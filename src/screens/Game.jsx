import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Eye, Layers, Pointer, RotateCcw } from 'lucide-react'
import TopBar from '../components/TopBar.jsx'
import Card from '../components/Card.jsx'
import FactPopup from '../components/FactPopup.jsx'
import StatsBar from '../components/StatsBar.jsx'
import { getCategory, getDifficulty } from '../data/science.js'
import { buildDeck, calcAccuracy, calcScore } from '../utils/game.js'
import { useTimer } from '../hooks/useTimer.js'

const MISMATCH_DELAY = 900

export default function Game({ categoryId, difficultyId, onFinish, onQuit }) {
  const category = getCategory(categoryId)
  const difficulty = getDifficulty(difficultyId)

  const [deck, setDeck] = useState(() => buildDeck(categoryId, difficulty.pairs))
  const [run, setRun] = useState(0)                   // bumps on restart so the peek bar replays
  const [flipped, setFlipped] = useState([])          // uids of currently face-up, unmatched cards
  const [matched, setMatched] = useState(() => new Set())
  const [found, setFound] = useState([])              // matched elements, in the order they were found
  const [attempts, setAttempts] = useState(0)
  const [peeking, setPeeking] = useState(true)
  const [locked, setLocked] = useState(false)
  const [fact, setFact] = useState(null)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)

  const { seconds, reset: resetTimer } = useTimer(started && !finished)
  const finishedRef = useRef(false)

  const matches = matched.size / 2
  const remaining = difficulty.pairs - matches
  const accuracy = calcAccuracy(matches, attempts)

  // Show every card for a short peek at the start of the round.
  useEffect(() => {
    const id = setTimeout(() => setPeeking(false), difficulty.peekMs)
    return () => clearTimeout(id)
  }, [deck, difficulty.peekMs])

  const restart = useCallback(() => {
    finishedRef.current = false
    setDeck(buildDeck(categoryId, difficulty.pairs))
    setRun((r) => r + 1)
    setFlipped([])
    setMatched(new Set())
    setFound([])
    setAttempts(0)
    setPeeking(true)
    setLocked(false)
    setFact(null)
    setStarted(false)
    setFinished(false)
    resetTimer()
  }, [categoryId, difficulty.pairs, resetTimer])

  const handleFlip = (card) => {
    if (peeking || locked || finished) return
    if (flipped.includes(card.uid) || matched.has(card.uid)) return
    if (!started) setStarted(true)

    const next = [...flipped, card.uid]
    setFlipped(next)
    if (next.length < 2) return

    // Second card flipped: evaluate the attempt.
    setAttempts((a) => a + 1)
    setLocked(true)
    const [first, second] = next.map((uid) => deck.find((c) => c.uid === uid))
    const isMatch = first.element.id === second.element.id

    if (isMatch) {
      setMatched((prev) => new Set([...prev, first.uid, second.uid]))
      setFound((prev) => [...prev, first.element])
      setFlipped([])
      setFact(first.element)
    } else {
      setTimeout(() => {
        setFlipped([])
        setLocked(false)
      }, MISMATCH_DELAY)
    }
  }

  const closeFact = useCallback(() => {
    setFact(null)
    setLocked(false)
  }, [])

  // All pairs found: stop the clock and hand over the result.
  useEffect(() => {
    if (finishedRef.current || matches !== difficulty.pairs || fact) return
    finishedRef.current = true
    setFinished(true)
    const score = calcScore({ pairs: difficulty.pairs, attempts, seconds, difficulty })
    onFinish({ categoryId, difficultyId, score, accuracy, attempts, seconds, pairs: difficulty.pairs, found })
  }, [matches, fact, difficulty, attempts, seconds, accuracy, categoryId, difficultyId, found, onFinish])

  // Board shape for phones and for wide layouts; CSS picks the right pair.
  const boardStyle = useMemo(() => {
    const cards = difficulty.pairs * 2
    return {
      '--cols': difficulty.columns,
      '--rows': cards / difficulty.columns,
      '--cols-wide': difficulty.columnsWide,
      '--rows-wide': cards / difficulty.columnsWide,
    }
  }, [difficulty])

  return (
    <div className="view game" style={{ '--accent': category.color, '--accent-soft': category.colorSoft }}>
      <div className="game-toolbar">
        <TopBar
          crumbs={[category.name, difficulty.name]}
          onBack={onQuit}
          right={
            <button className="key key-soft key-restart" onClick={restart} aria-label="Restart round">
              <RotateCcw size={15} /> <span>Restart</span>
            </button>
          }
        />
      </div>

      <StatsBar seconds={seconds} attempts={attempts} matches={matches} pairs={difficulty.pairs} accuracy={accuracy} />

      <Status peeking={peeking} started={started} remaining={remaining} peekMs={difficulty.peekMs} run={run} />

      <div className="stage dotgrid">
        <div className={`grid${difficulty.columns >= 5 ? ' is-dense' : ''}`} style={boardStyle}>
          {deck.map((card) => (
            <Card
              key={card.uid}
              card={card}
              color={category.color}
              flipped={peeking || flipped.includes(card.uid)}
              matched={matched.has(card.uid)}
              disabled={peeking || locked}
              onClick={() => handleFlip(card)}
            />
          ))}
        </div>
      </div>

      <Discoveries found={found} total={difficulty.pairs} />

      <FactPopup element={fact} category={category} found={matches} total={difficulty.pairs} onClose={closeFact} />
    </div>
  )
}

// One-line hint for the round. Always rendered so the layout never jumps.
function Status({ peeking, started, remaining, peekMs, run }) {
  if (peeking) {
    return (
      <div className="status is-peek" style={{ '--peek': `${peekMs}ms` }}>
        <Eye size={14} /> Memorise the cards
        <span className="status-bar" key={run} />
      </div>
    )
  }
  if (!started) {
    return (
      <div className="status">
        <Pointer size={14} /> Pick any card to begin
      </div>
    )
  }
  return (
    <div className="status">
      <Layers size={14} />
      {remaining === 0 ? 'All pairs found' : `${remaining} ${remaining === 1 ? 'pair' : 'pairs'} to go`}
    </div>
  )
}

// Running list of the facts unlocked this round, newest first.
function Discoveries({ found, total }) {
  return (
    <section className="panel log" aria-label="Discoveries">
      <header className="log-head">
        <span className="eyebrow">Discoveries</span>
        <span className="eyebrow">{found.length} / {total}</span>
      </header>
      {found.length === 0 ? (
        <p className="log-empty">Facts you unlock are collected here.</p>
      ) : (
        <ul className="log-list">
          {[...found].reverse().map((element) => {
            const Icon = element.icon
            return (
              <li className="log-item" key={element.id}>
                <span className="icon-tile icon-tile-sm">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <div>
                  <div className="log-name">{element.name}</div>
                  <div className="log-fact">{element.fact}</div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
