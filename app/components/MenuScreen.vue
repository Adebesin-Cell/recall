<script setup lang="ts">
import { css } from '~~/styled-system/css'

defineProps<{
  title: string
  tagline: string
  label: string
  bestLevel: number
  bestScore: number
  challenge?: { score: number, levelReached: number } | null
}>()
defineEmits<{ start: [] }>()
</script>

<template>
  <section :class="css({ w: 'full', maxW: '40rem', display: 'grid', gap: '8' })">
    <div :class="css({ display: 'grid', gap: '3' })">
      <NuxtLink
        to="/"
        :class="css({ textStyle: 'label', opacity: 0.55, w: 'fit-content', _hover: { opacity: 1, color: 'accent' } })"
      >
        ← RECALL ARCADE
      </NuxtLink>
      <p :class="css({ textStyle: 'label', color: 'accent' })">
        {{ label }}
      </p>
      <h1 :class="css({ textStyle: 'display', fontSize: { base: '7xl', md: '9xl' }, color: 'fg' })">
        {{ title }}
      </h1>
      <p :class="css({ textStyle: 'body', maxW: '26rem', opacity: 0.7, lineHeight: '1.5' })">
        {{ tagline }}
      </p>
    </div>

    <div
      v-if="challenge"
      :class="css({ border: '1px solid token(colors.accent)', borderRadius: 'none', p: '5', display: 'grid', gap: '1', boxShadow: 'glowSm' })"
    >
      <p :class="css({ textStyle: 'label', color: 'accent' })">
        ⚡ YOU'VE BEEN CHALLENGED
      </p>
      <p :class="css({ textStyle: 'display', fontSize: '3xl', color: 'fg' })">
        BEAT {{ challenge.score }} PTS
      </p>
      <p :class="css({ textStyle: 'label', opacity: 0.6 })">
        THEY REACHED LV {{ challenge.levelReached }} · SAME SEQUENCE, YOUR TURN
      </p>
    </div>

    <div :class="css({ display: 'grid', gap: '4' })">
      <p :class="css({ textStyle: 'label', opacity: 0.6 })">
        BEST · LV {{ bestLevel }} · {{ bestScore }} PTS
      </p>
      <button
        type="button"
        :class="css({ textStyle: 'display', fontSize: '2xl', bg: 'accent', color: 'paper', py: '5', borderRadius: 'none', cursor: 'pointer', boxShadow: 'glowLg', transition: 'transform 120ms', _hover: { transform: 'translateY(-2px)' } })"
        @click="$emit('start')"
      >
        {{ challenge ? 'ACCEPT CHALLENGE' : 'START' }}
      </button>
    </div>
  </section>
</template>
