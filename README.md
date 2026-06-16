# Recall

A no-database, URL-shareable number-recall game. Memorize the number, type it
back before the timer drains — it only gets faster. Built on **Nuxt 4** to
dogfood **Panda CSS v2** (`@pandacss/dev@2.0.0-beta.0`).

## Stack
Nuxt 4 · Bun · Panda CSS v2 (beta) · Ark UI · VueUse · Zod · lz-string ·
nuxt-og-image · Vitest · oxlint/oxfmt.

## Develop
```bash
bun install          # also runs panda codegen via postinstall
bun run dev          # nuxt dev (PostCSS plugin emits Panda CSS)
bun run test         # vitest
```
After editing `panda.config.ts`, re-run `bunx panda codegen`.

## How it works
- Pure core: seeded PRNG (`app/game/seed.ts`), reducer engine
  (`app/game/engine.ts`), level curve (`app/game/levelConfig.ts`).
- Sharing: a run encodes to `?r=<lz-string>` (`app/share/codec.ts`); the seed
  replays the exact sequence so a friend faces the same numbers.
- Palette inverts dark→light between play and result via the Panda `safe`
  condition.
