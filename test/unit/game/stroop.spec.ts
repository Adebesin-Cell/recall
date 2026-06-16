import { describe, expect, it } from 'vitest'
import { roundForLevel, stroopScore, STROOP_COLORS, stroopTimeMs } from '~/game/stroop'

describe('stroop', () => {
  it('is deterministic for the same seed/level', () => {
    expect(roundForLevel(42, 3)).toEqual(roundForLevel(42, 3))
  })

  it('isMatch is true exactly when ink name equals the word', () => {
    for (let level = 1; level < 60; level++) {
      const r = roundForLevel(7, level)
      expect(r.isMatch).toBe(r.inkName === r.word)
    }
  })

  it('only uses known palette colors', () => {
    const names = STROOP_COLORS.map(c => c.name)
    const r = roundForLevel(99, 5)
    expect(names).toContain(r.word)
    expect(names).toContain(r.inkName)
  })

  it('time shrinks with level but never below the floor', () => {
    expect(stroopTimeMs(1)).toBeGreaterThan(stroopTimeMs(10))
    expect(stroopTimeMs(999)).toBe(1200)
  })

  it('rewards speed and streak', () => {
    expect(stroopScore(2000, 1, 5)).toBeGreaterThan(stroopScore(0, 1, 0))
  })
})
