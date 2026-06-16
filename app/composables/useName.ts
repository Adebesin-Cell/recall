import { useStorage } from '@vueuse/core'

// Optional player name, persisted locally and attached to leaderboard entries.
export function useName() {
  const name = useStorage('recall:name', '')
  return { name }
}
