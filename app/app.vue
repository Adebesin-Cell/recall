<script setup lang="ts">
useHead({
  titleTemplate: title => (title && title !== 'Recall' ? `${title} · Recall` : 'Recall — Brain Games for Memory, Focus & Reaction'),
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
  ],
})

useSeoMeta({
  description: 'Fast, free brain games that train memory, focus and reaction — number recall, the Stroop test, mental-math sprints and word anagrams. No sign-up: your scores and leaderboards live in a shareable link.',
  ogSiteName: 'Recall',
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

// Site-wide default OG image; game pages override it with a per-run card.
defineOgImageComponent('Default')
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </div>
</template>
