import { ShieldHalf } from 'lucide-react'
import { BRAND } from '../config'

export default function Logo() {
  return (
    <a href='#/' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='flex items-center gap-2.5'>
      <span className='rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 p-2 shadow-lg shadow-indigo-500/30'>
        <ShieldHalf size={18} />
      </span>
      <span className='font-display text-lg font-semibold tracking-wide'>{BRAND}</span>
    </a>
  )
}