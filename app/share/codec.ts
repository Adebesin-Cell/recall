import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import { Run } from '~/game/types'

const VERSION = 1

export function encodeRun(run: Omit<Run, 'version'>): string {
  const tuple = [VERSION, run.seed, run.levelReached, run.score, run.streak]
  return compressToEncodedURIComponent(JSON.stringify(tuple))
}

export function decodeRun(encoded: string): Run | null {
  if (!encoded) return null
  try {
    const json = decompressFromEncodedURIComponent(encoded)
    if (!json) return null
    const tuple = JSON.parse(json)
    if (!Array.isArray(tuple)) return null
    const parsed = Run.safeParse({
      version: tuple[0],
      seed: tuple[1],
      levelReached: tuple[2],
      score: tuple[3],
      streak: tuple[4],
    })
    if (!parsed.success || parsed.data.version !== VERSION) return null
    return parsed.data
  }
  catch {
    return null
  }
}
