<script setup lang="ts">
import { css } from '~~/styled-system/css'
import { button } from '~~/styled-system/recipes'

defineProps<{ word: string, inkHex: string, level: number, score: number, fraction: number }>()
defineEmits<{ answer: [match: boolean] }>()
</script>

<template>
  <section :class="css({ w: 'full', maxW: '40rem', display: 'flex', flexDir: 'column', alignItems: 'center', gap: '10' })">
    <p :class="css({ textStyle: 'label', color: 'accent' })">
      STROOP · LV {{ level }} · {{ score }} PTS
    </p>

    <div
      :class="css({ h: '4px', w: 'full', maxW: 'sm', bg: 'rgba(250,250,250,0.12)' })"
      role="progressbar"
    >
      <div
        :class="css({ h: 'full', bg: 'accent', boxShadow: 'glowSm', transition: 'width 50ms linear' })"
        :style="{ width: `${fraction * 100}%` }"
      />
    </div>

    <p :class="css({ textStyle: 'label', opacity: 0.6 })">
      DOES THE INK MATCH THE WORD?
    </p>
    <div
      :class="css({ textStyle: 'display', fontSize: { base: '6xl', md: '8xl' }, animation: 'flipIn 200ms ease-out' })"
      :style="{ color: inkHex, textShadow: `0 0 28px ${inkHex}aa, 0 0 56px ${inkHex}55` }"
    >
      {{ word }}
    </div>

    <div :class="css({ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4', w: 'full', maxW: 'sm' })">
      <button
        type="button"
        :class="[button({ visual: 'solid' }), css({ w: 'full' })]"
        @click="$emit('answer', true)"
      >
        MATCH
      </button>
      <button
        type="button"
        :class="[button({ visual: 'outline' }), css({ w: 'full' })]"
        @click="$emit('answer', false)"
      >
        NO MATCH
      </button>
    </div>
  </section>
</template>
