import Header from './components/Header'
import Hero from './components/Hero'
import Overview from './components/Overview'
import CtaBanner from './components/CtaBanner'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'
import RequestCallModal from './components/RequestCallModal'
import { useReveal } from './hooks/useReveal'
import { CallModalProvider } from './i18n/CallModalContext'
import { LanguageProvider } from './i18n/LanguageContext'

function AppShell() {
  useReveal()

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Overview />
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
