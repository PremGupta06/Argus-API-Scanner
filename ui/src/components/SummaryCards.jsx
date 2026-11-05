import { motion } from 'framer-motion'
import CountUp from './CountUp'
import RiskRing from './RiskRing'
import { SEVERITIES, SEV_STYLE } from '../constants'

export default function SummaryCards({ summary, score, grade, active, onFilter }) {
  return (
    <div className='flex flex-col items-center gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl md:flex-row'>
      <RiskRing score={score} grade={grade} />
      <div className='grid w-full flex-1 grid-cols-2 gap-3 sm:grid-cols-5'>
        {SEVERITIES.map((sev, i) => {
          const s = SEV_STYLE[sev]
          const on = active === sev
          return (
            <motion.button
              key={sev}
              type='button'
              onClick={() => onFilter(on ? 'all' : sev)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={
                'rounded-2xl border p-4 text-center transition ' +
                s.bg + ' ' + (on ? s.border + ' ring-2 ring-white/20' : 'border-white/10')
              }
            >
              <div className={'text-3xl font-bold ' + s.text}>
                <CountUp value={summary[sev] || 0} />
              </div>
              <div className='mt-1 text-xs capitalize text-slate-400'>{sev}</div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}