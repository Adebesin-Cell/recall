<script setup lang="ts">
import BigNumber from '~/components/BigNumber.vue'
import KeypadInput from '~/components/KeypadInput.vue'
import { css } from '~~/styled-system/css'

defineProps<{ prompt: string, level: number, score: number, fraction: number }>()
defineEmits<{ submit: [value: string] }>()
</script>

<template>
  <section :class="css({ w: 'full', maxW: '40rem', display: 'flex', flexDir: 'column', alignItems: 'center', gap: '8' })">
    <p :class="css({ textStyle: 'label', color: 'accent' })">
      MATH · LV {{ level }} · {{ score }} PTS
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
    <BigNumber :value="prompt" glow />
    <KeypadInput :key="level" @submit="(v) => $emit('submit', v)" />
  </section>
</template>
