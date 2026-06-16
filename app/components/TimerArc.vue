<script setup lang="ts">
import { computed } from 'vue'
import { css } from '~~/styled-system/css'

const props = defineProps<{ fraction: number }>()

const R = 54
const CIRC = 2 * Math.PI * R
const dashOffset = computed(() => CIRC * (1 - Math.max(0, Math.min(1, props.fraction))))
</script>

<template>
  <svg
    width="128" height="128" viewBox="0 0 128 128"
    :class="css({ transform: 'rotate(-90deg)' })"
  >
    <circle cx="64" cy="64" :r="R" fill="none" stroke="rgba(250,250,250,0.12)" stroke-width="6" />
    <circle
      cx="64" cy="64" :r="R" fill="none" stroke="#6C5CE7" stroke-width="6" stroke-linecap="round"
      :stroke-dasharray="CIRC" :stroke-dashoffset="dashOffset"
      style="filter: drop-shadow(0 0 6px rgba(108,92,231,0.8)); transition: stroke-dashoffset 50ms linear"
    />
  </svg>
</template>
