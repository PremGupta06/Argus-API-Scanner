import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import Home from './pages/Home'
import ScannerPage from './pages/ScannerPage'
import useRoute from './useRoute'

export default function App() {
  const route = useRoute()
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const notify = useCallback((text, type = 'success') => {
    clearTimeout(timer.current)
    setToast({ text, type, id: Date.now() })
    timer.current = setTimeout(() => setToast(null), 3500)
  }, [])

  return (
    <MotionConfig reducedMotion='user'>
      <div className='min-h-screen bg-ink-950 text-slate-200'>
        <Navbar route={route} />
        <main>
          <AnimatePresence mode='wait'>
            <motion.div
              key={route}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {route === 'scanner' ? <ScannerPage notify={notify} /> : <Home notify={notify} />}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
        <Toast toast={toast} />
      </div>
    </MotionConfig>
  )
}