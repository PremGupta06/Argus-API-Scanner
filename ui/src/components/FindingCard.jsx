import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Wrench } from 'lucide-react'
import { SEV_STYLE } from '../constants'

export default function FindingCard({ finding, index }) {
  const [open, setOpen] = useState(false)
  const s = SEV_STYLE[finding.severity]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05 }}
      className='overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl'
    >
      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/[0.03]'
      >
        <span className={'h-2.5 w-2.5 shrink-0 rounded-full ' + s.dot} />
        <span className='min-w-0 flex-1'>
          <span className='block font-medium'>{finding.title}</span>
          <span className='block truncate font-mono text-xs text-slate-400'>{finding.endpoint}</span>
        </span>
        <span className={'rounded-md border px-2 py-0.5 text-xs font-semibold uppercase ' + s.bg + ' ' + s.border + ' ' + s.text}>
          {finding.severity}
        </span>
        <ChevronDown size={18} className={'shrink-0 text-slate-400 transition-transform ' + (open ? 'rotate-180' : '')} />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='overflow-hidden'
          >
            <div className='space-y-3 border-t border-white/10 p-4 text-sm'>
              <p className='text-slate-300'>{finding.description}</p>
              <pre className='overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-xs text-slate-300'>
                {finding.evidence}
              </pre>
              <p className='flex gap-2 text-slate-300'>
                <Wrench size={16} className='mt-0.5 shrink-0 text-emerald-400' />
                <span>
                  <b className='text-emerald-300'>Fix:</b> {finding.remediation}
                </span>
              </p>
              <p className='text-xs text-slate-500'>
                {finding.check_id} &middot; {finding.owasp}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}