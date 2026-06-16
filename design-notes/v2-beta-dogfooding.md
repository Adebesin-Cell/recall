---
title: Panda v2 Beta — Dogfooding Log (what broke)
status: living
scope:
  - "@pandacss/dev@2.0.0-beta.0"
  - "@pandacss/preset-base@2.0.0-beta.0"
  - "@pandacss/preset-panda@2.0.0-beta.0"
  - recall (Nuxt 4 + Bun)
---

# Panda v2 Beta — Dogfooding Log

## Summary

Recall is built specifically to dogfood **Panda CSS v2 beta** (`2.0.0-beta.0`). This note logs
everything that broke while wiring Panda into a Nuxt 4 app, the evidence, the root cause, the
workaround we shipped, and the suggested upstream fix. These are point-in-time findings against
`2.0.0-beta.0` — re-verify against newer betas before filing.

Reference doc being validated: chakra-ui/panda PR #3590 (`V2_MIGRATION.md`).

---

## Finding 1 — `defineConfig` does not auto-include base presets (highest impact)

**What broke.** A config with no `presets` key produces a *bare* system: no utilities, no token
scales, no standard conditions. Three symptoms, one cause:

1. TypeScript: `Object literal may only specify known properties, and 'bg' does not exist in type 'SystemStyleObject'.`
2. Emitted CSS had unresolved tokens — literally `.fs_6xl { font-size: 6xl; }` (the scale name leaked
   through instead of resolving to a `rem` var).
3. The whole app rendered unstyled (white background, serif fallback) because layout/spacing/font
   utilities were never generated.

**Evidence.**
```
$ node -e "require.resolve('@pandacss/preset-base')"  → MISSING
$ node -e "require.resolve('@pandacss/preset-panda')" → MISSING
$ panda cssgen → ".fs_6xl { font-size: 6xl; }"  (invalid)
$ panda cssgen → "warning unknown_condition `_active`" / "`_hover`"
```

**Root cause.** In v2 beta, `defineConfig({...})` without an explicit `presets` array does **not**
fold in `@pandacss/preset-base` + `@pandacss/preset-panda`. Without them there are no utility
definitions (`bg`, `color`, `p`), no token scales (`6xl`, spacing `8`), and no pseudo conditions
(`_hover`, `_active`). The packages are also not transitive deps of `@pandacss/dev`, so they must be
installed.

**Workaround (shipped).**
```bash
bun add -d @pandacss/preset-base@2.0.0-beta.0 @pandacss/preset-panda@2.0.0-beta.0
```
```ts
// panda.config.ts
export default defineConfig({
  presets: ['@pandacss/preset-base', '@pandacss/preset-panda'],
  // ...
})
```
After this: `.fs_6xl { font-size: var(--font-sizes-6xl) }`, `:hover`/`:active` emit, `bg` typechecks,
`panda cssgen` reports `diagnostics: 0`.

