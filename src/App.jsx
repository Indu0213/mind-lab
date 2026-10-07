import { useCallback, useEffect, useState } from 'react'
import Shell from './components/Shell.jsx'
import Splash from './screens/Splash.jsx'
import Home from './screens/Home.jsx'
import HowToPlay from './screens/HowToPlay.jsx'
import CategorySelect from './screens/CategorySelect.jsx'
import DifficultySelect from './screens/DifficultySelect.jsx'
import Game from './screens/Game.jsx'
import Report from './screens/Report.jsx'
import Leaderboard from './screens/Leaderboard.jsx'
import { getBestScore, getPlayerName, saveScore } from './utils/storage.js'

// Which navigation item is highlighted on each screen.
const NAV_SECTION = {
  category: 'play',
  difficulty: 'play',
  game: 'play',
  report: 'play',
  leaderboard: 'leaderboard',
  howto: 'howto',
}

// Screens are driven by a small state machine rather than a router.
export default function App() {
  const [screen, setScreen] = useState('splash')
  const [categoryId, setCategoryId] = useState(null)
  const [difficultyId, setDifficultyId] = useState(null)
  const [result, setResult] = useState(null)
  const [best, setBest] = useState(0)
  const [round, setRound] = useState(0)
  const [returnTo, setReturnTo] = useState('home')

  // Every screen starts at the top of the page.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [screen])

  const goHome = useCallback(() => setScreen('home'), [])

  const openLeaderboard = () => {
    setReturnTo(screen === 'report' ? 'report' : 'home')
    setScreen('leaderboard')
  }

  const pickCategory = (id) => {
    setCategoryId(id)
    setScreen('difficulty')
  }

  const navigate = (target) => {
    if (target === 'play') setScreen('category')
    else if (target === 'leaderboard') openLeaderboard()
    else setScreen(target)
  }

  const handleFinish = useCallback((res) => {
    const previousBest = getBestScore(res.categoryId, res.difficultyId)
    saveScore({
      name: getPlayerName() || 'Player',
      category: res.categoryId,
      difficulty: res.difficultyId,
      score: res.score,
      accuracy: res.accuracy,
      attempts: res.attempts,
      seconds: res.seconds,
      date: new Date().toISOString(),
    })
    setBest(previousBest)
    setResult(res)
    setScreen('report')
  }, [])

  const playAgain = () => {
    setRound((r) => r + 1)
    setScreen('game')
  }

  if (screen === 'splash') return <Splash onDone={goHome} />

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <Home onPlay={() => setScreen('category')} onPickCategory={pickCategory} />
      case 'howto':
        return <HowToPlay onBack={goHome} onPlay={() => setScreen('category')} />
      case 'category':
        return <CategorySelect onBack={goHome} onSelect={pickCategory} />
      case 'difficulty':
        return (
          <DifficultySelect
            categoryId={categoryId}
            onBack={() => setScreen('category')}
            onSelect={(id) => {
              setDifficultyId(id)
              setRound((r) => r + 1)
              setScreen('game')
            }}
          />
        )
      case 'game':
        return (
          <Game
            key={`${categoryId}-${difficultyId}-${round}`}
            categoryId={categoryId}
            difficultyId={difficultyId}
            onFinish={handleFinish}
            onQuit={() => setScreen('difficulty')}
          />
        )
      case 'report':
        return (
          <Report
            result={result}
            best={best}
            onPlayAgain={playAgain}
            onChangeMode={() => setScreen('category')}
            onHome={goHome}
            onLeaderboard={openLeaderboard}
          />
        )
      case 'leaderboard':
        return <Leaderboard onBack={() => setScreen(returnTo)} />
      default:
        return null
    }
  }

  return (
    <Shell active={NAV_SECTION[screen]} onNavigate={navigate}>
      {renderScreen()}
    </Shell>
  )
}
