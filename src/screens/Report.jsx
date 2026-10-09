import { Clock, Crosshair, Layers, LayoutGrid, RotateCcw, Trophy, X } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import { getCategory, getDifficulty, themeStyle } from '../data/science.js'
import { formatNumber, formatTime, memoryRating } from '../utils/game.js'
import { useCountUp } from '../hooks/useCountUp.js'

const LEVELS = [1, 2, 3, 4, 5]

export default function Report({ result, best, onPlayAgain, onChangeMode, onHome, onLeaderboard }) {
  const category = getCategory(result.categoryId)
  const difficulty = getDifficulty(result.difficultyId)
  const rating = memoryRating(result.accuracy)
  const isNewBest = result.score > best
  const score = useCountUp(result.score)
  const accuracy = useCountUp(result.accuracy)
  const found = result.found || []

  const details = [
    { label: 'Completion time', value: formatTime(result.seconds), icon: Clock, tone: 'blue' },
    { label: 'Attempts', value: result.attempts, icon: Crosshair, tone: 'amber' },
    { label: 'Pairs matched', value: result.pairs, icon: Layers, tone: 'emerald' },
    { label: 'Mistakes', value: result.attempts - result.pairs, icon: X, tone: 'rose' },
  ]

  return (
    <div className="view report themed" style={themeStyle(category)}>
      <div className="report-crumbs">
        <TopBar crumbs={['Report', category.name, difficulty.name]} onBack={onHome} />
      </div>

      <div className="report-title">
        <PageHeader
          title={<>Round <span className="wavy">complete</span>.</>}
          sub={`${category.name} on ${difficulty.name}, finished in ${formatTime(result.seconds)}.`}
        />
      </div>

      <div className="report-actions">
        <button className="key key-solid key-lg" onClick={onPlayAgain}>
          <RotateCcw size={16} /> Play again
        </button>
        <button className="key key-soft key-lg" onClick={onChangeMode}>
          <LayoutGrid size={15} /> Change mode
        </button>
        <button className="key key-soft key-lg" onClick={onLeaderboard}>
          <Trophy size={15} /> Leaderboard
        </button>
      </div>

      <div className="report-grid">
        <div className="panel result-card">
          <ProgressRing value={accuracy} color={category.color}>
            <span className="ring-value">{accuracy}%</span>
            <span className="eyebrow ring-label">Accuracy</span>
          </ProgressRing>
          <div className="result-score">
            <p className="eyebrow">Score</p>
            <p className="result-score-value">{formatNumber(score)}</p>
            <p className="result-score-label">
              points
              {isNewBest && <span className="badge badge-rose">New best</span>}
            </p>
          </div>
        </div>

        <div className="panel memory-card">
          <div className="memory-head">
            <div>
              <p className="eyebrow">Memory performance</p>
              <p className="memory-rating">{rating.label}</p>
            </div>
            <span className="eyebrow">Level {rating.level} / 5</span>
          </div>
          <div className="level" aria-hidden="true">
            {LEVELS.map((n) => (
              <span key={n} className={n <= rating.level ? 'is-on' : ''} style={{ '--i': n }} />
            ))}
          </div>
          <p className="memory-note">{rating.note}</p>
        </div>

        <div className="panel details">
          {details.map(({ label, value, icon: Icon, tone }) => (
            <div className={`detail tone-${tone}`} key={label}>
              <span className="detail-label">
                <span className="tone-chip"><Icon size={12} strokeWidth={2.25} /></span>
                <span className="eyebrow">{label}</span>
              </span>
              <span className="detail-value">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {found.length > 0 && (
        <section className="section report-recap">
          <div className="section-head">
            <h2 className="section-title">What you discovered</h2>
            <span className="eyebrow">{found.length} facts</span>
          </div>
          <ul className="fact-grid">
            {found.map((element) => {
              const Icon = element.icon
              return (
                <li className="panel fact-card" key={element.id}>
                  <span className="icon-tile icon-tile-sm">
                    <Icon size={16} strokeWidth={1.75} />
                  </span>
                  <div>
                    <div className="log-name">{element.name}</div>
                    <div className="log-fact">{element.fact}</div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </div>
  )
}
