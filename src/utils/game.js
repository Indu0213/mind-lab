import { ELEMENTS } from '../data/science.js'

// Fisher-Yates shuffle, returns a new array.
export function shuffle(list) {
  const arr = [...list]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// Builds a shuffled deck of card objects for the given category and pair count.
export function buildDeck(categoryId, pairs) {
  const pool = shuffle(ELEMENTS[categoryId]).slice(0, pairs)
  const cards = pool.flatMap((element) => [
    { uid: `${element.id}-a`, element },
    { uid: `${element.id}-b`, element },
  ])
  return shuffle(cards)
}

// Accuracy is the share of attempts that produced a match.
export function calcAccuracy(matches, attempts) {
  if (attempts === 0) return 0
  return Math.round((matches / attempts) * 100)
}

// Score rewards matches, penalises wrong attempts and adds a bonus for beating par time.
export function calcScore({ pairs, attempts, seconds, difficulty }) {
  const mistakes = Math.max(0, attempts - pairs)
  const base = pairs * 100
  const penalty = mistakes * 15
  const timeBonus = Math.max(0, difficulty.parSeconds - seconds) * 3
  const raw = Math.max(0, base - penalty + timeBonus)
  return Math.round(raw * difficulty.multiplier)
}

// A friendly label describing how the player's memory performed, on a 1-5 scale.
export function memoryRating(accuracy) {
  if (accuracy >= 90) return { level: 5, label: 'Exceptional', note: 'Near-perfect recall. Your memory is razor sharp.' }
  if (accuracy >= 75) return { level: 4, label: 'Sharp', note: 'Very few slips. You are tracking positions really well.' }
  if (accuracy >= 60) return { level: 3, label: 'Good', note: 'Solid memory with a few guesses along the way.' }
  if (accuracy >= 45) return { level: 2, label: 'Developing', note: 'You are getting there. Try to focus on card positions.' }
  return { level: 1, label: 'Warming up', note: 'Keep practising. Memory improves fast with repetition.' }
}

export function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function formatNumber(value) {
  return value.toLocaleString('en-US')
}

export function formatDate(iso) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}
