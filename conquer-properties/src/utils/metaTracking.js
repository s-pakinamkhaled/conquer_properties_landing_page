
const isPixelReady = () =>
    typeof window !== 'undefined' &&
    typeof window.fbq === 'function'

// Meta Standard Events
export const trackEvent = (name, params = {}) => {
    if (isPixelReady()) {
        window.fbq('track', name, params)
    }
}

// Meta Custom Events
export const trackCustomEvent = (name, params = {}) => {
    if (isPixelReady()) {
        window.fbq('trackCustom', name, params)
    }
}

// Project views
export const trackProjectView = (projectName) => {
    trackEvent('ViewContent', {
        content_name: projectName,
        content_category: 'Real Estate Project',
    })
}

// Form start
export const trackFormStart = (formName) => {
    trackCustomEvent('FormStart', {
        form_name: formName,
    })
}

// Successful lead
export const trackLead = (projectName = 'General Inquiry') => {
    trackEvent('Lead', {
        content_name: projectName,
        content_category: 'Real Estate',
    })
}

// WhatsApp click
export const trackWhatsApp = (projectName = 'General Inquiry') => {
    trackEvent('Contact', {
        content_name: projectName,
        contact_method: 'WhatsApp',
    })
}

// Phone click
export const trackPhone = (projectName = 'General') => {
    trackCustomEvent('PhoneClick', {
        project_name: projectName,
    })
}

// Scroll depth
export const trackScrollDepth = (percentage) => {
    trackCustomEvent('ScrollDepth', {
        scroll_percentage: percentage,
    })
}

// Track scroll milestones once per page load
export const setupScrollTracking = () => {
    const milestones = [25, 50, 75, 90]
    const reached = new Set()

    const handleScroll = () => {
        const scrollable =
            document.documentElement.scrollHeight - window.innerHeight

        if (scrollable <= 0) return

        const percentage =
            (window.scrollY / scrollable) * 100

        milestones.forEach((milestone) => {
            if (percentage >= milestone && !reached.has(milestone)) {
                reached.add(milestone)
                trackScrollDepth(milestone)
            }
        })
    }

    window.addEventListener('scroll', handleScroll, {
        passive: true,
    })

    handleScroll()

    return () => {
        window.removeEventListener('scroll', handleScroll)
    }
}
