/**
 * Curated sample servers for the server cards — well-known, long-lived
 * networks that reliably answer pings (verified against the live API).
 */
export const SAMPLE_SERVERS: readonly string[] = [
  'mc.hypixel.net',
  'gommehd.net',
  '2b2t.org',
  'play.cubecraft.net',
  'wynncraft.com'
];

export function pickRandomSampleServer(): string {
  return SAMPLE_SERVERS[Math.floor(Math.random() * SAMPLE_SERVERS.length)];
}
