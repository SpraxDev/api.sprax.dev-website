/** URL builders for the live API. All data is fetched client-side (permissive CORS). */

export const API_BASE = 'https://api.sprax.dev';

export type SkinArea = 'head' | 'body';
export type CapeType = 'mojang' | 'optifine' | 'labymod';

export const CAPE_TYPES: readonly CapeType[] = ['mojang', 'optifine', 'labymod'];

/**
 * Query parameters of the skin/render endpoints. API defaults (overlay on,
 * auto-detected model, no download) are omitted from built URLs so the
 * copyable URLs stay minimal.
 */
export interface RenderParams {
  size?: number;
  overlay?: boolean;
  /** true = slim ("Alex") arms, false = classic ("Steve"); omit to auto-detect */
  slim?: boolean;
  download?: boolean;
}

export function uuidUrl(username: string): string {
  return `${API_BASE}/mc/v2/uuid/${encodeURIComponent(username)}`;
}

export function profileUrl(user: string): string {
  return `${API_BASE}/mc/v2/profile/${encodeURIComponent(user)}`;
}

// Skin endpoints use v1 — v2 does not officially exist for skins yet.
// Switch to /mc/v2/skin/... once it ships.
export function skinUrl(user: string, params?: RenderParams): string {
  return `${API_BASE}/mc/v1/skin/${encodeURIComponent(user)}${renderQuery(params)}`;
}

export function headRenderUrl(user: string, params?: RenderParams): string {
  return `${API_BASE}/mc/v1/skin/${encodeURIComponent(user)}/head${renderQuery(params)}`;
}

export function bodyRenderUrl(user: string, params?: RenderParams): string {
  return `${API_BASE}/mc/v1/skin/${encodeURIComponent(user)}/body${renderQuery(params)}`;
}

export function skin3dRenderUrl(user: string, area: SkinArea, params?: RenderParams): string {
  return `${API_BASE}/mc/v1/skin/${encodeURIComponent(user)}/${area}/3d${renderQuery(params)}`;
}

export function capeUrl(type: CapeType, user: string): string {
  return `${API_BASE}/mc/v1/capes/${type}/${encodeURIComponent(user)}`;
}

export function capeRenderUrl(type: CapeType, user: string, size?: number): string {
  return `${API_BASE}/mc/v1/capes/${type}/${encodeURIComponent(user)}/render${renderQuery({ size })}`;
}

export function skinByUrlRenderUrl(
  area: SkinArea,
  skinTextureUrl: string,
  params?: RenderParams
): string {
  return xUrlRenderUrl(area, skinTextureUrl, params);
}

export function skinByUrl3dRenderUrl(
  area: SkinArea,
  skinTextureUrl: string,
  params?: RenderParams
): string {
  return xUrlRenderUrl(`${area}/3d`, skinTextureUrl, params);
}

function xUrlRenderUrl(path: string, skinTextureUrl: string, params?: RenderParams): string {
  const extraQuery = renderQuery(params).replace(/^\?/, '');
  const url = `${API_BASE}/mc/v1/skin/x-url/${path}?url=${encodeURIComponent(skinTextureUrl)}`;
  return extraQuery === '' ? url : `${url}&${extraQuery}`;
}

export function serverPingUrl(host: string, port?: number): string {
  const url = `${API_BASE}/mc/v2/server/ping?host=${encodeURIComponent(host)}`;
  return port != null ? `${url}&port=${port}` : url;
}

export function blocklistCheckUrl(host: string): string {
  return `${API_BASE}/mc/v2/server/blocklist/check?host=${encodeURIComponent(host)}`;
}

function renderQuery(params: RenderParams = {}): string {
  const query = new URLSearchParams();
  if (params.size != null) {
    query.set('size', String(params.size));
  }
  if (params.overlay === false) {
    query.set('overlay', 'false');
  }
  if (params.slim != null) {
    query.set('slim', String(params.slim));
  }
  if (params.download === true) {
    query.set('download', 'true');
  }
  const encoded = query.toString();
  return encoded === '' ? '' : `?${encoded}`;
}
