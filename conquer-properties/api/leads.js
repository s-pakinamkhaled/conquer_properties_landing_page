
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

    if (/^01[0125]\d{8}$/.test(value)) {
        value = `20${value.slice(1)}`
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
    } = process.env

    if (!OPENAI_PIXEL_ID || !OPENAI_CONVERSIONS_API_KEY) {
        return res.status(500).json({
            success: false,
            message: 'OpenAI server configuration is incomplete',
        })
    }

    const body = req.body || {}

    const fullName =
        typeof body.fullName === 'string' ? body.fullName.trim() : ''

    const phone =
        typeof body.phone === 'string' ? body.phone.trim() : ''

    const email = normalizeEmail(body.email)

    const eventId =
        typeof body.eventId === 'string' ? body.eventId.trim() : ''

    const oppref =
        typeof body.oppref === 'string' ? body.oppref.trim() : ''

    const obref =
        typeof body.obref === 'string' ? body.obref.trim() : ''

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

    const nameParts = fullName.split(/\s+/).filter(Boolean)

    const user = {}
    const normalizedPhone = normalizePhone(phone)

    if (email) {
        user.emails_sha256 = [sha256(email)]
    }

    if (normalizedPhone) {
        user.phone_numbers_sha256 = [sha256(normalizedPhone)]
    }

    const firstName = normalizeName(nameParts[0] || '')
    const lastName = normalizeName(nameParts.slice(1).join(' '))

    if (firstName) {
        user.first_names_sha256 = [sha256(firstName)]
    }

    if (lastName) {
        user.last_names_sha256 = [sha256(lastName)]
    }

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
            // Keep the default website URL.
        }
    }

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

    if (oppref) {
        event.oppref = oppref
    }

    if (Object.keys(user).length > 0) {
        event.user = user
    }

    try {
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

        const responseText = await capiResponse.text()

        if (!capiResponse.ok) {
            console.error(
                'OpenAI CAPI rejected event:',
                capiResponse.status,
                responseText
            )

            return res.status(502).json({
                success: false,
                serverEventSent: false,
                message: 'OpenAI conversion event was rejected',
            })
        }

        console.log('OpenAI CAPI response:', responseText)

        return res.status(200).json({
            success: true,
            eventId,
            serverEventSent: true,
        })
    } catch (error) {
        console.error('OpenAI CAPI request failed:', error.message)

        return res.status(502).json({
            success: false,
            serverEventSent: false,
            message: 'OpenAI conversion request failed',
        })
    }
}
