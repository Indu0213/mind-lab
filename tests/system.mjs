// System tests for MindLab.
// Opens the running application in headless Google Chrome, plays it like a user through the
// Chrome DevTools Protocol and checks what is shown on screen.
//
// Before running, start the application in another terminal with:  npm run dev
// Then run:  npm run test:system
//
// Needs Node.js 22 or later and Google Chrome. Set CHROME_PATH if Chrome is installed
// somewhere unusual, and APP_URL if the application is not on http://localhost:5173/.
import { spawn } from 'node:child_process'
import { mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const DEFAULT_CHROME = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  linux: 'google-chrome',
}
const CHROME = process.env.CHROME_PATH || DEFAULT_CHROME[process.platform] || 'google-chrome'
const APP = process.env.APP_URL || 'http://localhost:5173/'
const PORT = 9335
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const profile = mkdtempSync(path.join(os.tmpdir(), 'mindlab-system-test-'))
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' })
const results = []
const check = (id, what, expected, actual) => results.push({ id, what, expected: String(expected), actual: String(actual), pass: String(expected) === String(actual) })

try {
  let targets
  for (let i = 0; i < 150 && !targets; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json`); if (r.ok) targets = await r.json() } catch { /* wait */ } if (!targets) await sleep(100) }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r, { once: true }))
  let seq = 0
  const pending = new Map()
  const send = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })) })
  let dialogs = 0
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id)
      pending.delete(m.id)
      if (m.error) p.rej(new Error(m.error.message))
      else p.res(m.result)
    }
    else if (m.method === 'Page.javascriptDialogOpening') { dialogs++; send('Page.handleJavaScriptDialog', { accept: true }) }
  })
  const ev = async (body) => {
    const r = await send('Runtime.evaluate', { expression: `(async () => { ${body} })()`, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error('page: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text))
    return r.result.value
  }
  const PRELOAD = `(() => { const o = window.setTimeout.bind(window); window.__origST = o; window.__hold = new Set([2200]); window.__held = [];
    window.setTimeout = (fn, d, ...a) => window.__hold.has(d) ? (window.__held.push(fn), 0) : o(fn, d, ...a);
    window.__release = () => { const h = window.__held; window.__held = []; h.forEach((f) => f()) } })()`
  const HELPERS = `window.__t = (() => {
    const sleep = (ms) => new Promise((r) => window.__origST(r, ms))
    const waitFor = async (fn, ms = 10000) => { const t = Date.now(); while (Date.now() - t < ms) { const v = fn(); if (v) return v; await sleep(40) } throw new Error('timeout ' + fn) }
    const q = (s) => document.querySelector(s), qa = (s) => [...document.querySelectorAll(s)]
    const byText = (sel, text) => qa(sel).find((e) => e.textContent.includes(text))
    const api = { sleep, waitFor, q, qa, byText,
      setName(name) { const el = q('#player-name'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, name); el.dispatchEvent(new Event('input', { bubbles: true })) },
      async goHome() { q('.nav-brand').click(); await waitFor(() => q('.home')); await sleep(300) },
      async start(category, level) { byText('.cat-card', category).click(); await waitFor(() => q('.diff-card')); await sleep(200); byText('.diff-card', level).click(); await waitFor(() => q('.card')) },
      async peekDone() { await waitFor(() => q('.card') && !q('.status.is-peek')); await sleep(250) },
      cards() { return qa('.card').map((el) => ({ el, name: el.querySelector('.card-name').textContent, matched: el.classList.contains('is-matched'), flipped: el.classList.contains('is-flipped') })) },
      pairsLeft() { const g = {}; api.cards().filter((c) => !c.matched).forEach((c) => (g[c.name] ||= []).push(c)); return Object.values(g) },
      flippedCount() { return api.cards().filter((c) => c.flipped && !c.matched).length },
      stats() { return qa('.stat-value').map((e) => e.textContent) },
      async matchOne({ close = true } = {}) { const [a, b] = api.pairsLeft()[0]; a.el.click(); await sleep(120); b.el.click(); await waitFor(() => q('.popup .key')); await sleep(200); if (close) await api.closePopup() },
      async closePopup() { q('.popup .key').click(); await waitFor(() => !q('.popup')); await sleep(150) },
      async mismatch() { const p = api.pairsLeft(); p[0][0].el.click(); await sleep(120); p[1][0].el.click(); await sleep(1250) },
      async finish() { while (api.pairsLeft().length) await api.matchOne(); await waitFor(() => q('.result-card')); await sleep(1500) },
    }
    return api })()`
  const viewport = async (w, h, mobile = false) => { await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile }); await send('Emulation.setTouchEmulationEnabled', { enabled: mobile }) }
  const load = async () => {
    await send('Page.navigate', { url: APP })
    for (let i = 0; i < 100; i++) { try { if (await ev(`return !!document.querySelector('.splash, .app') && !!window.__hold`)) break } catch { /* swapping */ } await sleep(100) }
    await ev(HELPERS)
  }
  const leaveSplash = () => ev(`__hold.delete(2200); __release(); await __t.waitFor(() => __t.q('.home')); await __t.sleep(400)`)

  await send('Page.enable'); await send('Runtime.enable')
  await send('Page.addScriptToEvaluateOnNewDocument', { source: PRELOAD })
  await viewport(1280, 800)
  await load(); await ev(`localStorage.clear()`); await load()

  check('F01', 'Splash screen is shown when the app opens', true, await ev(`return !!__t.q('.splash') && __t.q('.splash-title').textContent === 'MindLab'`))
  await leaveSplash()
  check('F02', 'Home page opens after the splash', true, await ev(`return !!__t.q('.home') && !__t.q('.splash')`))
  check('F03', 'Player name field accepts at most 18 characters', 18, await ev(`return __t.q('#player-name').maxLength`))
  check('F04', 'Home lists all four science categories', 'Biology,Physics,Chemistry,Space', await ev(`return __t.qa('.cat-card .row-title').map((e) => e.textContent).join()`))

  // round with an empty name
  await ev(`__t.setName(''); await __t.sleep(100); __hold.add(3000); await __t.start('Biology', 'Easy'); await __t.sleep(300)`)
  check('F05', 'Easy board deals 12 cards', 12, await ev(`return __t.qa('.card').length`))
  check('F06', 'All cards are face up during the peek', 12, await ev(`return __t.qa('.card.is-flipped').length`))
  check('F07', 'Cards cannot be clicked during the peek', 12, await ev(`return __t.qa('.card:disabled').length`))
  await ev(`__hold.delete(3000); __release(); await __t.peekDone()`)
  check('F08', 'All cards are hidden when the peek ends', 0, await ev(`return __t.qa('.card.is-flipped').length`))
  await ev(`await __t.sleep(1300)`)
  check('F09', 'Timer does not run before the first flip', '00:00', await ev(`return __t.stats()[0]`))
  await ev(`__t.pairsLeft()[0][0].el.click(); await __t.sleep(200)`)
  check('F10', 'First flip turns one card and is not counted as an attempt', '1 flipped, 0 attempts', await ev(`return __t.flippedCount() + ' flipped, ' + __t.stats()[2] + ' attempts'`))
  await ev(`__hold.add(900); __t.pairsLeft().find((g) => g.every((c) => !c.flipped))[0].el.click(); await __t.sleep(250)`)
  check('F11', 'Two different cards count as one attempt with 0% accuracy', '1 attempts, 0%', await ev(`return __t.stats()[2] + ' attempts, ' + __t.stats()[3]`))
  await ev(`__t.cards().find((c) => !c.flipped && !c.matched).el.click(); await __t.sleep(200)`)
  check('F12', 'A third card cannot be flipped while two are showing', 2, await ev(`return __t.flippedCount()`))
  await ev(`__hold.delete(900); __release(); await __t.sleep(800)`)
  check('F13', 'Unmatched cards flip back face down', 0, await ev(`return __t.flippedCount()`))
  const name = await ev(`const [a, b] = __t.pairsLeft()[0]; a.el.click(); await __t.sleep(120); b.el.click(); await __t.waitFor(() => __t.q('.popup')); await __t.sleep(250); return a.name`)
  check('F14', 'A matching pair opens the fact popup for that element', name, await ev(`return __t.q('.popup-title').textContent`))
  check('F15', 'The popup shows a science fact', true, await ev(`return __t.q('.popup-fact').textContent.length > 20`))
  check('F16', 'Matched pair is counted (pairs 1/6, 2 attempts, 50%)', '1/6,2,50%', await ev(`return __t.stats().slice(1).join()`))
  await ev(`__t.cards().find((c) => !c.matched).el.click(); await __t.sleep(200)`)
  check('F17', 'Board is locked while the fact popup is open', 0, await ev(`return __t.flippedCount()`))
  await ev(`await __t.closePopup(); __t.cards().find((c) => c.matched).el.click(); await __t.sleep(200)`)
  check('F18', 'Clicking a matched card does nothing', '0 flipped, 2 attempts', await ev(`return __t.flippedCount() + ' flipped, ' + __t.stats()[2] + ' attempts'`))
  check('F19', 'The matched element is added to the discoveries list', name, await ev(`return __t.q('.log-name').textContent`))
  await ev(`await __t.sleep(1200)`)
  check('F20', 'Timer runs after the first flip', true, await ev(`return __t.stats()[0] !== '00:00'`))
  await ev(`__t.q('.key-restart').click(); await __t.sleep(300)`)
  check('F21', 'Restart resets time, pairs, attempts and accuracy', '00:00,0/6,0,0%', await ev(`return __t.stats().join()`))
  check('F22', 'Restart starts a new peek', true, await ev(`return !!__t.q('.status.is-peek')`))
  await ev(`await __t.peekDone(); await __t.finish()`)
  const r1 = await ev(`const d = __t.qa('.detail-value').map((e) => e.textContent); const [m, s] = d[0].split(':').map(Number); return { score: Number(__t.q('.result-score-value').textContent.replace(/,/g, '')), seconds: m * 60 + s, attempts: Number(d[1]), pairs: Number(d[2]), mistakes: Number(d[3]), acc: __t.q('.ring-value').textContent, best: !!__t.q('.badge-rose') }`)
  check('F23', 'Report opens when the last pair is matched', true, r1.pairs === 6)
  check('F24', 'Score on the report equals the scoring formula', Math.round(600 - 15 * (r1.attempts - 6) + Math.max(0, 45 - r1.seconds) * 3), r1.score)
  check('F25', 'Mistakes = attempts - pairs', r1.attempts - 6, r1.mistakes)
  check('F26', 'Accuracy on the report = pairs / attempts', Math.round((6 / r1.attempts) * 100) + '%', r1.acc)
  check('F27', 'First result in a mode is marked as a new best', true, r1.best)
  check('F28', 'Report lists one fact for every pair found', 6, await ev(`return __t.qa('.fact-card').length`))

  // play again, worse
  await ev(`__t.byText('.report-actions .key', 'Play again').click(); await __t.peekDone(); for (let i = 0; i < 5; i++) await __t.mismatch(); await __t.finish()`)
  const r2 = await ev(`return { score: Number(__t.q('.result-score-value').textContent.replace(/,/g, '')), best: !!__t.q('.badge-rose') }`)
  check('F29', 'A lower score in the same mode is not marked as a new best', 'lower: true, badge: false', `lower: ${r2.score < r1.score}, badge: ${r2.best}`)

  await ev(`__t.byText('.report-actions .key', 'Leaderboard').click(); await __t.waitFor(() => __t.q('.score-table')); await __t.sleep(300)`)
  check('F30', 'Leaderboard lists both rounds, highest score first', `${r1.score},${r2.score}`, await ev(`return __t.qa('.score-table .score-value').map((e) => e.textContent.replace(/,/g, '')).join()`))
  check('F31', 'A blank name is saved as "Player"', 'Player', await ev(`return __t.q('.player-name').textContent`))
  await ev(`__t.byText('.chip', 'Physics').click(); await __t.sleep(300)`)
  check('F32', 'Filtering by a category with no scores shows the empty state', 'No scores yet', await ev(`return __t.q('.empty-title')?.textContent`))
  await ev(`__t.qa('.chip')[0].click(); await __t.sleep(200); __t.byText('.segmented-item', 'Easy').click(); await __t.sleep(300)`)
  check('F33', 'Filtering by Easy shows the two Easy rounds', 2, await ev(`return __t.qa('.score-table tbody tr').length`))
  await ev(`__t.byText('.segmented-item', 'Hard').click(); await __t.sleep(300)`)
  check('F34', 'Filtering by Hard shows no rounds', true, await ev(`return !!__t.q('.empty') && !__t.q('.score-table')`))

  await load(); await leaveSplash()
  check('F35', 'Scores are still there after the page is reloaded', 2, await ev(`return JSON.parse(localStorage.getItem('mindlab.scores')).length`))
  check('F36', 'Home shows rounds played and best score after reload', `2,${r1.score.toLocaleString('en-US')}`, await ev(`return __t.qa('.metric-value').slice(0, 2).map((e) => e.textContent).join()`))
  await ev(`__t.byText('.nav-link', 'Leaderboard').click(); await __t.waitFor(() => __t.q('.score-table')); __t.byText('.text-btn', 'Clear').click(); await __t.sleep(400)`)
  check('F37', 'Clear scores asks for confirmation, then empties the board', '1 dialog, 0 scores', `${dialogs} dialog, ${await ev(`return JSON.parse(localStorage.getItem('mindlab.scores')).length`)} scores`)

  // navigation
  await ev(`__t.byText('.nav-link', 'Play').click(); await __t.waitFor(() => __t.q('.cat-card') && !__t.q('.home')); __t.byText('.cat-card', 'Space').click(); await __t.waitFor(() => __t.q('.diff-card')); __t.byText('.diff-card', 'Hard').click(); await __t.waitFor(() => __t.q('.card')); await __t.sleep(300)`)
  check('F38', 'Hard board deals 30 cards in 6 columns on desktop', '30 cards, 6 columns', await ev(`return __t.qa('.card').length + ' cards, ' + getComputedStyle(__t.q('.grid')).gridTemplateColumns.split(' ').length + ' columns'`))
  check('F39', 'Desktop game fits the window without page scrolling', true, await ev(`return document.documentElement.scrollHeight <= innerHeight`))
  await ev(`__t.q('.crumbbar .key').click(); await __t.sleep(300)`)
  const back1 = await ev(`return __t.q('.page-title').textContent`)
  await ev(`__t.q('.crumbbar .key').click(); await __t.sleep(300)`)
  const back2 = await ev(`return __t.q('.page-title').textContent`)
  await ev(`__t.q('.crumbbar .key').click(); await __t.sleep(300)`)
  check('F40', 'Back button steps Game > Difficulty > Category > Home', 'Select difficulty. | Choose a category. | home', `${back1} | ${back2} | ${await ev(`return __t.q('.home') ? 'home' : 'other'`)}`)
  await ev(`__t.byText('.nav-link', 'How to play').click(); await __t.sleep(300)`)
  check('F41', 'How to play page shows six steps', 6, await ev(`return __t.qa('.step-card').length`))

  // responsive
  const sizes = [[1440, 900, false], [1280, 720, false], [820, 1180, true], [390, 844, true], [375, 667, true]]
  const noScroll = []
  for (const [w, h, mobile] of sizes) {
    await viewport(w, h, mobile); await load(); await leaveSplash()
    const home = await ev(`return document.documentElement.scrollWidth <= innerWidth`)
    await ev(`await __t.start('Chemistry', 'Hard'); await __t.sleep(400)`)
    const game = await ev(`return document.documentElement.scrollWidth <= innerWidth`)
    const cols = await ev(`return getComputedStyle(__t.q('.grid')).gridTemplateColumns.split(' ').length`)
    const inView = await ev(`return __t.q('.stage').getBoundingClientRect().bottom <= innerHeight`)
    noScroll.push(`${w}x${h}: ${home && game ? 'ok' : 'SCROLL'}, ${cols} cols, board ${inView ? 'in view' : 'below fold'}`)
  }
  check('F42', 'No sideways scrolling and the Hard board stays in view at five screen sizes', '1440x900: ok, 6 cols, board in view | 1280x720: ok, 6 cols, board in view | 820x1180: ok, 5 cols, board in view | 390x844: ok, 5 cols, board in view | 375x667: ok, 5 cols, board in view', noScroll.join(' | '))
  check('F43', 'Phone navigation shows icons only', 'none', await ev(`return getComputedStyle(__t.q('.nav-link span')).display`))
  ws.close()
} catch (e) {
  results.push({ id: 'ERR', what: String(e.message), expected: '', actual: '', pass: false })
} finally {
  chrome.kill()
  await sleep(300)
  rmSync(profile, { recursive: true, force: true })
}

const failed = results.filter((r) => !r.pass)
for (const r of results) {
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.id}  ${r.what}${r.pass ? '' : `  (expected ${r.expected}, got ${r.actual})`}`)
}
console.log(`\n${results.length - failed.length} of ${results.length} system tests passed`)
process.exit(failed.length ? 1 : 0)
