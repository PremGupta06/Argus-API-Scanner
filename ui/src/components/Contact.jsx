import { useState } from 'react'
import { Loader2, Mail, Send, ShieldCheck } from 'lucide-react'
import Reveal from './Reveal'
import { SectionTitle } from './Section'
import { CONTACT_EMAIL } from '../config'

const EMPTY = { name: '', email: '', message: '', website: '' }

const fieldClass =
  'w-full rounded-xl border border-white/10 bg-ink-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-400/70 focus:ring-4 focus:ring-indigo-500/15'

export default function Contact({ notify }) {
  const [form, setForm] = useState(EMPTY)
  const [sending, setSending] = useState(false)
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not send your message')
      setForm(EMPTY)
      notify('Message sent. Thank you!')
    } catch (err) {
      notify(err.message, 'error')
    }
    setSending(false)
  }

  return (
    <section id='contact' className='relative scroll-mt-20 py-24'>
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-indigo-700/20 to-transparent' />
      <div className='relative mx-auto max-w-6xl px-6'>
        <SectionTitle eyebrow='Contact' white='Get in' accent='touch' text='Questions, feedback or ideas? Send a message.' />
        <Reveal className='mt-12'>
          <div className='grid gap-6 lg:grid-cols-[1fr_1.4fr]'>
            <div className='rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8'>
              <h3 className='font-display text-xl font-semibold'>Talk to us</h3>
              <p className='mt-2 text-sm text-slate-400'>We read every message and reply as soon as we can.</p>
              <ul className='mt-6 space-y-4 text-sm text-slate-300'>
                <li className='flex items-center gap-3'><Mail size={18} className='text-sky-300' /> {CONTACT_EMAIL}</li>
                <li className='flex items-center gap-3'><ShieldCheck size={18} className='text-emerald-400' /> Your message is stored privately on our server.</li>
              </ul>
            </div>

            <form onSubmit={submit} className='space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <input className={fieldClass} placeholder='Your name' aria-label='Your name' required maxLength={100} value={form.name} onChange={set('name')} />
                <input className={fieldClass} type='email' placeholder='Email address' aria-label='Email address' required maxLength={150} value={form.email} onChange={set('email')} />
              </div>
              <textarea className={fieldClass + ' min-h-32 resize-y'} placeholder='Your message' aria-label='Your message' required minLength={10} maxLength={2000} value={form.message} onChange={set('message')} />
              <input tabIndex={-1} autoComplete='off' aria-hidden='true' className='hidden' value={form.website} onChange={set('website')} />
              <button
                type='submit'
                disabled={sending}
                className='inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3 text-sm font-semibold text-ink-950 shadow-lg shadow-sky-400/25 transition hover:bg-sky-200 disabled:opacity-60'
              >
                {sending ? <Loader2 size={16} className='animate-spin' /> : <Send size={16} />}
                Send message
              </button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  )
}