
import { CONTACT } from '../config'
import { Facebook, Instagram, LinkedIn, Phone } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'

import {
  trackPhone,
  trackCustomEvent,
} from '../utils/metaTracking'

import {
  trackOpenAIPhoneClick,
} from '../utils/openaiTracking'

const socials = [
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/conquer_properties/',
    Icon: Instagram,
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/Conquer.Properties',
    Icon: Facebook,
  },
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/86453154',
    Icon: LinkedIn,
  },
]

export default function Footer() {
  const { t } = useLanguage()

  const handlePhoneClick = () => {
    // Existing Meta tracking
    trackPhone('Footer')

    // OpenAI Pixel tracking
    trackOpenAIPhoneClick()
  }

  const handleSocialClick = (name) => {
    trackCustomEvent('SocialMediaClick', {
      platform: name,
      section: 'Footer',
    })
  }

  const handleNavigationClick = (destination) => {
    trackCustomEvent('NavigationClick', {
      destination,
      section: 'Footer',
    })
  }

  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />

      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a
              href="#home"
              className="footer-logo"
              onClick={() => handleNavigationClick('#home')}
            >
              <img src="/images/logo.png" alt={t.brand} />
            </a>

            <h3>{t.brand}</h3>
            <p>{t.footerTagline}</p>
          </div>

          <div className="footer-col">
            <h4>{t.explore}</h4>

            <nav className="footer-links" aria-label="Footer">
              <a
                href="#home"
                onClick={() => handleNavigationClick('#home')}
              >
                {t.navHome}
              </a>

              <a
                href="#overview"
                onClick={() => handleNavigationClick('#overview')}
              >
                {t.navOverview}
              </a>

              <a
                href="#projects"
                onClick={() => handleNavigationClick('#projects')}
              >
                {t.navProjects}
              </a>

              <a
                href="#contact"
                onClick={() => handleNavigationClick('#contact')}
              >
                {t.contact}
              </a>
            </nav>
          </div>

          <div className="footer-col">
            <h4>{t.contact}</h4>

            <div className="footer-contact">
              {CONTACT.phones.map((phone) => (
                <a
                  key={phone}
                  href={`tel:${phone.replace(/\s/g, '')}`}
                  onClick={handlePhoneClick}
                >
                  <Phone />
                  <span>{phone}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="footer-col">
            <h4>{t.follow}</h4>

            <div className="footer-social">
              {socials.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  title={name}
                  onClick={() => handleSocialClick(name)}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} {t.brand}. {t.rights}
          </p>

          <p>{t.footerNote}</p>
        </div>
      </div>
    </footer>
  )
}
