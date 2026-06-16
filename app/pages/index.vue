<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import GameOverScreen from '~/components/GameOverScreen.vue'
import MemorizeScreen from '~/components/MemorizeScreen.vue'
import MenuScreen from '~/components/MenuScreen.vue'
import RecallScreen from '~/components/RecallScreen.vue'
import ResultScreen from '~/components/ResultScreen.vue'
import { useAutosave } from '~/composables/useAutosave'
import { useTimer } from '~/composables/useTimer'
import { beginRecall, type GameState, nextLevel, startGame, submit } from '~/game/engine'
import { decodeRun } from '~/share/codec'
import { css } from '~~/styled-system/css'

// Centered, max-width frame so the mobile-first screens read as an intentional
// editorial column on desktop instead of stretching edge-to-edge.
const frame = css({ position: 'relative', w: 'full', maxW: '40rem', mx: 'auto', minH: '100dvh' })

const route = useRoute()
const { profile, recordRun } = useAutosave()

const state = ref<GameState | null>(null)

// A shared run becomes the "challenge" to beat.
const challenge = computed(() => {
  const r = typeof route.query.r === 'string' ? decodeRun(route.query.r) : null
  return r ? { score: r.score } : null
})

// Dynamic OG card when arriving via a shared ?r= run.
const sharedRun = computed(() =>
  typeof route.query.r === 'string' ? decodeRun(route.query.r) : null,
)
if (sharedRun.value) {
  defineOgImageComponent('OgRun', {
    score: sharedRun.value.score,
    level: sharedRun.value.levelReached,
  })
}

const memorizeTimer = useTimer(() => {
  if (state.value?.phase === 'memorize') state.value = beginRecall(state.value)
})
const recallTimer = useTimer(() => {
  if (state.value?.phase === 'recall') handleSubmit('') // timeout = wrong
})

function newSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647)
}

function begin() {
  // Replay the challenger's exact sequence if one was shared, else a fresh seed.
  const sharedSeed = typeof route.query.r === 'string' ? decodeRun(route.query.r)?.seed : undefined
  state.value = startGame(sharedSeed ?? newSeed())
}

function handleReady() {
  if (state.value?.phase === 'memorize') {
    memorizeTimer.stop()
    state.value = beginRecall(state.value)
  }
}

function handleSubmit(value: string) {
  if (state.value?.phase !== 'recall') return
  recallTimer.stop()
  state.value = submit(state.value, value, recallTimer.remaining.value)
}

function handleNext() {
  if (state.value) state.value = nextLevel(state.value)
}

function handleAgain() {
  begin()
}

// Drive timers off phase transitions.
watch(() => state.value?.phase, (phase) => {
  if (!state.value) return
  if (phase === 'memorize') memorizeTimer.start(state.value.config.memorizeMs)
  if (phase === 'recall') recallTimer.start(state.value.config.inputMs)
  if (phase === 'gameover' || phase === 'won') {
    recordRun({ levelReached: state.value.level, score: state.value.score, seed: state.value.seed })
  }
})
</script>

<template>
  <ClientOnly>
    <div :class="frame">
      <MenuScreen
        v-if="!state || state.phase === 'idle'"
        :best-level="profile.bestLevel"
        :best-score="profile.bestScore"
        @start="begin"
      />
    <MemorizeScreen
      v-else-if="state.phase === 'memorize'"
      :value="state.current"
      :level="state.level"
      :fraction="memorizeTimer.fraction.value"
      @ready="handleReady"
    />
    <RecallScreen
      v-else-if="state.phase === 'recall'"
      :level="state.level"
      :fraction="recallTimer.fraction.value"
      @submit="handleSubmit"
    />
    <ResultScreen
      v-else-if="state.phase === 'result'"
      :score="state.score"
      :last-gained="state.lastGained"
      :streak="state.streak"
      :level="state.level"
      :seed="state.seed"
      :challenge="challenge"
      @next="handleNext"
    />
      <GameOverScreen
        v-else
        :score="state.score"
        :level="state.level"
        :streak="state.streak"
        :seed="state.seed"
        :won="state.phase === 'won'"
        @again="handleAgain"
      />
    </div>
    <template #fallback>
      <div :class="frame">
        <MenuScreen :best-level="0" :best-score="0" />
      </div>
    </template>
  </ClientOnly>
</template>
