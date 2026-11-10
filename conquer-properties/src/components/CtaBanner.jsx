import { ArrowRight } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'

export default function CtaBanner() {
  const { t } = useLanguage()

  return (
    <section className="cta-banner" aria-labelledby="cta-heading">
      <div className="cta-banner-media" aria-hidden="true">
        <img src="/images/cta-bg.jpg" alt="" />
      </div>
      <div className="cta-banner-content reveal">
        <h2 id="cta-heading">{t.ctaTitle}</h2>
        <p>{t.ctaText}</p>
        <a href="#contact" className="btn btn-gold">
          {t.exploreOptions}
          <ArrowRight />
        </a>
      </div>
    </section>
  )
}
