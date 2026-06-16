import { configForLevel, type LevelConfig, MAX_LEVEL } from './levelConfig'
import { numberForLevel } from './seed'
import { type Phase } from './types'

export interface GameState {
  phase: Phase
  level: number
  score: number
  streak: number
  seed: number
  current: string
  lastGained: number
  config: LevelConfig
}

const BASE_POINTS = 100

function scoreFor(config: LevelConfig, remainingMs: number, streak: number): number {
  const speedBonus = 1 + Math.max(0, remainingMs) / config.inputMs // 1..2
  const streakMult = 1 + streak * 0.1
  return Math.round(BASE_POINTS * config.digits * speedBonus * streakMult)
}

export function startGame(seed: number): GameState {
  const config = configForLevel(1)
  return {
    phase: 'memorize',
    level: 1,
    score: 0,
    streak: 0,
    seed,
    current: numberForLevel(seed, 1, config.digits),
    lastGained: 0,
    config,
  }
}

export function beginRecall(state: GameState): GameState {
  return { ...state, phase: 'recall' }
}

export function submit(state: GameState, value: string, remainingMs: number): GameState {
  if (value !== state.current) {
    return { ...state, phase: 'gameover' }
  }
  const gained = scoreFor(state.config, remainingMs, state.streak)
  return {
    ...state,
    phase: 'result',
    score: state.score + gained,
    lastGained: gained,
    streak: state.streak + 1,
  }
}

export function nextLevel(state: GameState): GameState {
  if (state.level >= MAX_LEVEL) {
    return { ...state, phase: 'won' }
  }
  const level = state.level + 1
  const config = configForLevel(level)
  return {
    ...state,
    phase: 'memorize',
    level,
    config,
    current: numberForLevel(state.seed, level, config.digits),
  }
}
