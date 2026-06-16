<script setup lang="ts">
import GameTile from '~/components/GameTile.vue'
import TopBar from '~/components/TopBar.vue'
import { css } from '~~/styled-system/css'
import { frame } from '~~/styled-system/patterns'

const games = [
  { to: '/numbers', name: 'NUMBERS', desc: 'Memorize a number, type it back before the timer drains.', ready: true },
  { to: '/stroop', name: 'STROOP', desc: 'Does the ink color match the word? Decide fast.', ready: true },
  { to: '/math', name: 'MATH SPRINT', desc: 'Solve multiplication against the clock.', ready: true },
  { to: '/words', name: 'WORD FORM', desc: 'Build valid words from the letters you are given.', ready: true },
]

const howTo = [
  'Pick a game below — each one trains a different mental muscle.',
  'Every level gets faster and harder. Survive as long as you can.',
  'Set a name in Settings, then share your link — friends play the exact same run and join your leaderboard.',
]
</script>

<template>
  <div>
    <TopBar how-to-title="HOW IT WORKS" :how-to="howTo" />
    <div :class="frame()" style="height: 100dvh">
      <section :class="css({ w: 'full', maxW: '46rem', display: 'grid', gap: '10' })">
        <div :class="css({ display: 'grid', gap: '3' })">
          <p :class="css({ textStyle: 'label', color: 'accent' })">
            ACTIVE-RECALL ARCADE
          </p>
          <h1 :class="css({ textStyle: 'display', fontSize: 'clamp(3rem, 15vw, 9rem)', color: 'fg', overflowWrap: 'anywhere' })">
            RECALL
          </h1>
          <p :class="css({ textStyle: 'body', maxW: '30rem', opacity: 0.7, lineHeight: '1.5' })">
            Fast little games to sharpen your memory, focus, and reaction. Pick a mode, race the
            clock, and climb the levels — each run gets harder as you go.
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
  </div>
</template>
