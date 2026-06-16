import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimer } from '~/composables/useTimer'

describe('useTimer', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('counts down and reports fraction remaining', () => {
    const t = useTimer()
    t.start(1000)
    expect(t.remaining.value).toBe(1000)
    expect(t.fraction.value).toBe(1)
    vi.advanceTimersByTime(500)
    expect(t.remaining.value).toBeLessThanOrEqual(500)
    expect(t.fraction.value).toBeCloseTo(0.5, 1)
  })

  it('fires onExpire once when it reaches zero', () => {
    const onExpire = vi.fn()
    const t = useTimer(onExpire)
    t.start(1000)
    vi.advanceTimersByTime(1200)
    expect(onExpire).toHaveBeenCalledTimes(1)
    expect(t.remaining.value).toBe(0)
  })

  it('stop halts the countdown', () => {
    const t = useTimer()
    t.start(1000)
    vi.advanceTimersByTime(300)
    t.stop()
    const frozen = t.remaining.value
    vi.advanceTimersByTime(500)
    expect(t.remaining.value).toBe(frozen)
  })
})
