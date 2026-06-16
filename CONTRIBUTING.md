# Contributing

Thanks for taking a look! Recall is a small, open arcade of brain games — fixes
(bugs, typos, accessibility issues) and new games or thoughtful suggestions are
genuinely welcome.

## What to work on

See **[ROADMAP.md](./ROADMAP.md)** for direction and ideas. Adding a new game is the
most fun entry point — the shared building blocks (timer, scoring, leaderboard, share)
mean a new mode is mostly its own pure logic + one screen. Open an issue to claim
something, or send a PR.

## Getting started

Prerequisites: [Node.js](https://nodejs.org) 22+ and [bun](https://bun.sh).

```bash
bun install      # also runs panda codegen
bun run dev      # http://localhost:3000  (runs panda cssgen --watch + nuxt dev)
bun run test     # vitest
bun run lint     # oxlint
```

After editing `panda.config.ts`, re-run `bunx panda codegen` (and `bunx panda cssgen`).

## Project structure

```
app/
  pages/         # one route per game (numbers, stroop, math, words) + the hub (index)
  components/    # screens (Menu/Result/GameOver/...), TopBar, Leaderboard, etc.
  composables/   # useTimer, useAutosave, useName, useFlash
  game/          # pure, tested game logic (engine, seed, levelConfig, stroop, math, words)
  share/         # board.ts — the URL leaderboard codec
test/unit/       # vitest specs mirroring app/ paths
panda.config.ts  # design system: tokens, recipes, slot recipes, patterns
design-notes/    # Panda v2 beta dogfooding log
```

## How a game works

Each game is a small state machine in its page that drives shared pieces:

- **Pure logic** in `app/game/<name>.ts` — deterministic from a `seed` so runs replay
  exactly. Always covered by a `test/unit/game/<name>.spec.ts`.
- **State in the URL** — finishing a run encodes the leaderboard into the `?c=` query
  via `app/share/board.ts`. There is no database; the link _is_ the leaderboard.
- **Shared UI** — `MenuScreen`, `GameOverScreen`, `TimerArc`, `KeypadInput`, the
  `button`/`gameTile` recipes and the `frame` pattern.

To add a game: write `app/game/<name>.ts` (+ tests), a play screen, and a page that
wires `useTimer` + the board, then add a tile in `app/pages/index.vue`.

## Code style

- Vue components use `<script setup lang="ts">`. Components are PascalCase; pages are
  kebab-case.
- Types are **Zod-first** where they cross the wire (see `app/game/types.ts`,
  `app/share/board.ts`): define with `z.object`/`z.enum` + `z.infer`.
- Styling is **Panda CSS v2** — prefer recipes/patterns over one-off `css()` where a
  pattern already exists. Use semantic tokens (`bg`/`fg`/`accent`), never hardcoded hex
  in components.
- Keep code self-documenting; reserve comments for the non-obvious.

## Tests & checks

Before opening a PR: `bun run test && bun run lint && bun run build` should all pass.
New game logic must come with unit tests (determinism, scoring, edge cases).
