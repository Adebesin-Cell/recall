<script setup lang="ts">
import { css } from '~~/styled-system/css'
import { button } from '~~/styled-system/recipes'

defineProps<{
  score: number
  lastGained: number
  streak: number
  level: number
  topTarget?: number
}>()
defineEmits<{ next: [] }>()
</script>

<template>
  <section
    data-mode="safe"
    :class="css({ w: 'full', maxW: '40rem', bg: 'bg', color: 'fg', display: 'grid', gap: '8', p: { base: '8', md: '10' } })"
  >
    <div>
      <h1 :class="css({ textStyle: 'display', fontSize: { base: '7xl', md: '8xl' } })">
        GOOD JOB
      </h1>
      <p :class="css({ textStyle: 'label', mt: '2' })">
        COMPLETED · LV {{ level }} · +{{ lastGained }} PTS
      </p>
    </div>

    <div :class="css({ display: 'grid', gap: '2' })">
      <p :class="css({ textStyle: 'label', opacity: 0.6 })">
        TOTAL SCORE
      </p>
      <p :class="css({ textStyle: 'timer', fontSize: '7xl' })">
        {{ score }}
      </p>
      <p :class="css({ textStyle: 'label', color: 'accent' })">
        STREAK ×{{ streak }}
      </p>
      <p v-if="topTarget" :class="css({ textStyle: 'label', mt: '2' })">
        {{ score > topTarget ? `AHEAD OF THE BOARD (${topTarget})` : `CHASING TOP ${topTarget}` }}
      </p>
    </div>

    <button
      type="button"
      :class="[button({ visual: 'invert' }), css({ w: 'full' })]"
      @click="$emit('next')"
    >
      NEXT LEVEL
    </button>
  </section>
</template>
