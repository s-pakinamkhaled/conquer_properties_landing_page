import { CONTACT } from '../config'
import { ArrowRight, Check, WhatsApp } from './Icons'
import { useCallModal } from '../i18n/CallModalContext'
import { useLanguage } from '../i18n/LanguageContext'

export default function Overview() {
  const { t } = useLanguage()
  const { openModal } = useCallModal()
  const whatsappHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(t.whatsappMessage)}`

  const highlights = [
    t.overviewPoint1,
    t.overviewPoint2,
    t.overviewPoint3,
    t.overviewPoint4,
  ]

  const stats = [
    { value: '2020', label: t.statEstablished },
    { value: '6', label: t.statYears },
    { value: '5', label: t.statMarkets },
    { value: '40+', label: t.statDevelopers },
  ]

  const glance = [
    { label: t.glanceEstablished, value: '2020' },
    { label: t.glanceIndustry, value: t.glanceIndustryValue },
    { label: t.glanceMarket, value: t.glanceMarketValue },
    { label: t.glancePrimary, value: t.glancePrimaryValue },
    { label: t.glanceServices, value: t.glanceServicesValue },
  ]

  return (
    <section className="overview" id="overview">
      <div className="container overview-grid">
        <div className="overview-copy">
          <p className="eyebrow reveal">{t.overviewEyebrow}</p>
          <h2 className="overview-title reveal reveal-delay-1">{t.overviewTitle}</h2>
          <p className="overview-lead reveal reveal-delay-2">{t.overviewLead}</p>
          <p className="overview-text reveal reveal-delay-2">{t.overviewBody}</p>

          <ul className="overview-points reveal reveal-delay-3">
            {highlights.map((item) => (
              <li key={item}>
                <span className="overview-check" aria-hidden="true">
                  <Check width="14" height="14" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="overview-stats reveal reveal-delay-3">
            {stats.map((stat) => (
              <div className="overview-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="overview-glance reveal reveal-delay-3">
            <h3>{t.overviewGlanceTitle}</h3>
            <dl>
              {glance.map((row) => (
                <div className="overview-glance-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="overview-actions reveal reveal-delay-3">
            <button type="button" className="btn btn-gold" onClick={openModal}>
              {t.overviewCta}
              <ArrowRight />
            </button>
            <a href={whatsappHref} className="btn btn-whatsapp" target="_blank" rel="noreferrer">
              <WhatsApp />
              {t.whatsappText}
            </a>
          </div>
        </div>

        <div className="overview-media reveal reveal-delay-1">
          <img src="/images/overview.jpg" alt={t.overviewImageAlt} />
          <div className="overview-media-card">
            <span>{t.overviewMediaLabel}</span>
            <strong>{t.overviewMediaValue}</strong>
          </div>
        </div>
      </div>
    </section>
  )
}
