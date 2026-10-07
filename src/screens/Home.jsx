import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import CategoryCard from '../components/CategoryCard.jsx'
import { CATEGORIES, ELEMENTS } from '../data/science.js'
import { getBestByCategory, getPlayerName, getScores, setPlayerName } from '../utils/storage.js'
import { formatNumber } from '../utils/game.js'

// Three sample cards fanned out in the hero panel.
const FAN = [
  { categoryId: 'biology', elementId: 'dna' },
  { categoryId: 'physics', elementId: 'atom' },
  { categoryId: 'space', elementId: 'saturn' },
].map(({ categoryId, elementId }) => ({
  color: CATEGORIES.find((c) => c.id === categoryId).color,
  element: ELEMENTS[categoryId].find((e) => e.id === elementId),
}))

const SAMPLE = FAN[1].element
const SAMPLE_FACT = `${SAMPLE.fact.split('. ')[0]}.`
const TOTAL_CARDS = Object.values(ELEMENTS).reduce((sum, list) => sum + list.length, 0)

export default function Home({ onPlay, onPickCategory }) {
  const [name, setName] = useState(getPlayerName())
  const scores = getScores()
  const bestByCategory = getBestByCategory()
  const games = scores.length
  const best = games ? formatNumber(scores[0].score) : '—'
  const accuracy = games
    ? `${Math.round(scores.reduce((sum, s) => sum + s.accuracy, 0) / games)}%`
    : '—'

  const saveName = () => setPlayerName(name || 'Player')

  const handlePlay = (e) => {
    e.preventDefault()
    saveName()
    onPlay()
  }

  const handlePick = (id) => {
    saveName()
    onPickCategory(id)
  }

  return (
    <div className="view home">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Science memory challenge</p>
          <h1 className="display">
            Train your memory, one <span className="wavy">discovery</span> at a time.
          </h1>
          <p className="lead">
            Flip the cards, find the pairs and unlock a science fact with every match.
            Four fields of science, three levels of difficulty.
          </p>

          <form className="start-row" onSubmit={handlePlay}>
            <label className="field">
              <span className="eyebrow">Player name</span>
              <input
                className="input"
                id="player-name"
                name="player-name"
                autoComplete="off"
                value={name}
                maxLength={18}
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <button type="submit" className="key key-solid key-lg">
              Start challenge <ArrowRight size={16} />
            </button>
          </form>

          <div className="panel metrics">
            <div className="metric">
              <span className="metric-value">{games}</span>
              <span className="eyebrow">Rounds</span>
            </div>
            <div className="metric">
              <span className="metric-value">{best}</span>
              <span className="eyebrow">Best score</span>
            </div>
            <div className="metric">
              <span className="metric-value">{accuracy}</span>
              <span className="eyebrow">Accuracy</span>
            </div>
          </div>
        </div>

        <div className="hero-panel dotgrid" aria-hidden="true">
          <span className="eyebrow hero-note hero-note-left">Fig. 01</span>
          <span className="eyebrow hero-note hero-note-right">
            {TOTAL_CARDS} cards / {CATEGORIES.length} fields
          </span>
          <div className="fan">
            {FAN.map(({ color, element }, i) => {
              const Icon = element.icon
              return (
                <span key={element.id} className={`fan-card fan-card-${i + 1}`} style={{ '--card-accent': color }}>
                  <Icon strokeWidth={1.5} />
                  <em>{element.name}</em>
                </span>
              )
            })}
          </div>
          <div className="hero-fact">
            <span className="badge badge-emerald">
              <Check size={10} strokeWidth={3} /> Match
            </span>
            <span className="hero-fact-title">{SAMPLE.name}</span>
            <span className="hero-fact-text">{SAMPLE_FACT}</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Pick a field to begin</h2>
          <span className="eyebrow">{CATEGORIES.length} fields / {TOTAL_CARDS} cards</span>
        </div>
        <div className="card-grid card-grid-4">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              best={bestByCategory[category.id]}
              onSelect={handlePick}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
