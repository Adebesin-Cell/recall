<script setup lang="ts">
import { css } from '~~/styled-system/css'
import { gameTile } from '~~/styled-system/recipes'

defineProps<{ to: string, name: string, desc: string, ready: boolean }>()
</script>

<template>
  <NuxtLink v-if="ready" :to="to" :class="gameTile({ state: 'ready' })">
    <span :class="css({ textStyle: 'display', fontSize: '2xl', color: 'fg' })">{{ name }}</span>
    <span :class="css({ textStyle: 'body', opacity: 0.7 })">{{ desc }}</span>
    <span :class="css({ textStyle: 'label', color: 'accent', mt: '2' })">PLAY →</span>
  </NuxtLink>
  <div v-else :class="gameTile({ state: 'soon' })">
    <span :class="css({ textStyle: 'display', fontSize: '2xl', color: 'fg' })">{{ name }}</span>
    <span :class="css({ textStyle: 'body', opacity: 0.7 })">{{ desc }}</span>
    <span :class="css({ textStyle: 'label', mt: '2' })">SOON</span>
  </div>
</template>
