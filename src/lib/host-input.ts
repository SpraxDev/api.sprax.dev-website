export interface ParsedHostInput {
  host: string;
  port?: number;
}

/**
 * Splits a user-typed server address into host and optional port.
 *
 * Handles `host`, `host:port`, bare IPv6 addresses (`2001:db8::1` — multiple
 * colons, never treated as a port) and bracketed IPv6 (`[2001:db8::1]:25565`).
 * An unparsable port is ignored so the host is still pinged.
 */
export function parseHostInput(input: string): ParsedHostInput {
  const trimmed = input.trim();

  const bracketed = /^\[([^\]]+)\](?::(\d{1,5}))?$/.exec(trimmed);
  if (bracketed != null) {
    return withPort(bracketed[1], bracketed[2]);
  }

  // Two or more colons without brackets → a bare IPv6 address, no port
  const firstColon = trimmed.indexOf(':');
  if (firstColon !== -1 && trimmed.indexOf(':', firstColon + 1) !== -1) {
    return { host: trimmed };
  }

  const hostAndPort = /^(.+):(\d{1,5})$/.exec(trimmed);
  if (hostAndPort != null) {
    return withPort(hostAndPort[1], hostAndPort[2]);
  }
  return { host: trimmed };
}

function withPort(host: string, portText: string | undefined): ParsedHostInput {
  if (portText == null) {
    return { host };
  }
  const port = Number(portText);
  return port >= 1 && port <= 65535 ? { host, port } : { host };
}
