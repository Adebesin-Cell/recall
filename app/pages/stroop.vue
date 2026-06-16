<script setup lang="ts">
import { ref } from 'vue'
import GameOverScreen from '~/components/GameOverScreen.vue'
import MenuScreen from '~/components/MenuScreen.vue'
import StroopScreen from '~/components/StroopScreen.vue'
import { useAutosave } from '~/composables/useAutosave'
import { useTimer } from '~/composables/useTimer'
import { roundForLevel, type StroopRound, stroopScore, stroopTimeMs } from '~/game/stroop'
import { decodeRun, encodeRun } from '~/share/codec'
import { css } from '~~/styled-system/css'

const frame = css({ minH: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '6' })

const route = useRoute()
const { profile, recordRun } = useAutosave('stroop')

type Phase = 'idle' | 'playing' | 'gameover'
const phase = ref<Phase>('idle')
const seed = ref(0)
const level = ref(1)
const score = ref(0)
const streak = ref(0)
const round = ref<StroopRound | null>(null)

const incoming = decodeRun(typeof route.query.r === 'string' ? route.query.r : '')
if (incoming) {
  defineOgImageComponent('OgRun', { score: incoming.score, level: incoming.levelReached })
}

const timer = useTimer(() => answer(null)) // timeout counts as a miss

function syncUrl() {
  if (typeof window === 'undefined') return
  const r = encodeRun({ seed: seed.value, levelReached: level.value, score: score.value, streak: streak.value })
  window.history.replaceState(window.history.state, '', `?r=${r}`)
}

function newSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647)
}

function begin() {
  seed.value = incoming?.seed ?? newSeed()
  level.value = 1
  score.value = 0
  streak.value = 0
  round.value = roundForLevel(seed.value, 1)
  phase.value = 'playing'
  timer.start(stroopTimeMs(1))
  syncUrl()
}

function answer(match: boolean | null) {
  if (phase.value !== 'playing' || !round.value) return
  timer.stop()
  const correct = match !== null && match === round.value.isMatch
  if (!correct) {
    phase.value = 'gameover'
    recordRun({ levelReached: level.value, score: score.value, seed: seed.value })
    syncUrl()
    return
  }
  score.value += stroopScore(timer.remaining.value, level.value, streak.value)
  streak.value += 1
  level.value += 1
  round.value = roundForLevel(seed.value, level.value)
  timer.start(stroopTimeMs(level.value))
  syncUrl()
}
</script>

<template>
  <ClientOnly>
    <div :class="frame" :style="{ height: '100dvh' }">
      <MenuScreen
        v-if="phase === 'idle'"
        title="STROOP"
        label="REACTION"
        tagline="A color word, shown in some ink. Tap whether the ink matches the word — before the clock runs out."
        :best-level="profile.bestLevel"
        :best-score="profile.bestScore"
        @start="begin"
      />
      <StroopScreen
        v-else-if="phase === 'playing' && round"
        :word="round.word"
        :ink-hex="round.inkHex"
        :level="level"
        :score="score"
        :fraction="timer.fraction.value"
        @answer="answer"
      />
      <GameOverScreen
        v-else
        :score="score"
        :level="level"
        :streak="streak"
        :seed="seed"
        @again="begin"
      />
    </div>
    <template #fallback>
      <div :class="frame">
        <MenuScreen
          title="STROOP"
          label="REACTION"
          tagline="A color word, shown in some ink. Tap whether the ink matches the word — before the clock runs out."
          :best-level="0"
          :best-score="0"
        />
      </div>
    </template>
  </ClientOnly>
</template>
