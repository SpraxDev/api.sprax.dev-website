import { describe, expect, it } from 'vitest';
import { bodyRenderUrl, serverPingUrl, skinByUrl3dRenderUrl, skinByUrlRenderUrl, skinUrl } from './api';

describe('render URL builders', () => {
  it('omits API defaults so URLs stay minimal', () => {
    expect(bodyRenderUrl('SpraxDev', { size: 128, overlay: true, download: false })).toBe(
      'https://api.sprax.dev/mc/v1/skin/SpraxDev/body?size=128'
    );
  });

  it('includes non-default parameters', () => {
    expect(bodyRenderUrl('SpraxDev', { size: 512, overlay: false, slim: true })).toBe(
      'https://api.sprax.dev/mc/v1/skin/SpraxDev/body?size=512&overlay=false&slim=true'
    );
    expect(skinUrl('SpraxDev', { download: true })).toBe(
      'https://api.sprax.dev/mc/v1/skin/SpraxDev?download=true'
    );
  });

  it('encodes the username', () => {
    expect(skinUrl('jeb_')).toBe('https://api.sprax.dev/mc/v1/skin/jeb_');
  });

  it('appends render params after the x-url query', () => {
    expect(skinByUrlRenderUrl('head', 'https://example.org/skin.png', { size: 64 })).toBe(
      'https://api.sprax.dev/mc/v1/skin/x-url/head?url=https%3A%2F%2Fexample.org%2Fskin.png&size=64'
    );
  });

  it('builds the 3d x-url path', () => {
    expect(skinByUrl3dRenderUrl('body', 'https://example.org/skin.png', { size: 128 })).toBe(
      'https://api.sprax.dev/mc/v1/skin/x-url/body/3d?url=https%3A%2F%2Fexample.org%2Fskin.png&size=128'
    );
  });

  it('adds the port to ping URLs only when given', () => {
    expect(serverPingUrl('mc.example.org')).toBe(
      'https://api.sprax.dev/mc/v2/server/ping?host=mc.example.org'
    );
    expect(serverPingUrl('mc.example.org', 25566)).toBe(
      'https://api.sprax.dev/mc/v2/server/ping?host=mc.example.org&port=25566'
    );
  });
});
