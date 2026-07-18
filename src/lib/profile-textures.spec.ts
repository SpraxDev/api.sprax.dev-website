import { describe, expect, it } from 'vitest';
import { extractSkinTextureUrl } from './profile-textures';

function profileWith(textures: object): object {
  return {
    id: '955e4cf6411c40d1a1765bc8e03a8a9a',
    name: 'SpraxDev',
    properties: [{ name: 'textures', value: btoa(JSON.stringify(textures)) }]
  };
}

describe('extractSkinTextureUrl', () => {
  it('extracts the skin URL and upgrades it to https', () => {
    const profile = profileWith({
      textures: { SKIN: { url: 'http://textures.minecraft.net/texture/abc123' } }
    });
    expect(extractSkinTextureUrl(profile)).toBe('https://textures.minecraft.net/texture/abc123');
  });

  it('returns null when the profile has no skin', () => {
    expect(extractSkinTextureUrl(profileWith({ textures: {} }))).toBeNull();
  });

  it('returns null for malformed input', () => {
    expect(extractSkinTextureUrl(null)).toBeNull();
    expect(extractSkinTextureUrl({})).toBeNull();
    expect(extractSkinTextureUrl({ properties: [] })).toBeNull();
    expect(
      extractSkinTextureUrl({ properties: [{ name: 'textures', value: 'not-base64!!!' }] })
    ).toBeNull();
  });
});
