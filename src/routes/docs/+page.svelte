<script lang="ts">
  import { resolve } from '$app/paths';
  import SocialMeta from '$lib/components/SocialMeta.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { scalarConfig } from '$lib/scalar-config';
  import { theme } from '$lib/state/theme.svelte';
  import { docsJsonLd } from '$lib/structuredData';
  import type { Attachment } from 'svelte/attachments';

  let ready = $state(false);
  let headerHeight = $state(0);

  // Loaded lazily on the client only — the Scalar bundle is heavy and
  // must not run during prerendering.
  const scalar: Attachment<HTMLDivElement> = (container) => {
    let app: { destroy?: () => void } | undefined;
    let cancelled = false;

    Promise.all([
      import('@scalar/api-reference'),
      import('@scalar/api-reference/style.css')
    ]).then(([{ createApiReference }]) => {
      if (cancelled) return;
      app = createApiReference(container, scalarConfig(theme.effective));
      ready = true;
    });

    return () => {
      cancelled = true;
      app?.destroy?.();
    };
  };

  // Keep Scalar in sync when the theme changes after initialization. Its
  // forceDarkModeState is only read once at setup, but all of its styling
  // keys off these two body classes — and with its own toggle hidden,
  // nothing else touches them.
  $effect(() => {
    const effectiveTheme = theme.effective;
    if (!ready) return;
    document.body.classList.toggle('dark-mode', effectiveTheme === 'dark');
    document.body.classList.toggle('light-mode', effectiveTheme === 'light');
  });
</script>

<SocialMeta
  title="API reference — SpraxAPI"
  description="Interactive API reference for api.sprax.dev — Minecraft profiles, skins, capes, server pings and blocklist data."
  path="/docs"
  jsonLd={docsJsonLd}
/>

<header class="topbar" bind:clientHeight={headerHeight}>
  <!-- Full page load: Scalar rewrites history.state, which breaks SvelteKit's
       client-side back/forward across the two pages -->
  <a class="wordmark" href={resolve('/')} data-sveltekit-reload>
    <span class="block" aria-hidden="true"></span>SPRAX API
  </a>
  <nav aria-label="Quick links">
    <a href="https://github.com/SpraxDev/api.sprax.dev" target="_blank" rel="noopener noreferrer">GitHub</a>
    <a href="https://status.sprax.dev/" target="_blank" rel="noopener noreferrer">Status</a>
    <a href="https://sprax.me/discord" target="_blank" rel="noopener noreferrer">Discord</a>
    <ThemeToggle />
  </nav>
</header>

{#if !ready}
  <p class="loading">Loading API reference…</p>
{/if}
<!-- The header height offsets Scalar's full-viewport layout so its sidebar
     (incl. the "Powered by Scalar" footer) isn't clipped behind the topbar -->
<div style:--scalar-custom-header-height="{headerHeight + 1}px" {@attach scalar}></div>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2) var(--space-4);
    padding: var(--space-4);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
  }

  .wordmark {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    font-family: var(--font-display);
    font-size: var(--text-sm);
    letter-spacing: 0.08em;
    white-space: nowrap;
    color: var(--color-text);
    text-decoration: none;
  }

  .wordmark:hover {
    color: var(--color-accent);
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

  .loading {
    padding: var(--space-16) var(--space-4);
    text-align: center;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-faint);
  }
</style>
