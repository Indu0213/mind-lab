import { Check, Sparkle } from 'lucide-react'

export default function Card({ card, flipped, matched, disabled, color, onClick }) {
  const Icon = card.element.icon
  const classes = ['card', flipped && 'is-flipped', matched && 'is-matched'].filter(Boolean).join(' ')
  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled || matched || flipped}
      aria-label={flipped || matched ? card.element.name : 'Hidden card'}
      style={{ '--card-accent': color }}
    >
      <span className="card-inner">
        <span className="card-face card-back" aria-hidden="true">
          <span className="card-back-mark">
            <Sparkle size={11} strokeWidth={2} />
          </span>
        </span>
        <span className="card-face card-front">
          <span className="card-check" aria-hidden="true">
            <Check size={9} strokeWidth={3.5} />
          </span>
          <span className="card-icon">
            <Icon strokeWidth={1.5} />
          </span>
          <span className="card-name">{card.element.name}</span>
        </span>
      </span>
    </button>
  )
}
