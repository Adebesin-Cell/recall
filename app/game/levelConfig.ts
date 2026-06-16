export interface LevelConfig {
  level: number
  digits: number
  memorizeMs: number
  inputMs: number
}

// Curve shape: +1 digit ~every 2 levels; both timers shrink each level.
// Tune freely — this table is the single source of difficulty.
export const LEVELS: LevelConfig[] = [
  { level: 1, digits: 3, memorizeMs: 3000, inputMs: 6000 },
  { level: 2, digits: 4, memorizeMs: 2800, inputMs: 5400 },
  { level: 3, digits: 4, memorizeMs: 2500, inputMs: 4800 },
  { level: 4, digits: 5, memorizeMs: 2300, inputMs: 4400 },
  { level: 5, digits: 5, memorizeMs: 2000, inputMs: 4000 },
  { level: 6, digits: 6, memorizeMs: 1800, inputMs: 3600 },
  { level: 7, digits: 6, memorizeMs: 1600, inputMs: 3200 },
  { level: 8, digits: 7, memorizeMs: 1400, inputMs: 2800 },
  { level: 9, digits: 7, memorizeMs: 1200, inputMs: 2400 },
  { level: 10, digits: 7, memorizeMs: 1000, inputMs: 2000 },
]

export const MAX_LEVEL = LEVELS.length

export function configForLevel(level: number): LevelConfig {
  const clamped = Math.min(Math.max(level, 1), MAX_LEVEL)
  return LEVELS[clamped - 1]!
}
