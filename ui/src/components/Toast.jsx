import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function Toast({ toast }) {
  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-6 z-[70] flex justify-center px-4' aria-live='polite'>
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className={
              'pointer-events-auto flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm shadow-xl backdrop-blur-xl ' +
              (toast.type === 'error'
                ? 'border-red-500/30 bg-red-950/80 text-red-100'
                : 'border-emerald-500/30 bg-emerald-950/80 text-emerald-100')
            }
          >
            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {toast.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}