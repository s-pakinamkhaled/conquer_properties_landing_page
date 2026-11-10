import { useEffect, useState } from 'react'
import { ArrowRight, Mail, Phone, User } from './Icons'
import { useCallModal } from '../i18n/CallModalContext'
import { useLanguage } from '../i18n/LanguageContext'
import { submitLead } from '../lib/submitLead'

const initial = {
  fullName: '',
  phone: '',
  email: '',
  location: '',
  budget: '',
  unitType: '',
}

export default function RequestCallModal() {
  const { open, closeModal } = useCallModal()
  const { t, lang } = useLanguage()
  const [form, setForm] = useState(initial)
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!open) {
      setStatus('idle')
      setMessage('')
      setForm(initial)
    }
  }, [open])

  if (!open) return null

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
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
        email: form.email || 'Not provided',
        location: form.location || 'Not specified',
        budget: form.budget || 'Not specified',
        unitType: form.unitType || 'Not specified',
        language: lang,
        source: 'Request a Call modal',
        _subject: `Conquer Properties — call request from ${form.fullName}`,
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
    <div className="call-modal" role="dialog" aria-modal="true" aria-labelledby="call-modal-title">
      <button type="button" className="call-modal-backdrop" aria-label={t.closeModal} onClick={closeModal} />
      <div className="call-modal-card">
        <button type="button" className="call-modal-close" onClick={closeModal} aria-label={t.closeModal}>
          ×
        </button>

        <p className="call-modal-eyebrow">{t.modalEyebrow}</p>
        <h2 id="call-modal-title">{t.modalTitle}</h2>
        <p className="call-modal-text">{t.modalText}</p>

        <form className="call-modal-form" onSubmit={onSubmit}>
          <label className="visually-hidden" htmlFor="modal-fullName">
            {t.fullName}
          </label>
          <div className="call-modal-input">
            <User />
            <input
              id="modal-fullName"
              name="fullName"
              autoComplete="name"
              placeholder={t.fullName}
              value={form.fullName}
              onChange={onChange}
              required
            />
          </div>

          <label className="visually-hidden" htmlFor="modal-phone">
            {t.phone}
          </label>
          <div className="call-modal-input">
            <Phone />
            <input
              id="modal-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder={t.phone}
              value={form.phone}
              onChange={onChange}
              required
            />
          </div>
          <p className="call-modal-hint">{t.phoneHint}</p>

          <label className="visually-hidden" htmlFor="modal-email">
            {t.emailOptional}
          </label>
          <div className="call-modal-input">
            <Mail />
            <input
              id="modal-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={t.emailOptional}
              value={form.email}
              onChange={onChange}
            />
          </div>

          <div className="call-modal-row">
            <div className="call-modal-input">
              <select
                id="modal-location"
                name="location"
                value={form.location}
                onChange={onChange}
                required
                aria-label={t.location}
              >
                <option value="">{t.selectLocation}</option>
                <option value="New Cairo">{t.newCairo}</option>
                <option value="Zayed">{t.zayed}</option>
                <option value="North Coast">{t.northCoast}</option>
              </select>
            </div>
            <div className="call-modal-input">
              <select
                id="modal-unitType"
                name="unitType"
                value={form.unitType}
                onChange={onChange}
                required
                aria-label={t.unitType}
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

          <div className="call-modal-input">
            <select
              id="modal-budget"
              name="budget"
              value={form.budget}
              onChange={onChange}
              required
              aria-label={t.budget}
            >
              <option value="">{t.selectBudget}</option>
              <option value="Under 5M EGP">{t.budgetUnder5}</option>
              <option value="5M – 10M EGP">{t.budget5to10}</option>
              <option value="10M – 20M EGP">{t.budget10to20}</option>
              <option value="20M+ EGP">{t.budget20plus}</option>
            </select>
          </div>

          <button className="call-modal-submit" type="submit" disabled={status === 'loading'}>
            <span>{status === 'loading' ? t.sending : t.modalSubmit}</span>
            <ArrowRight />
          </button>
        </form>

        {message && (
          <p className={`call-modal-status ${status === 'success' ? 'success' : 'error'}`} role="status">
            {message}
          </p>
        )}

        <p className="call-modal-disclaimer">{t.modalDisclaimer}</p>
      </div>
    </div>
  )
}
