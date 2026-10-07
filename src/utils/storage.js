const SCORES_KEY = 'mindlab.scores'
const NAME_KEY = 'mindlab.playerName'
const MAX_ENTRIES = 50

function safeRead(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage may be unavailable in private mode; ignore.
  }
}

export function getPlayerName() {
  return safeRead(NAME_KEY, '') || ''
}

export function setPlayerName(name) {
  safeWrite(NAME_KEY, name.trim())
}

export function getScores() {
  const scores = safeRead(SCORES_KEY, [])
  return Array.isArray(scores) ? scores : []
}

export function saveScore(entry) {
  const scores = getScores()
  const record = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...entry }
  const next = [record, ...scores]
    .sort((a, b) => b.score - a.score || a.seconds - b.seconds)
    .slice(0, MAX_ENTRIES)
  safeWrite(SCORES_KEY, next)
  return record
}

export function clearScores() {
  safeWrite(SCORES_KEY, [])
}

// Best score for a category/difficulty combination, used on the report screen.
export function getBestScore(categoryId, difficultyId) {
  return getScores()
    .filter((s) => s.category === categoryId && s.difficulty === difficultyId)
    .reduce((best, s) => (s.score > best ? s.score : best), 0)
}

// Highest score per category, keyed by category id.
export function getBestByCategory() {
  const best = {}
  for (const s of getScores()) best[s.category] = Math.max(best[s.category] || 0, s.score)
  return best
}
