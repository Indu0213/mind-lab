const RADIUS = 40
const STROKE = 6
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function ProgressRing({ value, color, children }) {
  const clamped = Math.min(100, Math.max(0, value))
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE
  return (
    <div className="ring">
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle className="ring-track" cx="50" cy="50" r={RADIUS} fill="none" strokeWidth={STROKE} />
        <circle
          cx="50"
          cy="50"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="ring-center">{children}</div>
    </div>
  )
}
