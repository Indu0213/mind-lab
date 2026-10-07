// Segmented control with a pill that slides to the active option.
export default function Segmented({ options, value, onChange, label }) {
  const index = Math.max(0, options.findIndex((o) => o.value === value))
  return (
    <div
      className="segmented"
      role="tablist"
      aria-label={label}
      style={{ '--count': options.length, '--index': index }}
    >
      <span className="segmented-pill" aria-hidden="true" />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={o.value === value}
          className="segmented-item"
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
