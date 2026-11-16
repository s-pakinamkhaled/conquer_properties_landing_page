
import { useEffect, useRef } from 'react'
import { ArrowRight } from './Icons'
import { useLanguage } from '../i18n/LanguageContext'
import { trackCustomEvent } from '../utils/metaTracking'

export default function CtaBanner() {
  const { t } = useLanguage()
  const sectionRef = useRef(null)

  // Track CTA banner view once
  useEffect(() => {
    const section = sectionRef.current

    if (!section) return undefined

    let tracked = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked) {
          tracked = true

          trackCustomEvent('SectionView', {
            section_name: 'CTA Banner',
          })

          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  // Track Explore Options click
  const handleExploreClick = () => {
    trackCustomEvent('CtaBannerClick', {
      button_name: 'Explore Options',
      section: 'CTA Banner',
    })
  }

  return (
    <section
      className="cta-banner"
      aria-labelledby="cta-heading"
      ref={sectionRef}
    >
      <div className="cta-banner-media" aria-hidden="true">
        <img src="/images/cta-bg.jpg" alt="" />
      </div>

      <div className="cta-banner-content reveal">
        <h2 id="cta-heading">{t.ctaTitle}</h2>

        <p>{t.ctaText}</p>

        <a
          href="#contact"
          className="btn btn-gold"
          onClick={handleExploreClick}
        >
          {t.exploreOptions}
          <ArrowRight />
        </a>
      </div>
    </section>
  )
}
