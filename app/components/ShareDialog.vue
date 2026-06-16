<script setup lang="ts">
import { Dialog } from '@ark-ui/vue/dialog'
import { useClipboard } from '@vueuse/core'
import { computed } from 'vue'
import type { Entry } from '~/share/board'
import { encodeChallenge } from '~/share/board'
import { css } from '~~/styled-system/css'
import { button } from '~~/styled-system/recipes'

const props = defineProps<{ seed: number, board: Entry[] }>()
const { copy, copied } = useClipboard()

const shareUrl = computed(() => {
  const c = encodeChallenge({ seed: props.seed, board: props.board })
  const origin = typeof window === 'undefined' ? 'https://recall.app' : window.location.origin
  const path = typeof window === 'undefined' ? '/' : window.location.pathname
  return `${origin}${path}?c=${c}`
})
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger :class="[button({ visual: 'outline' }), css({ w: 'full' })]">
      SHARE
    </Dialog.Trigger>
    <Dialog.Backdrop :class="css({ position: 'fixed', inset: 0, bg: 'rgba(0,0,0,0.7)' })" />
    <Dialog.Positioner :class="css({ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', p: '6' })">
      <Dialog.Content :class="css({ bg: 'ink', color: 'paper', p: '8', maxW: 'md', w: 'full', display: 'grid', gap: '5', border: '1px solid token(colors.violet)', boxShadow: 'glowLg' })">
        <Dialog.Title :class="css({ textStyle: 'display', fontSize: '3xl' })">
          PASS IT ON
        </Dialog.Title>
        <p :class="css({ textStyle: 'body', opacity: 0.7 })">
          This link carries the whole leaderboard. Whoever opens it plays the same sequence — and
          their score joins the board.
        </p>
        <p :class="css({ textStyle: 'body', wordBreak: 'break-all', opacity: 0.5, fontSize: 'xs' })">
          {{ shareUrl }}
        </p>
        <button
          type="button"
          :class="[button({ visual: 'solid' }), css({ w: 'full' })]"
          @click="copy(shareUrl)"
        >
          {{ copied ? 'COPIED ✓' : 'COPY LINK' }}
        </button>
      </Dialog.Content>
    </Dialog.Positioner>
  </Dialog.Root>
</template>
