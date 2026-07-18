/**
 * Extracts the skin texture URL from a Mojang-style profile (the base64
 * `textures` property). Returns null when the profile has no skin.
 *
 * Mojang serves texture URLs with `http://` — they're rewritten to https so
 * they can be fed straight into the x-url render endpoints.
 */
export function extractSkinTextureUrl(profile: unknown): string | null {
  if (typeof profile !== 'object' || profile == null) return null;

  const properties = (profile as { properties?: unknown }).properties;
  if (!Array.isArray(properties)) return null;

  const textures = properties.find(
    (property): property is { name: string; value: string } =>
      typeof property === 'object' &&
      property != null &&
      (property as { name?: unknown }).name === 'textures' &&
      typeof (property as { value?: unknown }).value === 'string'
  );
  if (textures == null) return null;

  try {
    const decoded = JSON.parse(atob(textures.value));
    const url = decoded?.textures?.SKIN?.url;
    if (typeof url !== 'string' || url === '') return null;
    return url.replace(/^http:\/\//, 'https://');
  } catch {
    return null;
  }
}
