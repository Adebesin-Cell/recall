# Recall — Design Spec

**Date:** 2026-06-16
**Working title:** Recall (changeable)
**Status:** Approved design, pre-implementation

## 1. Purpose

A small, shareable, no-database brain-training game whose primary goal is to
**dogfood and showcase Panda CSS v2** (`@pandacss/dev@2.0.0-beta.0`). The game is
fun enough that both developers and non-developers want to try it, and the
shareable URL is the growth loop.

v1 ships **one** game: **number recall** — memorize a number, then type it back
before a timer runs out, with difficulty rising across 10 levels.

### Success criteria

- A player can complete a full run (menu → memorize → recall → result/game-over)
  with no backend.
- Progress autosaves locally; a run can be shared as a URL that replays the
  exact same number sequence for a friend.
- The UI exercises the headline Panda v2 features (semantic tokens + token
  modes, `textStyles`, recipes, patterns, keyframes).
- Static build (`nuxt generate`), deployable to Vercel.

### Non-goals (v1)

- The other game modes (word-form, multiplication, Stroop) — menu shows them as
  "coming soon" tiles only.
- Accounts, servers, databases, leaderboards beyond the share-URL head-to-head.
- Hints / "assistances".

## 2. Visual direction

**Brutalist-editorial structure + neon-glow mood.** Structure comes from the app
mockups; mood comes from the dark/electric-violet reference pins. **No
photography** — the "texture" is light and glow, not imagery.

- **Palette (three semantic tokens):**
  - `bg` near-black `#0A0A0A`
  - `fg` near-white `#FAFAFA`
  - `accent` electric violet `~#6C5CE7` (exact hue tunable), carrying **glow
    shadows**. Greys are not used decoratively.
- **Two modes that double as a gameplay signal:**
  - **Pressure (memorize/recall)** — dark base, accent glow on the live element
    (the number, the timer arc, the active key).
  - **Safe (result)** — inverts to a clean light surface.
- **Accent usage** — the glowing accent is reserved for the *live/active* thing
  on screen (draining timer arc, current number glow, pressed keypad key). It is
  an attention cue, not decoration.
- **Heavy compressed display type** for hero text; **tiny uppercase, tracked
  labels** ("CURRENT CHALLENGE"); **tabular monospaced timer** so digits do not
  jitter while counting down.
- **Near-zero radius, no gradients as fills.** Flat surfaces; the only "depth"
  is the accent glow.
- Motion: number flip, draining glow arc, mode invert transition.

## 3. Stack & conventions

Mirrors the user's existing Nuxt app (`Desktop/lope`), swapping the CSS layer:

- **Nuxt 4**, **Bun** package manager, **SSG** (`nuxt generate`; client-side
  state so prerender is fine).
- **Panda CSS v2** (`@pandacss/dev@2.0.0-beta.0`) from npm — *replaces* UnoCSS.
- **`@ark-ui/vue` v5** — headless behavior for keypad, dialog, share modal.
- **`@nuxtjs/color-mode`** (`preference: dark`) — drives the black/white invert.
- **`@vueuse/core` + `@vueuse/nuxt`** — `useStorage` (autosave), timers,
  clipboard (share).
