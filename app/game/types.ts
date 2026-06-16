import { z } from 'zod'

export const Phase = z.enum(['idle', 'memorize', 'recall', 'result', 'gameover', 'won'])
export type Phase = z.infer<typeof Phase>

export const Run = z.object({
  version: z.number(),
  seed: z.number(),
  levelReached: z.number(),
  score: z.number(),
  streak: z.number(),
})
export type Run = z.infer<typeof Run>
