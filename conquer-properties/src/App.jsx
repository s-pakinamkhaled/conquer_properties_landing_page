
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
import {
  CallModalProvider,
  useCallModal,
} from './i18n/CallModalContext'
import { LanguageProvider } from './i18n/LanguageContext'

import { setupScrollTracking } from './utils/metaTracking'
import { trackOpenAIPageView } from './utils/openaiTracking'

function AppShell() {
  useReveal()

  const { openModal } = useCallModal()

  // Keep automatic modal opening
  useEffect(() => {
    openModal()
  }, [openModal])

  // Setup Meta Pixel scroll tracking
  useEffect(() => {
    const cleanup = setupScrollTracking()
    return cleanup
  }, [])

  // Track OpenAI landing page view
  useEffect(() => {
    trackOpenAIPageView()
  }, [])

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
