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
import { decodeRun, encodeRun } from '~/share/codec'
import { css } from '~~/styled-system/css'

const frame = css({ minH: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '6' })

const route = useRoute()
const { profile, recordRun } = useAutosave('numbers')

const state = ref<GameState | null>(null)

// Capture an incoming shared run ONCE — the challenge to beat and the seed to
// replay. We then overwrite ?r= with the player's own live state as they play.
const incoming = decodeRun(typeof route.query.r === 'string' ? route.query.r : '')
const challenge = computed(() => (incoming ? { score: incoming.score } : null))

if (incoming) {
  defineOgImageComponent('OgRun', { score: incoming.score, level: incoming.levelReached })
}

function syncUrl() {
  if (!state.value || typeof window === 'undefined') return
  const r = encodeRun({
    seed: state.value.seed,
    levelReached: state.value.level,
    score: state.value.score,
    streak: state.value.streak,
  })
  window.history.replaceState(window.history.state, '', `?r=${r}`)
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
  state.value = startGame(incoming?.seed ?? newSeed())
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

watch(() => state.value?.phase, (phase) => {
  if (!state.value) return
  if (phase === 'memorize') memorizeTimer.start(state.value.config.memorizeMs)
  if (phase === 'recall') recallTimer.start(state.value.config.inputMs)
  if (phase === 'gameover' || phase === 'won') {
    recordRun({ levelReached: state.value.level, score: state.value.score, seed: state.value.seed })
  }
  syncUrl()
})
</script>

<template>
  <ClientOnly>
    <div :class="frame" :style="{ height: '100dvh' }">
      <MenuScreen
        v-if="!state || state.phase === 'idle'"
        title="NUMBERS"
        label="ACTIVE RECALL"
        tagline="Memorize the number. Type it back before the timer drains. It only gets faster."
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
        <MenuScreen
          title="NUMBERS"
          label="ACTIVE RECALL"
          tagline="Memorize the number. Type it back before the timer drains. It only gets faster."
          :best-level="0"
          :best-score="0"
        />
      </div>
    </template>
  </ClientOnly>
</template>
