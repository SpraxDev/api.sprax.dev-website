<script lang="ts">
  import { resolve } from '$app/paths';
  import { skinUrl } from '$lib/api';
  import Hero from '$lib/components/Hero.svelte';
  import RenderCard from '$lib/components/cards/RenderCard.svelte';
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

    <section class="showcase" aria-label="Live endpoint previews">
      <UuidCard />
      <RenderCard variant="head" title="Head render" />
      <RenderCard variant="body" title="Body render" />
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

  .showcase {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
    gap: var(--space-4);
    align-items: stretch;
  }
</style>
