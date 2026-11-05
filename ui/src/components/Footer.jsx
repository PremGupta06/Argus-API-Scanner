import Logo from './Logo'
import { BRAND, NAV } from '../config'

export default function Footer() {
  return (
    <footer className='border-t border-white/10 bg-ink-900/60'>
      <div className='mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between'>
        <div className='space-y-3'>
          <Logo />
          <p className='max-w-sm text-xs text-slate-500'>
            Use this tool only on systems you own or are explicitly authorised to test.
          </p>
        </div>
        <ul className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-400'>
          {NAV.map((item) => (
            <li key={item.href}><a href={item.href} className='transition hover:text-white'>{item.label}</a></li>
          ))}
          <li><a href='#/scanner' className='transition hover:text-white'>Scanner</a></li>
        </ul>
      </div>
      <div className='border-t border-white/5 py-4 text-center text-xs text-slate-600'>
        &copy; {new Date().getFullYear()} {BRAND}. Built with React, Tailwind CSS and Flask.
      </div>
    </footer>
  )
}