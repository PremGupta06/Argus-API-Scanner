import Reveal from './Reveal'

export function Eyebrow({ children }) {
  return (
    <span className='inline-flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-xs font-medium tracking-wide text-indigo-200'>
      <span className='h-1.5 w-1.5 rounded-full bg-sky-300' />
      {children}
    </span>
  )
}

export function SectionTitle({ eyebrow, white, accent, text, center = true }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-xl'}>
      <Reveal><Eyebrow>{eyebrow}</Eyebrow></Reveal>
      <Reveal delay={0.05}>
        <h2 className='mt-4 font-display text-3xl font-semibold uppercase tracking-tight sm:text-4xl'>
          {white}{' '}
          <span className='bg-gradient-to-r from-indigo-300 to-violet-400 bg-clip-text text-transparent'>{accent}</span>
        </h2>
      </Reveal>
      {text && (
        <Reveal delay={0.1}>
          <p className='mt-4 text-slate-400'>{text}</p>
        </Reveal>
      )}
    </div>
  )
}

export function Button({ href, onClick, children, variant = 'primary', type = 'button', className = '' }) {
  const base = 'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition duration-300'
  const styles =
    variant === 'primary'
      ? 'bg-sky-300 text-ink-950 shadow-lg shadow-sky-400/25 hover:bg-sky-200 hover:shadow-sky-300/40'
      : 'border border-white/15 bg-white/5 text-slate-100 hover:bg-white/10'
  const cls = base + ' ' + styles + ' ' + className
  if (href) return <a href={href} className={cls}>{children}</a>
  return <button type={type} onClick={onClick} className={cls}>{children}</button>
}