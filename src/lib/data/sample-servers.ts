/**
 * Curated sample servers for the server cards — well-known, long-lived
 * networks that reliably answer pings (verified against the live API).
 */
export const SAMPLE_SERVERS: readonly string[] = [
  'mc.hypixel.net',
  'wynncraft.com',
  '2b2t.org',
  'mc-auth.com',
  'visit.uncensoredlibrary.com',
];

export function pickRandomSampleServer(): string {
  return SAMPLE_SERVERS[Math.floor(Math.random() * SAMPLE_SERVERS.length)];
}

let initialPick: string | undefined;

/**
 * The random sample server picked once per page load — the ping and
 * blocklist cards share it so they both start on the same server.
 */
export function initialSampleServer(): string {
  initialPick ??= pickRandomSampleServer();
  return initialPick;
}
