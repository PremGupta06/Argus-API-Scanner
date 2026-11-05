import { useEffect, useState } from 'react'
import { animate } from 'framer-motion'

export default function CountUp({ value }) {
  const [n, setN] = useState(0)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [value])

  return <span>{n}</span>
}