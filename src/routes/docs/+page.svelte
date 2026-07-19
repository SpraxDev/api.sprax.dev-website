<script lang="ts">
  import type { Attachment } from 'svelte/attachments';
  import { resolve } from '$app/paths';
  import { API_BASE } from '$lib/api';
  import SocialMeta from '$lib/components/SocialMeta.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { theme, type Theme } from '$lib/state/theme.svelte';

  let ready = $state(false);
  let headerHeight = $state(0);

  function scalarConfig(effectiveTheme: Theme) {
    return {
      url: `${API_BASE}/openapi.json`,
      // Scalar's dark mode is driven by the site's theme toggle — one source
      // of truth, so Scalar's own toggle stays hidden
      forceDarkModeState: effectiveTheme,
      hideDarkModeToggle: true,
      // A plain reference: no MCP generator, no API-client button, and no
      // developer toolbar / Ask-AI chrome (not even on localhost)
      mcp: { disabled: true },
      hideClientButton: true,
      showDeveloperTools: 'never' as const,
      // Not in the public config type (yet), but honored at runtime:
      // kills the Ask-AI agent button, which otherwise shows on localhost
      ...{ agent: { disabled: true } },
      // Fonts are self-hosted by the site — don't fetch Scalar's CDN fonts
      withDefaultFonts: false,
      customCss: `
        .scalar-app {
          --scalar-font: 'Atkinson Hyperlegible Next Variable', system-ui, sans-serif;
          --scalar-font-code: 'Departure Mono', ui-monospace, monospace;
        }
        .dark-mode {
          --scalar-color-accent: #93cc72;
          --scalar-background-1: #0c1014;
          --scalar-background-2: #12171d;
          --scalar-background-3: #1a2129;
        }
        .light-mode {
          --scalar-color-accent: #417c28;
          --scalar-background-1: #eef1f4;
          --scalar-background-2: #f7f9fa;
          --scalar-background-3: #e2e8ed;
        }
      `
    };
  }

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
