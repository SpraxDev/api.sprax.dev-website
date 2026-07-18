<script lang="ts">
  import { profileUrl, skinByUrl3dRenderUrl, skinByUrlRenderUrl, type SkinArea } from '$lib/api';
  import DebouncedTextInput from '$lib/components/DebouncedTextInput.svelte';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { extractSkinTextureUrl } from '$lib/profile-textures';
  import { username } from '$lib/state/username.svelte';

  // A permanent textures.minecraft.net URL (SpraxDev's skin) so the card is
  // alive before anyone pastes their own.
  const DEFAULT_TEXTURE_URL =
    'https://textures.minecraft.net/texture/cc69184e66d39fc1f5ed11a5e19e250a0561c289bf8bdb69362b11bc7fc659c1';

  let textureUrl = $state(DEFAULT_TEXTURE_URL);
  let style = $state<'3d' | 'flat'>('3d');

  // Follow the global username: adopt the skin URL from the player's profile
  // so this card updates with the rest of the page. A profile without a skin
  // (or a failed request) leaves the current URL untouched.
  $effect(() => {
    const name = username.value;
    if (name === '') return;

    const controller = new AbortController();
    fetch(profileUrl(name), { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((profile) => {
        if (controller.signal.aborted || profile == null) return;
        const skinUrl = extractSkinTextureUrl(profile);
        if (skinUrl != null) {
          textureUrl = skinUrl;
        }
      })
      .catch(() => {
        // Decorative convenience only — keep the current URL on failure.
      });
    return () => controller.abort();
  });
  let area = $state<SkinArea>('body');
  let size = $state(128);
  let overlay = $state(true);
  let model = $state<'auto' | 'classic' | 'slim'>('auto');

  function clampSize(value: number): number {
    return Number.isFinite(value) ? Math.min(1024, Math.max(8, Math.round(value))) : 128;
  }

  const isHttps = $derived(textureUrl.startsWith('https://'));
  const url = $derived.by(() => {
    const params = {
      size: clampSize(size),
      overlay,
      // The API rejects `slim` for head renders
      slim: area === 'body' && model !== 'auto' ? model === 'slim' : undefined
    };
    return style === '3d'
      ? skinByUrl3dRenderUrl(area, textureUrl, params)
      : skinByUrlRenderUrl(area, textureUrl, params);
  });
  const width = $derived(style === '3d' && area === 'head' ? 138 : 128);
  const height = $derived.by(() => {
    if (area === 'head') return 128;
    return style === '3d' ? 234 : 256;
  });

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
          class={[{ pixelated: style === 'flat', hidden: status !== 'loaded' }]}
          src={url}
          alt="Minecraft {area} render of the given skin texture"
          {width}
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
      style
      <select bind:value={style}>
        <option value="3d">3D</option>
        <option value="flat">flat</option>
      </select>
    </label>
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
    align-self: stretch;
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
