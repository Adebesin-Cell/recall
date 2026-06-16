<script setup lang="ts">
import { css } from '~~/styled-system/css'

defineProps<{ to: string, name: string, desc: string, ready: boolean }>()

const tile = css({
  display: 'grid',
  gap: '2',
  p: '6',
  border: '1px solid token(colors.fg)',
  borderRadius: 'none',
  transition: 'all 140ms',
  textAlign: 'left',
})
const interactive = css({
  cursor: 'pointer',
  _hover: { borderColor: 'accent', boxShadow: 'glowSm', transform: 'translateY(-2px)' },
})
const disabled = css({ opacity: 0.4 })
</script>

<template>
  <NuxtLink v-if="ready" :to="to" :class="`${tile} ${interactive}`">
    <span :class="css({ textStyle: 'display', fontSize: '2xl', color: 'fg' })">{{ name }}</span>
    <span :class="css({ textStyle: 'body', opacity: 0.7 })">{{ desc }}</span>
    <span :class="css({ textStyle: 'label', color: 'accent', mt: '2' })">PLAY →</span>
  </NuxtLink>
  <div v-else :class="`${tile} ${disabled}`">
    <span :class="css({ textStyle: 'display', fontSize: '2xl', color: 'fg' })">{{ name }}</span>
    <span :class="css({ textStyle: 'body', opacity: 0.7 })">{{ desc }}</span>
    <span :class="css({ textStyle: 'label', mt: '2' })">SOON</span>
  </div>
</template>
