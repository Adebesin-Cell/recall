// Deterministic PRNG (mulberry32) so a seed fully reproduces a run's sequence.
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Distinct stream per level via a large odd multiplier offset.
export function numberForLevel(seed: number, level: number, digits: number): string {
  const rng = mulberry32((seed + level * 2654435761) >>> 0)
  let out = String(1 + Math.floor(rng() * 9)) // first digit 1-9
  for (let i = 1; i < digits; i++) out += String(Math.floor(rng() * 10))
  return out
}