- **`nuxt-og-image`** — dynamic black-on-white OG card of a shared score.
- **oxlint + oxfmt** — lint/format toolchain (matches user's setup).
- Standalone repo under `Desktop/open-source/recall`.

## 4. Game mechanic

One round, three beats:

1. **MEMORIZE** — a number appears on black; an arc timer drains. When it
   expires (or the player taps "I've got it"), the number vanishes.
2. **RECALL** — an Ark UI keypad appears; the player types the number before the
   input timer expires.
3. **JUDGE** — correct → award points, `streak++`, advance to next level.
   Wrong or timeout → game over.

### Difficulty curve

Two knobs tighten as the player climbs. Shape: **+1 digit roughly every 2
levels; both timers shrink each level.** Exact values live in a single
`levelConfig` array so tuning is a one-file change (no logic edits).

| Level | Digits | Memorize window | Input window |
|-------|--------|-----------------|--------------|
| 1     | 3      | 4.0s            | 8s           |
| 5     | 5      | 3.0s            | 6s           |
| 10    | 7      | 1.8s            | 4s           |

### Scoring

`score += base × digits × speedBonus`, where `speedBonus` rewards answering with
time to spare. A streak multiplier compounds consecutive correct answers. Final
`score`, `levelReached`, and `streak` are what get encoded into the share URL.

### Sequence generation

Numbers are generated from a **stored seed** via a small seeded PRNG. The seed —
not the numbers — is persisted and shared, so a shared URL replays the identical
sequence the original player faced ("beat my run").

## 5. Screens

- **Menu** — dark, heavy display title with accent glow, best score/level,
  "Start" CTA, and "coming soon" tiles for the other modes.
- **Memorize** — dark, giant number (hero) with accent glow, draining glow arc,
  optional "I've got it" button.
- **Recall** — dark, Ark keypad (accent on the pressed key), tabular input
  timer, current entry.
- **Result ("GOOD JOB")** — light (inverted), score, `+PTS`, streak, "Share" and
  "Next level" actions. Head-to-head banner if arrived via a shared URL.
- **Game over** — inverted, final stats, "Share", "Play again".

## 6. State & persistence

Two distinct concerns, deliberately not conflated:

### A. Autosave (localStorage via `useStorage`)

```
{ bestLevel, bestScore, totalRuns, lastSeed }
```

Plain JSON. Restores the player to the menu with stats intact.

### B. Share URL (one run snapshot)

```
#r=<lz-string-compressed payload>
```

- Stored in the **hash** (`#`) so it never touches a server — pure client.
- Payload tuple: `[version, seed, levelReached, score, streak]`.
- Encoded with **`lz-string`** (`compressToEncodedURIComponent` /
  `decompressFromEncodedURIComponent`) — URL-safe, no separate base64 step,
  compresses well, and future-proofs larger payloads (e.g. a future
  level-builder mode).
- All encoding sits behind a single interface — `encodeRun(run)` /
  `decodeRun(str)` — so call sites never know the codec, and it can be swapped
  without touching screens.
- `version` guards against format drift; an unknown/old version decodes to
  `null` and the app falls back to a fresh run.

When a friend opens a shared URL: decode → seed primes the same sequence →
result screen shows a head-to-head comparison against the shared score.

## 7. Panda v2 showcase (the point)

- **Semantic tokens + token modes** — `fg` / `bg` / `accent` defined once and
  **inverted** for dark-pressure vs light-safe screens (headline v2 feature).
- **Glow as a token** — accent glow expressed via `shadows` tokens (e.g.
  `glow.sm` / `glow.lg`) so the neon effect is systematized, not ad-hoc.
- **`textStyles`** — `display`, `label`, `body`, `timer` (tabular nums).
- **Recipes (`cva`)** — `button`, `keypadKey` (accent-glow on press), `statRow`,
  `divider`; slot recipe for the result-screen card.
- **Patterns** — `stack`, `grid` (keypad), `divider` (the thin curved divider +
  dot-on-arc progress marker).
- **Keyframes / animations** — number flip, glow-arc drain, mode invert,
  accent-glow pulse.

## 8. Module / boundary breakdown

Each unit has one purpose and a clear interface:

- `game/levelConfig.ts` — the tunable curve table. No logic.
- `game/engine.ts` — pure state machine: `(state, action) → state`. Phases,
  scoring, advance/lose. No DOM, no storage. Testable in isolation.
- `game/seed.ts` — seeded PRNG + `numberForLevel(seed, level)`.
- `share/codec.ts` — `encodeRun` / `decodeRun` (wraps lz-string + versioning).
- `composables/useAutosave.ts` — `useStorage` wrapper for the local profile.
- `composables/useTimer.ts` — countdown driving both the arc and the deadline.
- UI components (Vue): `MenuScreen`, `MemorizeScreen`, `RecallScreen`,
  `KeypadInput` (Ark), `ResultScreen`, `GameOverScreen`, `ShareDialog` (Ark),
  `TimerArc`, `BigNumber`.
- Panda config: `panda.config.ts` with tokens, semanticTokens (modes),
  textStyles, recipes, patterns, keyframes.

## 9. Error handling & edge cases

- **Malformed / old share URL** → `decodeRun` returns `null` → start a fresh run,
  no crash.
- **Timer expiry mid-input** → treated as a wrong answer → game over.
- **localStorage unavailable / blocked** → game still playable; autosave is
  best-effort (try/catch, degrade silently).
- **Hydration** — game logic is client-only; screens render a stable shell on the
  server to avoid mismatch.

## 10. Testing strategy

- **Unit:** `engine.ts` (state transitions, scoring, lose conditions),
  `seed.ts` (same seed → same sequence), `codec.ts` (round-trip
  encode/decode, version mismatch → null).
- **Component:** keypad input, timer expiry path, invert on phase change.
- **Smoke:** full run menu → result, and opening a shared URL → head-to-head.

## 11. Open items (deferred, not blocking)

- Final game name.
- Exact `levelConfig` tuning values.
- Exact accent hue (`~#6C5CE7` placeholder) and glow intensity — tune live.
- Whether to add the other 3 modes in a later milestone.
