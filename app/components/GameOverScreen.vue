<script setup lang="ts">
import type { Entry } from '~/share/board'
import GameShareDialog from '~/components/ShareDialog.vue'
import Leaderboard from '~/components/Leaderboard.vue'
import { css } from '~~/styled-system/css'
import { button, panel } from '~~/styled-system/recipes'

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

const cls = panel()
</script>

<template>
  <section data-mode="safe" :class="[cls.root, css({ bg: 'bg', color: 'fg', animation: 'sweepIn 340ms ease-out' })]">
    <div>
      <h1 :class="cls.heading">
        {{ won ? 'PERFECT RUN' : 'GAME OVER' }}
      </h1>
      <p :class="[cls.meta, css({ mt: '2' })]">
        {{ score }} PTS · REACHED LV {{ level }} · STREAK ×{{ streak }}
      </p>
      <p :class="[cls.meta, css({ color: 'accent', mt: '1' })]">
        {{ myIndex === 0 ? '🏆 NEW TOP OF THE BOARD' : `RANKED #${myIndex + 1} OF ${board.length}` }}
      </p>
    </div>

    <Leaderboard :entries="board" :my-index="myIndex" />

    <div :class="css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4' })">
      <GameShareDialog :seed="seed" :board="board" />
      <button type="button" :class="button({ visual: 'invert' })" @click="$emit('again')">
        PLAY AGAIN
      </button>
    </div>
  </section>
</template>
