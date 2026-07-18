import { describe, expect, it } from 'vitest';
import { parseMotd, stripLegacyCodes } from './motd';

describe('parseMotd', () => {
  it('parses a legacy string with color codes (Hypixel-style)', () => {
    const lines = parseMotd('§aHypixel Network §c[1.8]\n§3§lSB 0.26');

    expect(lines).toHaveLength(2);
    expect(lines[0]).toEqual([
      { text: 'Hypixel Network ', color: '#55ff55' },
      { text: '[1.8]', color: '#ff5555' }
    ]);
    expect(lines[1]).toEqual([{ text: 'SB 0.26', color: '#00aaaa', bold: true }]);
  });

  it('resets formatting when a color code follows formatting codes', () => {
    const [line] = parseMotd('§lbold §athen green');
    expect(line).toEqual([
      { text: 'bold ', bold: true },
      { text: 'then green', color: '#55ff55' }
    ]);
  });

  it('parses a chat component tree with named and hex colors (2b2t/GommeHD-style)', () => {
    const lines = parseMotd({
      text: '',
      extra: [
        { bold: true, color: 'gray', text: '2B ' },
        { color: 'gold', text: 'Updated' },
        '\n',
        { color: '#ffd900', text: 'G' }
      ]
    });

    expect(lines).toHaveLength(2);
    expect(lines[0]).toEqual([
      { text: '2B ', color: '#aaaaaa', bold: true },
      { text: 'Updated', color: '#ffaa00' }
    ]);
    expect(lines[1]).toEqual([{ text: 'G', color: '#ffd900' }]);
  });

  it('inherits parent styles into nested extras', () => {
    const [line] = parseMotd({
      bold: true,
      extra: [{ color: 'red', extra: [{ text: 'nested' }] }]
    });
    expect(line).toEqual([{ text: 'nested', color: '#ff5555', bold: true }]);
  });

  it('skips non-text components (sprite/atlas entries)', () => {
    const [line] = parseMotd({
      extra: [{ color: 'white', atlas: 'minecraft:items', sprite: 'minecraft:item/x' }, 'plain']
    });
    expect(line).toEqual([{ text: 'plain' }]);
  });

  it('parses legacy codes inside component text', () => {
    const [line] = parseMotd({ text: '§eyellow', color: 'red' });
    expect(line).toEqual([{ text: 'yellow', color: '#ffff55' }]);
  });

  it('returns a single empty line for empty input', () => {
    expect(parseMotd('')).toEqual([[]]);
    expect(parseMotd(undefined)).toEqual([[]]);
  });

  it('trims trailing whitespace per line but keeps leading whitespace (Wynncraft-style padding)', () => {
    const lines = parseMotd('  §acentered   \n§btext §7   ');
    expect(lines).toEqual([
      [{ text: '  ' }, { text: 'centered', color: '#55ff55' }],
      [{ text: 'text', color: '#55ffff' }]
    ]);
  });
});

describe('stripLegacyCodes', () => {
  it('removes all § codes', () => {
    expect(stripLegacyCodes('§f§f§fWe support: 1.20-1.21')).toBe('We support: 1.20-1.21');
  });
});
