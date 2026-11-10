import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const CallModalContext = createContext(null)

export function CallModalProvider({ children }) {
  const [open, setOpen] = useState(false)

  const openModal = useCallback(() => setOpen(true), [])
  const closeModal = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, closeModal])

  const value = useMemo(() => ({ open, openModal, closeModal }), [open, openModal, closeModal])

  return <CallModalContext.Provider value={value}>{children}</CallModalContext.Provider>
}

export function useCallModal() {
  const ctx = useContext(CallModalContext)
  if (!ctx) throw new Error('useCallModal must be used within CallModalProvider')
  return ctx
}
