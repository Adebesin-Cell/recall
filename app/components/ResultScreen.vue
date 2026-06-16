<script setup lang="ts">
import GameShareDialog from '~/components/ShareDialog.vue'
import { css } from '~~/styled-system/css'

defineProps<{
  score: number
  lastGained: number
  streak: number
  level: number
  seed: number
  challenge?: { score: number } | null
}>()
defineEmits<{ next: [] }>()
</script>

<template>
  <section
    data-mode="safe"
    :class="css({ minH: '100dvh', bg: 'bg', color: 'fg', display: 'flex', flexDir: 'column', justifyContent: 'space-between', p: '8' })"
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
      <p v-if="challenge" :class="css({ textStyle: 'label', mt: '2' })">
        {{ score > challenge.score ? `YOU BEAT ${challenge.score}` : `TARGET ${challenge.score}` }}
      </p>
    </div>

    <div :class="css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4' })">
      <GameShareDialog :seed="seed" :level-reached="level" :score="score" :streak="streak" />
      <button
        type="button"
        :class="css({ textStyle: 'display', fontSize: 'xl', bg: 'fg', color: 'bg', py: '3', cursor: 'pointer' })"
        @click="$emit('next')"
      >
        NEXT LEVEL
      </button>
    </div>
  </section>
</template>
