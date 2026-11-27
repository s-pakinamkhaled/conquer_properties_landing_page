
import { createHash } from 'node:crypto'

const OPENAI_CAPI_URL = 'https://bzr.openai.com/v1/events'
const SITE_URL = 'https://landing.conquerproperties.com/'

function sha256(value) {
    return createHash('sha256')
        .update(value, 'utf8')
        .digest('hex')
}

function normalizeEmail(email) {
    if (typeof email !== 'string') return ''

    const value = email.trim().toLowerCase()

    if (!value || value === 'not provided') return ''

    return value
}

function normalizePhone(phone) {
    if (typeof phone !== 'string') return ''

    let value = phone.replace(/[\s().-]/g, '')

    if (value.startsWith('+')) {
        value = value.slice(1)
    } else if (value.startsWith('00')) {
        value = value.slice(2)
    }

    // Convert Egyptian local mobile numbers to international format.
    if (/^0?1[0125]\d{8}$/.test(value)) {
        value = `20${value.replace(/^0/, '')}`
    } else {
        value = value.replace(/^0+/, '')
    }

    return /^\d{8,15}$/.test(value) ? value : ''
}

function normalizeName(name) {
    if (typeof name !== 'string') return ''

    return name
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[\x21-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]/g, '')
}

function getClientIp(req) {
    const realIp = req.headers['x-real-ip']

    if (typeof realIp === 'string' && realIp.trim()) {
        return realIp.trim()
    }

    const forwardedFor = req.headers['x-forwarded-for']

    if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
        return forwardedFor.split(',')[0].trim()
    }

    return ''
}

export default async function handler(req, res) {
    // Health check
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            service: 'Conquer Leads API',
            status: 'running',
        })
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed',
        })
    }

    const {
        OPENAI_PIXEL_ID,
        OPENAI_CONVERSIONS_API_KEY,
        FORM_ENDPOINT,
        FORM_CC_EMAILS,
    } = process.env

    if (
        !OPENAI_PIXEL_ID ||
        !OPENAI_CONVERSIONS_API_KEY ||
        !FORM_ENDPOINT
    ) {
        return res.status(500).json({
            success: false,
            message: 'Server configuration is incomplete',
        })
    }

    const body = req.body || {}

    const fullName =
        typeof body.fullName === 'string' ? body.fullName.trim() : ''

    const phone =
        typeof body.phone === 'string' ? body.phone.trim() : ''

    const email = normalizeEmail(body.email)

    const location = body.location || 'Not specified'
    const budget = body.budget || 'Not specified'
    const unitType = body.unitType || 'Not specified'
    const language = body.language || 'en'
    const source = body.source || 'Website'

    const subject =
        typeof body._subject === 'string'
            ? body._subject.trim().slice(0, 200)
            : 'New lead from Conquer Properties'

    const eventId =
        typeof body.eventId === 'string' ? body.eventId.trim() : ''

    const oppref =
        typeof body.oppref === 'string' ? body.oppref.trim() : ''

    const obref =
        typeof body.obref === 'string' ? body.obref.trim() : ''

    let sourceUrl = SITE_URL

    if (typeof body.sourceUrl === 'string') {
        try {
            const parsedUrl = new URL(body.sourceUrl)

            if (
                parsedUrl.protocol === 'https:' &&
                parsedUrl.hostname === 'landing.conquerproperties.com'
            ) {
                sourceUrl = parsedUrl.href
            }
        } catch {
            // Use the default website URL.
        }
    }

    if (!fullName || !phone || !eventId) {
        return res.status(400).json({
            success: false,
            message: 'Name, phone and event ID are required',
        })
    }

    if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/.test(eventId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid event ID',
        })
    }

    // 1. Send the lead to the existing email recipients.
    try {
        const formResponse = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                phone,
                email: email || 'Not provided',
                location,
                budget,
                unitType,
                language,
                source,
                _subject: subject,
                _template: 'table',
                _captcha: 'false',
                _cc: FORM_CC_EMAILS || '',
            }),
        })

        const formResult = await formResponse.json().catch(() => ({}))

        if (
            !formResponse.ok ||
            formResult.success === false ||
            formResult.success === 'false'
        ) {
            throw new Error('FormSubmit delivery failed')
        }
    } catch (error) {
        console.error('Lead delivery failed:', error.message)

        return res.status(502).json({
            success: false,
            message: 'Unable to submit your request. Please try again.',
        })
    }

    // 2. Prepare matching information for OpenAI.
    const nameParts = fullName.split(/\s+/).filter(Boolean)

    const firstName = normalizeName(nameParts[0] || '')
    const lastName = normalizeName(nameParts.slice(1).join(' '))

    const normalizedPhone = normalizePhone(phone)

    const user = {}

    if (email) {
        user.emails_sha256 = [sha256(email)]
    }

    if (normalizedPhone) {
        user.phone_numbers_sha256 = [sha256(normalizedPhone)]
    }

    if (firstName) {
        user.first_names_sha256 = [sha256(firstName)]
    }

    if (lastName) {
        user.last_names_sha256 = [sha256(lastName)]
    }

    // obref belongs inside the user object.
    if (obref) {
        user.obref = obref
    }

    const ipAddress = getClientIp(req)
    const userAgent = req.headers['user-agent']

    if (ipAddress) {
        user.ip_address = ipAddress
    }

    if (typeof userAgent === 'string' && userAgent.trim()) {
        user.user_agent = userAgent.trim()
    }

    // 3. Send the confirmed lead to OpenAI Conversions API.
    let serverEventSent = false

    try {
        const event = {
            id: eventId,
            type: 'lead_created',
            timestamp_ms: Date.now(),
            action_source: 'web',
            source_url: sourceUrl,
            data: {
                type: 'customer_action',
            },
        }

        // oppref belongs at the event level.
        if (oppref) {
            event.oppref = oppref
        }

        if (Object.keys(user).length > 0) {
            event.user = user
        }

        const capiResponse = await fetch(
            `${OPENAI_CAPI_URL}?pid=${encodeURIComponent(OPENAI_PIXEL_ID)}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${OPENAI_CONVERSIONS_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    validate_only: false,
                    events: [event],
                }),
            }
        )

        if (!capiResponse.ok) {
            const errorText = await capiResponse.text()

            console.error(
                'OpenAI CAPI rejected event:',
                capiResponse.status,
                errorText
            )
        } else {
            serverEventSent = true
        }
    } catch (error) {
        console.error('OpenAI CAPI request failed:', error.message)
    }

    // 4. Return the result to React.
    return res.status(200).json({
        success: true,
        eventId,
        serverEventSent,
        message: 'Lead submitted successfully',
    })
}
