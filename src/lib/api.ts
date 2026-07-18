/** URL builders for the live API. All data is fetched client-side (permissive CORS). */

export const API_BASE = 'https://api.sprax.dev';

export function uuidUrl(username: string): string {
  return `${API_BASE}/mc/v2/uuid/${encodeURIComponent(username)}`;
}

// Skin endpoints use v1 — v2 does not officially exist for skins yet.
// Switch to /mc/v2/skin/... once it ships.
export function skinUrl(user: string): string {
  return `${API_BASE}/mc/v1/skin/${encodeURIComponent(user)}`;
}

export function headRenderUrl(user: string, size?: number): string {
  return withSize(`${API_BASE}/mc/v1/skin/${encodeURIComponent(user)}/head`, size);
}

export function bodyRenderUrl(user: string, size?: number): string {
  return withSize(`${API_BASE}/mc/v1/skin/${encodeURIComponent(user)}/body`, size);
}

export function serverPingUrl(host: string): string {
  return `${API_BASE}/mc/v2/server/ping?host=${encodeURIComponent(host)}`;
}

export function blocklistCheckUrl(host: string): string {
  return `${API_BASE}/mc/v2/server/blocklist/check?host=${encodeURIComponent(host)}`;
}

function withSize(url: string, size?: number): string {
  return size != null ? `${url}?size=${size}` : url;
}
