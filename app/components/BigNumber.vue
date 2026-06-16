<script setup lang="ts">
import { css } from '~~/styled-system/css'

defineProps<{ value: string, glow?: boolean }>()
</script>

<template>
  <div
    :class="css({
      textStyle: 'display',
      fontSize: { base: '6xl', md: '8xl' },
      color: 'fg',
      letterSpacing: '0.06em',
      animation: 'flipIn 240ms ease-out',
    })"
    :style="glow ? 'text-shadow: 0 0 28px rgba(108,92,231,0.85), 0 0 56px rgba(108,92,231,0.4)' : ''"
  >
    {{ value }}
  </div>
</template>
