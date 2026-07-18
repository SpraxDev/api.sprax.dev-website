/** URL builders for the live API. All data is fetched client-side (permissive CORS). */

export const API_BASE = 'https://api.sprax.dev';

export type SkinArea = 'head' | 'body';
export type CapeType = 'mojang' | 'optifine' | 'labymod';

export const CAPE_TYPES: readonly CapeType[] = ['mojang', 'optifine', 'labymod'];

export function uuidUrl(username: string): string {
  return `${API_BASE}/mc/v2/uuid/${encodeURIComponent(username)}`;
}

export function profileUrl(user: string): string {
  return `${API_BASE}/mc/v2/profile/${encodeURIComponent(user)}`;
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

export function skin3dRenderUrl(user: string, area: SkinArea, size?: number): string {
  return withSize(`${API_BASE}/mc/v1/skin/${encodeURIComponent(user)}/${area}/3d`, size);
}

export function capeUrl(type: CapeType, user: string): string {
  return `${API_BASE}/mc/v1/capes/${type}/${encodeURIComponent(user)}`;
}

export function capeRenderUrl(type: CapeType, user: string, size?: number): string {
  return withSize(`${API_BASE}/mc/v1/capes/${type}/${encodeURIComponent(user)}/render`, size);
}

export function skinByUrlRenderUrl(area: SkinArea, skinTextureUrl: string, size?: number): string {
  const url = `${API_BASE}/mc/v1/skin/x-url/${area}?url=${encodeURIComponent(skinTextureUrl)}`;
  return size != null ? `${url}&size=${size}` : url;
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
