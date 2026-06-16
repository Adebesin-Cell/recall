<script setup lang="ts">
import { Dialog } from '@ark-ui/vue/dialog'
import { useName } from '~/composables/useName'
import { css } from '~~/styled-system/css'

defineProps<{ howToTitle: string, howTo: string[] }>()

const { name } = useName()

const cluster = css({ position: 'fixed', top: '0', right: '0', p: '5', display: 'flex', gap: '7', zIndex: '50' })
const iconBtn = css({ display: 'grid', justifyItems: 'center', gap: '1.5', bg: 'transparent', color: 'fg', cursor: 'pointer', opacity: 0.65, transition: 'all 120ms', _hover: { opacity: 1, color: 'accent' } })
const iconLabel = css({ textStyle: 'label', fontSize: '0.625rem' })
const backdrop = css({ position: 'fixed', inset: 0, bg: 'rgba(0,0,0,0.72)' })
const positioner = css({ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', p: '6', zIndex: '60' })
const content = css({ bg: 'ink', color: 'paper', p: '8', maxW: 'md', w: 'full', display: 'grid', gap: '5', border: '1px solid token(colors.violet)', boxShadow: 'glowLg' })
const heading = css({ textStyle: 'display', fontSize: '3xl' })
const nameInput = css({ textStyle: 'label', fontSize: 'md', bg: 'transparent', color: 'paper', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.35)', px: '3', py: '2', _focus: { borderColor: 'accent', outline: 'none', boxShadow: 'glowSm' } })
const closeBtn = css({ textStyle: 'label', bg: 'accent', color: 'paper', py: '4', cursor: 'pointer', borderRadius: 'none', borderWidth: '0' })

function resetScores() {
  if (typeof window === 'undefined') return
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith('recall:profile')) localStorage.removeItem(key)
  }
}
</script>

<template>
  <div :class="cluster">
    <!-- How to play -->
    <Dialog.Root>
      <Dialog.Trigger :class="iconBtn" aria-label="How to play">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
        <span :class="iconLabel">HOW TO</span>
      </Dialog.Trigger>
      <Dialog.Backdrop :class="backdrop" />
      <Dialog.Positioner :class="positioner">
        <Dialog.Content :class="content">
          <Dialog.Title :class="heading">
            {{ howToTitle }}
          </Dialog.Title>
          <ol :class="css({ display: 'grid', gap: '3' })">
            <li v-for="(step, i) in howTo" :key="i" :class="css({ textStyle: 'body', opacity: 0.8, display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3' })">
              <span :class="css({ textStyle: 'timer', color: 'accent' })">{{ i + 1 }}</span>
              <span>{{ step }}</span>
            </li>
          </ol>
          <Dialog.CloseTrigger :class="closeBtn">
            GOT IT
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>

    <!-- Settings -->
    <Dialog.Root>
      <Dialog.Trigger :class="iconBtn" aria-label="Settings">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
        <span :class="iconLabel">SETTINGS</span>
      </Dialog.Trigger>
      <Dialog.Backdrop :class="backdrop" />
      <Dialog.Positioner :class="positioner">
        <Dialog.Content :class="content">
          <Dialog.Title :class="heading">
            SETTINGS
          </Dialog.Title>
          <ClientOnly>
            <label :class="css({ display: 'grid', gap: '2' })">
              <span :class="css({ textStyle: 'label', opacity: 0.6 })">YOUR NAME · SHOWS ON THE LEADERBOARD</span>
              <input v-model="name" maxlength="12" placeholder="ANON" :class="nameInput">
            </label>
          </ClientOnly>
          <button type="button" :class="css({ textStyle: 'label', bg: 'transparent', color: 'paper', borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgba(255,255,255,0.35)', py: '3', cursor: 'pointer' })" @click="resetScores">
            RESET MY SCORES
          </button>
          <Dialog.CloseTrigger :class="closeBtn">
            DONE
          </Dialog.CloseTrigger>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  </div>
</template>
