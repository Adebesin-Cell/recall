<script setup lang="ts">
import { computed, ref } from 'vue'
import GameOverScreen from '~/components/GameOverScreen.vue'
import MenuScreen from '~/components/MenuScreen.vue'
import StroopScreen from '~/components/StroopScreen.vue'
import TopBar from '~/components/TopBar.vue'
import { useAutosave } from '~/composables/useAutosave'
import { useName } from '~/composables/useName'
import { useTimer } from '~/composables/useTimer'
import { roundForLevel, type StroopRound, stroopScore, stroopTimeMs } from '~/game/stroop'
import { decodeChallenge, encodeChallenge, type Entry, mergeEntry, sanitizeName, topScore } from '~/share/board'
import { frame } from '~~/styled-system/patterns'

const howTo = [
  'A color word appears, painted in some ink color.',
  'Tap MATCH if the ink matches the word — NO MATCH if it doesn’t.',
  'It speeds up each round. One wrong tap (or timeout) ends it.',
]

const route = useRoute()
const { profile, recordRun } = useAutosave('stroop')
const { name } = useName()

type Phase = 'idle' | 'playing' | 'gameover'
const phase = ref<Phase>('idle')
const seed = ref(0)
const level = ref(1)
const score = ref(0)
const streak = ref(0)
const round = ref<StroopRound | null>(null)
const finalBoard = ref<Entry[]>([])
const myIndex = ref(0)

const incoming = decodeChallenge(typeof route.query.c === 'string' ? route.query.c : '')
const incomingBoard = computed(() => incoming?.board ?? [])
const myName = computed(() => sanitizeName(name.value))

if (incoming) {
  defineOgImageComponent('Run', { score: topScore(incoming.board), level: incoming.board[0]?.l ?? 0 })
}

const timer = useTimer(() => answer(null)) // timeout = miss

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
}

function finishRun() {
  recordRun({ levelReached: level.value, score: score.value, seed: seed.value })
  const board = mergeEntry(incoming?.board ?? [], { n: myName.value, s: score.value, l: level.value })
  finalBoard.value = board
  myIndex.value = board.findIndex(e => e.n === myName.value)
  if (typeof window !== 'undefined') {
    const c = encodeChallenge({ seed: seed.value, board })
    window.history.replaceState(window.history.state, '', `?c=${c}`)
  }
}

function answer(match: boolean | null) {
  if (phase.value !== 'playing' || !round.value) return
  timer.stop()
  const correct = match !== null && match === round.value.isMatch
  if (!correct) {
    phase.value = 'gameover'
    finishRun()
    return
  }
  score.value += stroopScore(timer.remaining.value, level.value, streak.value)
  streak.value += 1
  level.value += 1
  round.value = roundForLevel(seed.value, level.value)
  timer.start(stroopTimeMs(level.value))
}
</script>

<template>
  <div>
    <TopBar how-to-title="HOW TO PLAY · STROOP" :how-to="howTo" />
    <ClientOnly>
      <div :class="frame()" style="height: 100dvh">
        <MenuScreen
          v-if="phase === 'idle'"
          title="STROOP"
        label="REACTION"
        tagline="A color word, shown in some ink. Tap whether the ink matches the word — before the clock runs out."
        :best-level="profile.bestLevel"
        :best-score="profile.bestScore"
        :board="incomingBoard"
        :my-name="myName"
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
        :board="finalBoard"
        :my-index="myIndex"
        @again="begin"
      />
      </div>
      <template #fallback>
        <div :class="frame()">
          <MenuScreen
            title="STROOP"
          label="REACTION"
          tagline="A color word, shown in some ink. Tap whether the ink matches the word — before the clock runs out."
          :best-level="0"
          :best-score="0"
          :board="incomingBoard"
          :my-name="myName"
        />
        </div>
      </template>
    </ClientOnly>
  </div>
</template>
