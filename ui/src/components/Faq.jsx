import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Reveal from './Reveal'
import { SectionTitle } from './Section'
import { FAQ } from '../content'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <section id='faq' className='mx-auto max-w-3xl scroll-mt-20 px-6 py-24'>
      <SectionTitle eyebrow='FAQ' white='Common' accent='questions' />
      <div className='mt-10 space-y-3'>
        {FAQ.map((item, i) => {
          const on = open === i
          return (
            <Reveal key={item.q} delay={i * 0.05}>
              <div className='rounded-2xl border border-white/10 bg-white/[0.03]'>
                <button
                  type='button'
                  aria-expanded={on}
                  onClick={() => setOpen(on ? -1 : i)}
                  className='flex w-full items-center justify-between gap-4 p-5 text-left font-medium'
                >
                  {item.q}
                  <ChevronDown size={18} className={'shrink-0 text-slate-400 transition-transform ' + (on ? 'rotate-180' : '')} />
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className='overflow-hidden'
                    >
                      <p className='px-5 pb-5 text-sm text-slate-400'>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}