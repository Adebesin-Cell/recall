<script setup lang="ts">
import { computed, ref } from 'vue'
import FlashOverlay from '~/components/FlashOverlay.vue'
import GameOverScreen from '~/components/GameOverScreen.vue'
import MathScreen from '~/components/MathScreen.vue'
import MenuScreen from '~/components/MenuScreen.vue'
import TopBar from '~/components/TopBar.vue'
import { useAutosave } from '~/composables/useAutosave'
import { useFlash } from '~/composables/useFlash'
import { useName } from '~/composables/useName'
import { useTimer } from '~/composables/useTimer'
import { mathScore, type MathProblem, mathTimeMs, problemForLevel } from '~/game/math'
import { decodeChallenge, encodeChallenge, type Entry, mergeEntry, sanitizeName, topScore } from '~/share/board'
import { frame } from '~~/styled-system/patterns'

const howTo = [
  'A multiplication problem appears — solve it in your head.',
  'Type the answer on the keypad and hit ✓ before the bar empties.',
  'Numbers grow and time shrinks each level. A wrong answer (or timeout) ends it.',
]

useSeoMeta({
  title: 'Math Sprint — Mental Math Drills',
  description: 'Solve multiplication against the clock. A mental-math speed drill where the numbers grow and the timer shrinks every level. Sharpen arithmetic and focus. Free, no sign-up.',
})

const route = useRoute()
const { profile, recordRun } = useAutosave('math')
const { name } = useName()
const { flash, trigger } = useFlash()

type Phase = 'idle' | 'playing' | 'gameover'
const phase = ref<Phase>('idle')
const seed = ref(0)
const level = ref(1)
const score = ref(0)
const streak = ref(0)
const problem = ref<MathProblem | null>(null)
const finalBoard = ref<Entry[]>([])
const myIndex = ref(0)

const incoming = decodeChallenge(typeof route.query.c === 'string' ? route.query.c : '')
const incomingBoard = computed(() => incoming?.board ?? [])
const myName = computed(() => sanitizeName(name.value))

if (incoming) {
  defineOgImage('Run', { score: topScore(incoming.board), level: incoming.board[0]?.l ?? 0 })
}

const timer = useTimer(() => submit('')) // timeout = wrong

function newSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647)
}

function begin() {
  seed.value = incoming?.seed ?? newSeed()
  level.value = 1
  score.value = 0
  streak.value = 0
  problem.value = problemForLevel(seed.value, 1)
  phase.value = 'playing'
  timer.start(mathTimeMs(1))
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

function submit(value: string) {
  if (phase.value !== 'playing' || !problem.value) return
  timer.stop()
  const correct = value !== '' && Number(value) === problem.value.answer
  trigger(correct ? 'correct' : 'wrong')
  if (!correct) {
    phase.value = 'gameover'
    finishRun()
    return
  }
  score.value += mathScore(timer.remaining.value, level.value, streak.value)
  streak.value += 1
  level.value += 1
  problem.value = problemForLevel(seed.value, level.value)
  timer.start(mathTimeMs(level.value))
}
</script>

<template>
  <div>
    <TopBar how-to-title="HOW TO PLAY · MATH SPRINT" :how-to="howTo" />
    <FlashOverlay :flash="flash" />
    <ClientOnly>
      <div :class="frame()" style="height: 100dvh">
        <MenuScreen
          v-if="phase === 'idle'"
          title="MATH SPRINT"
          label="MENTAL MATH"
          tagline="Solve multiplication against the clock. It speeds up and the numbers grow every level."
          :best-level="profile.bestLevel"
          :best-score="profile.bestScore"
          :board="incomingBoard"
          :my-name="myName"
          @start="begin"
        />
        <MathScreen
          v-else-if="phase === 'playing' && problem"
          :prompt="problem.prompt"
          :level="level"
          :score="score"
          :fraction="timer.fraction.value"
          @submit="submit"
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
            title="MATH SPRINT"
            label="MENTAL MATH"
            tagline="Solve multiplication against the clock. It speeds up and the numbers grow every level."
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
