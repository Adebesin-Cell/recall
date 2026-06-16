import { mulberry32 } from './seed'

// Six-letter base words used to seed each round (always solvable: the base itself
// is a real word). Chosen to be anagram-rich and unambiguously common.
export const BASES = [
  'PLANET', 'GARDEN', 'MASTER', 'STREAM', 'FRIEND', 'ORANGE', 'SILVER', 'MARKET',
  'WINTER', 'DANGER', 'RANDOM', 'PURPLE', 'MEMORY', 'ACTION', 'NUMBER', 'LETTER',
  'SECOND', 'REASON', 'OBJECT', 'SIMPLE', 'CASTLE', 'BRANCH', 'CIRCLE', 'FLOWER',
  'ISLAND', 'JUNGLE', 'KITTEN', 'LITTLE', 'MOTHER', 'PEOPLE', 'ROCKET', 'SPRING',
]

// Lazy-loaded English dictionary (~275k words via an-array-of-english-words).
// Loaded only when the Word Form game starts, so it never weighs down the rest
// of the app. Filtered to 3–8 letter a–z words and memoized.
let cache: Set<string> | null = null
export async function loadDictionary(): Promise<Set<string>> {
  if (cache) return cache
  const mod = await import('an-array-of-english-words')
  const words = (mod.default ?? mod) as string[]
  cache = new Set(words.filter(w => /^[a-z]{3,8}$/.test(w)))
  return cache
}

export function baseForLevel(seed: number, level: number): string {
  const rng = mulberry32((seed + level * 2654435761) >>> 0)
  return BASES[Math.floor(rng() * BASES.length)]!
}

// Deterministic Fisher-Yates shuffle of the base word's letters.
export function lettersForLevel(seed: number, level: number): string[] {
  const rng = mulberry32(((seed ^ 0x9E3779B9) + level * 40503) >>> 0)
  const chars = baseForLevel(seed, level).split('')
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[chars[i], chars[j]] = [chars[j]!, chars[i]!]
  }
  return chars
}

// Can `word` be built from the available letters (each usable once)?
export function canForm(word: string, letters: string[]): boolean {
  const pool = new Map<string, number>()
  for (const c of letters) pool.set(c.toUpperCase(), (pool.get(c.toUpperCase()) ?? 0) + 1)
  for (const c of word.toUpperCase()) {
    const n = pool.get(c) ?? 0
    if (n === 0) return false
    pool.set(c, n - 1)
  }
  return true
}

export function isValidWord(word: string, letters: string[], dictionary: Set<string>): boolean {
  const w = word.trim().toLowerCase()
  return w.length >= 3 && dictionary.has(w) && canForm(w, letters)
}

export function wordTimeMs(level: number): number {
  return Math.max(6000, 18000 - level * 800)
}

export function wordScore(word: string, remainingMs: number, level: number, streak: number): number {
  const lengthPoints = word.length * word.length * 10 // longer words reward more
  const speedBonus = 1 + Math.max(0, remainingMs) / wordTimeMs(level)
  const streakMult = 1 + streak * 0.1
  return Math.round(lengthPoints * speedBonus * streakMult)
}
