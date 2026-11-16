
import { CONTACT } from '../config'
import { WhatsApp } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'
import { trackWhatsApp } from '../utils/metaTracking'

export default function WhatsAppFab() {
  const { t } = useLanguage()

  const href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t.whatsappMessage)}`

  const handleWhatsAppClick = () => {
    trackWhatsApp('Floating WhatsApp Button')
  }

  return (
    <a
      className="whatsapp-fab"
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={t.whatsappLabel}
      onClick={handleWhatsAppClick}
    >
      <WhatsApp />
      <span>{t.whatsappText}</span>
    </a>
  )
}
