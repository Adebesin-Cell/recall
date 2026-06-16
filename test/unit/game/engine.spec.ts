import { describe, expect, it } from 'vitest'
import { beginRecall, type GameState, nextLevel, startGame, submit } from '~/game/engine'
import { numberForLevel } from '~/game/seed'

describe('game engine', () => {
  it('starts at level 1 in memorize phase with a level-1 number', () => {
    const s = startGame(42)
    expect(s.phase).toBe('memorize')
    expect(s.level).toBe(1)
    expect(s.score).toBe(0)
    expect(s.current).toBe(numberForLevel(42, 1, s.config.digits))
  })

  it('moves from memorize to recall', () => {
    expect(beginRecall(startGame(42)).phase).toBe('recall')
  })

  it('awards points and advances to result on a correct answer', () => {
    const s = beginRecall(startGame(42))
    const next = submit(s, s.current, 4000)
    expect(next.phase).toBe('result')
    expect(next.score).toBeGreaterThan(0)
    expect(next.streak).toBe(1)
    expect(next.lastGained).toBe(next.score)
  })

  it('gives a higher score for more time remaining', () => {
    const s = beginRecall(startGame(42))
    const fast = submit(s, s.current, 6000)
    const slow = submit(s, s.current, 0)
    expect(fast.score).toBeGreaterThan(slow.score)
  })

  it('ends the game on a wrong answer', () => {
    const s = beginRecall(startGame(42))
    expect(submit(s, '00000000', 4000).phase).toBe('gameover')
  })

  it('advances to the next level with a fresh number', () => {
    const won = submit(beginRecall(startGame(42)), startGame(42).current, 4000)
    const next = nextLevel(won)
    expect(next.level).toBe(2)
    expect(next.phase).toBe('memorize')
    expect(next.current).toBe(numberForLevel(42, 2, next.config.digits))
  })

  it('reaches the won phase after clearing the last level', () => {
    let s: GameState = startGame(42)
    for (let i = 0; i < 9; i++) {
      s = submit(beginRecall(s), s.current, 1000)
      s = nextLevel(s)
    }
    s = submit(beginRecall(s), s.current, 1000) // clear level 10
    const final = nextLevel(s)
    expect(final.phase).toBe('won')
  })
})
