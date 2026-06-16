import { useStorage } from '@vueuse/core'

export interface Profile {
  bestLevel: number
  bestScore: number
  totalRuns: number
  lastSeed: number
}

const DEFAULT_PROFILE: Profile = { bestLevel: 0, bestScore: 0, totalRuns: 0, lastSeed: 0 }

export function useAutosave() {
  const profile = useStorage<Profile>('recall:profile', { ...DEFAULT_PROFILE })

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
