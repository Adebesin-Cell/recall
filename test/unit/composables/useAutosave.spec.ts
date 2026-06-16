import { beforeEach, describe, expect, it } from 'vitest'
import { useAutosave } from '~/composables/useAutosave'

describe('useAutosave', () => {
  beforeEach(() => localStorage.clear())

  it('starts with a zeroed profile', () => {
    const { profile } = useAutosave()
    expect(profile.value).toEqual({ bestLevel: 0, bestScore: 0, totalRuns: 0, lastSeed: 0 })
  })

  it('recordRun raises bests and counts runs', () => {
    const { profile, recordRun } = useAutosave()
    recordRun({ levelReached: 4, score: 1200, seed: 99 })
    expect(profile.value).toEqual({ bestLevel: 4, bestScore: 1200, totalRuns: 1, lastSeed: 99 })
  })

  it('does not lower an existing best', () => {
    const { profile, recordRun } = useAutosave()
    recordRun({ levelReached: 6, score: 2000, seed: 1 })
    recordRun({ levelReached: 2, score: 500, seed: 2 })
    expect(profile.value.bestLevel).toBe(6)
    expect(profile.value.bestScore).toBe(2000)
    expect(profile.value.totalRuns).toBe(2)
    expect(profile.value.lastSeed).toBe(2)
  })
})
