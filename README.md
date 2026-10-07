# MindLab – Science Memory Challenge

A memory-training card game that uses science elements (DNA, atoms, planets, molecules, lab equipment) instead of ordinary pictures. Match a pair and learn a short science fact about it.

## Features

- Splash screen, landing page and top navigation
- Four categories: Biology, Physics, Chemistry, Space (15 elements each)
- Three difficulties: Easy (6 pairs), Medium (8 pairs), Hard (15 pairs)
- Responsive layout for desktop, tablet and phone
- Short "peek" at all cards before the round starts
- Timer, attempts, pairs found and live accuracy
- Fact popup after every successful match, plus a running list of discoveries during the round
- Performance report: score, accuracy ring, completion time, mistakes, a five-level memory rating and a recap of every fact unlocked
- Local leaderboard with category and difficulty filters

## Run locally

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

The production files are generated in the `dist/` folder.

## Design

The interface uses a neutral, editorial style: white surfaces, hairline borders with soft layered shadows, and one accent colour per science category.

- **Type:** Instrument Serif for headings, Geist for interface text, Geist Mono for small uppercase labels
- **Buttons:** tactile keycap style with a pressed state
- **Icons:** Lucide

All design tokens (colours, fonts, shadows, easing) are CSS variables at the top of `src/styles/index.css`. The visual style is inspired by the open-source component library at opensourceui.in.

## Responsive layout

The app is a full-width web app with a sticky top navigation, not a single phone column.

| Width | Layout |
| --- | --- |
| Desktop, 1000px and up | Two-column hero, four category cards in a row, board on the left with stats and discoveries in a sidebar, dashboard-style report, full leaderboard table |
| Tablet, 620px to 999px | Stacked hero, two-column card grids, centred board |
| Phone, under 620px | Icon navigation, compact list rows, board sized to stay in view |

On desktop the board is sized from the space available in both directions, so every difficulty fits the window without scrolling. The Hard board is 6 x 5 on desktop and 5 x 6 on phones.

## Project structure

```
src/
  data/science.js        categories, elements, facts and difficulty settings
  utils/game.js          deck builder, scoring, accuracy, rating and formatting helpers
  utils/storage.js       player name and leaderboard persistence (localStorage)
  hooks/useTimer.js      round timer
  hooks/useCountUp.js    number count-up animation for the report
  components/            Shell (navigation), Card, CategoryCard, FactPopup, StatsBar,
                         TopBar, PageHeader, Segmented, ProgressRing
  screens/               Splash, Home, HowToPlay, CategorySelect, DifficultySelect,
                         Game, Report, Leaderboard
  styles/index.css       design tokens and all component styles
  App.jsx                screen flow
```

## Scoring

- 100 points per pair
- −15 points for every wrong attempt
- +3 points for every second under the difficulty's par time
- Multiplied by the difficulty multiplier (Easy ×1, Medium ×1.5, Hard ×2)

Accuracy = matched pairs ÷ total attempts.

## Adding content

Edit `src/data/science.js`. Each element needs an `id`, `name`, `icon` and `fact`. Keep at least 15 elements per category so the Hard grid can be filled. The `icon` field takes any Lucide icon component.
