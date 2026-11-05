import { useEffect } from 'react'
import Contact from '../components/Contact'
import Faq from '../components/Faq'
import Features from '../components/Features'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import Integrations from '../components/Integrations'
import Marquee from '../components/Marquee'
import Stats from '../components/Stats'

export default function Home({ notify }) {
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id && !id.startsWith('/')) {
      const timer = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView()
      }, 80)
      return () => clearTimeout(timer)
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <Hero />
      <Marquee />
      <Stats />
      <Features />
      <HowItWorks />
      <Integrations />
      <Faq />
      <Contact notify={notify} />
    </>
  )
}