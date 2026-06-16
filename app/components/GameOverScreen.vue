<script setup lang="ts">
import GameShareDialog from '~/components/ShareDialog.vue'
import { css } from '~~/styled-system/css'

defineProps<{ score: number, level: number, streak: number, seed: number, won?: boolean }>()
defineEmits<{ again: [] }>()
</script>

<template>
  <section
    data-mode="safe"
    :class="css({ minH: '100dvh', bg: 'bg', color: 'fg', display: 'flex', flexDir: 'column', justifyContent: 'space-between', p: '8' })"
  >
    <h1 :class="css({ textStyle: 'display', fontSize: { base: '6xl', md: '8xl' } })">
      {{ won ? 'PERFECT RUN' : 'GAME OVER' }}
    </h1>
    <div :class="css({ display: 'grid', gap: '2' })">
      <p :class="css({ textStyle: 'timer', fontSize: '7xl' })">
        {{ score }}
      </p>
      <p :class="css({ textStyle: 'label' })">
        REACHED LV {{ level }} · STREAK ×{{ streak }}
      </p>
    </div>
    <div :class="css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4' })">
      <GameShareDialog :seed="seed" :level-reached="level" :score="score" :streak="streak" />
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
