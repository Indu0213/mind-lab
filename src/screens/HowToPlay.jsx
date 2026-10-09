import { ArrowRight, Eye, Gauge, Grid3x3, Lightbulb, Microscope, Trophy } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import PageHeader from '../components/PageHeader.jsx'

const STEPS = [
  { icon: Microscope, tone: 'emerald', title: 'Pick a category', text: 'Biology, Physics, Chemistry or Space. Each has its own set of science cards.' },
  { icon: Gauge, tone: 'blue', title: 'Choose a difficulty', text: 'Bigger boards mean more pairs to remember and a higher score multiplier.' },
  { icon: Eye, tone: 'amber', title: 'Memorise the peek', text: 'All cards are shown for a few seconds at the start. Use it well.' },
  { icon: Grid3x3, tone: 'rose', title: 'Flip two cards', text: 'Find matching pairs. Every wrong attempt lowers your accuracy.' },
  { icon: Lightbulb, tone: 'emerald', title: 'Learn a fact', text: 'Each match reveals a quick science fact about that element.' },
  { icon: Trophy, tone: 'blue', title: 'Beat your score', text: 'Finish fast with few mistakes to climb the leaderboard.' },
]

export default function HowToPlay({ onBack, onPlay }) {
  return (
    <div className="view">
      <TopBar crumbs={['Guide', 'Rules']} onBack={onBack} />
      <div className="page-head">
        <PageHeader
          title={<>How to <span className="wavy">play</span>.</>}
          sub="Six steps from your first flip to the top of the board."
        />
        <button className="key key-solid key-lg" onClick={onPlay}>
          Start challenge <ArrowRight size={16} />
        </button>
      </div>

      <ol className="step-grid">
        {STEPS.map(({ icon: Icon, tone, title, text }, i) => (
          <li className={`panel step-card tone-${tone}`} key={title}>
            <div className="step-top">
              <span className="icon-tile">
                <Icon size={20} strokeWidth={1.6} />
              </span>
              <span className="eyebrow">Step {String(i + 1).padStart(2, '0')}</span>
            </div>
            <h2 className="step-title">{title}</h2>
            <p className="step-text">{text}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}
