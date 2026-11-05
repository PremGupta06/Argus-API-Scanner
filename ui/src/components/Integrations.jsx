import { Check, ShieldHalf } from 'lucide-react'
import Reveal from './Reveal'
import { Eyebrow } from './Section'
import { WORKFLOW } from '../content'

const POINTS = [
  'Dashboard for interactive scans',
  'CLI with CI-friendly exit codes',
  'JSON export for your own tools',
]

export default function Integrations() {
  return (
    <section id='workflow' className='relative scroll-mt-20 overflow-hidden py-24'>
      <div className='mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2'>
        <div>
          <Reveal><Eyebrow>Integrations</Eyebrow></Reveal>
          <Reveal delay={0.05}>
            <h2 className='mt-4 font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl'>
              Smart integrations,{' '}
              <span className='bg-gradient-to-r from-indigo-300 to-violet-400 bg-clip-text text-transparent'>simple workflow</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className='mt-4 max-w-md text-slate-400'>
              Explore results in the dashboard, automate with the command line, and feed JSON exports into your own tools.
            </p>
          </Reveal>
          <ul className='mt-6 space-y-3'>
            {POINTS.map((p, i) => (
              <li key={p}>
                <Reveal delay={0.15 + i * 0.07}>
                  <div className='flex items-center gap-3 text-sm text-slate-300'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300'>
                      <Check size={14} />
                    </span>
                    {p}
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal>
          <div className='relative mx-auto aspect-square w-full max-w-[460px]'>
            <div className='absolute inset-x-8 bottom-2 h-24 rounded-[50%] bg-gradient-to-t from-violet-600/40 to-transparent blur-2xl' />
            <div className='absolute inset-[10%] animate-orbit rounded-full border border-dashed border-indigo-300/20' />
            <div className='absolute inset-[24%] animate-orbit-rev rounded-full border border-indigo-300/15' />
            <div className='absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-2xl shadow-indigo-500/40'>
              <ShieldHalf size={34} />
            </div>
            {WORKFLOW.map((w, i) => {
              const angle = (i / WORKFLOW.length) * 2 * Math.PI - Math.PI / 2
              const left = 50 + Math.cos(angle) * 34
              const top = 50 + Math.sin(angle) * 34
              return (
                <div key={w.name} className='absolute -translate-x-1/2 -translate-y-1/2' style={{ left: left + '%', top: top + '%' }}>
                  <div
                    className='flex animate-float items-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-ink-900/90 px-3 py-1.5 text-xs backdrop-blur'
                    style={{ animationDelay: i * 0.6 + 's' }}
                  >
                    <span className={'h-2 w-2 rounded-full ' + (w.status === 'ready' ? 'bg-emerald-400' : 'bg-amber-400')} />
                    {w.name}
                  </div>
                </div>
              )
            })}
          </div>
          <p className='mt-4 text-center text-xs text-slate-500'>Green: available now. Amber: planned.</p>
        </Reveal>
      </div>
    </section>
  )
}