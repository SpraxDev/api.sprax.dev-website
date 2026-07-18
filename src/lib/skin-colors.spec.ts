import { describe, expect, it } from 'vitest';
import { extractDominantColors } from './skin-colors';

function pixels(...colors: [r: number, g: number, b: number, a: number, count: number][]): Uint8ClampedArray {
  const out: number[] = [];
  for (const [r, g, b, a, count] of colors) {
    for (let i = 0; i < count; ++i) {
      out.push(r, g, b, a);
    }
  }
  return new Uint8ClampedArray(out);
}

describe('extractDominantColors', () => {
  it('returns the most common color first', () => {
    const data = pixels([200, 16, 16, 255, 100], [16, 16, 200, 255, 30]);
    expect(extractDominantColors(data, 2)).toEqual(['#c81010', '#1010c8']);
  });

  it('ignores transparent pixels', () => {
    const data = pixels([0, 255, 0, 0, 1000], [200, 16, 16, 255, 10]);
    expect(extractDominantColors(data, 2)).toEqual(['#c81010']);
  });

  it('favors a saturated color over a slightly larger grey area', () => {
    const data = pixels([128, 128, 128, 255, 120], [220, 60, 20, 255, 100]);
    expect(extractDominantColors(data, 1)).toEqual(['#dc3c14']);
  });

  it('skips near-duplicate shades when picking multiple colors', () => {
    const data = pixels([200, 16, 16, 255, 100], [210, 40, 40, 255, 90], [16, 16, 200, 255, 30]);
    const [first, second] = extractDominantColors(data, 2);
    expect(first).toMatch(/^#[0-9a-f]{6}$/);
    expect(second).toBe('#1010c8');
  });

  it('returns an empty array for fully transparent input', () => {
    expect(extractDominantColors(pixels([255, 255, 255, 0, 64]))).toEqual([]);
  });
});
