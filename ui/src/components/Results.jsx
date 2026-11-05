import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Download, RotateCcw, Search } from 'lucide-react'
import FindingCard from './FindingCard'
import SummaryCards from './SummaryCards'
import { gradeOf, riskScore } from '../constants'

const btn =
  'flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-200 transition hover:bg-white/10'

export default function Results({ job, onReset }) {
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const score = riskScore(job.findings)

  const shown = useMemo(
    () =>
      job.findings.filter(
        (f) =>
          (filter === 'all' || f.severity === filter) &&
          (f.title + ' ' + f.endpoint + ' ' + f.check_id).toLowerCase().includes(query.toLowerCase())
      ),
    [job, filter, query]
  )

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(job, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'scan-' + job.id + '.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='space-y-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='text-2xl font-semibold'>Scan results</h2>
          <p className='text-sm text-slate-400'>
            {job.target} &middot; {job.findings.length} findings &middot; {job.duration}s
          </p>
        </div>
        <div className='flex gap-2'>
          <button onClick={exportJson} className={btn}>
            <Download size={15} /> Export JSON
          </button>
          <button onClick={onReset} className={btn}>
            <RotateCcw size={15} /> New scan
          </button>
        </div>
      </div>

      <SummaryCards summary={job.summary} score={score} grade={gradeOf(score)} active={filter} onFilter={setFilter} />

      <div className='relative'>
        <Search size={16} className='absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500' />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search findings...'
          className='w-full rounded-xl border border-white/10 bg-slate-900/70 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-indigo-400/70'
        />
      </div>

      <div className='space-y-3'>
        <AnimatePresence>
          {shown.map((f, i) => (
            <FindingCard key={f.check_id + f.endpoint + f.title} finding={f} index={i} />
          ))}
        </AnimatePresence>
        {shown.length === 0 && <p className='py-10 text-center text-slate-500'>No findings match.</p>}
      </div>
    </motion.div>
  )
}