<script setup lang="ts">
import type { Entry } from '~/share/board'
import { css } from '~~/styled-system/css'

defineProps<{ entries: Entry[], myIndex?: number }>()

const row = css({ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '3', alignItems: 'baseline', py: '2', borderBottom: '1px solid token(colors.fg)', borderColor: 'rgba(128,128,128,0.25)' })
</script>

<template>
  <div :class="css({ display: 'grid', gap: '1' })">
    <p :class="css({ textStyle: 'label', opacity: 0.6, mb: '1' })">
      LEADERBOARD
    </p>
    <div
      v-for="(entry, i) in entries"
      :key="i"
      :class="row"
      :style="i === myIndex ? 'color: var(--colors-accent)' : ''"
    >
      <span :class="css({ textStyle: 'timer', fontSize: 'sm', opacity: 0.7 })">{{ i + 1 }}</span>
      <span :class="css({ textStyle: 'label' })">{{ entry.n }}{{ i === myIndex ? ' · YOU' : '' }}</span>
      <span :class="css({ textStyle: 'timer', fontSize: 'md' })">{{ entry.s }}</span>
    </div>
  </div>
</template>
