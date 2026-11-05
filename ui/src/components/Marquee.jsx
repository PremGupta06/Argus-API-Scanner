import { COVERAGE } from '../content'

export default function Marquee() {
  const items = [...COVERAGE, ...COVERAGE]
  return (
    <section className='border-y border-white/5 bg-white/[0.02] py-6' aria-label='Coverage'>
      <p className='mb-4 text-center text-xs uppercase tracking-[0.25em] text-slate-500'>
        Aligned with the OWASP API Security Top 10
      </p>
      <div
        className='overflow-hidden'
        style={{ maskImage: 'linear-gradient(90deg, transparent, black 12%, black 88%, transparent)' }}
      >
        <div className='flex w-max animate-marquee hover:[animation-play-state:paused]'>
          {items.map((text, i) => (
            <span key={i} className='mr-4 whitespace-nowrap rounded-full border border-white/10 bg-ink-900 px-4 py-2 text-sm text-slate-300'>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}