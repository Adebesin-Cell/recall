<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import FlashOverlay from '~/components/FlashOverlay.vue'
import GameOverScreen from '~/components/GameOverScreen.vue'
import MemorizeScreen from '~/components/MemorizeScreen.vue'
import MenuScreen from '~/components/MenuScreen.vue'
import RecallScreen from '~/components/RecallScreen.vue'
import ResultScreen from '~/components/ResultScreen.vue'
import TopBar from '~/components/TopBar.vue'
import { useAutosave } from '~/composables/useAutosave'
import { useFlash } from '~/composables/useFlash'
import { useName } from '~/composables/useName'
import { useTimer } from '~/composables/useTimer'
import { beginRecall, type GameState, nextLevel, startGame, submit } from '~/game/engine'
import { decodeChallenge, encodeChallenge, type Entry, mergeEntry, sanitizeName, topScore } from '~/share/board'
import { frame } from '~~/styled-system/patterns'

const howTo = [
  'A number flashes — memorize it before the ring drains.',
  'Type it back on the keypad before the bar empties.',
  'Each level adds digits and shaves time. One miss ends the run.',
]

useSeoMeta({
  title: 'Numbers — Number Memory Game',
  description: 'Memorize a number, then type it back before the timer drains. A fast digit-span memory game that adds digits and shrinks the clock every level. Free, no sign-up.',
})

const route = useRoute()
const { profile, recordRun } = useAutosave('numbers')
const { name } = useName()
const { flash, trigger } = useFlash()

const state = ref<GameState | null>(null)
const finalBoard = ref<Entry[]>([])
const myIndex = ref(0)

// Incoming shared leaderboard challenge (seed + board). Captured once.
const incoming = decodeChallenge(typeof route.query.c === 'string' ? route.query.c : '')
const incomingBoard = computed(() => incoming?.board ?? [])
const myName = computed(() => sanitizeName(name.value))

if (incoming) {
  defineOgImage('Run', { score: topScore(incoming.board), level: incoming.board[0]?.l ?? 0 })
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
  const next = submit(state.value, value, recallTimer.remaining.value)
  trigger(next.phase === 'gameover' ? 'wrong' : 'correct')
  state.value = next
}

function handleNext() {
  if (state.value) state.value = nextLevel(state.value)
}

function handleAgain() {
  begin()
}

// On run end: append my entry to the board and write the new ?c= leaderboard URL.
function finishRun() {
  if (!state.value) return
  recordRun({ levelReached: state.value.level, score: state.value.score, seed: state.value.seed })
  const board = mergeEntry(incoming?.board ?? [], { n: myName.value, s: state.value.score, l: state.value.level })
  finalBoard.value = board
  myIndex.value = board.findIndex(e => e.n === myName.value)
  if (typeof window !== 'undefined') {
    const c = encodeChallenge({ seed: state.value.seed, board })
    window.history.replaceState(window.history.state, '', `?c=${c}`)
  }
}

watch(() => state.value?.phase, (phase) => {
  if (!state.value) return
  if (phase === 'memorize') memorizeTimer.start(state.value.config.memorizeMs)
  if (phase === 'recall') recallTimer.start(state.value.config.inputMs)
  if (phase === 'gameover' || phase === 'won') finishRun()
})
</script>

<template>
  <div>
    <TopBar how-to-title="HOW TO PLAY · NUMBERS" :how-to="howTo" />
    <FlashOverlay :flash="flash" />
    <ClientOnly>
      <div :class="frame()" style="height: 100dvh">
        <MenuScreen
          v-if="!state || state.phase === 'idle'"
          title="NUMBERS"
        label="ACTIVE RECALL"
        tagline="Memorize the number. Type it back before the timer drains. It only gets faster."
        :best-level="profile.bestLevel"
        :best-score="profile.bestScore"
        :board="incomingBoard"
        :my-name="myName"
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
        :top-target="topScore(incomingBoard)"
        @next="handleNext"
      />
      <GameOverScreen
        v-else
        :score="state.score"
        :level="state.level"
        :streak="state.streak"
        :seed="state.seed"
        :board="finalBoard"
        :my-index="myIndex"
        :won="state.phase === 'won'"
        @again="handleAgain"
      />
      </div>
      <template #fallback>
        <div :class="frame()">
          <MenuScreen
            title="NUMBERS"
          label="ACTIVE RECALL"
          tagline="Memorize the number. Type it back before the timer drains. It only gets faster."
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
