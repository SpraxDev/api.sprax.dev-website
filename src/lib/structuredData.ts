import type { APIReference, Graph, Person, WebAPI, WebSite } from 'schema-dts';

/**
 * schema.org JSON-LD graphs for the site's pages. All content is static and
 * curated (the site is prerendered and username-agnostic).
 *
 * The identity of each shared entity (`@id`, `name`, `url`) lives in a single
 * constant below, referenced by both the canonical, fully-detailed node (home
 * page) and its stub (docs page), so the two pages can never disagree.
 * Consumers consolidate nodes across the site by matching `@id`.
 */

const SITE_ORIGIN = 'https://api.sprax.dev';
const DOCS_URL = `${SITE_ORIGIN}/docs`;

const WEBSITE = {
  id: `${SITE_ORIGIN}/#website`,
  name: 'SpraxAPI',
  url: `${SITE_ORIGIN}/`
};
const API = {
  id: `${SITE_ORIGIN}/#api`,
  name: 'SpraxAPI — Minecraft data API',
  url: `${SITE_ORIGIN}/`
};
const PERSON = {
  id: 'https://github.com/SpraxDev#person',
  name: 'Christian Koop',
  alternateName: 'SpraxDev',
  url: 'https://github.com/SpraxDev'
};

const person: Person = {
  '@type': 'Person',
  '@id': PERSON.id,
  name: PERSON.name,
  alternateName: PERSON.alternateName,
  url: PERSON.url
};

const website: WebSite = {
  '@type': 'WebSite',
  '@id': WEBSITE.id,
  url: WEBSITE.url,
  name: WEBSITE.name,
  description:
    'Free public Minecraft REST API: profiles, UUIDs, skin renders, capes, server pings and Mojang blocklist tracking. No API key required.',
  inLanguage: 'en',
  publisher: { '@id': PERSON.id },
  about: { '@id': API.id }
};

const webApi: WebAPI = {
  '@type': 'WebAPI',
  '@id': API.id,
  name: API.name,
  description:
    'Free public REST API for Minecraft data: player profiles, UUIDs, skin and cape renders, server pings and Mojang server-blocklist tracking. Plain HTTPS GET requests, no API key or signup; a descriptive User-Agent is required.',
  url: API.url,
  documentation: DOCS_URL,
  termsOfService: `${SITE_ORIGIN}/`,
  provider: { '@id': PERSON.id },
  audience: {
    '@type': 'Audience',
    audienceType: 'Developers'
  }
};

/** The docs page itself: the human-readable API reference document. */
const apiReference: APIReference = {
  '@type': 'APIReference',
  '@id': `${DOCS_URL}#docs`,
  name: 'SpraxAPI — API reference',
  headline: 'Interactive API reference for api.sprax.dev',
  description:
    'Interactive API reference for api.sprax.dev — Minecraft profiles, skins, capes, server pings and blocklist data.',
  url: DOCS_URL,
  inLanguage: 'en',
  about: { '@id': API.id },
  mainEntity: { '@id': API.id },
  isPartOf: { '@id': WEBSITE.id },
  author: { '@id': PERSON.id },
  publisher: { '@id': PERSON.id }
};

/** Home page: the canonical, fully-detailed entity graph. */
export const homeJsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [website, webApi, person]
};

/**
 * Docs page: the full `APIReference` node, plus minimal stubs of the shared
 * entities (same identity constants as the canonical nodes) so the page also
 * parses in isolation without contradicting the home page.
 */
export const docsJsonLd: Graph = {
  '@context': 'https://schema.org',
  '@graph': [
    apiReference,
    {
      '@type': 'WebAPI',
      '@id': API.id,
      name: API.name,
      url: API.url,
      documentation: DOCS_URL
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE.id,
      name: WEBSITE.name,
      url: WEBSITE.url
    },
    {
      '@type': 'Person',
      '@id': PERSON.id,
      name: PERSON.name,
      alternateName: PERSON.alternateName,
      url: PERSON.url
    }
  ]
};

/**
 * JSON for a `<script type="application/ld+json">` body, with `<` escaped so no
 * value can prematurely close the script element (`</script>` breakout).
 */
export function serializeJsonLd(graph: object): string {
  return JSON.stringify(graph).replace(/</g, '\\u003c');
}
