import { describe, expect, it } from 'vitest'
import { mathScore, mathTimeMs, problemForLevel } from '~/game/math'

describe('math', () => {
  it('is deterministic for the same seed/level', () => {
    expect(problemForLevel(42, 3)).toEqual(problemForLevel(42, 3))
  })

  it('answer always equals a × b, and prompt matches', () => {
    for (let level = 1; level < 40; level++) {
      const p = problemForLevel(7, level)
      expect(p.answer).toBe(p.a * p.b)
      expect(p.prompt).toBe(`${p.a} × ${p.b}`)
    }
  })

  it('factors grow with level', () => {
    const early = problemForLevel(7, 1)
    const late = problemForLevel(7, 12)
    expect(late.a).toBeGreaterThan(early.a)
  })

  it('time shrinks with level but never below the floor', () => {
    expect(mathTimeMs(1)).toBeGreaterThan(mathTimeMs(10))
    expect(mathTimeMs(999)).toBe(3000)
  })

  it('rewards speed and streak', () => {
    expect(mathScore(4000, 1, 5)).toBeGreaterThan(mathScore(0, 1, 0))
  })
})
