// Shared randomness helpers. A seeded RNG lets friends replay the exact same
// draw/quiz from a shared link (static site, no backend).

export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function newSeed(): string {
  return Math.floor(Math.random() * 36 ** 6)
    .toString(36)
    .padStart(6, '0');
}

export function rngFromSeed(seed: string): Rng {
  return mulberry32(hashString(seed));
}

export function pickRandom<T>(pool: T[], rng: Rng = Math.random): T {
  return pool[Math.floor(rng() * pool.length)];
}

export function shuffle<T>(items: T[], rng: Rng = Math.random): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function sample<T>(items: T[], count: number, rng: Rng = Math.random): T[] {
  return shuffle(items, rng).slice(0, count);
}

export function normalize(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .toLowerCase();
}

export function parsePlayerNames(raw: string, max = 10): string[] {
  const seen = new Set<string>();
  return raw
    .split(/[\n,;]+/)
    .map(name => name.trim().slice(0, 20))
    .filter(name => {
      if (!name || seen.has(name.toLowerCase())) return false;
      seen.add(name.toLowerCase());
      return true;
    })
    .slice(0, max);
}

/** Copy text, falling back to the native share sheet on mobile. */
export async function shareOrCopy(text: string, url: string): Promise<'shared' | 'copied' | 'failed'> {
  if (typeof navigator === 'undefined') return 'failed';
  if (navigator.share) {
    try {
      await navigator.share({ text, url });
      return 'shared';
    } catch {
      // user cancelled — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return 'copied';
  } catch {
    return 'failed';
  }
}
