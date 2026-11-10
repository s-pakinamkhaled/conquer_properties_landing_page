import { FORM_ENDPOINT, FORM_RECIPIENTS } from '../config'

export async function submitLead(payload) {
  const [, ...ccEmails] = FORM_RECIPIENTS
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...payload,
      _template: 'table',
      _captcha: 'false',
      _cc: ccEmails.join(','),
    }),
  })

  const result = await response.json().catch(() => ({}))
  if (!response.ok || result.success === 'false' || result.success === false) {
    throw new Error(result.message || 'Request failed')
  }

  return result
}
