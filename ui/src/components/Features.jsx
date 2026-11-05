import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Wrench } from 'lucide-react'
import Reveal from './Reveal'
import { SectionTitle } from './Section'
import { FEATURES } from '../content'
import { SEV_STYLE } from '../constants'

export default function Features() {
  const [active, setActive] = useState(0)
  const f = FEATURES[active]
  const s = SEV_STYLE[f.severity]

  return (
    <section id='features' className='mx-auto max-w-6xl scroll-mt-20 px-6 py-24'>
      <SectionTitle
        eyebrow='Security checks'
        white='Explore our'
        accent='checks'
        text='Six focused checks that catch the most common and most damaging API flaws.'
      />
      <Reveal className='mt-12'>
        <div className='grid gap-6 lg:grid-cols-[320px_1fr]'>
          <div role='tablist' className='flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible'>
            {FEATURES.map((item, i) => {
              const Icon = item.icon
              const on = i === active
              return (
                <button
                  key={item.id}
                  role='tab'
                  aria-selected={on}
                  onClick={() => setActive(i)}
                  className={
                    'relative flex shrink-0 items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition lg:shrink ' +
                    (on ? 'border-indigo-400/40 text-white' : 'border-white/10 text-slate-400 hover:bg-white/5')
                  }
                >
                  {on && <motion.span layoutId='tab-bg' className='absolute inset-0 rounded-2xl bg-indigo-500/15' />}
                  <Icon size={18} className='relative' />
                  <span className='relative whitespace-nowrap text-sm font-medium lg:whitespace-normal'>{item.title}</span>
                </button>
              )
            })}
          </div>

          <div className='relative min-h-[380px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-800 to-ink-900 p-6 sm:p-8'>
            <div className='pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/20 blur-3xl' />
            <AnimatePresence mode='wait'>
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className='relative space-y-5'
              >
                <div className='flex flex-wrap items-center gap-3'>
                  <span className={'rounded-md border px-2 py-0.5 text-xs font-semibold uppercase ' + s.bg + ' ' + s.border + ' ' + s.text}>
                    {f.severity}
                  </span>
                  <span className='text-xs text-slate-500'>{f.owasp}</span>
                </div>
                <h3 className='font-display text-2xl font-semibold'>{f.title}</h3>
                <p className='text-slate-300'>{f.summary}</p>
                <pre className='overflow-x-auto rounded-xl border border-white/10 bg-ink-950/80 p-4 font-mono text-xs leading-relaxed text-slate-300'>
                  {f.example.map((line, i) => (
                    <div key={i}>{line || ' '}</div>
                  ))}
                </pre>
                <p className='flex gap-2 text-sm text-slate-300'>
                  <Wrench size={16} className='mt-0.5 shrink-0 text-emerald-400' />
                  <span><b className='text-emerald-300'>How to fix:</b> {f.fix}</span>
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </section>
  )
}