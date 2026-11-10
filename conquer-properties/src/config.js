/**
 * Form submissions are delivered to these emails via FormSubmit.
 * Each inbox must confirm once the first time (check spam for the activation email).
 */
export const FORM_RECIPIENTS = [
  'abdelrhmanmammdoh536@gmail.com',
  'moamenabdelpaqi@gmail.com',
  'pakinamkhaled10@gmail.com',
]

export const FORM_ENDPOINT = `https://formsubmit.co/ajax/${FORM_RECIPIENTS[0]}`

export const CONTACT = {
  phones: ['011 51355588', '01201955580'],
  email: FORM_RECIPIENTS[0],
  address: '[Office Address]',
  whatsapp: '201201955580',
}

export const PROJECT = {
  name: '[Project Name]',
  developer: '[Developer Name]',
  location: '[Project Location]',
}
