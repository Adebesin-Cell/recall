import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { z } from 'zod'

// One leaderboard row.
export const Entry = z.object({
  n: z.string(), // name
  s: z.number(), // score
  l: z.number(), // level reached
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

// Append an entry, keep the board sorted by score desc and capped.
export function addEntry(board: Entry[], entry: Entry): Entry[] {
  return [...board, entry]
    .sort((a, b) => b.s - a.s)
    .slice(0, MAX_ENTRIES)
}

export function topScore(board: Entry[]): number {
  return board[0]?.s ?? 0
}

// Encoded as a compact tuple [version, seed, [[name, score, level], ...]] to
// keep the URL short, then lz-string compressed + URL-safe.
export function encodeChallenge(challenge: Omit<Challenge, 'v'>): string {
  const tuple = [VERSION, challenge.seed, challenge.board.map(e => [e.n, e.s, e.l])]
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
    const board = rawBoard.map((e: unknown[]) => ({ n: e[0], s: e[1], l: e[2] }))
    const parsed = Challenge.safeParse({ v: tuple[0], seed: tuple[1], board })
    if (!parsed.success || parsed.data.v !== VERSION) return null
    return parsed.data
  }
  catch {
    return null
  }
}
