import { describe, expect, it } from 'vitest'
import { configForLevel, LEVELS, MAX_LEVEL } from '~/game/levelConfig'

describe('levelConfig', () => {
  it('has 10 levels', () => {
    expect(LEVELS).toHaveLength(10)
    expect(MAX_LEVEL).toBe(10)
  })

  it('increases digits and shrinks timers as levels rise', () => {
    expect(configForLevel(1).digits).toBe(3)
    expect(configForLevel(10).digits).toBe(7)
    expect(configForLevel(10).memorizeMs).toBeLessThan(configForLevel(1).memorizeMs)
    expect(configForLevel(10).inputMs).toBeLessThan(configForLevel(1).inputMs)
  })

  it('clamps out-of-range levels to the last level', () => {
    expect(configForLevel(99)).toEqual(configForLevel(10))
    expect(configForLevel(0)).toEqual(configForLevel(1))
  })
})
