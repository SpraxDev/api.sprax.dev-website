import { describe, expect, it } from 'vitest';
import { abridgeStrings } from './abridge';

describe('abridgeStrings', () => {
  it('truncates long strings and keeps short ones', () => {
    expect(abridgeStrings('a'.repeat(50), 40)).toBe('a'.repeat(40) + '…');
    expect(abridgeStrings('short', 40)).toBe('short');
  });

  it('walks nested objects and arrays', () => {
    const input = {
      name: 'SpraxDev',
      properties: [{ value: 'x'.repeat(100) }]
    };
    expect(abridgeStrings(input, 10)).toEqual({
      name: 'SpraxDev',
      properties: [{ value: 'x'.repeat(10) + '…' }]
    });
  });

  it('leaves numbers, booleans and null untouched', () => {
    expect(abridgeStrings({ a: 1, b: true, c: null }, 5)).toEqual({ a: 1, b: true, c: null });
  });
});
