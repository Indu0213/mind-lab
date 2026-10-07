import { formatTime } from '../utils/game.js'

export default function StatsBar({ seconds, attempts, matches, pairs, accuracy }) {
  const items = [
    { label: 'Time', value: formatTime(seconds) },
    { label: 'Pairs', value: `${matches}/${pairs}` },
    { label: 'Attempts', value: attempts },
    { label: 'Accuracy', value: `${accuracy}%` },
  ]
  return (
    <div className="panel stats-panel">
      <div className="stats">
        {items.map(({ label, value }) => (
          <div className="stat" key={label}>
            <span className="eyebrow stat-label">{label}</span>
            <span className="stat-value">{value}</span>
          </div>
        ))}
      </div>
      <div
        className="progress"
        role="progressbar"
        aria-label="Pairs found"
        aria-valuemin={0}
        aria-valuemax={pairs}
        aria-valuenow={matches}
      >
        <span style={{ width: `${(matches / pairs) * 100}%` }} />
      </div>
    </div>
  )
}
