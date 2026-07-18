/**
 * Renders Minecraft server MOTDs ("description" in a ping response) into
 * styled spans. Servers send either a legacy string with `§`-formatting codes
 * or a chat-component tree (nested `extra`, named/hex colors, style flags) —
 * often a mix: component text can itself contain legacy codes.
 */

export interface MotdSpan {
  text: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underlined?: boolean;
  strikethrough?: boolean;
  obfuscated?: boolean;
}

type MotdStyle = Omit<MotdSpan, 'text'>;

interface ChatComponent {
  text?: unknown;
  extra?: unknown;
  color?: unknown;
  bold?: unknown;
  italic?: unknown;
  underlined?: unknown;
  strikethrough?: unknown;
  obfuscated?: unknown;
}

/** In-game colors of the 16 legacy color codes (`§0`–`§f`). */
const LEGACY_COLORS: Readonly<Record<string, string>> = {
  '0': '#000000',
  '1': '#0000aa',
  '2': '#00aa00',
  '3': '#00aaaa',
  '4': '#aa0000',
  '5': '#aa00aa',
  '6': '#ffaa00',
  '7': '#aaaaaa',
  '8': '#555555',
  '9': '#5555ff',
  a: '#55ff55',
  b: '#55ffff',
  c: '#ff5555',
  d: '#ff55ff',
  e: '#ffff55',
  f: '#ffffff'
};

const NAMED_COLORS: Readonly<Record<string, string>> = {
  black: LEGACY_COLORS['0'],
  dark_blue: LEGACY_COLORS['1'],
  dark_green: LEGACY_COLORS['2'],
  dark_aqua: LEGACY_COLORS['3'],
  dark_red: LEGACY_COLORS['4'],
  dark_purple: LEGACY_COLORS['5'],
  gold: LEGACY_COLORS['6'],
  gray: LEGACY_COLORS['7'],
  dark_gray: LEGACY_COLORS['8'],
  blue: LEGACY_COLORS['9'],
  green: LEGACY_COLORS['a'],
  aqua: LEGACY_COLORS['b'],
  red: LEGACY_COLORS['c'],
  light_purple: LEGACY_COLORS['d'],
  yellow: LEGACY_COLORS['e'],
  white: LEGACY_COLORS['f']
};

/**
 * Parses a ping response's `description` into lines of styled spans.
 * Unknown/non-text components (e.g. sprite components) are skipped.
 */
export function parseMotd(description: unknown): MotdSpan[][] {
  const spans: MotdSpan[] = [];
  collectSpans(description, {}, spans);
  return splitIntoLines(spans);
}

/** Removes legacy `§x` formatting codes, e.g. for plain-text version names. */
export function stripLegacyCodes(text: string): string {
  return text.replace(/§./g, '');
}

function collectSpans(component: unknown, inherited: MotdStyle, out: MotdSpan[]): void {
  if (typeof component === 'string') {
    out.push(...parseLegacyText(component, inherited));
    return;
  }
  if (typeof component !== 'object' || component == null) {
    return;
  }

  const chat = component as ChatComponent;
  const style: MotdStyle = {
    color: parseColor(chat.color) ?? inherited.color,
    bold: parseFlag(chat.bold) ?? inherited.bold,
    italic: parseFlag(chat.italic) ?? inherited.italic,
    underlined: parseFlag(chat.underlined) ?? inherited.underlined,
    strikethrough: parseFlag(chat.strikethrough) ?? inherited.strikethrough,
    obfuscated: parseFlag(chat.obfuscated) ?? inherited.obfuscated
  };

  if (typeof chat.text === 'string' && chat.text !== '') {
    out.push(...parseLegacyText(chat.text, style));
  }
  if (Array.isArray(chat.extra)) {
    for (const child of chat.extra) {
      collectSpans(child, style, out);
    }
  }
}

/** Parses a raw string honoring legacy `§` codes, starting from `base` style. */
function parseLegacyText(text: string, base: MotdStyle): MotdSpan[] {
  const spans: MotdSpan[] = [];
  let style: MotdStyle = { ...base };
  let buffer = '';

  const flush = () => {
    if (buffer !== '') {
      spans.push({ text: buffer, ...style });
      buffer = '';
    }
  };

  for (let i = 0; i < text.length; ++i) {
    if (text[i] === '§' && i + 1 < text.length) {
      const code = text[i + 1].toLowerCase();
      ++i;
      flush();
      if (code in LEGACY_COLORS) {
        // A color code also resets all formatting (vanilla behavior)
        style = { color: LEGACY_COLORS[code] };
      } else if (code === 'l') {
        style.bold = true;
      } else if (code === 'o') {
        style.italic = true;
      } else if (code === 'n') {
        style.underlined = true;
      } else if (code === 'm') {
        style.strikethrough = true;
      } else if (code === 'k') {
        style.obfuscated = true;
      } else if (code === 'r') {
        style = { ...base };
      }
      // Unknown codes are dropped silently
      continue;
    }
    buffer += text[i];
  }
  flush();
  return spans;
}

function parseColor(color: unknown): string | undefined {
  if (typeof color !== 'string') {
    return undefined;
  }
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    return color.toLowerCase();
  }
  return NAMED_COLORS[color];
}

function parseFlag(flag: unknown): boolean | undefined {
  return typeof flag === 'boolean' ? flag : undefined;
}

function splitIntoLines(spans: MotdSpan[]): MotdSpan[][] {
  const lines: MotdSpan[][] = [[]];
  for (const span of spans) {
    const parts = span.text.split('\n');
    for (let i = 0; i < parts.length; ++i) {
      if (i > 0) {
        lines.push([]);
      }
      if (parts[i] !== '') {
        lines[lines.length - 1].push({ ...span, text: parts[i] });
      }
    }
  }
  for (const line of lines) {
    trimLineEnd(line);
  }
  return lines;
}

/**
 * Drops trailing whitespace from a line (some MOTDs pad lines with dozens of
 * spaces, which would needlessly widen the rendered box). Leading whitespace
 * is kept — servers use it for centering.
 */
function trimLineEnd(line: MotdSpan[]): void {
  while (line.length > 0) {
    const last = line[line.length - 1];
    last.text = last.text.replace(/\s+$/, '');
    if (last.text !== '') {
      return;
    }
    line.pop();
  }
}
