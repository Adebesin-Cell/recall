import { describe, expect, it } from 'vitest'
import { numberForLevel } from '~/game/seed'

describe('numberForLevel', () => {
  it('is deterministic for the same seed/level/digits', () => {
    expect(numberForLevel(123, 1, 4)).toBe(numberForLevel(123, 1, 4))
  })

  it('produces the requested number of digits', () => {
    expect(numberForLevel(123, 1, 4)).toHaveLength(4)
    expect(numberForLevel(123, 5, 7)).toHaveLength(7)
  })

  it('never starts with a leading zero', () => {
    for (let seed = 0; seed < 50; seed++) {
      expect(numberForLevel(seed, 1, 5)[0]).not.toBe('0')
    }
  })

  it('varies across levels for the same seed', () => {
    expect(numberForLevel(7, 1, 4)).not.toBe(numberForLevel(7, 2, 4))
  })
})
