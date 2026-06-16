import { mulberry32 } from './seed'

export interface MathProblem {
  a: number
  b: number
  answer: number
  prompt: string
}

// Factor ranges widen as the run goes on: single digits → 2-digit × 1-digit → bigger.
function rangeForLevel(level: number) {
  if (level <= 3) return { aMin: 2, aMax: 9, bMin: 2, bMax: 9 }
  if (level <= 6) return { aMin: 3, aMax: 12, bMin: 2, bMax: 9 }
  if (level <= 9) return { aMin: 6, aMax: 19, bMin: 3, bMax: 9 }
  return { aMin: 11, aMax: 29, bMin: 3, bMax: 12 }
}

// Deterministic problem for a seed+level so runs are replayable/shareable.
export function problemForLevel(seed: number, level: number): MathProblem {
  const rng = mulberry32((seed + level * 2654435761) >>> 0)
  const r = rangeForLevel(level)
  const a = r.aMin + Math.floor(rng() * (r.aMax - r.aMin + 1))
  const b = r.bMin + Math.floor(rng() * (r.bMax - r.bMin + 1))
  return { a, b, answer: a * b, prompt: `${a} × ${b}` }
}

// Per-problem time shrinks with level; floor keeps mental math feasible.
export function mathTimeMs(level: number): number {
  return Math.max(3000, 9000 - level * 250)
}

const BASE_POINTS = 80

export function mathScore(remainingMs: number, level: number, streak: number): number {
  const speedBonus = 1 + Math.max(0, remainingMs) / mathTimeMs(level) // 1..2
  const streakMult = 1 + streak * 0.1
  return Math.round(BASE_POINTS * speedBonus * streakMult)
}
