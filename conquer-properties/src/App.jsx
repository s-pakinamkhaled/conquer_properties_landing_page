
import { useEffect } from 'react'

import Header from './components/Header'
import Hero from './components/Hero'
import Overview from './components/Overview'
import Projects from './components/Projects'
import CtaBanner from './components/CtaBanner'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import RequestCallModal from './components/RequestCallModal'

import { useReveal } from './hooks/useReveal'
import { CallModalProvider, useCallModal } from './i18n/CallModalContext'
import { LanguageProvider } from './i18n/LanguageContext'

function AppShell() {
  useReveal()

  const { openModal } = useCallModal()

  useEffect(() => {
    openModal()
  }, [openModal])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Overview />
        <Projects />
        <CtaBanner />
      </main>
      <Footer />
      <WhatsAppFab />
      <RequestCallModal />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <CallModalProvider>
        <AppShell />
      </CallModalProvider>
    </LanguageProvider>
  )
}
