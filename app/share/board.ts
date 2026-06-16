import lzString from 'lz-string'
import { z } from 'zod'

// Default import (not named) — lz-string is CJS and named ESM imports break in
// the Nitro/Vercel server bundle.
const { compressToEncodedURIComponent, decompressFromEncodedURIComponent } = lzString

// One leaderboard row. `p` = number of times this player has played.
export const Entry = z.object({
  n: z.string(), // name
  s: z.number(), // best score
  l: z.number(), // level reached at best score
  p: z.number(), // plays
})
export type Entry = z.infer<typeof Entry>

// A shared challenge: the seed everyone replays + the running leaderboard.
export const Challenge = z.object({
  v: z.number(),
  seed: z.number(),
  board: z.array(Entry),
})
export type Challenge = z.infer<typeof Challenge>

const VERSION = 1
export const MAX_ENTRIES = 20
const MAX_NAME = 12

export function sanitizeName(name: string): string {
  const clean = name.trim().slice(0, MAX_NAME).toUpperCase()
  return clean || 'ANON'
}

// Merge a finished run into the board, identified by name:
// returning players keep their BEST score and increment their play count;
// new players are appended. Always sorted by score desc and capped.
export function mergeEntry(board: Entry[], run: { n: string, s: number, l: number }): Entry[] {
  const existing = board.find(e => e.n === run.n)
  let next: Entry[]
  if (existing) {
    const improved = run.s > existing.s
    next = board.map(e =>
      e.n === run.n
        ? { n: e.n, s: Math.max(e.s, run.s), l: improved ? run.l : e.l, p: e.p + 1 }
        : e,
    )
  }
  else {
    next = [...board, { n: run.n, s: run.s, l: run.l, p: 1 }]
  }
  return next.sort((a, b) => b.s - a.s).slice(0, MAX_ENTRIES)
}

export function rankOf(board: Entry[], name: string): number {
  return board.findIndex(e => e.n === name)
}

export function topScore(board: Entry[]): number {
  return board[0]?.s ?? 0
}

// Compact tuple [version, seed, [[name, score, level, plays], ...]], lz-compressed.
export function encodeChallenge(challenge: Omit<Challenge, 'v'>): string {
  const tuple = [VERSION, challenge.seed, challenge.board.map(e => [e.n, e.s, e.l, e.p])]
  return compressToEncodedURIComponent(JSON.stringify(tuple))
}

export function decodeChallenge(encoded: string): Challenge | null {
  if (!encoded) return null
  try {
    const json = decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    const tuple = JSON.parse(json)
    if (!Array.isArray(tuple)) return null
    const rawBoard = Array.isArray(tuple[2]) ? tuple[2] : []
    const board = rawBoard.map((e: unknown[]) => ({ n: e[0], s: e[1], l: e[2], p: e[3] ?? 1 }))
    const parsed = Challenge.safeParse({ v: tuple[0], seed: tuple[1], board })
    if (!parsed.success || parsed.data.v !== VERSION) return null
    return parsed.data
  }
  catch {
    return null
  }
}
