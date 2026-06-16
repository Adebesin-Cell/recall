import { describe, expect, it } from 'vitest'
import { decodeRun, encodeRun } from '~/share/codec'

describe('run codec', () => {
  it('round-trips a run', () => {
    const encoded = encodeRun({ seed: 42, levelReached: 6, score: 2685, streak: 5 })
    expect(decodeRun(encoded)).toEqual({ version: 1, seed: 42, levelReached: 6, score: 2685, streak: 5 })
  })

  it('produces a URL-safe string', () => {
    const encoded = encodeRun({ seed: 1, levelReached: 1, score: 100, streak: 0 })
    expect(encoded).toBe(encodeURIComponent(encoded))
  })

  it('returns null for garbage input', () => {
    expect(decodeRun('!!!not-valid!!!')).toBeNull()
    expect(decodeRun('')).toBeNull()
  })

  it('returns null for an unknown version payload', async () => {
    // lz-string encoding of JSON [999, 1, 1, 1, 0]
    const { compressToEncodedURIComponent } = await import('lz-string')
    const bad = compressToEncodedURIComponent(JSON.stringify([999, 1, 1, 1, 0]))
    expect(decodeRun(bad)).toBeNull()
  })
})
