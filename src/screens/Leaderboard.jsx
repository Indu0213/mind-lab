import { useState } from 'react'
import { Trophy } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Segmented from '../components/Segmented.jsx'
import { CATEGORIES, DIFFICULTIES, getCategory, getDifficulty } from '../data/science.js'
import { getScores, clearScores } from '../utils/storage.js'
import { formatDate, formatNumber, formatTime } from '../utils/game.js'

const LEVEL_OPTIONS = [
  { value: 'all', label: 'All' },
  ...DIFFICULTIES.map((d) => ({ value: d.id, label: d.name })),
]

export default function Leaderboard({ onBack }) {
  const [scores, setScores] = useState(getScores)
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')

  const visible = scores
    .filter((s) => category === 'all' || s.category === category)
    .filter((s) => difficulty === 'all' || s.difficulty === difficulty)
    .slice(0, 10)

  const handleClear = () => {
    if (window.confirm('Clear all saved scores?')) {
      clearScores()
      setScores([])
    }
  }

  return (
    <div className="view">
      <TopBar
        crumbs={['Scores', 'This device']}
        onBack={onBack}
        right={scores.length > 0 && (
          <button className="text-btn" onClick={handleClear}>Clear scores</button>
        )}
      />
      <PageHeader
        title={<><span className="wavy">Leaderboard</span>.</>}
        sub="The ten best rounds saved on this device."
      />

      <div className="toolbar">
        <Segmented options={LEVEL_OPTIONS} value={difficulty} onChange={setDifficulty} label="Difficulty" />
        <div className="chips" role="group" aria-label="Category">
          <button className={`chip${category === 'all' ? ' is-active' : ''}`} onClick={() => setCategory('all')}>
            All
          </button>
          {CATEGORIES.map(({ id, name }) => (
            <button
              key={id}
              className={`chip${category === id ? ' is-active' : ''}`}
              onClick={() => setCategory(id)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="empty dotgrid">
          <span className="icon-tile">
            <Trophy size={20} strokeWidth={1.6} />
          </span>
          <p className="empty-title">No scores yet</p>
          <p className="empty-text">Play a round to get on the board.</p>
        </div>
      ) : (
        <div className="panel table-wrap">
          <table className="score-table">
            <thead>
              <tr>
                <th className="col-rank">#</th>
                <th>Player</th>
                <th className="col-wide">Field</th>
                <th className="col-wide">Level</th>
                <th className="col-wide num">Accuracy</th>
                <th className="col-wide num">Time</th>
                <th className="col-wide num">Date</th>
                <th className="num">Score</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((s, i) => {
                const cat = getCategory(s.category)
                const level = getDifficulty(s.difficulty).name
                const Icon = cat.icon
                return (
                  <tr key={s.id} style={{ '--accent': cat.color, '--accent-soft': cat.colorSoft }}>
                    <td className="col-rank">
                      <span className={`rank rank-${i + 1}`}>{i + 1}</span>
                    </td>
                    <td>
                      <div className="player">
                        <span className="icon-tile icon-tile-sm">
                          <Icon size={16} strokeWidth={1.75} />
                        </span>
                        <div className="player-text">
                          <div className="player-name">{s.name}</div>
                          <div className="player-meta">
                            {cat.name} · {level} · {s.accuracy}% · {formatTime(s.seconds)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="col-wide">{cat.name}</td>
                    <td className="col-wide">{level}</td>
                    <td className="col-wide num">{s.accuracy}%</td>
                    <td className="col-wide num">{formatTime(s.seconds)}</td>
                    <td className="col-wide num">{formatDate(s.date)}</td>
                    <td className="num score-value">{formatNumber(s.score)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
