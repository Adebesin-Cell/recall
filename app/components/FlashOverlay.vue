<script setup lang="ts">
import type { Flash } from '~/composables/useFlash'
import { css } from '~~/styled-system/css'

defineProps<{ flash: Flash }>()
</script>

<template>
  <div
    v-if="flash"
    :class="css({ position: 'fixed', inset: 0, zIndex: '40', pointerEvents: 'none', animation: 'flash 320ms ease-out forwards' })"
    :style="{ background: flash === 'correct' ? 'radial-gradient(circle at center, rgba(108,92,231,0.55), transparent 70%)' : 'radial-gradient(circle at center, rgba(255,92,92,0.5), transparent 70%)' }"
  />
</template>
