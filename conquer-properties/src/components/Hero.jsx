import { useEffect, useRef, useState } from 'react'
import { PROJECT } from '../config'
import { ArrowRight, Phone, User } from './Icons'
import { useCallModal } from '../i18n/CallModalContext'
import { useLanguage } from '../i18n/LanguageContext'
import { submitLead } from '../lib/submitLead'

const initial = {
  fullName: '',
  phone: '',
  location: '',
  budget: '',
  unitType: '',
}

export default function Hero() {
  const { t, lang } = useLanguage()
  const { openModal } = useCallModal()
  const sectionRef = useRef(null)
  const mediaRef = useRef(null)
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const section = sectionRef.current
    const media = mediaRef.current
    if (!section || !media) return undefined

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      section.classList.add('hero-ready')
      return undefined
    }

    requestAnimationFrame(() => section.classList.add('hero-ready'))

    let raf = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    let scrollY = 0

    const animate = () => {
      currentX += (targetX - currentX) * 0.045
      currentY += (targetY - currentY) * 0.045
      media.style.transform = `translate3d(${currentX * 10}px, ${currentY * 6 + scrollY * 0.1}px, 0) scale(1.06)`
      raf = requestAnimationFrame(animate)
    }

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      targetX = (e.clientX - rect.left) / rect.width - 0.5
      targetY = (e.clientY - rect.top) / rect.height - 0.5
    }

    const onScroll = () => {
      scrollY = Math.min(window.scrollY, window.innerHeight)
    }

    raf = requestAnimationFrame(animate)
    section.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      cancelAnimationFrame(raf)
      section.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onQuickSubmit = async (e) => {
    e.preventDefault()

    if (!form.fullName.trim() || !form.phone.trim()) {
      setStatus('error')
      setMessage(t.errNamePhone)
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      await submitLead({
        fullName: form.fullName,
        phone: form.phone,
        location: form.location || 'Not specified',
        budget: form.budget || 'Not specified',
        unitType: form.unitType || 'Not specified',
        language: lang,
        source: 'Hero contact box',
        _subject: `Conquer Properties — new request from ${form.fullName}`,
      })

      setStatus('success')
      setMessage(t.successMsg)
      setForm(initial)
    } catch {
      setStatus('error')
      setMessage(t.errorMsg)
    }
  }

  return (
    <section className="hero" id="home" ref={sectionRef}>
      <div className="hero-media" aria-hidden="true">
        <div className="hero-media-track" ref={mediaRef}>
          <img src="/images/hero.jpg?v=3" alt="" />
        </div>
      </div>

      <div className="hero-body">
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow hero-anim hero-anim-1">
              {t.heroEyebrow} {PROJECT.location}
            </p>
            <h1 className="hero-title">
              <span className="gold hero-anim hero-anim-2">{t.heroTitleGold}</span>
              <span className="hero-anim hero-anim-3">{t.heroTitleWhite}</span>
            </h1>
            <p className="hero-text hero-anim hero-anim-4">{t.heroText}</p>
            <div className="hero-actions hero-anim hero-anim-5">
              <a href="#contact" className="btn btn-gold">
                {t.viewHomes}
                <ArrowRight />
              </a>
              <button type="button" className="btn btn-ghost" onClick={openModal}>
                <Phone />
                {t.requestCall}
              </button>
            </div>
          </div>

          <aside
            className="hero-lead-card hero-anim hero-anim-5"
            id="contact"
            aria-label={t.navContact}
          >
            <div className="hero-lead-frame" aria-hidden="true" />
            <div className="hero-lead-shine" aria-hidden="true" />

            <div className="hero-lead-header">
              <p className="hero-lead-badge">{t.leadBadge}</p>
              <h2>{t.leadTitle}</h2>
              <p className="hero-lead-text">{t.leadText}</p>
            </div>

            <form className="hero-lead-form" onSubmit={onQuickSubmit}>
              <div className="hero-lead-field">
                <label htmlFor="hero-fullName">{t.fullName}</label>
                <div className="hero-lead-input">
                  <User />
                  <input
                    id="hero-fullName"
                    name="fullName"
                    autoComplete="name"
                    placeholder={t.fullNamePlaceholder}
                    value={form.fullName}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div className="hero-lead-field">
                <label htmlFor="hero-phone">{t.phone}</label>
                <div className="hero-lead-input">
                  <Phone />
                  <input
                    id="hero-phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={t.phonePlaceholder}
                    value={form.phone}
                    onChange={onChange}
                    required
                  />
                </div>
              </div>

              <div className="hero-lead-field">
                <label htmlFor="hero-location">{t.location}</label>
                <div className="hero-lead-input">
                  <select
                    id="hero-location"
                    name="location"
                    value={form.location}
                    onChange={onChange}
                    required
                  >
                    <option value="">{t.selectLocation}</option>
                    <option value="New Cairo">{t.newCairo}</option>
                    <option value="Zayed">{t.zayed}</option>
                    <option value="North Coast">{t.northCoast}</option>
                  </select>
                </div>
              </div>

              <div className="hero-lead-row">
                <div className="hero-lead-field">
                  <label htmlFor="hero-budget">{t.budget}</label>
                  <div className="hero-lead-input">
                    <select
                      id="hero-budget"
                      name="budget"
                      value={form.budget}
                      onChange={onChange}
                      required
                    >
                      <option value="">{t.selectBudget}</option>
                      <option value="Under 5M EGP">{t.budgetUnder5}</option>
                      <option value="5M – 10M EGP">{t.budget5to10}</option>
                      <option value="10M – 20M EGP">{t.budget10to20}</option>
                      <option value="20M+ EGP">{t.budget20plus}</option>
                    </select>
                  </div>
                </div>

                <div className="hero-lead-field">
                  <label htmlFor="hero-unitType">{t.unitType}</label>
                  <div className="hero-lead-input">
                    <select
                      id="hero-unitType"
                      name="unitType"
                      value={form.unitType}
                      onChange={onChange}
                      required
                    >
                      <option value="">{t.selectType}</option>
                      <option value="Apartment">{t.apartment}</option>
                      <option value="Duplex">{t.duplex}</option>
                      <option value="Townhouse">{t.townhouse}</option>
                      <option value="Twin house">{t.twinHouse}</option>
                      <option value="Penthouse">{t.penthouse}</option>
                      <option value="Villa">{t.villa}</option>
                      <option value="Chalet">{t.chalet}</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="hero-lead-submit" type="submit" disabled={status === 'loading'}>
                <span>{status === 'loading' ? t.sending : t.callMeBack}</span>
                <ArrowRight />
              </button>
            </form>

            <div className="hero-lead-footer">
              {message && (
                <p
                  className={`hero-lead-status ${status === 'success' ? 'success' : 'error'}`}
                  role="status"
                >
                  {message}
                </p>
              )}
              <p className="hero-lead-note">{t.leadNote}</p>
            </div>
          </aside>
        </div>
      </div>

      <div className="scroll-hint hero-anim hero-anim-6" aria-hidden="true">
        <span className="scroll-hint-line" />
        {t.scrollHint}
      </div>
    </section>
  )
}
