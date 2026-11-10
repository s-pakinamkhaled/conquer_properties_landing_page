import { useEffect, useState } from 'react'
import { ArrowRight } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'

export default function Header() {
  const { t, toggleLang, lang } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  const links = [
    { href: '#home', label: t.navHome },
    { href: '#overview', label: t.navOverview },
    { href: '#contact', label: t.navContact },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = () => setOpen(false)
  const goTo = (href) => {
    setActive(href)
    close()
  }

  return (
    <header className={`site-header${scrolled || open ? ' scrolled' : ''}${open ? ' open' : ''}`}>
      <div className="header-inner">
        <a href="#home" className="brand" onClick={() => goTo('#home')}>
          <img src="/images/logo.png" alt={t.brand} />
          <span className="brand-text">{t.brand}</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={active === link.href ? 'active' : undefined}
              onClick={() => goTo(link.href)}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-cta">
          <button
            type="button"
            className="lang-toggle"
            onClick={toggleLang}
            aria-label={lang === 'en' ? 'Switch to Arabic' : 'Switch to English'}
          >
            {t.langLabel}
          </button>
          <a href="#contact" className="btn btn-outline-gold" onClick={() => goTo('#contact')}>
            {t.contactUs}
            <ArrowRight />
          </a>
        </div>

        <button
          className="menu-toggle"
          aria-label={open ? t.closeMenu : t.openMenu}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
        </button>
      </div>
    </header>
  )
}
