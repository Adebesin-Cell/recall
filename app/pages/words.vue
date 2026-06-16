<script setup lang="ts">
import { computed, ref } from 'vue'
import FlashOverlay from '~/components/FlashOverlay.vue'
import GameOverScreen from '~/components/GameOverScreen.vue'
import MenuScreen from '~/components/MenuScreen.vue'
import TopBar from '~/components/TopBar.vue'
import WordScreen from '~/components/WordScreen.vue'
import { useAutosave } from '~/composables/useAutosave'
import { useFlash } from '~/composables/useFlash'
import { useName } from '~/composables/useName'
import { useTimer } from '~/composables/useTimer'
import { isValidWord, lettersForLevel, wordScore, wordTimeMs } from '~/game/words'
import { decodeChallenge, encodeChallenge, type Entry, mergeEntry, sanitizeName, topScore } from '~/share/board'
import { frame } from '~~/styled-system/patterns'

const howTo = [
  'You get the scrambled letters of a hidden word.',
  'Type any real word (3+ letters) you can build from those letters, then hit Submit.',
  'Longer words score more. Time shrinks each level; a wrong word or timeout ends it.',
]

const route = useRoute()
const { profile, recordRun } = useAutosave('words')
const { name } = useName()
const { flash, trigger } = useFlash()

type Phase = 'idle' | 'playing' | 'gameover'
const phase = ref<Phase>('idle')
const seed = ref(0)
const level = ref(1)
const score = ref(0)
const streak = ref(0)
const letters = ref<string[]>([])
const finalBoard = ref<Entry[]>([])
const myIndex = ref(0)

const incoming = decodeChallenge(typeof route.query.c === 'string' ? route.query.c : '')
const incomingBoard = computed(() => incoming?.board ?? [])
const myName = computed(() => sanitizeName(name.value))

if (incoming) {
  defineOgImageComponent('Run', { score: topScore(incoming.board), level: incoming.board[0]?.l ?? 0 })
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
  letters.value = lettersForLevel(seed.value, 1)
  phase.value = 'playing'
  timer.start(wordTimeMs(1))
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

function submit(word: string) {
  if (phase.value !== 'playing') return
  timer.stop()
  const correct = isValidWord(word, letters.value)
  trigger(correct ? 'correct' : 'wrong')
  if (!correct) {
    phase.value = 'gameover'
    finishRun()
    return
  }
  score.value += wordScore(word.trim(), timer.remaining.value, level.value, streak.value)
  streak.value += 1
  level.value += 1
  letters.value = lettersForLevel(seed.value, level.value)
  timer.start(wordTimeMs(level.value))
}
</script>

<template>
  <div>
    <TopBar how-to-title="HOW TO PLAY · WORD FORM" :how-to="howTo" />
    <FlashOverlay :flash="flash" />
    <ClientOnly>
      <div :class="frame()" style="height: 100dvh">
        <MenuScreen
          v-if="phase === 'idle'"
          title="WORD FORM"
          label="VOCABULARY"
          tagline="Unscramble the letters into any real word. Longer words score more — and the clock keeps tightening."
          :best-level="profile.bestLevel"
          :best-score="profile.bestScore"
          :board="incomingBoard"
          :my-name="myName"
          @start="begin"
        />
        <WordScreen
          v-else-if="phase === 'playing'"
          :key="level"
          :letters="letters"
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
            title="WORD FORM"
            label="VOCABULARY"
            tagline="Unscramble the letters into any real word. Longer words score more — and the clock keeps tightening."
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
