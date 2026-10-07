import { ArrowRight } from 'lucide-react'
import { ELEMENTS } from '../data/science.js'
import { formatNumber } from '../utils/game.js'

// Category tile. A compact row on phones, a taller card with sample icons on wider screens.
export default function CategoryCard({ category, best = 0, onSelect }) {
  const { id, name, tagline, icon: Icon, color, colorSoft } = category
  const elements = ELEMENTS[id]

  return (
    <button
      className="depth-card cat-card"
      style={{ '--accent': color, '--accent-soft': colorSoft }}
      onClick={() => onSelect(id)}
    >
      <span className="icon-tile">
        <Icon size={22} strokeWidth={1.6} />
      </span>
      <ArrowRight size={16} className="row-arrow" />
      <span className="cat-body">
        <span className="row-title">{name}</span>
        <span className="row-sub">{tagline}</span>
      </span>
      <span className="cat-samples" aria-hidden="true">
        {elements.slice(1, 7).map(({ id: elementId, icon: Sample }) => (
          <Sample key={elementId} size={17} strokeWidth={1.6} />
        ))}
      </span>
      <span className="eyebrow cat-meta">
        {elements.length} cards
        {best > 0 && <> · Best {formatNumber(best)}</>}
      </span>
    </button>
  )
}
