<script lang="ts">
  import { skinByUrlRenderUrl, type SkinArea } from '$lib/api';
  import DebouncedTextInput from '$lib/components/DebouncedTextInput.svelte';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';

  // A permanent textures.minecraft.net URL (SpraxDev's skin) so the card is
  // alive before anyone pastes their own.
  const DEFAULT_TEXTURE_URL =
    'https://textures.minecraft.net/texture/cc69184e66d39fc1f5ed11a5e19e250a0561c289bf8bdb69362b11bc7fc659c1';

  let textureUrl = $state(DEFAULT_TEXTURE_URL);
  let area = $state<SkinArea>('body');
  let size = $state(128);
  let overlay = $state(true);
  let model = $state<'auto' | 'classic' | 'slim'>('auto');

  function clampSize(value: number): number {
    return Number.isFinite(value) ? Math.min(1024, Math.max(8, Math.round(value))) : 128;
  }

  const isHttps = $derived(textureUrl.startsWith('https://'));
  const url = $derived(
    skinByUrlRenderUrl(area, textureUrl, {
      size: clampSize(size),
      overlay,
      // The API rejects `slim` for head renders
      slim: area === 'body' && model !== 'auto' ? model === 'slim' : undefined
    })
  );
  const height = $derived(area === 'body' ? 256 : 128);

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

    <div class="frame" style:min-height="{height}px">
      {#if !isHttps}
        <p class="error">The skin URL must start with https://</p>
      {:else}
        <img
          class={['pixelated', { hidden: status !== 'loaded' }]}
          src={url}
          alt="Minecraft {area} render of the given skin texture"
          width="128"
          {height}
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

  {#snippet params()}
    <label>
      area
      <select bind:value={area}>
        <option value="body">body</option>
        <option value="head">head</option>
      </select>
    </label>
    <label>
      size
      <input
        type="number"
        min="8"
        max="1024"
        value={size}
        onchange={(event) => (size = clampSize(event.currentTarget.valueAsNumber))}
      />
    </label>
    <label><input type="checkbox" bind:checked={overlay} /> overlay</label>
    {#if area === 'body'}
      <label>
        model
        <select bind:value={model}>
          <option value="auto">auto</option>
          <option value="classic">classic</option>
          <option value="slim">slim</option>
        </select>
      </label>
    {/if}
  {/snippet}
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
