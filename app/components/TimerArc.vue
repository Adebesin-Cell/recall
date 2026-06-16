<script setup lang="ts">
import { computed } from 'vue'
import { css } from '~~/styled-system/css'

const props = defineProps<{ fraction: number }>()

const SIZE = 260
const R = 118
const CIRC = 2 * Math.PI * R
const dashOffset = computed(() => CIRC * (1 - Math.max(0, Math.min(1, props.fraction))))
</script>

<template>
  <div :class="css({ position: 'relative', display: 'grid', placeItems: 'center' })">
    <svg
      :width="SIZE" :height="SIZE" :viewBox="`0 0 ${SIZE} ${SIZE}`"
      :class="css({ transform: 'rotate(-90deg)' })"
    >
      <circle :cx="SIZE / 2" :cy="SIZE / 2" :r="R" fill="none" stroke="rgba(250,250,250,0.12)" stroke-width="5" />
      <circle
        :cx="SIZE / 2" :cy="SIZE / 2" :r="R" fill="none" stroke="#6C5CE7" stroke-width="5" stroke-linecap="round"
        :stroke-dasharray="CIRC" :stroke-dashoffset="dashOffset"
        style="filter: drop-shadow(0 0 6px rgba(108,92,231,0.8)); transition: stroke-dashoffset 50ms linear"
      />
    </svg>
    <div :class="css({ position: 'absolute', inset: '0', display: 'grid', placeItems: 'center', px: '6' })">
      <slot />
    </div>
  </div>
</template>
