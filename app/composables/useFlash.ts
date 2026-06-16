import { ref } from 'vue'

export type Flash = 'correct' | 'wrong' | null

// Brief screen flash for answer feedback. Lives at page level so it survives the
// phase change into the game-over screen (a wrong answer still flashes red).
export function useFlash() {
  const flash = ref<Flash>(null)
  let token = 0

  function trigger(kind: Exclude<Flash, null>) {
    flash.value = kind
    const mine = ++token
    setTimeout(() => {
      if (token === mine) flash.value = null
    }, 320)
  }

  return { flash, trigger }
}
