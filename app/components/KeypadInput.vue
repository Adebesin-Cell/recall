<script setup lang="ts">
import { ref } from 'vue'
import { css } from '~~/styled-system/css'

const emit = defineEmits<{ submit: [value: string] }>()
const entry = ref('')
const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'] as const

function press(key: string) {
  if (key === 'del') entry.value = entry.value.slice(0, -1)
  else if (key === 'ok') emit('submit', entry.value)
  else entry.value += key
}

const keyClass = css({
  textStyle: 'display',
  fontSize: '3xl',
  py: '4',
  bg: 'transparent',
  color: 'fg',
  border: '1px solid token(colors.fg)',
  borderRadius: 'none',
  cursor: 'pointer',
  transition: 'all 120ms',
  _active: { bg: 'accent', borderColor: 'accent', boxShadow: 'glowSm' },
})
</script>

<template>
  <div :class="css({ display: 'grid', gap: '4', w: 'full', maxW: 'sm' })">
    <div
      data-testid="entry"
      :class="css({ textStyle: 'timer', fontSize: '5xl', textAlign: 'center', minH: '1.2em', color: 'accent' })"
    >
      {{ entry }}
    </div>
    <div :class="css({ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3' })">
      <button
        v-for="key in keys"
        :key="key"
        :data-key="key"
        type="button"
        :class="keyClass"
        @click="press(key)"
      >
        {{ key === 'del' ? '⌫' : key === 'ok' ? '✓' : key }}
      </button>
    </div>
  </div>
</template>
