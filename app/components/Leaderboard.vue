<script setup lang="ts">
import type { Entry } from '~/share/board'
import { css } from '~~/styled-system/css'

const props = defineProps<{ entries: Entry[], myIndex?: number, myName?: string }>()

function isMine(entry: Entry, i: number): boolean {
  return i === props.myIndex || (!!props.myName && entry.n === props.myName)
}

const row = css({ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '3', alignItems: 'baseline', py: '2', borderBottom: '1px solid', borderColor: 'rgba(128,128,128,0.25)' })
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
      :style="isMine(entry, i) ? 'color: var(--colors-accent)' : ''"
    >
      <span :class="css({ textStyle: 'timer', fontSize: 'sm', opacity: 0.7 })">{{ i + 1 }}</span>
      <span :class="css({ textStyle: 'label' })">
        {{ entry.n }}<span v-if="isMine(entry, i)"> · YOU</span><span v-if="entry.p > 1" :class="css({ opacity: 0.5 })"> · {{ entry.p }}×</span>
      </span>
      <span :class="css({ textStyle: 'timer', fontSize: 'md' })">{{ entry.s }}</span>
    </div>
  </div>
</template>
