import { useEffect, useState } from 'react'

function read() {
  return window.location.hash.startsWith('#/scanner') ? 'scanner' : 'home'
}

export default function useRoute() {
  const [route, setRoute] = useState(read())

  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}