import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ArrowRight, Check } from 'lucide-react'
import { ELEMENTS, themeStyle } from '../data/science.js'

// Fact card shown after a successful match, laid out like a small catalogue entry.
export default function FactPopup({ element, category, found, total, onClose }) {
  useEffect(() => {
    if (!element) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [element, onClose])

  if (!element) return null

  const Icon = element.icon
  const number = ELEMENTS[category.id].findIndex((e) => e.id === element.id) + 1
  const catalogRef = `${category.code}.${String(number).padStart(2, '0')}`

  return createPortal(
    <div className="popup-backdrop" onClick={onClose} role="presentation">
      <div
        className="popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fact-title"
        onClick={(e) => e.stopPropagation()}
        style={themeStyle(category)}
      >
        <div className="popup-head">
          <span className="eyebrow">{catalogRef} / {category.name}</span>
          <span className="badge badge-emerald">
            <Check size={10} strokeWidth={3} /> Match
          </span>
        </div>

        <div className="popup-body">
          <span className="icon-tile icon-tile-lg icon-tile-solid">
            <Icon size={28} strokeWidth={1.6} />
          </span>
          <h2 id="fact-title" className="popup-title">{element.name}</h2>
          <p className="eyebrow">Did you know</p>
          <p className="popup-fact">{element.fact}</p>
        </div>

        <div className="popup-foot">
          <span className="eyebrow">Pair {found} of {total}</span>
          <button className="key key-solid" onClick={onClose} autoFocus>
            Continue <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
