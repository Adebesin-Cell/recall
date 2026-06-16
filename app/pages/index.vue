<script setup lang="ts">
import GameTile from '~/components/GameTile.vue'
import { css } from '~~/styled-system/css'

const frame = css({ minH: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: '6' })

const games = [
  { to: '/numbers', name: 'NUMBERS', desc: 'Memorize a number, type it back before the timer drains.', ready: true },
  { to: '/stroop', name: 'STROOP', desc: 'Does the ink color match the word? Decide fast.', ready: true },
  { to: '/math', name: 'MATH SPRINT', desc: 'Solve multiplication against the clock.', ready: false },
  { to: '/words', name: 'WORD FORM', desc: 'Build valid words from the letters you are given.', ready: false },
]
</script>

<template>
  <div :class="frame" :style="{ minHeight: '100dvh' }">
    <section :class="css({ w: 'full', maxW: '46rem', display: 'grid', gap: '10' })">
      <div :class="css({ display: 'grid', gap: '3' })">
        <p :class="css({ textStyle: 'label', color: 'accent' })">
          ACTIVE-RECALL ARCADE
        </p>
        <h1 :class="css({ textStyle: 'display', fontSize: { base: '7xl', md: '9xl' }, color: 'fg' })">
          RECALL
        </h1>
        <p :class="css({ textStyle: 'body', maxW: '30rem', opacity: 0.7, lineHeight: '1.5' })">
          Fast little games to sharpen your memory, focus, and reaction. Pick a mode, race the
          clock, and climb the levels — each run gets harder as you go.
        </p>
        <p :class="css({ textStyle: 'label', opacity: 0.55, mt: '1' })">
          PICK A GAME TO PLAY
        </p>
      </div>

      <div :class="css({ display: 'grid', gridTemplateColumns: { base: '1fr', sm: '1fr 1fr' }, gap: '4' })">
        <GameTile
          v-for="game in games"
          :key="game.to"
          :to="game.to"
          :name="game.name"
          :desc="game.desc"
          :ready="game.ready"
        />
      </div>
    </section>
  </div>
</template>
