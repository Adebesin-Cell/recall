import { describe, expect, it } from 'vitest'
import { Phase, Run } from '~/game/types'

describe('game types', () => {
  it('exposes phase enum values', () => {
    expect(Phase.enum.memorize).toBe('memorize')
    expect(Phase.enum.recall).toBe('recall')
    expect(Phase.enum.won).toBe('won')
  })

  it('parses a valid run', () => {
    const run = Run.parse({ version: 1, seed: 42, levelReached: 3, score: 900, streak: 2 })
    expect(run.seed).toBe(42)
  })

  it('rejects a run with a non-numeric score', () => {
    expect(Run.safeParse({ version: 1, seed: 1, levelReached: 1, score: 'x', streak: 0 }).success).toBe(false)
  })
})
