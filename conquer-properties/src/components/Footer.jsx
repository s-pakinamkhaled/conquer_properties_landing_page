import { CONTACT } from '../config'
import { Facebook, Instagram, LinkedIn, Phone } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'

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

  return (
    <footer className="site-footer">
      <div className="footer-glow" aria-hidden="true" />
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#home" className="footer-logo">
              <img src="/images/logo.png" alt={t.brand} />
            </a>
            <h3>{t.brand}</h3>
            <p>{t.footerTagline}</p>
          </div>

          <div className="footer-col">
            <h4>{t.explore}</h4>
            <nav className="footer-links" aria-label="Footer">
              <a href="#home">{t.navHome}</a>
              <a href="#overview">{t.navOverview}</a>
              <a href="#contact">{t.contact}</a>
            </nav>
          </div>

          <div className="footer-col">
            <h4>{t.contact}</h4>
            <div className="footer-contact">
              {CONTACT.phones.map((phone) => (
                <a key={phone} href={`tel:${phone.replace(/\s/g, '')}`}>
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
