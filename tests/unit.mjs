// Unit tests for MindLab.
// Checks the game helpers (time format, accuracy, score, rating, deck building, shuffle),
// the science content and the storage functions. Storage is tested against an in-memory
// stand-in for the browser's localStorage.
//
// Run with:  npm test
const store = new Map()
globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), clear: () => store.clear() }
const g = await import('../src/utils/game.js')
const s = await import('../src/utils/storage.js')
const d = await import('../src/data/science.js')
const out = []
const t = (id, what, actual, expected) => out.push({ id, what, expected: String(expected), actual: String(actual), pass: String(actual) === String(expected) })
const lvl = (id) => d.getDifficulty(id)

t('U01', 'formatTime(0)', g.formatTime(0), '00:00')
t('U02', 'formatTime(65)', g.formatTime(65), '01:05')
t('U03', 'formatTime(600)', g.formatTime(600), '10:00')
t('U04', 'calcAccuracy(0 matches, 0 attempts)', g.calcAccuracy(0, 0), 0)
t('U05', 'calcAccuracy(6, 6)', g.calcAccuracy(6, 6), 100)
t('U06', 'calcAccuracy(6, 7)', g.calcAccuracy(6, 7), 86)
t('U07', 'calcAccuracy(15, 18)', g.calcAccuracy(15, 18), 83)
t('U08', 'calcScore Easy: 6 pairs, 7 attempts, 16 s', g.calcScore({ pairs: 6, attempts: 7, seconds: 16, difficulty: lvl('easy') }), 672)
t('U09', 'calcScore Medium: 8 pairs, 10 attempts, 23 s', g.calcScore({ pairs: 8, attempts: 10, seconds: 23, difficulty: lvl('medium') }), 1389)
t('U10', 'calcScore Hard: 15 pairs, 18 attempts, 42 s', g.calcScore({ pairs: 15, attempts: 18, seconds: 42, difficulty: lvl('hard') }), 3558)
t('U11', 'calcScore with no time bonus (Easy, 6 attempts, 200 s)', g.calcScore({ pairs: 6, attempts: 6, seconds: 200, difficulty: lvl('easy') }), 600)
t('U12', 'calcScore never goes below zero (Easy, 60 attempts, 100 s)', g.calcScore({ pairs: 6, attempts: 60, seconds: 100, difficulty: lvl('easy') }), 0)
const rate = (a) => { const r = g.memoryRating(a); return `${r.label} (${r.level})` }
t('U13', 'memoryRating(90)', rate(90), 'Exceptional (5)')
t('U14', 'memoryRating(89)', rate(89), 'Sharp (4)')
t('U15', 'memoryRating(75)', rate(75), 'Sharp (4)')
t('U16', 'memoryRating(74)', rate(74), 'Good (3)')
t('U17', 'memoryRating(60)', rate(60), 'Good (3)')
t('U18', 'memoryRating(59)', rate(59), 'Developing (2)')
t('U19', 'memoryRating(45)', rate(45), 'Developing (2)')
t('U20', 'memoryRating(44)', rate(44), 'Warming up (1)')

const deck = g.buildDeck('physics', 6)
const counts = {}
deck.forEach((c) => (counts[c.element.id] = (counts[c.element.id] || 0) + 1))
const physicsIds = new Set(d.ELEMENTS.physics.map((e) => e.id))
t('U21', 'buildDeck(physics, 6) card count', deck.length, 12)
t('U22', 'buildDeck: every element appears exactly twice', Object.values(counts).every((n) => n === 2) && Object.keys(counts).length === 6, true)
t('U23', 'buildDeck: card ids are unique', new Set(deck.map((c) => c.uid)).size, 12)
t('U24', 'buildDeck: all cards belong to the chosen category', deck.every((c) => physicsIds.has(c.element.id)), true)
const hard = g.buildDeck('space', 15)
t('U25', 'buildDeck(space, 15) card count and distinct elements', `${hard.length} cards, ${new Set(hard.map((c) => c.element.id)).size} elements`, '30 cards, 15 elements')
const src = [1, 2, 3, 4, 5, 6, 7, 8]
const sh = g.shuffle(src)
t('U26', 'shuffle keeps the same members and leaves the input unchanged', [...sh].sort().join() === src.join() && src.join() === '1,2,3,4,5,6,7,8' && sh !== src, true)
let orders = new Set()
for (let i = 0; i < 40; i++) orders.add(g.buildDeck('biology', 6).map((c) => c.uid).join())
t('U27', 'buildDeck gives different orders across 40 runs', orders.size > 30, true)
t('U28', 'formatNumber(3558)', g.formatNumber(3558), '3,558')
t('U29', 'Content: 4 categories with 15 elements each', d.CATEGORIES.map((c) => d.ELEMENTS[c.id].length).join(), '15,15,15,15')
t('U30', 'Content: every element has a name, icon and fact', Object.values(d.ELEMENTS).flat().every((e) => e.id && e.name && e.icon && e.fact.length > 20), true)
t('U31', 'Content: element ids are unique inside each category', d.CATEGORIES.every((c) => new Set(d.ELEMENTS[c.id].map((e) => e.id)).size === 15), true)

// storage
t('S01', 'getScores() on empty storage', JSON.stringify(s.getScores()), '[]')
t('S02', 'getPlayerName() on empty storage', JSON.stringify(s.getPlayerName()), '""')
s.setPlayerName('  Indu  ')
t('S03', 'setPlayerName trims spaces', s.getPlayerName(), 'Indu')
const rec = (score, seconds, category = 'physics', difficulty = 'easy') => ({ name: 'A', category, difficulty, score, accuracy: 80, attempts: 8, seconds, date: '2026-10-09T10:00:00.000Z' })
s.saveScore(rec(500, 30)); s.saveScore(rec(900, 40)); s.saveScore(rec(900, 20)); s.saveScore(rec(700, 25, 'space', 'hard'))
t('S04', 'saveScore keeps scores sorted high to low, faster time first on a tie', s.getScores().map((r) => `${r.score}/${r.seconds}`).join(' '), '900/20 900/40 700/25 500/30')
t('S05', 'getBestScore(physics, easy)', s.getBestScore('physics', 'easy'), 900)
t('S06', 'getBestScore for a mode never played', s.getBestScore('biology', 'hard'), 0)
t('S07', 'getBestByCategory()', JSON.stringify(s.getBestByCategory()), '{"physics":900,"space":700}')
for (let i = 0; i < 60; i++) s.saveScore(rec(100 + i, 50))
t('S08', 'storage keeps only the best 50 records', s.getScores().length, 50)
t('S09', 'lowest scores are the ones dropped', Math.min(...s.getScores().map((r) => r.score)), 114)
s.clearScores()
t('S10', 'clearScores() empties the list', s.getScores().length, 0)
store.set('mindlab.scores', '{broken json')
t('S11', 'corrupted storage is read as an empty list', JSON.stringify(s.getScores()), '[]')

const failed = out.filter((r) => !r.pass)
for (const r of out) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.id}  ${r.what}${r.pass ? '' : `  (expected ${r.expected}, got ${r.actual})`}`)
}
console.log(`\n${out.length - failed.length} of ${out.length} unit tests passed`)
process.exit(failed.length ? 1 : 0)
