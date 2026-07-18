<script lang="ts">
  import { skinByUrlRenderUrl } from '$lib/api';
  import DebouncedTextInput from '$lib/components/DebouncedTextInput.svelte';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';

  // A permanent textures.minecraft.net URL (SpraxDev's skin) so the card is
  // alive before anyone pastes their own.
  const DEFAULT_TEXTURE_URL =
    'https://textures.minecraft.net/texture/cc69184e66d39fc1f5ed11a5e19e250a0561c289bf8bdb69362b11bc7fc659c1';

  let textureUrl = $state(DEFAULT_TEXTURE_URL);

  const isHttps = $derived(textureUrl.startsWith('https://'));
  const url = $derived(skinByUrlRenderUrl('body', textureUrl, 128));

  let loadedUrl = $state<string | null>(null);
  let failedUrl = $state<string | null>(null);
  const status = $derived(url === loadedUrl ? 'loaded' : url === failedUrl ? 'failed' : 'loading');
</script>

<ShowcaseCard {url}>
  <div class="body">
    <DebouncedTextInput
      bind:value={textureUrl}
      label="Skin texture URL to render"
      id="skin-texture-url"
      placeholder="https://textures.minecraft.net/texture/…"
    />

    <div class="frame">
      {#if !isHttps}
        <p class="error">The skin URL must start with https://</p>
      {:else}
        <img
          class={['pixelated', { hidden: status !== 'loaded' }]}
          src={url}
          alt="Minecraft body render of the given skin texture"
          width="128"
          height="256"
          onload={() => (loadedUrl = url)}
          onerror={() => (failedUrl = url)}
        />
        {#if status === 'loading'}
          <div class="skeleton" aria-hidden="true"></div>
        {:else if status === 'failed'}
          <p class="error">Could not fetch or render that URL as a skin</p>
        {/if}
      {/if}
    </div>

    <p class="hint">Renders any skin texture reachable over https — no profile needed.</p>
  </div>
</ShowcaseCard>

<style>
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    width: 100%;
  }

  .frame {
    position: relative;
    display: grid;
    place-items: center;
    min-height: 256px;
  }

  img {
    grid-area: 1 / 1;
  }

  img.hidden {
    visibility: hidden;
  }

  .skeleton {
    position: absolute;
    inset: 0;
    width: 128px;
    margin-inline: auto;
    background: repeating-conic-gradient(
        var(--color-surface-raised) 0% 25%,
        var(--color-surface) 0% 50%
      )
      0 0 / 32px 32px;
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  .error {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-danger);
    text-align: center;
    margin: 0;
  }

  .hint {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-faint);
  }

  @keyframes pulse {
    to {
      opacity: 0.5;
    }
  }
</style>
