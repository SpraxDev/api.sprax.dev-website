<script lang="ts">
  import { resolve } from '$app/paths';
  import { skinUrl } from '$lib/api';
  import Hero from '$lib/components/Hero.svelte';
  import BlocklistCheckCard from '$lib/components/cards/BlocklistCheckCard.svelte';
  import CapesCard from '$lib/components/cards/CapesCard.svelte';
  import ProfileCard from '$lib/components/cards/ProfileCard.svelte';
  import RenderCard from '$lib/components/cards/RenderCard.svelte';
  import ServerPingCard from '$lib/components/cards/ServerPingCard.svelte';
  import SkinByUrlCard from '$lib/components/cards/SkinByUrlCard.svelte';
  import UuidCard from '$lib/components/cards/UuidCard.svelte';
  import { extractImagePalette } from '$lib/skin-colors';
  import { username } from '$lib/state/username.svelte';

  // Skin-lit signature: the current skin's dominant colors drive the page glow.
  let glow = $state.raw<readonly string[]>([]);

  $effect(() => {
    const name = username.value;
    if (name === '') return;

    let cancelled = false;
    extractImagePalette(skinUrl(name), 2)
      .then((colors) => {
        if (!cancelled && colors.length > 0) {
          glow = colors;
        }
      })
      .catch(() => {
        // Decorative only — keep the previous glow on failure.
      });
    return () => {
      cancelled = true;
    };
  });
</script>

<svelte:head>
  <title>Sprax API — Minecraft profiles, skins &amp; blocklist data</title>
  <meta
    name="description"
    content="Free public Minecraft REST API: profiles, UUIDs, skin renders, capes, server pings and Mojang blocklist tracking. No API key required."
  />
</svelte:head>

<div class="page" style:--glow-a={glow[0]} style:--glow-b={glow[1]}>
  <div class="glow" aria-hidden="true"></div>

  <header class="topbar">
    <span class="wordmark"><span class="block" aria-hidden="true"></span>SPRAX API</span>
    <nav aria-label="Quick links">
      <a href={resolve('/docs')}>Docs</a>
      <a href="https://github.com/SpraxDev/api.sprax.dev">GitHub</a>
      <a href="https://status.sprax.dev/">Status</a>
      <a href="https://sprax.me/discord">Discord</a>
    </nav>
  </header>

  <main>
    <Hero />

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Player skin</h2>
    <section class="showcase skins" aria-label="Skin endpoint previews">
      <RenderCard variant="skin" title="Raw skin" />
      <RenderCard variant="body" title="Skin render" />
      <RenderCard variant="body3d" title="3D skin render" />
      <RenderCard variant="head" title="Head render" />
      <RenderCard variant="head3d" title="3D head render" />
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Player data</h2>
    <section class="showcase data" aria-label="Player data previews">
      <UuidCard />
      <ProfileCard />
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Capes</h2>
    <section class="showcase capes" aria-label="Cape previews">
      <CapesCard />
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Skin by URL</h2>
    <section class="showcase xurl" aria-label="Skin-by-URL preview">
      <SkinByUrlCard />
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Server data</h2>
    <section class="showcase servers" aria-label="Server endpoint previews">
      <ServerPingCard />
      <BlocklistCheckCard />
    </section>
  </main>
</div>

<style>
  .page {
    position: relative;
    min-height: 100dvh;
    overflow-x: clip;
    transition:
      --glow-a 1.5s ease,
      --glow-b 1.5s ease;
  }

  .glow {
    position: absolute;
    inset: 0 0 auto;
    height: 42rem;
    pointer-events: none;
    background:
      radial-gradient(
        48rem 30rem at 32% 8rem,
        color-mix(in srgb, var(--glow-a) 26%, transparent),
        transparent 70%
      ),
      radial-gradient(
        44rem 28rem at 68% 3rem,
        color-mix(in srgb, var(--glow-b) 17%, transparent),
        transparent 70%
      );
  }

  .topbar,
  main {
    position: relative;
  }

  .topbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2) var(--space-4);
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: var(--space-4);
  }

  .wordmark {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-display);
    font-size: var(--text-sm);
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  .block {
    width: 10px;
    height: 10px;
    background: var(--color-accent);
  }

  nav {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }

  nav a {
    color: var(--color-text-muted);
    text-decoration: none;
  }

  nav a:hover {
    color: var(--color-accent);
    text-decoration: underline;
  }

  main {
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: 0 var(--space-4) var(--space-16);
  }

  .section-label {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    margin: var(--space-8) 0 var(--space-3);
  }

  .square {
    width: 8px;
    height: 8px;
    background: var(--color-gold);
  }

  .showcase {
    display: grid;
    gap: var(--space-4);
    align-items: stretch;
  }

  /* min 18rem → three columns on desktop, so the five skin cards fall into
     the intended 3 + 2 rows */
  .showcase.skins {
    grid-template-columns: repeat(auto-fit, minmax(min(18rem, 100%), 1fr));
  }

  .showcase.data,
  .showcase.servers {
    grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
  }

  .showcase.xurl {
    grid-template-columns: minmax(min(22rem, 100%), 36rem);
  }
</style>
