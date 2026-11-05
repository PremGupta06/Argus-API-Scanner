import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import { Button } from './Section'
import { NAV } from '../config'

export default function Navbar({ route }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [route])

  return (
    <header
      className={
        'fixed inset-x-0 top-0 z-50 transition-all duration-300 ' +
        (scrolled || open ? 'border-b border-white/10 bg-ink-950/80 backdrop-blur-xl' : 'border-b border-transparent')
      }
    >
      <nav className='mx-auto flex h-16 max-w-6xl items-center justify-between px-6' aria-label='Main'>
        <Logo />
        <ul className='hidden items-center gap-8 md:flex'>
          {NAV.map((item) => (
            <li key={item.href}>
              <a href={item.href} className='text-sm text-slate-300 transition hover:text-white'>{item.label}</a>
            </li>
          ))}
        </ul>
        <div className='hidden md:block'>
          <Button href='#/scanner'>{route === 'scanner' ? 'New scan' : 'Launch scanner'}</Button>
        </div>
        <button
          className='rounded-lg p-2 text-slate-300 md:hidden'
          onClick={() => setOpen(!open)}
          aria-label='Toggle menu'
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className='overflow-hidden md:hidden'
          >
            <ul className='space-y-1 px-6 pb-5'>
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={() => setOpen(false)} className='block rounded-lg px-3 py-3 text-slate-200 hover:bg-white/5'>
                    {item.label}
                  </a>
                </li>
              ))}
              <li className='pt-2'>
                <Button href='#/scanner' className='w-full'>Launch scanner</Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}