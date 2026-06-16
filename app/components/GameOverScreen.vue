<script setup lang="ts">
import type { Entry } from '~/share/board'
import GameShareDialog from '~/components/ShareDialog.vue'
import Leaderboard from '~/components/Leaderboard.vue'
import { css } from '~~/styled-system/css'

defineProps<{
  score: number
  level: number
  streak: number
  seed: number
  board: Entry[]
  myIndex: number
  won?: boolean
}>()
defineEmits<{ again: [] }>()
</script>

<template>
  <section
    data-mode="safe"
    :class="css({ w: 'full', maxW: '40rem', bg: 'bg', color: 'fg', display: 'grid', gap: '7', p: { base: '8', md: '10' } })"
  >
    <div>
      <h1 :class="css({ textStyle: 'display', fontSize: { base: '6xl', md: '8xl' } })">
        {{ won ? 'PERFECT RUN' : 'GAME OVER' }}
      </h1>
      <p :class="css({ textStyle: 'label', mt: '2' })">
        {{ score }} PTS · REACHED LV {{ level }} · STREAK ×{{ streak }}
      </p>
      <p :class="css({ textStyle: 'label', color: 'accent', mt: '1' })">
        {{ myIndex === 0 ? '🏆 NEW TOP OF THE BOARD' : `RANKED #${myIndex + 1} OF ${board.length}` }}
      </p>
    </div>

    <Leaderboard :entries="board" :my-index="myIndex" />

    <div :class="css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4' })">
      <GameShareDialog :seed="seed" :board="board" />
      <button
        type="button"
        :class="css({ textStyle: 'display', fontSize: 'xl', bg: 'fg', color: 'bg', py: '3', cursor: 'pointer' })"
        @click="$emit('again')"
      >
        PLAY AGAIN
      </button>
    </div>
  </section>
</template>
