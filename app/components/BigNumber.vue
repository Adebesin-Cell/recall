<script setup lang="ts">
import { css } from '~~/styled-system/css'

defineProps<{ value: string, glow?: boolean, compact?: boolean }>()
</script>

<template>
  <div
    :class="css({
      textStyle: 'display',
      color: 'fg',
      letterSpacing: '0.04em',
      lineHeight: '1',
      textAlign: 'center',
      animation: 'flipIn 240ms ease-out',
    })"
    :style="[
      glow ? 'text-shadow: 0 0 28px rgba(108,92,231,0.85), 0 0 56px rgba(108,92,231,0.4)' : '',
      compact ? 'font-size: clamp(2rem, 9vw, 3.25rem)' : 'font-size: clamp(3.5rem, 14vw, 6rem)',
    ]"
  >
    {{ value }}
  </div>
</template>
