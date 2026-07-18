/**
 * Curated "known good" usernames used as the initial value of the global
 * username input and by the randomize button. Picks should be well-known,
 * long-lived accounts with visually interesting skins or capes.
 */
export const KNOWN_USERNAMES: readonly string[] = [
  'SpraxDev',
  'Notch',
  'jeb_',
  'Dinnerbone',
  'Grumm',
  'Technoblade',
  'Hypixel',
  'CaptainSparklez',
  'Dream',
  'GeorgeNotFound',
  'Grian',
  'MumboJumbo',
  'Ph1LzA'
];

/**
 * Picks a random username from {@link KNOWN_USERNAMES}. When `exclude` is
 * given (e.g. the currently shown name), the result is guaranteed to differ
 * from it, so a re-roll always visibly changes the page.
 */
export function pickRandomUsername(exclude?: string): string {
  const pool = KNOWN_USERNAMES.filter((name) => name !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}
