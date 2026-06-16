import { describe, expect, it } from 'vitest'
import { baseForLevel, BASES, canForm, isValidWord, lettersForLevel, wordScore, wordTimeMs } from '~/game/words'

const DICT = new Set(['planet', 'plane', 'net', 'plan', 'pant'])

describe('words', () => {
  it('baseForLevel is deterministic and from the base list', () => {
    expect(baseForLevel(42, 3)).toBe(baseForLevel(42, 3))
    expect(BASES).toContain(baseForLevel(42, 3))
  })

  it('lettersForLevel is a deterministic permutation of the base', () => {
    const base = baseForLevel(42, 3)
    const letters = lettersForLevel(42, 3)
    expect(letters).toEqual(lettersForLevel(42, 3))
    expect([...letters].sort()).toEqual(base.split('').sort())
  })

  it('canForm respects letter availability', () => {
    const letters = 'PLANET'.split('')
    expect(canForm('plane', letters)).toBe(true)
    expect(canForm('plants', letters)).toBe(false) // no second-letter S
  })

  it('isValidWord requires dictionary + formable + length >= 3', () => {
    const letters = 'PLANET'.split('')
    expect(isValidWord('planet', letters, DICT)).toBe(true) // the base word
    expect(isValidWord('plane', letters, DICT)).toBe(true) // dictionary sub-word
    expect(isValidWord('net', letters, DICT)).toBe(true)
    expect(isValidWord('pl', letters, DICT)).toBe(false) // too short
    expect(isValidWord('zzz', letters, DICT)).toBe(false) // not in dictionary
    expect(isValidWord('plant', letters, DICT)).toBe(false) // formable but not in dictionary
  })

  it('time shrinks with level but never below the floor', () => {
    expect(wordTimeMs(1)).toBeGreaterThan(wordTimeMs(10))
    expect(wordTimeMs(999)).toBe(6000)
  })

  it('rewards longer words, speed, and streak', () => {
    expect(wordScore('planet', 5000, 1, 5)).toBeGreaterThan(wordScore('net', 0, 1, 0))
  })
})
