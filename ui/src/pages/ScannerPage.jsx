import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, History as HistoryIcon } from 'lucide-react'
import { getScan, health, startScan } from '../api'
import { clearHistory, loadHistory, saveScan } from '../history'
import HistoryModal from '../components/HistoryModal'
import Progress from '../components/Progress'
import Results from '../components/Results'
import ScanForm from '../components/ScanForm'

export default function ScannerPage({ notify }) {
  const [phase, setPhase] = useState('form')
  const [job, setJob] = useState(null)
  const [error, setError] = useState('')
  const [online, setOnline] = useState(null)
  const [history, setHistory] = useState(loadHistory)
  const [showHistory, setShowHistory] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    health().then(setOnline)
    return () => clearInterval(timer.current)
  }, [])

  const fail = (message) => {
    clearInterval(timer.current)
    setError(message)
    setPhase('form')
  }

  const poll = (id) => {
    timer.current = setInterval(async () => {
      try {
        const data = await getScan(id)
        setJob(data)
        if (data.status === 'done') {
          clearInterval(timer.current)
          setHistory(saveScan(data))
          setPhase('results')
          notify('Scan complete: ' + data.findings.length + ' findings')
        }
        if (data.status === 'error') fail(data.error)
      } catch (err) {
        fail(err.message)
      }
    }, 400)
  }

  const start = async (form) => {
    setError('')
    try {
      const id = await startScan({
        target: form.target, spec: form.spec, spec_text: form.spec_text,
        token: form.token, token_b: form.token_b, own_id: form.own_id,
        ids: form.ids, aggressive: form.aggressive,
      })
      setJob({ id, status: 'running', events: [], findings: [], summary: {} })
      setPhase('scanning')
      poll(id)
    } catch (err) {
      setError(err.message)
      setOnline(await health())
    }
  }

  const reset = () => {
    setJob(null)
    setPhase('form')
  }

  const openFromHistory = (entry) => {
    setJob(entry)
    setPhase('results')
    setShowHistory(false)
  }

  const clear = () => {
    clearHistory()
    setHistory([])
  }

  const dot = online === null ? 'bg-slate-500' : online ? 'bg-emerald-400' : 'bg-red-500'
  const label = online === null ? 'Checking backend' : online ? 'Backend online' : 'Backend offline'

  return (
    <div className='relative min-h-[80vh] overflow-hidden pb-20 pt-28'>
      <div className='pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl' />
      <div className='pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl' />

      <div className='relative mx-auto max-w-5xl px-6'>
        <div className='mb-8 flex items-center justify-between'>
          <span className='flex items-center gap-2 text-xs text-slate-400'>
            <span className={'h-2 w-2 rounded-full ' + dot} />
            {label}
          </span>
          <button
            type='button'
            onClick={() => setShowHistory(true)}
            className='flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200 transition hover:bg-white/10'
          >
            <HistoryIcon size={14} /> History ({history.length})
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className='mx-auto mb-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200'
            >
              <AlertTriangle size={18} className='mt-0.5 shrink-0' />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode='wait'>
          {phase === 'form' && (
            <motion.div key='form' exit={{ opacity: 0, y: -16 }}>
              <div className='mb-8 text-center'>
                <h1 className='bg-gradient-to-r from-white via-indigo-200 to-violet-300 bg-clip-text font-display text-3xl font-bold tracking-tight text-transparent sm:text-4xl'>
                  Run a security scan
                </h1>
                <p className='mx-auto mt-3 max-w-xl text-slate-400'>
                  Import an OpenAPI spec, run OWASP API Top 10 checks and get a prioritised report.
                </p>
              </div>
              <ScanForm onStart={start} />
            </motion.div>
          )}
          {phase === 'scanning' && (
            <motion.div key='scanning' exit={{ opacity: 0 }}>
              <Progress events={job ? job.events : []} />
            </motion.div>
          )}
          {phase === 'results' && (
            <motion.div key='results'>
              <Results job={job} onReset={reset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <HistoryModal
        open={showHistory}
        onClose={() => setShowHistory(false)}
        items={history}
        onPick={openFromHistory}
        onClear={clear}
      />
    </div>
  )
}