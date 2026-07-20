import { describe, expect, it } from 'vitest';
import { docsJsonLd, homeJsonLd, serializeJsonLd } from './structuredData';

type Node = Record<string, unknown> & { '@type': string; '@id': string };

const graphOf = (doc: unknown) => (doc as { '@graph': Node[] })['@graph'];
const byType = (doc: unknown, type: string) => {
  const node = graphOf(doc).find((n) => n['@type'] === type);
  if (!node) throw new Error(`no ${type} node`);
  return node;
};

describe('homeJsonLd', () => {
  it('is the canonical graph of WebSite, WebAPI and Person', () => {
    expect(graphOf(homeJsonLd).map((n) => n['@type'])).toEqual(['WebSite', 'WebAPI', 'Person']);
  });

  it('links the WebSite and WebAPI to the Person and to each other by @id', () => {
    const site = byType(homeJsonLd, 'WebSite');
    const api = byType(homeJsonLd, 'WebAPI');
    const person = byType(homeJsonLd, 'Person');

    expect(site.about).toEqual({ '@id': api['@id'] });
    expect(site.publisher).toEqual({ '@id': person['@id'] });
    expect(api.provider).toEqual({ '@id': person['@id'] });
    expect(api.documentation).toBe('https://api.sprax.dev/docs');
  });
});

describe('docsJsonLd', () => {
  it('leads with an APIReference describing the docs page', () => {
    const ref = byType(docsJsonLd, 'APIReference');
    expect(ref['@id']).toBe('https://api.sprax.dev/docs#docs');
    expect(ref.url).toBe('https://api.sprax.dev/docs');
  });

  it('points the APIReference back at the shared entities by @id', () => {
    const ref = byType(docsJsonLd, 'APIReference');
    const api = byType(homeJsonLd, 'WebAPI');
    const site = byType(homeJsonLd, 'WebSite');
    const person = byType(homeJsonLd, 'Person');

    expect(ref.about).toEqual({ '@id': api['@id'] });
    expect(ref.mainEntity).toEqual({ '@id': api['@id'] });
    expect(ref.isPartOf).toEqual({ '@id': site['@id'] });
    expect(ref.author).toEqual({ '@id': person['@id'] });
    expect(ref.publisher).toEqual({ '@id': person['@id'] });
  });

  it('stubs the shared entities consistently with their canonical nodes', () => {
    for (const type of ['WebSite', 'WebAPI', 'Person'] as const) {
      const stub = byType(docsJsonLd, type);
      const canonical = byType(homeJsonLd, type);

      expect(stub['@id']).toBe(canonical['@id']);
      expect(stub.name).toBe(canonical.name);
      expect(stub.url).toBe(canonical.url);
    }
  });

  it('keeps the Person alternateName and WebAPI documentation on the stubs', () => {
    expect(byType(docsJsonLd, 'Person').alternateName).toBe('SpraxDev');
    expect(byType(docsJsonLd, 'WebAPI').documentation).toBe('https://api.sprax.dev/docs');
  });
});

describe('serializeJsonLd', () => {
  it('round-trips as valid JSON', () => {
    expect(JSON.parse(serializeJsonLd(homeJsonLd))).toEqual(homeJsonLd);
    expect(JSON.parse(serializeJsonLd(docsJsonLd))).toEqual(docsJsonLd);
  });

  it('escapes every "<" so no value can close the script element', () => {
    const serialized = serializeJsonLd({ danger: '</script><script>alert(1)</script>' });
    expect(serialized).not.toContain('<');
    expect(serialized).toContain('\\u003c/script>');
  });
});
