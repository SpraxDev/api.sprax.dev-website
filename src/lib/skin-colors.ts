/**
 * Dominant-color extraction for the "skin-lit" ambient glow: the current
 * player's skin is sampled client-side and its dominant colors drive the
 * page's glow custom properties.
 */

interface Bucket {
  n: number;
  r: number;
  g: number;
  b: number;
}

/**
 * Extracts up to `count` dominant colors from raw RGBA pixel data.
 * Transparent pixels are ignored; saturated colors are favored over greys so
 * the glow picks up a skin's character colors, and picked colors are forced
 * to be visually distinct from each other.
 */
export function extractDominantColors(rgba: Uint8ClampedArray, count = 2): string[] {
  // Quantize to 8 levels per channel (512 buckets), averaging the true color
  // per bucket so the result is not posterized.
  const buckets = new Map<number, Bucket>();
  for (let i = 0; i + 3 < rgba.length; i += 4) {
    if (rgba[i + 3] < 128) continue;
    const r = rgba[i];
    const g = rgba[i + 1];
    const b = rgba[i + 2];
    const key = ((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5);
    let bucket = buckets.get(key);
    if (bucket == null) {
      bucket = { n: 0, r: 0, g: 0, b: 0 };
      buckets.set(key, bucket);
    }
    ++bucket.n;
    bucket.r += r;
    bucket.g += g;
    bucket.b += b;
  }

  const candidates = Array.from(buckets.values(), (bucket) => {
    const r = bucket.r / bucket.n;
    const g = bucket.g / bucket.n;
    const b = bucket.b / bucket.n;
    const max = Math.max(r, g, b);
    const saturation = max === 0 ? 0 : (max - Math.min(r, g, b)) / max;
    // Near-black barely glows; saturated areas beat large grey ones.
    const darknessPenalty = max < 48 ? 0.25 : 1;
    return { r, g, b, score: bucket.n * (0.15 + saturation) * darknessPenalty };
  }).sort((a, b) => b.score - a.score);

  const picked: typeof candidates = [];
  for (const candidate of candidates) {
    if (picked.length >= count) break;
    const isDistinct = picked.every(
      (p) => Math.hypot(p.r - candidate.r, p.g - candidate.g, p.b - candidate.b) > 80
    );
    if (isDistinct) picked.push(candidate);
  }
  return picked.map((c) => toHex(c.r, c.g, c.b));
}

function toHex(r: number, g: number, b: number): string {
  const channel = (value: number) => Math.round(value).toString(16).padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** Loads an image (CORS-enabled) and extracts its dominant colors. Browser only. */
export async function extractImagePalette(url: string, count = 2): Promise<string[]> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = url;
  await image.decode();

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;
  const context = canvas.getContext('2d');
  if (context == null) return [];

  context.drawImage(image, 0, 0);
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  return extractDominantColors(data, count);
}
