<script setup lang="ts">
import { ref } from 'vue'
import { css } from '~~/styled-system/css'
import { button } from '~~/styled-system/recipes'

defineProps<{ letters: string[], level: number, score: number, fraction: number }>()
const emit = defineEmits<{ submit: [value: string] }>()

const entry = ref('')

function go() {
  emit('submit', entry.value)
  entry.value = ''
}
</script>

<template>
  <section :class="css({ w: 'full', maxW: '40rem', display: 'flex', flexDir: 'column', alignItems: 'center', gap: '7' })">
    <p :class="css({ textStyle: 'label', color: 'accent' })">
      WORDS · LV {{ level }} · {{ score }} PTS
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

    <div :class="css({ display: 'flex', gap: '3', flexWrap: 'wrap', justifyContent: 'center' })">
      <span
        v-for="(letter, i) in letters"
        :key="i"
        :class="css({ textStyle: 'display', fontSize: '4xl', w: '16', h: '16', display: 'grid', placeItems: 'center', borderWidth: '1px', borderStyle: 'solid', borderColor: 'fg', color: 'fg', boxShadow: 'glowSm' })"
      >
        {{ letter }}
      </span>
    </div>

    <p :class="css({ textStyle: 'label', opacity: 0.6 })">
      FORM A WORD · 3+ LETTERS
    </p>
    <input
      v-model="entry"
      autofocus
      autocomplete="off"
      autocapitalize="characters"
      :class="css({ textStyle: 'display', fontSize: '4xl', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em', bg: 'transparent', color: 'accent', borderBottomWidth: '2px', borderStyle: 'solid', borderColor: 'accent', w: 'full', maxW: 'sm', py: '2', _focus: { outline: 'none' } })"
      @keyup.enter="go"
    >
    <button type="button" :class="[button({ visual: 'solid' }), css({ w: 'full', maxW: 'sm' })]" @click="go">
      SUBMIT
    </button>
  </section>
</template>
