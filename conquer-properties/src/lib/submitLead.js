
import { FORM_ENDPOINT, FORM_RECIPIENTS } from '../config'

function createEventId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function getCookie(name) {
  if (typeof document === 'undefined') return ''

  const cookie = document.cookie
    .split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))

  return cookie ? cookie.substring(name.length + 1) : ''
}

function getOpenAIMatchingData() {
  if (typeof window === 'undefined') return {}

  const oppref = getCookie('__oppref')
  const obref = getCookie('__obref')

  return {
    ...(oppref ? { oppref } : {}),
    ...(obref ? { obref } : {}),
  }
}

export async function submitLead(payload) {
  const eventId = createEventId()
  const matchingData = getOpenAIMatchingData()

  // 1. Send the lead directly to FormSubmit from the browser.
  const [, ...ccEmails] = FORM_RECIPIENTS

  const formResponse = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      eventId,
      _template: 'table',
      _captcha: 'false',
      _cc: ccEmails.join(','),
      _url: window.location.href,
    }),
  })

  const formResult = await formResponse.json().catch(() => ({}))

  if (
    !formResponse.ok ||
    formResult.success === false ||
    formResult.success === 'false'
  ) {
    console.error('FormSubmit rejected the lead:', {
      status: formResponse.status,
      response: formResult,
    })

    throw new Error(
      formResult.message || 'Unable to send your request. Please try again.'
    )
  }

  // 2. Send the same lead to our server for OpenAI Conversions API.
  // A CAPI failure must not turn a successfully emailed lead into a failed form.
  let serverEventSent = false

  try {
    const apiResponse = await fetch('/api/leads', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        eventId,
        ...matchingData,
        sourceUrl: window.location.href,
      }),
    })

    const apiResult = await apiResponse.json().catch(() => ({}))
    serverEventSent = apiResponse.ok && apiResult.serverEventSent === true

    if (!apiResponse.ok) {
      console.error('OpenAI server event request failed:', apiResult)
    }
  } catch (error) {
    console.error('OpenAI server event request failed:', error)
  }

  return {
    success: true,
    eventId,
    serverEventSent,
  }
}
