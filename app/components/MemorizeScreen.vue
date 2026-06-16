<script setup lang="ts">
import BigNumber from '~/components/BigNumber.vue'
import TimerArc from '~/components/TimerArc.vue'
import { css } from '~~/styled-system/css'

defineProps<{ value: string, level: number, fraction: number }>()
defineEmits<{ ready: [] }>()
</script>

<template>
  <section :class="css({ w: 'full', maxW: '40rem', display: 'flex', flexDir: 'column', alignItems: 'center', gap: '10' })">
    <p :class="css({ textStyle: 'label', color: 'accent' })">
      MEMORIZE · LV {{ level }}
    </p>
    <TimerArc :fraction="fraction" />
    <BigNumber :value="value" glow />
    <button
      type="button"
      :class="css({ textStyle: 'label', border: '1px solid token(colors.fg)', px: '6', py: '3', bg: 'transparent', color: 'fg', cursor: 'pointer' })"
      @click="$emit('ready')"
    >
      I'VE GOT IT
    </button>
  </section>
</template>
