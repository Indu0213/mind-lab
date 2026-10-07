import { ArrowRight } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { DIFFICULTIES, getCategory } from '../data/science.js'
import { formatTime } from '../utils/game.js'

export default function DifficultySelect({ categoryId, onSelect, onBack }) {
  const category = getCategory(categoryId)
  return (
    <div className="view" style={{ '--accent': category.color, '--accent-soft': category.colorSoft }}>
      <TopBar crumbs={['Play', category.name]} onBack={onBack} />
      <PageHeader
        title={<>Select <span className="wavy">difficulty</span>.</>}
        sub="Bigger boards are harder to remember but score more."
      />
      <div className="card-grid card-grid-3">
        {DIFFICULTIES.map((d) => {
          const cards = d.pairs * 2
          return (
            <button key={d.id} className="depth-card diff-card" onClick={() => onSelect(d.id)}>
              <span
                className="diff-preview"
                aria-hidden="true"
                style={{ '--cols': d.columns, '--cols-wide': d.columnsWide }}
              >
                <span className="grid-preview">
                  {Array.from({ length: cards }, (_, i) => <i key={i} />)}
                </span>
              </span>
              <span className="diff-body">
                <span className="row-title">
                  {d.name} <span className="mult">×{d.multiplier}</span>
                </span>
                <span className="row-sub">{d.pairs} pairs · {cards} cards</span>
                <span className="eyebrow row-meta">
                  {d.peekMs / 1000}s peek · Par {formatTime(d.parSeconds)}
                </span>
              </span>
              <ArrowRight size={16} className="row-arrow" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
