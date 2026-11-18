
import { CONTACT } from '../config'
import { WhatsApp } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'
import { trackWhatsApp } from '../utils/metaTracking'
import { trackOpenAIWhatsAppClick } from '../utils/openaiTracking'

export default function WhatsAppFab() {
  const { t } = useLanguage()

  const href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t.whatsappMessage)}`

  const handleWhatsAppClick = () => {
    // Existing Meta tracking
    trackWhatsApp('Floating WhatsApp Button')

    // OpenAI Pixel tracking
    trackOpenAIWhatsAppClick()
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
