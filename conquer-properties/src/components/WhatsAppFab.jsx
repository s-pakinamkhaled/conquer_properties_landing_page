import { CONTACT } from '../config'
import { WhatsApp } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'

export default function WhatsAppFab() {
  const { t } = useLanguage()
  const href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t.whatsappMessage)}`

  return (
    <a
      className="whatsapp-fab"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={t.whatsappLabel}
    >
      <WhatsApp />
      <span>{t.whatsappText}</span>
    </a>
  )
}
