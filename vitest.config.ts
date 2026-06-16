import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Plain Vitest + Vue plugin (not the Nuxt environment): the tested units import
// `vue`/`@vueuse` explicitly and need no Nuxt auto-imports, so this is faster and
// avoids spinning up the full Nuxt vite-builder. Aliases mirror Nuxt: ~ = app/, ~~ = root.
export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
  },
  resolve: {
    alias: {
      '~~': fileURLToPath(new URL('./', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
    },
  },
})
