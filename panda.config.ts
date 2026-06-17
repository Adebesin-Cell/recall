import { defineConfig, definePattern, defineRecipe, defineSlotRecipe } from '@pandacss/dev'

const button = defineRecipe({
  className: 'btn',
  description: 'Brutalist action button',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'display',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '-0.01em',
    borderRadius: 'none',
    cursor: 'pointer',
    transition: 'transform 120ms, box-shadow 120ms, background 120ms',
  },
  variants: {
    visual: {
      solid: { bg: 'accent', color: 'paper', boxShadow: 'glowLg', _hover: { transform: 'translateY(-2px)' } },
      invert: { bg: 'fg', color: 'bg' },
      outline: { bg: 'transparent', color: 'fg', borderWidth: '1px', borderStyle: 'solid', borderColor: 'fg' },
      ghost: { bg: 'transparent', color: 'fg', opacity: 0.7, _hover: { opacity: 1, color: 'accent' } },
    },
    size: {
      sm: { fontSize: 'sm', letterSpacing: '0.12em', px: '6', py: '3' },
      md: { fontSize: 'xl', px: '6', py: '4' },
      lg: { fontSize: '2xl', px: '8', py: '5' },
    },
  },
  defaultVariants: { visual: 'solid', size: 'md' },
})

const gameTile = defineRecipe({
  className: 'tile',
  description: 'Game-select tile',
  base: {
    display: 'grid',
    gap: '2',
    p: '6',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'fg',
    borderRadius: 'none',
    transition: 'all 140ms',
    textAlign: 'left',
  },
  variants: {
    state: {
      ready: { cursor: 'pointer', _hover: { borderColor: 'accent', boxShadow: 'glowSm', transform: 'translateY(-2px)' } },
      soon: { opacity: 0.4 },
    },
  },
  defaultVariants: { state: 'ready' },
})

const keyCap = defineRecipe({
  className: 'keycap',
  description: 'On-screen keypad key',
  base: {
    fontFamily: 'display',
    fontWeight: '900',
    fontSize: '3xl',
    py: '4',
    bg: 'transparent',
    color: 'fg',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'fg',
    borderRadius: 'none',
    cursor: 'pointer',
    transition: 'all 120ms',
    _active: { bg: 'accent', borderColor: 'accent', boxShadow: 'glowSm' },
  },
})


const panel = defineSlotRecipe({
  className: 'panel',
  description: 'Result / game-over card',
  slots: ['root', 'heading', 'meta'],
  base: {
    root: { w: 'full', maxW: '40rem', display: 'grid', gap: '7', p: { base: '8', md: '10' } },
    heading: { textStyle: 'display', fontSize: { base: '6xl', md: '8xl' } },
    meta: { textStyle: 'label' },
  },
})


const frame = definePattern({
  description: 'Full-viewport, flex-centered screen wrapper (scrolls when content is tall)',
  properties: {},
  transform() {
    return {
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingInline: '6',
      paddingTop: '6rem',
      paddingBottom: '2rem',
    }
  },
})

export default defineConfig({
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  preflight: true,
  jsxFramework: 'vue',
  include: ['./app/**/*.{vue,ts}'],
  exclude: [],
  outdir: 'styled-system',
  conditions: {
    extend: {
      safe: '[data-mode=safe] &',
    },
  },
  patterns: {
    extend: { frame },
  },
  theme: {
    extend: {
      recipes: { button, gameTile, keyCap },
      slotRecipes: { panel },
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
        sweepIn: {
          '0%': { clipPath: 'inset(0 0 100% 0)', opacity: '0.5' },
          '100%': { clipPath: 'inset(0 0 0 0)', opacity: '1' },
        },
        flash: {
          '0%': { opacity: '0.5' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      bg: 'bg',
      color: 'fg',
      fontFamily: 'display',
      overflowX: 'hidden',
    },
  },
})
