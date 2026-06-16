import { describe, expect, it } from 'vitest'
import { decodeChallenge, encodeChallenge, MAX_ENTRIES, mergeEntry, rankOf, sanitizeName, topScore } from '~/share/board'

describe('leaderboard board', () => {
  it('round-trips a challenge with a board', () => {
    const board = [{ n: 'LOPE', s: 719, l: 7, p: 3 }, { n: 'ANON', s: 300, l: 4, p: 1 }]
    const encoded = encodeChallenge({ seed: 42, board })
    expect(decodeChallenge(encoded)).toEqual({ v: 1, seed: 42, board })
  })

  it('defaults plays to 1 for legacy payloads without it', () => {
    // simulate an old tuple [v, seed, [[n,s,l]]] missing the plays field
    const board = decodeChallenge(encodeChallenge({ seed: 1, board: [{ n: 'A', s: 100, l: 1, p: 1 }] }))
    expect(board?.board[0].p).toBe(1)
  })

  it('produces a URL-safe string', () => {
    const encoded = encodeChallenge({ seed: 1, board: [{ n: 'A', s: 100, l: 1, p: 1 }] })
    expect(encoded).toBe(encodeURIComponent(encoded))
  })

  it('returns null for garbage', () => {
    expect(decodeChallenge('!!!')).toBeNull()
    expect(decodeChallenge('')).toBeNull()
  })

  it('mergeEntry appends a new player with 1 play', () => {
    const board = mergeEntry([], { n: 'LOPE', s: 500, l: 5 })
    expect(board).toEqual([{ n: 'LOPE', s: 500, l: 5, p: 1 }])
  })

  it('mergeEntry keeps the best score and counts plays for a returning player', () => {
    let board = mergeEntry([], { n: 'LOPE', s: 500, l: 5 })
    board = mergeEntry(board, { n: 'LOPE', s: 800, l: 8 }) // improved
    board = mergeEntry(board, { n: 'LOPE', s: 200, l: 2 }) // worse
    expect(board).toHaveLength(1)
    expect(board[0]).toEqual({ n: 'LOPE', s: 800, l: 8, p: 3 })
  })

  it('sorts by score desc and caps the board', () => {
    let board: ReturnType<typeof mergeEntry> = []
    for (let i = 0; i < MAX_ENTRIES + 5; i++) board = mergeEntry(board, { n: `P${i}`, s: i * 10, l: i })
    expect(board).toHaveLength(MAX_ENTRIES)
    expect(board[0].s).toBeGreaterThan(board[1].s)
  })

  it('rankOf finds a player position (and -1 when absent)', () => {
    const board = [{ n: 'A', s: 900, l: 9, p: 1 }, { n: 'B', s: 100, l: 1, p: 1 }]
    expect(rankOf(board, 'B')).toBe(1)
    expect(rankOf(board, 'Z')).toBe(-1)
  })

  it('sanitizes names (upper, trimmed, capped, fallback)', () => {
    expect(sanitizeName('  lope  ')).toBe('LOPE')
    expect(sanitizeName('')).toBe('ANON')
    expect(sanitizeName('abcdefghijklmnopqrst')).toHaveLength(12)
  })

  it('topScore reads the leading score', () => {
    expect(topScore([{ n: 'A', s: 900, l: 9, p: 1 }])).toBe(900)
    expect(topScore([])).toBe(0)
  })
})
