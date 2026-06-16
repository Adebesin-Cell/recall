<script setup lang="ts">
import BigNumber from '~/components/BigNumber.vue'
import TimerArc from '~/components/TimerArc.vue'
import { css } from '~~/styled-system/css'
import { button } from '~~/styled-system/recipes'

defineProps<{ value: string, level: number, fraction: number }>()
defineEmits<{ ready: [] }>()
</script>

<template>
  <section :class="css({ w: 'full', maxW: '40rem', display: 'flex', flexDir: 'column', alignItems: 'center', gap: '10' })">
    <p :class="css({ textStyle: 'label', color: 'accent' })">
      MEMORIZE · LV {{ level }}
    </p>
    <TimerArc :fraction="fraction">
      <BigNumber :value="value" glow compact />
    </TimerArc>
    <button
      type="button"
      :class="button({ visual: 'outline', size: 'sm' })"
      @click="$emit('ready')"
    >
      I'VE GOT IT
    </button>
  </section>
</template>
