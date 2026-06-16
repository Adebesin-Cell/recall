# Roadmap

Recall is a small arcade of brain games where **the URL is the database** — your
runs and leaderboards live entirely in a shareable link. This is the backlog and
direction. Anything unchecked is fair game; open an issue to claim something.

## Done

- [x] **Numbers** — memorize a number, type it back before the timer drains
- [x] **Stroop** — does the ink color match the word?
- [x] **Math Sprint** — multiplication against the clock
- [x] **Word Form** — anagram sprint over a real dictionary
- [x] Game-select hub, Settings (name), per-game How-to
- [x] URL leaderboard (`?c=`): seed replay + ranked entries, merge-by-name + play counts
- [x] Motion polish: number-in-arc, dark→light sweep, correct/miss flash
- [x] Panda v2 design system (recipes, slot recipes, patterns)

## Next

- [ ] **Deploy** to a public domain (Vercel) so share links work end-to-end
- [ ] Dynamic OG image polish per game (currently one shared card)
- [ ] Sound + haptics (toggle in Settings)
- [ ] Reduced-motion support (respect `prefers-reduced-motion`)
- [ ] Keyboard play for Numbers/Math (type digits, Enter to submit)
- [ ] Accessibility pass (focus order, ARIA for the live timer, color-contrast in light mode)

## New game ideas

- [ ] **Sequence** — repeat a growing pattern (Simon-style)
- [ ] **Schulte table** — find numbers 1–N as fast as you can
- [ ] **N-back** — the classic working-memory task
- [ ] **Reaction** — tap the instant the screen flips

Adding a game is the best entry point: write `app/game/<name>.ts` (+ tests), a play
screen, and a page that wires `useTimer` + the leaderboard, then add a tile in
`app/pages/index.vue`. See [CONTRIBUTING.md](./CONTRIBUTING.md).
