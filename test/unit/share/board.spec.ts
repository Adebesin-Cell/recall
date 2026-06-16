import { describe, expect, it } from 'vitest'
import { addEntry, decodeChallenge, encodeChallenge, MAX_ENTRIES, sanitizeName, topScore } from '~/share/board'

describe('leaderboard board', () => {
  it('round-trips a challenge with a board', () => {
    const board = [{ n: 'LOPE', s: 719, l: 7 }, { n: 'ANON', s: 300, l: 4 }]
    const encoded = encodeChallenge({ seed: 42, board })
    expect(decodeChallenge(encoded)).toEqual({ v: 1, seed: 42, board })
  })

  it('produces a URL-safe string', () => {
    const encoded = encodeChallenge({ seed: 1, board: [{ n: 'A', s: 100, l: 1 }] })
    expect(encoded).toBe(encodeURIComponent(encoded))
  })

  it('returns null for garbage', () => {
    expect(decodeChallenge('!!!')).toBeNull()
    expect(decodeChallenge('')).toBeNull()
  })

  it('addEntry sorts by score desc and caps the board', () => {
    let board: { n: string, s: number, l: number }[] = []
    for (let i = 0; i < MAX_ENTRIES + 5; i++) board = addEntry(board, { n: `P${i}`, s: i * 10, l: i })
    expect(board).toHaveLength(MAX_ENTRIES)
    expect(board[0].s).toBeGreaterThan(board[1].s)
    expect(board[0].s).toBe((MAX_ENTRIES + 4) * 10)
  })

  it('sanitizes names (upper, trimmed, capped, fallback)', () => {
    expect(sanitizeName('  lope  ')).toBe('LOPE')
    expect(sanitizeName('')).toBe('ANON')
    expect(sanitizeName('abcdefghijklmnopqrst')).toHaveLength(12)
  })

  it('topScore reads the leading score', () => {
    expect(topScore([{ n: 'A', s: 900, l: 9 }, { n: 'B', s: 100, l: 1 }])).toBe(900)
    expect(topScore([])).toBe(0)
  })
})
