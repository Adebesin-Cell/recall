import { mulberry32 } from './seed'

// Six-letter base words used to seed each round (always solvable: the base
// itself is a valid answer). Chosen to be anagram-rich.
export const BASES = [
  'PLANET', 'GARDEN', 'MASTER', 'STREAM', 'FRIEND', 'ORANGE', 'SILVER', 'MARKET',
  'WINTER', 'DANGER', 'RANDOM', 'PURPLE', 'MEMORY', 'ACTION', 'NUMBER', 'LETTER',
  'SECOND', 'REASON', 'OBJECT', 'SIMPLE', 'CASTLE', 'BRANCH', 'CIRCLE', 'FLOWER',
  'ISLAND', 'JUNGLE', 'KITTEN', 'LITTLE', 'MOTHER', 'PEOPLE', 'ROCKET', 'SPRING',
]

// Common short words so sub-word answers also validate. Bases are added below.
const COMMON = [
  'ace', 'act', 'age', 'ago', 'aid', 'aim', 'air', 'ale', 'all', 'and', 'ant', 'any', 'ape', 'apt', 'arc', 'are', 'ark', 'arm', 'art', 'ash', 'ate',
  'bad', 'bag', 'ban', 'bar', 'bat', 'bay', 'bed', 'bee', 'beg', 'bet', 'bid', 'big', 'bin', 'bit', 'boa', 'bog', 'bow', 'box', 'boy', 'bud', 'bug', 'bun', 'bus', 'but', 'buy',
  'cab', 'can', 'cap', 'car', 'cat', 'cob', 'cod', 'cog', 'cop', 'cot', 'cow', 'cry', 'cub', 'cue', 'cup', 'cut',
  'dad', 'dam', 'day', 'den', 'dew', 'did', 'die', 'dig', 'dim', 'dip', 'dog', 'don', 'dot', 'dry', 'dub', 'due', 'dug',
  'ear', 'eat', 'egg', 'ego', 'elf', 'elk', 'elm', 'end', 'era', 'eye',
  'fan', 'far', 'fat', 'fed', 'fee', 'few', 'fig', 'fin', 'fit', 'fix', 'fly', 'foe', 'fog', 'for', 'fox', 'fry', 'fun', 'fur',
  'gap', 'gas', 'gem', 'get', 'gin', 'god', 'got', 'gum', 'gun', 'gut', 'guy', 'gym',
  'had', 'ham', 'has', 'hat', 'hay', 'hen', 'her', 'hid', 'him', 'hip', 'his', 'hit', 'hog', 'hop', 'hot', 'how', 'hub', 'hue', 'hug', 'hut',
  'ice', 'ill', 'ink', 'inn', 'ion', 'its', 'ivy',
  'jam', 'jar', 'jaw', 'jet', 'job', 'jog', 'joy', 'jug',
  'keg', 'key', 'kid', 'kin', 'kit',
  'lab', 'lad', 'lag', 'lap', 'law', 'lay', 'led', 'leg', 'let', 'lid', 'lie', 'lip', 'lit', 'log', 'lot', 'low',
  'mad', 'man', 'map', 'mat', 'men', 'met', 'mix', 'mob', 'mod', 'mom', 'mop', 'mud', 'mug', 'mum',
  'nab', 'nag', 'nap', 'net', 'new', 'nip', 'nod', 'nor', 'not', 'now', 'nun', 'nut',
  'oak', 'oar', 'oat', 'odd', 'off', 'oil', 'old', 'one', 'orb', 'ore', 'our', 'out', 'owe', 'owl', 'own',
  'pad', 'pan', 'par', 'pat', 'paw', 'pay', 'pea', 'peg', 'pen', 'pet', 'pie', 'pig', 'pin', 'pit', 'ply', 'pod', 'pop', 'pot', 'pry', 'pub', 'pun', 'pup', 'put',
  'rag', 'ram', 'ran', 'rap', 'rat', 'raw', 'ray', 'red', 'rib', 'rid', 'rim', 'rip', 'rob', 'rod', 'rot', 'row', 'rub', 'rug', 'rum', 'run', 'rye',
  'sad', 'sag', 'sat', 'saw', 'say', 'sea', 'see', 'set', 'she', 'shy', 'sin', 'sip', 'sir', 'sit', 'six', 'ski', 'sky', 'sly', 'sob', 'son', 'sow', 'spa', 'spy', 'sub', 'sue', 'sum', 'sun',
  'tab', 'tag', 'tan', 'tap', 'tar', 'tax', 'tea', 'ten', 'the', 'tie', 'tin', 'tip', 'toe', 'ton', 'too', 'top', 'toy', 'try', 'tub', 'tug',
  'urn', 'use',
  'van', 'vat', 'vet', 'via', 'vow',
  'wag', 'war', 'was', 'wax', 'way', 'web', 'wed', 'wet', 'who', 'why', 'wig', 'win', 'wit', 'wok', 'won',
  'yak', 'yam', 'yes', 'yet', 'you',
  'zap', 'zip', 'zoo',
  'acre', 'aim', 'alert', 'alien', 'amber', 'angle', 'ankle', 'apple', 'arena', 'armor',
  'baker', 'beard', 'beast', 'brain', 'bread', 'cabin', 'cable', 'camel', 'canoe', 'cargo',
  'crane', 'cream', 'crime', 'eagle', 'earth', 'enter', 'flame', 'flora', 'frame', 'glare',
  'grain', 'grape', 'grasp', 'great', 'green', 'heart', 'inner', 'large', 'laser', 'learn',
  'least', 'metal', 'miner', 'motor', 'mount', 'noble', 'ocean', 'organ', 'panel', 'paper',
  'plane', 'plant', 'plate', 'react', 'realm', 'rinse', 'river', 'roast', 'robin', 'rocky',
  'scale', 'scare', 'scorn', 'sense', 'sided', 'siren', 'slate', 'smart', 'snore', 'sober',
  'solar', 'sonar', 'spare', 'stale', 'stare', 'steam', 'steal', 'stone', 'store', 'tales',
  'tamer', 'tiger', 'timer', 'trace', 'trade', 'train', 'tread', 'trend', 'verse', 'water',
]

export const DICTIONARY: Set<string> = new Set([
  ...BASES.map(w => w.toLowerCase()),
  ...COMMON,
])

export function baseForLevel(seed: number, level: number): string {
  const rng = mulberry32((seed + level * 2654435761) >>> 0)
  return BASES[Math.floor(rng() * BASES.length)]!
}

// Deterministic Fisher-Yates shuffle of the base word's letters.
export function lettersForLevel(seed: number, level: number): string[] {
  const rng = mulberry32(((seed ^ 0x9e3779b9) + level * 40503) >>> 0)
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

export function isValidWord(word: string, letters: string[]): boolean {
  const w = word.trim().toLowerCase()
  return w.length >= 3 && DICTIONARY.has(w) && canForm(w, letters)
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
