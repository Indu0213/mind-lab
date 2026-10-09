import { Brain, HelpCircle, Play, Trophy } from 'lucide-react'

const LINKS = [
  { id: 'play', label: 'Play', icon: Play },
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'howto', label: 'How to play', icon: HelpCircle },
]

// App frame: sticky navigation on top, page content below.
export default function Shell({ active, onNavigate, children }) {
  return (
    <div className="app">
      <header className="nav">
        <div className="nav-inner">
          <button className="nav-brand" onClick={() => onNavigate('home')} aria-label="MindLab home">
            <span className="logo-key">
              <Brain size={16} strokeWidth={1.75} />
            </span>
            <span className="brand-name">MindLab</span>
          </button>

          <nav className="nav-links" aria-label="Main">
            {LINKS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`nav-link${active === id ? ' is-active' : ''}`}
                aria-current={active === id ? 'page' : undefined}
                aria-label={label}
                onClick={() => onNavigate(id)}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <span className="nav-tag">
            <span className="dots" aria-hidden="true"><i /><i /><i /><i /></span>
            <span className="eyebrow">Memory / Science</span>
          </span>
        </div>
      </header>

      <main className="page">{children}</main>
    </div>
  )
}
