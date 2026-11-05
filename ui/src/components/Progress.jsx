import { motion } from 'framer-motion'
import { CheckCircle2, CircleDashed, Loader2, MinusCircle, XCircle } from 'lucide-react'
import { CHECKS } from '../constants'

function stateOf(events) {
  const state = {}
  for (const e of events) {
    if (!e.check) continue
    if (e.type === 'check_start') state[e.check] = { status: 'running' }
    if (e.type === 'check_done') state[e.check] = { status: 'done', count: e.count }
    if (e.type === 'check_skipped') state[e.check] = { status: 'skipped' }
    if (e.type === 'check_error') state[e.check] = { status: 'error', message: e.message }
  }
  return state
}

function Icon({ status }) {
  if (status === 'running') return <Loader2 size={20} className='animate-spin text-indigo-400' />
  if (status === 'done') return <CheckCircle2 size={20} className='text-emerald-400' />
  if (status === 'skipped') return <MinusCircle size={20} className='text-slate-500' />
  if (status === 'error') return <XCircle size={20} className='text-red-400' />
  return <CircleDashed size={20} className='text-slate-600' />
}

export default function Progress({ events }) {
  const state = stateOf(events)
  const loaded = events.find((e) => e.type === 'spec_loaded')
  const finished = CHECKS.filter((c) => state[c.key] && state[c.key].status !== 'running').length
  const percent = Math.round((finished / CHECKS.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className='mx-auto w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl sm:p-8'
    >
      <div className='mb-6 flex items-end justify-between'>
        <div>
          <h2 className='text-xl font-semibold'>Scanning...</h2>
          <p className='text-sm text-slate-400'>
            {loaded ? loaded.endpoints + ' endpoints loaded from the spec' : 'Reading the OpenAPI spec'}
          </p>
        </div>
        <span className='text-3xl font-bold text-indigo-300'>{percent}%</span>
      </div>

      <div className='mb-6 h-2 overflow-hidden rounded-full bg-white/10'>
        <motion.div
          className='h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400'
          initial={{ width: '0%' }}
          animate={{ width: percent + '%' }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <ul className='space-y-2'>
        {CHECKS.map((c, i) => {
          const s = state[c.key] || { status: 'pending' }
          const note =
            s.status === 'skipped' ? 'Skipped (aggressive mode is off)' : s.status === 'error' ? s.message : c.desc
          return (
            <motion.li
              key={c.key}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={
                'flex items-center gap-4 rounded-2xl border p-3.5 transition-colors ' +
                (s.status === 'running' ? 'border-indigo-400/40 bg-indigo-500/10' : 'border-white/10 bg-white/[0.03]')
              }
            >
              <Icon status={s.status} />
              <div className='flex-1'>
                <div className='text-sm font-medium'>{c.label}</div>
                <div className='text-xs text-slate-500'>{note}</div>
              </div>
              {s.status === 'done' && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='rounded-md bg-white/10 px-2 py-0.5 text-xs text-slate-300'
                >
                  {s.count} found
                </motion.span>
              )}
            </motion.li>
          )
        })}
      </ul>
    </motion.div>
  )
}