import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, FlaskConical, Play, Upload, X } from 'lucide-react'

const EMPTY = {
  target: '', spec: '', spec_text: '', spec_name: '', token: '', token_b: '',
  own_id: 1, ids: '', aggressive: false, agreed: false,
}

const DEMO = {
  target: 'http://127.0.0.1:5050', spec: 'lab/openapi.yaml', spec_text: '', spec_name: '',
  token: 'token-alice', token_b: 'token-bob', own_id: 1, ids: '', aggressive: true, agreed: true,
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-slate-900/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-400/70 focus:ring-4 focus:ring-indigo-500/15 disabled:opacity-50'

function Field({ label, hint, children }) {
  return (
    <div>
      <span className='mb-1.5 block text-sm font-medium text-slate-300'>{label}</span>
      {children}
      {hint && <span className='mt-1 block text-xs text-slate-500'>{hint}</span>}
    </div>
  )
}

export default function ScanForm({ onStart }) {
  const [form, setForm] = useState(EMPTY)
  const [open, setOpen] = useState(false)

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const loadFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () =>
      setForm((f) => ({ ...f, spec_text: String(reader.result), spec_name: file.name, spec: '' }))
    reader.readAsText(file)
  }

  const ready = form.target && (form.spec || form.spec_text) && form.agreed

  const submit = (e) => {
    e.preventDefault()
    if (ready) onStart(form)
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='mx-auto w-full max-w-2xl space-y-5 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-indigo-950/40 backdrop-blur-xl sm:p-8'
    >
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 className='text-xl font-semibold'>New scan</h2>
          <p className='text-sm text-slate-400'>Point the scanner at an API and its OpenAPI spec.</p>
        </div>
        <button
          type='button'
          onClick={() => setForm(DEMO)}
          className='flex shrink-0 items-center gap-2 rounded-xl border border-indigo-400/30 bg-indigo-500/10 px-3 py-2 text-xs font-medium text-indigo-200 transition hover:bg-indigo-500/20'
        >
          <FlaskConical size={14} /> Use lab demo
        </button>
      </div>

      <Field label='Target API base URL'>
        <input className={inputClass} placeholder='http://127.0.0.1:5050' value={form.target} onChange={set('target')} />
      </Field>

      <Field label='OpenAPI spec' hint='Enter a file path or URL, or upload a .yaml or .json file.'>
        <div className='flex gap-2'>
          <input
            className={inputClass}
            placeholder='lab/openapi.yaml or https://example.com/openapi.json'
            value={form.spec}
            onChange={set('spec')}
            disabled={!!form.spec_text}
          />
          <label className='flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-slate-900/70 px-3.5 text-sm text-slate-300 transition hover:border-indigo-400/60'>
            <Upload size={15} /> Upload
            <input type='file' accept='.yaml,.yml,.json' className='hidden' onChange={loadFile} />
          </label>
        </div>
        {form.spec_name && (
          <span className='mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-300'>
            {form.spec_name}
            <button type='button' onClick={() => setForm({ ...form, spec_text: '', spec_name: '' })}>
              <X size={12} />
            </button>
          </span>
        )}
      </Field>

      <button
        type='button'
        onClick={() => setOpen(!open)}
        className='flex items-center gap-1.5 text-sm text-slate-400 transition hover:text-slate-200'
      >
        <ChevronDown size={16} className={'transition-transform ' + (open ? 'rotate-180' : '')} />
        Authentication and options
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='overflow-hidden'
          >
            <div className='grid gap-4 pt-1 sm:grid-cols-2'>
              <Field label='Token (user A)'>
                <input className={inputClass} placeholder='token-alice' value={form.token} onChange={set('token')} />
              </Field>
              <Field label='Token (user B)' hint='Improves BOLA detection'>
                <input className={inputClass} placeholder='token-bob' value={form.token_b} onChange={set('token_b')} />
              </Field>
              <Field label='Your object ID' hint='The ID that belongs to user A'>
                <input type='number' min='0' className={inputClass} value={form.own_id} onChange={set('own_id')} />
              </Field>
              <Field label='Extra object IDs' hint='Comma separated, tried by the BOLA check'>
                <input className={inputClass} placeholder='7, 8, 9' value={form.ids} onChange={set('ids')} />
              </Field>
            </div>
            <label className='mt-4 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-3.5'>
              <input type='checkbox' checked={form.aggressive} onChange={set('aggressive')} className='mt-1 accent-indigo-500' />
              <span className='text-sm'>
                <span className='font-medium text-slate-200'>Aggressive checks</span>
                <span className='block text-xs text-slate-500'>
                  Sends PUT and POST requests that can modify data. Use on test systems only.
                </span>
              </span>
            </label>
          </motion.div>
        )}
      </AnimatePresence>

      <label className='flex cursor-pointer items-start gap-3 text-sm text-slate-300'>
        <input type='checkbox' checked={form.agreed} onChange={set('agreed')} className='mt-1 accent-indigo-500' />
        I own this API or have written permission to test it.
      </label>

      <button
        type='submit'
        disabled={!ready}
        className='group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:from-indigo-400 hover:to-violet-400 disabled:cursor-not-allowed disabled:opacity-40'
      >
        <Play size={16} className='transition-transform group-hover:translate-x-0.5' /> Start scan
      </button>
    </motion.form>
  )
}