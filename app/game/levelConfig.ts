export interface LevelConfig {
  level: number
  digits: number
  memorizeMs: number
  inputMs: number
}

// Curve shape: +1 digit ~every 2 levels; both timers shrink each level.
// Tune freely — this table is the single source of difficulty.
export const LEVELS: LevelConfig[] = [
  { level: 1, digits: 3, memorizeMs: 4000, inputMs: 8000 },
  { level: 2, digits: 3, memorizeMs: 3750, inputMs: 7600 },
  { level: 3, digits: 4, memorizeMs: 3500, inputMs: 7100 },
  { level: 4, digits: 4, memorizeMs: 3250, inputMs: 6600 },
  { level: 5, digits: 5, memorizeMs: 3000, inputMs: 6000 },
  { level: 6, digits: 5, memorizeMs: 2800, inputMs: 5600 },
  { level: 7, digits: 6, memorizeMs: 2600, inputMs: 5200 },
  { level: 8, digits: 6, memorizeMs: 2400, inputMs: 4800 },
  { level: 9, digits: 7, memorizeMs: 2100, inputMs: 4400 },
  { level: 10, digits: 7, memorizeMs: 1800, inputMs: 4000 },
]

export const MAX_LEVEL = LEVELS.length

export function configForLevel(level: number): LevelConfig {
  const clamped = Math.min(Math.max(level, 1), MAX_LEVEL)
  return LEVELS[clamped - 1]!
}
