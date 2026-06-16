<script setup lang="ts">
import { Dialog } from '@ark-ui/vue/dialog'
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue'
import { encodeRun } from '~/share/codec'
import { css } from '~~/styled-system/css'

const props = defineProps<{ seed: number, levelReached: number, score: number, streak: number }>()
const { copy, copied } = useClipboard()

const shareUrl = computed(() => {
  const r = encodeRun({ seed: props.seed, levelReached: props.levelReached, score: props.score, streak: props.streak })
  const origin = typeof window === 'undefined' ? 'https://recall.app' : window.location.origin
  // Share the CURRENT game's route so the challenge replays the right mode.
  const path = typeof window === 'undefined' ? '/' : window.location.pathname
  return `${origin}${path}?r=${r}`
})
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger
      :class="css({ textStyle: 'display', fontSize: 'xl', border: '1px solid currentColor', px: '6', py: '3', bg: 'transparent', color: 'fg', cursor: 'pointer' })"
    >
      SHARE
    </Dialog.Trigger>
    <Dialog.Backdrop :class="css({ position: 'fixed', inset: 0, bg: 'rgba(0,0,0,0.7)' })" />
    <Dialog.Positioner :class="css({ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', p: '6' })">
      <Dialog.Content :class="css({ bg: 'ink', color: 'paper', p: '8', maxW: 'md', w: 'full', display: 'grid', gap: '5', border: '1px solid token(colors.violet)', boxShadow: 'glowLg' })">
        <Dialog.Title :class="css({ textStyle: 'display', fontSize: '3xl' })">
          BEAT MY RUN
        </Dialog.Title>
        <p :class="css({ textStyle: 'body', wordBreak: 'break-all', opacity: 0.7 })">
          {{ shareUrl }}
        </p>
        <button
          type="button"
          :class="css({ textStyle: 'label', bg: 'accent', color: 'paper', py: '4', cursor: 'pointer' })"
          @click="copy(shareUrl)"
        >
          {{ copied ? 'COPIED ✓' : 'COPY LINK' }}
        </button>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
</template>
