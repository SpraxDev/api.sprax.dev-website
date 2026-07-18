import { describe, expect, it } from 'vitest';
import { KNOWN_USERNAMES, pickRandomUsername } from './known-usernames';

describe('KNOWN_USERNAMES', () => {
  it('contains SpraxDev and only valid Minecraft usernames', () => {
    expect(KNOWN_USERNAMES).toContain('SpraxDev');
    for (const name of KNOWN_USERNAMES) {
      expect(name).toMatch(/^\w{3,16}$/);
    }
  });

  it('contains no duplicates', () => {
    expect(new Set(KNOWN_USERNAMES).size).toBe(KNOWN_USERNAMES.length);
  });
});

describe('pickRandomUsername', () => {
  it('returns a name from the curated list', () => {
    for (let i = 0; i < 50; ++i) {
      expect(KNOWN_USERNAMES).toContain(pickRandomUsername());
    }
  });

  it('never returns the excluded name', () => {
    for (const exclude of KNOWN_USERNAMES) {
      for (let i = 0; i < 25; ++i) {
        expect(pickRandomUsername(exclude)).not.toBe(exclude);
      }
    }
  });

  it('still returns a name when the excluded value is not in the list', () => {
    expect(KNOWN_USERNAMES).toContain(pickRandomUsername('NotInTheList'));
  });
});
