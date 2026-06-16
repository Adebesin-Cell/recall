import { computed, ref } from 'vue'

const TICK_MS = 50

export function useTimer(onExpire?: () => void) {
  const total = ref(0)
  const remaining = ref(0)
  let handle: ReturnType<typeof setInterval> | null = null

  function stop() {
    if (handle !== null) {
      clearInterval(handle)
      handle = null
    }
  }

  function start(ms: number) {
    stop()
    total.value = ms
    remaining.value = ms
    handle = setInterval(() => {
      remaining.value = Math.max(0, remaining.value - TICK_MS)
      if (remaining.value === 0) {
        stop()
        onExpire?.()
      }
    }, TICK_MS)
  }

  const fraction = computed(() => (total.value === 0 ? 0 : remaining.value / total.value))

  return { remaining, fraction, total, start, stop }
}
