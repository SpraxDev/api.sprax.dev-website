<script lang="ts">
  import { capeRenderUrl, type CapeType, capeUrl } from '$lib/api';
  import RequestUrl from '$lib/components/RequestUrl.svelte';
  import { username } from '$lib/state/username.svelte';

  let { type, size = 100 }: { type: CapeType; size?: number } = $props();

  const LABELS: Record<CapeType, string> = {
    mojang: 'Mojang',
    optifine: 'OptiFine',
    labymod: 'LabyMod'
  };

  // LabyMod capes are served as ready-to-display images and the /render
  // variant does not support them (HTTP 503) — use the raw endpoint there.
  const url = $derived(
    type === 'labymod' ? capeUrl(type, username.value) : capeRenderUrl(type, username.value, size)
  );

  let loadedUrl = $state<string | null>(null);
  let failedUrl = $state<string | null>(null);
  const status = $derived(url === loadedUrl ? 'loaded' : url === failedUrl ? 'failed' : 'loading');
</script>

<div class="provider">
  <h3>{LABELS[type]}</h3>
  <div class="frame">
    {#if username.value !== ''}
      <img
        class={{ hidden: status !== 'loaded' }}
        src={url}
        alt="{LABELS[type]} cape of {username.value}"
        width={type === 'labymod' ? 352 : size}
        height={type === 'labymod' ? 272 : size * 1.6}
        loading="lazy"
        onload={() => (loadedUrl = url)}
        onerror={() => (failedUrl = url)}
      />
    {/if}
    {#if status === 'loading'}
      <div class="skeleton" aria-hidden="true"></div>
    {:else if status === 'failed'}
      <p class="none">no cape</p>
    {/if}
  </div>
  <RequestUrl {url} />
</div>

<style>
  .provider {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  h3 {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    margin: 0 0 var(--space-2);
    text-align: center;
  }

  .frame {
    position: relative;
    display: grid;
    place-items: center;
    height: 160px;
    margin-bottom: var(--space-2);
  }

  img {
    grid-area: 1 / 1;
    width: auto;
    height: auto;
    max-height: 160px;
    max-width: 100%;
  }

  img.hidden {
    visibility: hidden;
  }

  .skeleton {
    position: absolute;
    inset: 0;
    width: 100px;
    margin-inline: auto;
    background: repeating-conic-gradient(
        var(--color-surface-raised) 0% 25%,
        var(--color-surface) 0% 50%
      )
      0 0 / 20px 20px;
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  .none {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-faint);
    margin: 0;
  }

  @keyframes pulse {
    to {
      opacity: 0.5;
    }
  }
</style>
