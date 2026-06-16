<script setup lang="ts">
import { css } from '~~/styled-system/css'

defineProps<{ bestLevel: number, bestScore: number }>()
defineEmits<{ start: [] }>()
</script>

<template>
  <section :class="css({ minH: '100dvh', display: 'flex', flexDir: 'column', justifyContent: 'space-between', p: '8' })">
    <p :class="css({ textStyle: 'label', color: 'accent' })">
      ACTIVE RECALL
    </p>
    <div :class="css({ display: 'grid', gap: '4' })">
      <h1 :class="css({ textStyle: 'display', fontSize: { base: '7xl', md: '9xl' }, color: 'fg' })">
        RECALL
      </h1>
      <p :class="css({ textStyle: 'body', maxW: '20rem', opacity: 0.7 })">
        Memorize the number. Type it back before the timer drains. It only gets faster.
      </p>
      <p :class="css({ textStyle: 'label', opacity: 0.6 })">
        BEST · LV {{ bestLevel }} · {{ bestScore }} PTS
      </p>
    </div>
    <button
      type="button"
      :class="css({ textStyle: 'display', fontSize: '2xl', bg: 'accent', color: 'paper', py: '5', borderRadius: 'none', cursor: 'pointer', boxShadow: 'glowLg', transition: 'transform 120ms', _hover: { transform: 'translateY(-2px)' } })"
      @click="$emit('start')"
    >
      START
    </button>
  </section>
</template>
