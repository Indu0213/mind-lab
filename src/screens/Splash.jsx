import { useEffect } from 'react'
import { Brain } from 'lucide-react'

export default function Splash({ onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 2200)
    return () => clearTimeout(id)
  }, [onDone])

  return (
    <div className="splash" onClick={onDone}>
      <span className="logo-key logo-key-xl">
        <Brain size={34} strokeWidth={1.5} />
      </span>
      <h1 className="splash-title">MindLab</h1>
      <p className="eyebrow">Science memory challenge</p>
      <div className="splash-loader"><span /></div>
    </div>
  )
}
