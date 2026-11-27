
function sendCustomEvent(eventName) {
    if (
        typeof window === 'undefined' ||
        typeof window.oaiq !== 'function'
    ) {
        return
    }

    window.oaiq(
        'measure',
        'custom',
        { type: 'custom' },
        { custom_event_name: eventName }
    )
}

// Page View
export function trackOpenAIPageView() {
    if (
        typeof window === 'undefined' ||
        typeof window.oaiq !== 'function'
    ) {
        return
    }

    window.oaiq('measure', 'page_viewed', {
        type: 'contents',
        contents: [
            {
                id: 'conquer-landing-page',
                name: 'Conquer Properties Landing Page',
                content_type: 'page',
            },
        ],
    })
}

// Successful Lead only
export function trackOpenAILead(eventId) {
    if (
        typeof window === 'undefined' ||
        typeof window.oaiq !== 'function' ||
        !eventId
    ) {
        return
    }

    window.oaiq(
        'measure',
        'lead_created',
        {
            type: 'customer_action',
        },
        {
            event_id: eventId,
        }
    )
}

// CTA clicks
export function trackOpenAIViewHomesClick() {
    sendCustomEvent('view_homes_clicked')
}

export function trackOpenAIRequestCallClick() {
    sendCustomEvent('request_call_clicked')
}

// Forms
export function trackOpenAIHeroFormStarted() {
    sendCustomEvent('hero_form_started')
}

export function trackOpenAIRequestCallFormOpened() {
    sendCustomEvent('request_call_form_opened')
}

export function trackOpenAIRequestCallFormStarted() {
    sendCustomEvent('request_call_form_started')
}

export function trackOpenAIHeroFormFailed() {
    sendCustomEvent('hero_form_submit_failed')
}

export function trackOpenAIRequestCallFormFailed() {
    sendCustomEvent('request_call_form_submit_failed')
}

// Contact clicks
export function trackOpenAIWhatsAppClick() {
    sendCustomEvent('whatsapp_clicked')
}

export function trackOpenAIPhoneClick() {
    sendCustomEvent('phone_clicked')
}
