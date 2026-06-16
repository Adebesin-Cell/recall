import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  // v2 beta: defineConfig does NOT auto-include base presets — without these,
  // there are no utilities (bg/color/p), no token scales (6xl, spacing), and no
  // _hover/_active conditions. See design-notes/v2-beta-dogfooding.md.
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  preflight: true,
  jsxFramework: 'vue',
  include: ['./app/**/*.{vue,ts}'],
  exclude: [],
  outdir: 'styled-system',
  conditions: {
    extend: {
      // Palette inversion: any subtree marked data-mode="safe" flips fg/bg.
      safe: '[data-mode=safe] &',
    },
  },
  theme: {
    extend: {
      tokens: {
        colors: {
          ink: { value: '#0A0A0A' },
          paper: { value: '#FAFAFA' },
          violet: { value: '#6C5CE7' },
        },
        fonts: {
          display: { value: 'Archivo, system-ui, sans-serif' },
          mono: { value: '"Geist Mono", ui-monospace, monospace' },
        },
        shadows: {
          glowSm: { value: '0 0 8px rgba(108,92,231,0.6)' },
          glowLg: { value: '0 0 24px rgba(108,92,231,0.85), 0 0 56px rgba(108,92,231,0.4)' },
        },
        radii: {
          none: { value: '0' },
        },
      },
      semanticTokens: {
        colors: {
          bg: { value: { base: '{colors.ink}', _safe: '{colors.paper}' } },
          fg: { value: { base: '{colors.paper}', _safe: '{colors.ink}' } },
          accent: { value: '{colors.violet}' },
        },
      },
      textStyles: {
        display: {
          value: {
            fontFamily: 'display',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '-0.02em',
            lineHeight: '0.9',
          },
        },
        label: {
          value: {
            fontFamily: 'display',
            fontSize: 'xs',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
          },
        },
        body: {
          value: { fontFamily: 'display', fontSize: 'sm', fontWeight: '400' },
        },
        timer: {
          value: {
            fontFamily: 'mono',
            fontWeight: '600',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.04em',
          },
        },
      },
      keyframes: {
        flipIn: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { textShadow: '0 0 8px rgba(108,92,231,0.55)' },
          '50%': { textShadow: '0 0 28px rgba(108,92,231,0.95)' },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      bg: 'bg',
      color: 'fg',
      fontFamily: 'display',
    },
  },
})
