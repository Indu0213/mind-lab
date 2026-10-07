import { ChevronLeft } from 'lucide-react'

// Row above a page title: back key, breadcrumb trail, optional action on the right.
export default function TopBar({ crumbs = [], onBack, right }) {
  return (
    <div className="crumbbar">
      {onBack && (
        <button className="key key-soft key-icon" onClick={onBack} aria-label="Go back">
          <ChevronLeft size={18} />
        </button>
      )}
      <p className="eyebrow crumbs">
        {crumbs.map((crumb, i) => (
          <span key={crumb}>
            {i > 0 && <span className="crumb-sep">/</span>}
            {crumb}
          </span>
        ))}
      </p>
      {right}
    </div>
  )
}