**Suggested upstream fix.** Either (a) default `presets` to base + panda when the key is omitted (v1
behavior), or (b) make `@pandacss/dev` depend on the presets and emit a hard error ("no presets
resolved — utilities/tokens will be empty") instead of silently producing a bare system. See also
Finding 4.

---

## Finding 2 — Experimental `@pandacss/dev/postcss` emits corrupted semantic-token CSS

**What broke.** With the PostCSS plugin wired into Nuxt, the emitted `:root` block contained an
invalid declaration that broke the entire rule:
```css
:where(:root, :host) {
  --colors-bg: var(--colors-ink);
  --colors-fg: var(--colors-paper)
#FAFAFA
;
  --colors-accent: var(--colors-violet);
}
```
`--colors-fg` got both the `var(...)` reference **and** the raw resolved hex concatenated, producing
invalid CSS. The browser discards the broken declaration (and surrounding rule), so tokens never
applied → unstyled page.

**Evidence.** The CLI path is clean for the *same* config:
```
$ panda cssgen --outfile /tmp/recall.css
  → "--colors-fg: var(--colors-paper);"   (correct)
```
Only the PostCSS-plugin output was corrupted. (Note: Finding 1's missing presets compounded the
unstyled symptom; this corruption is a *separate* defect specific to the postcss driver.)

**Root cause.** The `@pandacss/dev/postcss` driver is flagged **experimental** in the v2 migration
guide and mis-serializes conditional semantic-token base values (duplicating the var reference with
the literal fallback).

**Workaround (shipped).** Drop the PostCSS plugin; use the battle-tested CLI build and import the
generated stylesheet directly:
```ts
// nuxt.config.ts — no `postcss` block, no postcss.config.cjs
css: ['~~/styled-system/styles.css']
```
```jsonc
// package.json — generate CSS via the CLI, watch in dev
"dev": "concurrently -kr \"panda cssgen --watch\" \"nuxt dev\"",
"build": "panda codegen && panda cssgen && nuxt build",
"postinstall": "nuxt prepare && panda codegen && panda cssgen"
```

**Suggested upstream fix.** Fix conditional semantic-token serialization in the postcss driver; until
then the migration guide should steer Nuxt users to the CLI/Vite path (it already warns the plugin is
experimental — make that warning louder for semantic tokens specifically).

---

## Finding 3 — CLI surface differs from `V2_MIGRATION.md`

**What broke.** The migration guide documents a bare default-build command and a top-level watch:
```bash
panda          # "default build — codegen + cssgen in one pass"
panda --watch  # "rebuild on change"
```
Neither exists in `2.0.0-beta.0`:
```
$ panda
 ERROR  No command specified.
USAGE panda buildinfo|codegen|cssgen|init|inspect|validate
```

**Actual surface (verified).**
- No bare/default build command; no top-level `panda --watch`.
- Real commands: `panda codegen` (JS system) and `panda cssgen` (CSS) — run both.
- **Both** subcommands support `-w, --watch` and `--watchDebounce`.
- `panda cssgen` with no `--outfile` writes `styled-system/styles.css`.

**Root cause.** The guide (PR #3590) describes a planned/!shipped command surface ahead of the beta
binary.

**Workaround (shipped).** Treat `codegen` + `cssgen` as the two real steps everywhere (see Finding 2
scripts). For dev, watch CSS only (`panda cssgen --watch`) since the JS system changes only when the
config does.

**Suggested upstream fix.** Either ship the documented `panda` default command + `panda --watch`, or
correct `V2_MIGRATION.md` to the `codegen`/`cssgen` reality.

---

## Finding 4 — Migration "Get started" config is non-functional (doc)

**What broke.** The "Get started (new project)" snippet in `V2_MIGRATION.md` omits `presets`:
```ts
export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
})
```
Following it verbatim reproduces Finding 1 (bare system, no utilities/tokens/conditions). A new user
copying this gets an unstyled, type-erroring project with no obvious cause.

**Suggested upstream fix.** Add `presets: ['@pandacss/preset-base', '@pandacss/preset-panda']` to the
getting-started config and the install step, or fix Finding 1 so the omission is safe.

---

## Finding 5 — New atomic classes are only live after a regen (watch friction)

**What broke.** Adding a brand-new value to a `css({...})` call (e.g. `h: '100dvh'`) had *no
effect* in the browser, while an inline `:style="{ height: '100dvh' }"` worked immediately. The CSS
property was identical — the utility just wasn't in `styles.css` yet.

**Root cause.** In the CLI-build setup, atomic classes only exist after `panda cssgen` re-scans and
emits them. Until the watcher regenerates (or if the dev server serves stale CSS), a freshly-added
class name in `:class` points at a rule that doesn't exist. Inline styles bypass codegen entirely, so
they always apply — which is what made the two look like they behaved differently.

**Workaround.** For layout-critical one-offs, an inline style is fine. Otherwise: ensure
`cssgen --watch` is running, and re-run `bunx panda cssgen` after adding new utilities. This friction
is sharper with the CLI-watch path than it would be with a bundler plugin that regenerates in-process.

**Suggested upstream note.** Worth calling out in docs: with the CLI build, new class *names* require
a regen — HMR doesn't synthesize them. A first-class Nuxt module (or a stable Vite plugin) would
remove this entirely.

---

## Net effect on Recall's setup

- `panda.config.ts` declares `presets` explicitly.
- No PostCSS plugin; CSS comes from `panda cssgen` and is imported as `~~/styled-system/styles.css`.
- Scripts run `codegen` + `cssgen` (watch in dev via `concurrently`).
- All of the above is the *intended* dogfooding payoff: these are exactly the rough edges v2 needs
  reported before stable.
