import { motion } from 'framer-motion'
import CountUp from './CountUp'

export default function RiskRing({ score, grade }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const color = score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171'

  return (
    <div className='relative flex h-40 w-40 shrink-0 items-center justify-center'>
      <svg viewBox='0 0 128 128' className='h-full w-full -rotate-90'>
        <circle cx='64' cy='64' r={radius} fill='none' stroke='rgba(255,255,255,0.08)' strokeWidth='10' />
        <motion.circle
          cx='64' cy='64' r={radius} fill='none' stroke={color} strokeWidth='10' strokeLinecap='round'
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - score / 100) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className='absolute text-center'>
        <div className='text-4xl font-bold'><CountUp value={score} /></div>
        <div className='text-xs uppercase tracking-widest text-slate-400'>Grade {grade}</div>
      </div>
    </div>
  )
}