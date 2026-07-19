<script lang="ts">
  import { resolve } from '$app/paths';
  import { skinUrl } from '$lib/api';
  import DeveloperSection from '$lib/components/DeveloperSection.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import SocialMeta from '$lib/components/SocialMeta.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import ProjectsSection from '$lib/components/ProjectsSection.svelte';
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

<SocialMeta
  title="SpraxAPI — Minecraft profiles, skins & blocklist data"
  description="Free public Minecraft REST API: profiles, UUIDs, skin renders, capes, server pings and Mojang blocklist tracking. No API key required."
  path="/"
/>

<div class="page" style:--glow-a={glow[0]} style:--glow-b={glow[1]}>
  <div class="glow" aria-hidden="true"></div>

  <header class="topbar">
    <span class="wordmark"><span class="block" aria-hidden="true"></span>SPRAX API</span>
    <nav aria-label="Quick links">
      <!-- Full page load: Scalar rewrites history.state on /docs, which breaks
           SvelteKit's client-side back/forward across the two pages -->
      <a href={resolve('/docs')} data-sveltekit-reload>Docs</a>
      <a href="https://github.com/SpraxDev/api.sprax.dev" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://status.sprax.dev/" target="_blank" rel="noopener noreferrer">Status</a>
      <a href="https://sprax.me/discord" target="_blank" rel="noopener noreferrer">Discord</a>
      <ThemeToggle />
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
      <ProfileCard />
      <UuidCard />
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Capes</h2>
    <section class="showcase capes" aria-label="Cape previews">
      <CapesCard />
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Server data</h2>
    <section class="showcase thirds" aria-label="Server endpoint previews">
      <div class="span-2"><ServerPingCard /></div>
      <div><BlocklistCheckCard /></div>
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Skin by URL</h2>
    <section class="showcase thirds" aria-label="Skin-by-URL preview">
      <div class="span-2"><SkinByUrlCard /></div>
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>For developers</h2>
    <section aria-label="Developer information">
      <DeveloperSection />
    </section>

    <h2 class="section-label"><span class="square" aria-hidden="true"></span>Used by</h2>
    <section aria-label="Projects using this API">
      <ProjectsSection />
    </section>
  </main>

  <footer>
    <div class="footer-inner">
      <p>
        <span class="license" title="The API and this website are free software">GPL-3.0-or-later</span>
        ·
        <a href="https://github.com/SpraxDev/api.sprax.dev" target="_blank" rel="noopener noreferrer">Source on GitHub</a>
        ·
        <a href="https://sprax.me/discord" target="_blank" rel="noopener noreferrer">Support on Discord</a>
      </p>
      <p>
        <a href="https://sprax2013.de/#impressum" target="_blank" rel="noopener noreferrer">Legal notice</a>
        ·
        <a href="https://sprax2013.de/#privacy" target="_blank" rel="noopener noreferrer">Privacy policy</a>
      </p>
    </div>
  </footer>
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
  main,
  footer {
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
    align-items: center;
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

  .showcase.data {
    grid-template-columns: repeat(auto-fit, minmax(min(22rem, 100%), 1fr));
  }

  /* Server data + skin-by-URL share one 3-column rhythm: wide card spans 2 */
  .showcase.thirds {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .showcase.thirds > div {
    display: grid;
    min-width: 0;
  }

  .span-2 {
    grid-column: span 2;
  }

  @media (max-width: 56rem) {
    .showcase.thirds {
      grid-template-columns: minmax(0, 1fr);
    }

    .span-2 {
      grid-column: auto;
    }
  }

  footer {
    border-top: 1px solid var(--color-border);
  }

  .footer-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2) var(--space-4);
    max-width: var(--page-max-width);
    margin: 0 auto;
    padding: var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-faint);
  }

  .footer-inner p {
    margin: 0;
  }

  .footer-inner a {
    color: var(--color-text-muted);
    text-decoration: none;
  }

  .footer-inner a:hover {
    color: var(--color-accent);
    text-decoration: underline;
  }

  .license {
    color: var(--color-text-muted);
  }
</style>
