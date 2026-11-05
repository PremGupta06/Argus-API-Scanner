import Reveal from './Reveal'
import { SectionTitle } from './Section'
import { STEPS } from '../content'

export default function HowItWorks() {
  return (
    <section id='how' className='relative scroll-mt-20 py-24'>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/20 to-transparent' />
      <div className='relative mx-auto max-w-6xl px-6'>
        <SectionTitle eyebrow='Workflow' white='How it' accent='works' text='From OpenAPI spec to a prioritised report in four steps.' />
        <div className='relative mt-14 grid gap-8 md:grid-cols-4'>
          <div className='absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-indigo-400/40 to-transparent md:block' />
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.title} delay={i * 0.12}>
                <div className='relative text-center'>
                  <div className='relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-ink-900 text-indigo-200 shadow-lg shadow-indigo-500/20'>
                    <Icon size={22} />
                    <span className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-sky-300 text-xs font-bold text-ink-950'>
                      {i + 1}
                    </span>
                  </div>
                  <h3 className='mt-5 font-semibold'>{s.title}</h3>
                  <p className='mt-2 text-sm text-slate-400'>{s.text}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}