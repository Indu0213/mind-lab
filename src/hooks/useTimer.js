import { useEffect, useRef, useState } from 'react'

// Simple second-resolution timer. Starts when `running` becomes true.
export function useTimer(running) {
  const [seconds, setSeconds] = useState(0)
  const startRef = useRef(null)

  useEffect(() => {
    if (!running) return undefined
    if (startRef.current === null) startRef.current = Date.now()
    const tick = () => setSeconds(Math.floor((Date.now() - startRef.current) / 1000))
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [running])

  const reset = () => {
    startRef.current = null
    setSeconds(0)
  }

  return { seconds, reset }
}
