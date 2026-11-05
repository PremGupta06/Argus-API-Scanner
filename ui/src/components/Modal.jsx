import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className='fixed inset-0 z-[60] flex items-center justify-center p-4'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className='absolute inset-0 bg-ink-950/80 backdrop-blur-sm' onClick={onClose} />
          <motion.div
            role='dialog'
            aria-modal='true'
            aria-label={title}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            className='relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-ink-900 p-6 shadow-2xl'
          >
            <div className='mb-5 flex items-center justify-between'>
              <h2 className='font-display text-lg font-semibold'>{title}</h2>
              <button onClick={onClose} aria-label='Close' className='rounded-lg p-1.5 text-slate-400 transition hover:bg-white/10 hover:text-white'>
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}