import { motion } from 'framer-motion'

const CHIPS = [
  { label: 'BOLA', tone: 'text-red-300 border-red-400/30', pos: 'left-0 top-[14%]', delay: 0 },
  { label: 'Auth bypass', tone: 'text-orange-300 border-orange-400/30', pos: 'right-0 top-[26%]', delay: 1.2 },
  { label: 'Data leak', tone: 'text-amber-300 border-amber-400/30', pos: 'left-[4%] bottom-[20%]', delay: 2.1 },
  { label: 'No rate limit', tone: 'text-sky-300 border-sky-400/30', pos: 'right-[2%] bottom-[10%]', delay: 0.6 },
]

export default function ShieldHero() {
  return (
    <div className='relative mx-auto aspect-square w-full max-w-md'>
      <div className='absolute inset-8 rounded-full bg-indigo-600/30 blur-3xl' />
      {[0, 1].map((i) => (
        <span
          key={i}
          className='absolute inset-10 animate-pulse-ring rounded-full border border-indigo-300/30'
          style={{ animationDelay: i * 1.5 + 's' }}
        />
      ))}
      <div className='absolute inset-6 animate-orbit rounded-full border border-dashed border-white/10' />
      <div className='absolute inset-0 animate-orbit-rev rounded-full border border-white/5' />

      <div className='absolute inset-0 flex animate-float items-center justify-center'>
        <div className='relative'>
          <svg viewBox='0 0 200 240' className='h-64 w-56 drop-shadow-[0_0_40px_rgba(129,140,248,0.55)]'>
            <defs>
              <linearGradient id='shieldFill' x1='0' y1='0' x2='1' y2='1'>
                <stop offset='0%' stopColor='#818cf8' />
                <stop offset='55%' stopColor='#6d28d9' />
                <stop offset='100%' stopColor='#1e1b4b' />
              </linearGradient>
              <linearGradient id='shieldEdge' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#c7d2fe' />
                <stop offset='100%' stopColor='#6366f1' />
              </linearGradient>
            </defs>
            <path
              d='M100 8 L184 40 V118 C184 172 148 208 100 232 C52 208 16 172 16 118 V40 Z'
              fill='url(#shieldFill)' stroke='url(#shieldEdge)' strokeWidth='2.5'
            />
            <path
              d='M100 26 L168 52 V117 C168 160 140 190 100 210 C60 190 32 160 32 117 V52 Z'
              fill='none' stroke='rgba(255,255,255,0.18)' strokeWidth='1.2'
            />
            <motion.path
              d='M68 120 L92 144 L136 94'
              fill='none' stroke='#7dd3fc' strokeWidth='10' strokeLinecap='round' strokeLinejoin='round'
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.1, delay: 0.5, ease: 'easeOut' }}
            />
          </svg>
          <div className='pointer-events-none absolute inset-x-6 h-0.5 animate-scan rounded bg-gradient-to-r from-transparent via-sky-300 to-transparent shadow-[0_0_14px_3px_rgba(125,211,252,0.7)]' />
        </div>
      </div>

      {CHIPS.map((c) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + c.delay * 0.3 }}
          className={'absolute ' + c.pos}
        >
          <div
            className={'animate-float rounded-full border bg-ink-900/80 px-3 py-1.5 text-xs font-medium backdrop-blur ' + c.tone}
            style={{ animationDelay: c.delay + 's' }}
          >
            {c.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}