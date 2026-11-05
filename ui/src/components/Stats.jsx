import { useRef } from 'react'
import { useInView } from 'framer-motion'
import CountUp from './CountUp'
import Reveal from './Reveal'
import { SectionTitle } from './Section'
import { STATS } from '../content'

function Stat({ stat, index }) {
  const ref = useRef(null)
  const seen = useInView(ref, { once: true, margin: '-60px' })
  return (
    <Reveal delay={index * 0.08} className='h-full'>
      <div ref={ref} className='h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6'>
        <div className='font-display text-4xl font-bold text-white'>
          {stat.prefix}
          {seen ? <CountUp value={stat.value} /> : 0}
          {stat.suffix}
        </div>
        <div className='mt-2 font-medium text-slate-200'>{stat.label}</div>
        <div className='mt-1 text-sm text-slate-500'>{stat.note}</div>
      </div>
    </Reveal>
  )
}

export default function Stats() {
  return (
    <section className='mx-auto max-w-6xl px-6 py-24'>
      <SectionTitle
        eyebrow='By the numbers'
        white='Built for'
        accent='developers'
        text='A focused scanner that is quick to run, easy to read and private by design.'
      />
      <div className='mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {STATS.map((s, i) => (
          <Stat key={s.label} stat={s} index={i} />
        ))}
      </div>
    </section>
  )
}