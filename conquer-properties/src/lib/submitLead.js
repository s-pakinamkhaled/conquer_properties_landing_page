
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
  if (typeof window === 'undefined') {
    return {}
  }

  // OpenAI stores the ad click reference in this first-party cookie.
  const oppref = getCookie('__oppref')

  // Browser reference used for event matching.
  const obref = getCookie('__obref')

  return {
    ...(oppref ? { oppref } : {}),
    ...(obref ? { obref } : {}),
  }
}

export async function submitLead(payload) {
  const eventId = createEventId()
  const matchingData = getOpenAIMatchingData()

  const response = await fetch('/api/leads', {
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

  const result = await response.json().catch(() => ({}))

  if (!response.ok || result.success !== true) {
    throw new Error(result.message || 'Request failed')
  }

  return {
    ...result,
    eventId,
  }
}
