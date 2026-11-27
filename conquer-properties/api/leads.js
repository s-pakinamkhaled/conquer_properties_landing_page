
const OPENAI_CAPI_URL = 'https://bzr.openai.com/v1/events'
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

    const {
        fullName,
        phone,
        email,
        location,
        budget,
        unitType,
        language,
        source,
        eventId,
    } = req.body || {}

    if (
        !fullName?.trim() ||
        !phone?.trim() ||
        !eventId?.trim()
    ) {
        return res.status(400).json({
            success: false,
            message: 'Name, phone and event ID are required',
        })
    }

    if (eventId.length > 100) {
        return res.status(400).json({
            success: false,
            message: 'Invalid event ID',
        })
    }

    // 1. Forward the lead to FormSubmit
    let formResponse

    try {
        formResponse = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullName,
                phone,
                email: email || 'Not provided',
                location: location || 'Not specified',
                budget: budget || 'Not specified',
                unitType: unitType || 'Not specified',
                language,
                source: source || 'Website',
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

    // 2. Send the confirmed lead to OpenAI Conversions API
    let serverEventSent = false

    try {
        const event = {
            id: eventId,
            type: 'lead_created',
            timestamp_ms: Date.now(),
            action_source: 'web',
            source_url: 'https://landing.conquerproperties.com/',
            data: {
                type: 'customer_action',
            },
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

    // 3. Return the result to React
    return res.status(200).json({
        success: true,
        eventId,
        serverEventSent,
        message: 'Lead submitted successfully',
    })
}
