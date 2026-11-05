import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'
import ShieldHero from './ShieldHero'
import { Button, Eyebrow } from './Section'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } }

export default function Hero() {
  return (
    <section className='relative overflow-hidden pb-20 pt-32 sm:pt-40'>
      <div className='grid-bg pointer-events-none absolute inset-0' />
      <div className='pointer-events-none absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-3xl' />

      <div className='relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2'>
        <motion.div variants={container} initial='hidden' animate='show'>
          <motion.div variants={item}>
            <Eyebrow>Automated API security testing</Eyebrow>
          </motion.div>
          <motion.h1
            variants={item}
            className='mt-5 font-display text-4xl font-bold uppercase leading-tight tracking-tight sm:text-5xl lg:text-6xl'
          >
            Secure your APIs{' '}
            <span className='bg-gradient-to-r from-indigo-300 via-violet-300 to-sky-300 bg-clip-text text-transparent'>
              before attackers do
            </span>
          </motion.h1>
          <motion.p variants={item} className='mt-5 max-w-xl text-lg text-slate-400'>
            Import an OpenAPI spec and run OWASP API Top 10 checks in seconds. Get a prioritised, developer-friendly
            report with evidence and fixes.
          </motion.p>
          <motion.div variants={item} className='mt-8 flex flex-wrap gap-3'>
            <Button href='#/scanner'>Launch scanner <ArrowRight size={16} /></Button>
            <Button href='#how' variant='ghost'><Play size={15} /> See how it works</Button>
          </motion.div>
          <motion.p variants={item} className='mt-6 text-xs text-slate-500'>
            Runs on your machine. Only scan APIs you own or have permission to test.
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <ShieldHero />
        </motion.div>
      </div>
    </section>
  )
}