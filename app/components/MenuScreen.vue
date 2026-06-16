<script setup lang="ts">
import type { Entry } from '~/share/board'
import Leaderboard from '~/components/Leaderboard.vue'
import { topScore } from '~/share/board'
import { css } from '~~/styled-system/css'
import { button } from '~~/styled-system/recipes'

const props = defineProps<{
  title: string
  tagline: string
  label: string
  bestLevel: number
  bestScore: number
  board?: Entry[] | null
  myName?: string
}>()
defineEmits<{ start: [] }>()

const hasBoard = computed(() => !!props.board && props.board.length > 0)
const myStanding = computed(() => {
  if (!props.board || !props.myName) return null
  const i = props.board.findIndex(e => e.n === props.myName)
  return i < 0 ? null : { rank: i + 1, entry: props.board[i]! }
})
</script>

<template>
  <section :class="css({ w: 'full', maxW: '40rem', display: 'grid', gap: '8' })">
    <div :class="css({ display: 'grid', gap: '3' })">
      <NuxtLink
        to="/"
        :class="css({ textStyle: 'label', opacity: 0.55, w: 'fit-content', _hover: { opacity: 1, color: 'accent' } })"
      >
        ← RECALL ARCADE
      </NuxtLink>
      <p :class="css({ textStyle: 'label', color: 'accent' })">
        {{ label }}
      </p>
      <h1 :class="css({ textStyle: 'display', fontSize: 'clamp(2.75rem, 12vw, 7.5rem)', color: 'fg', overflowWrap: 'anywhere' })">
        {{ title }}
      </h1>
      <p :class="css({ textStyle: 'body', maxW: '26rem', opacity: 0.7, lineHeight: '1.5' })">
        {{ tagline }}
      </p>
    </div>

    <div
      v-if="hasBoard && board"
      :class="css({ border: '1px solid token(colors.accent)', borderRadius: 'none', p: '5', display: 'grid', gap: '3', boxShadow: 'glowSm' })"
    >
      <p :class="css({ textStyle: 'label', color: 'accent' })">
        ⚡ BEAT THE BOARD · TOP {{ topScore(board) }} PTS
      </p>
      <Leaderboard :entries="board.slice(0, 5)" :my-name="myName" />
      <p v-if="myStanding" :class="css({ textStyle: 'label' })">
        YOU'RE #{{ myStanding.rank }} · {{ myStanding.entry.s }} PTS · PLAYED {{ myStanding.entry.p }}×
      </p>
      <p v-else :class="css({ textStyle: 'label', opacity: 0.6 })">
        SAME SEQUENCE FOR EVERYONE — YOUR TURN
      </p>
    </div>

    <div :class="css({ display: 'grid', gap: '4' })">
      <p :class="css({ textStyle: 'label', opacity: 0.6 })">
        BEST · LV {{ bestLevel }} · {{ bestScore }} PTS
      </p>
      <button
        type="button"
        :class="[button({ visual: 'solid', size: 'lg' }), css({ w: 'full' })]"
        @click="$emit('start')"
      >
        {{ hasBoard ? 'PLAY THIS ROUND' : 'START' }}
      </button>
    </div>
  </section>
</template>
