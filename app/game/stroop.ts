import { mulberry32 } from './seed'

export interface StroopColor {
  name: string
  hex: string
}

// Palette of distinguishable colors (the accent violet is intentionally in the set).
export const STROOP_COLORS: StroopColor[] = [
  { name: 'VIOLET', hex: '#6C5CE7' },
  { name: 'RED', hex: '#FF5C5C' },
  { name: 'GREEN', hex: '#4ADE80' },
  { name: 'BLUE', hex: '#5CA8FF' },
  { name: 'AMBER', hex: '#FFB23E' },
]

export interface StroopRound {
  word: string // the color name written
  inkHex: string // the color it is rendered in
  inkName: string // the name of that ink color
  isMatch: boolean // does the ink match the word?
}

// Deterministic round for a seed+level so runs are replayable/shareable.
export function roundForLevel(seed: number, level: number): StroopRound {
  const rng = mulberry32((seed + level * 2654435761) >>> 0)
  const word = STROOP_COLORS[Math.floor(rng() * STROOP_COLORS.length)]!
  const match = rng() < 0.5
  let ink = word
  if (!match) {
    const others = STROOP_COLORS.filter(c => c.name !== word.name)
    ink = others[Math.floor(rng() * others.length)]!
  }
  return { word: word.name, inkHex: ink.hex, inkName: ink.name, isMatch: ink.name === word.name }
}

// Per-round time shrinks as the run goes on; floor keeps it playable.
export function stroopTimeMs(level: number): number {
  return Math.max(1200, 3500 - level * 110)
}

const BASE_POINTS = 60

export function stroopScore(remainingMs: number, level: number, streak: number): number {
  const speedBonus = 1 + Math.max(0, remainingMs) / stroopTimeMs(level) // 1..2
  const streakMult = 1 + streak * 0.1
  return Math.round(BASE_POINTS * speedBonus * streakMult)
}
