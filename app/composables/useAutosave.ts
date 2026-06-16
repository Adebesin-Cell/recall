import { useStorage } from '@vueuse/core'

export interface Profile {
  bestLevel: number
  bestScore: number
  totalRuns: number
  lastSeed: number
}

const DEFAULT_PROFILE: Profile = { bestLevel: 0, bestScore: 0, totalRuns: 0, lastSeed: 0 }

// Per-game profile so each mode keeps its own bests (key: recall:profile:<gameId>).
export function useAutosave(gameId = 'recall') {
  const profile = useStorage<Profile>(`recall:profile:${gameId}`, { ...DEFAULT_PROFILE })

  function recordRun(run: { levelReached: number, score: number, seed: number }) {
    profile.value = {
      bestLevel: Math.max(profile.value.bestLevel, run.levelReached),
      bestScore: Math.max(profile.value.bestScore, run.score),
      totalRuns: profile.value.totalRuns + 1,
      lastSeed: run.seed,
    }
  }

  return { profile, recordRun }
}
