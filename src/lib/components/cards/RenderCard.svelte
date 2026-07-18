<script lang="ts">
  import { bodyRenderUrl, headRenderUrl, skin3dRenderUrl, skinUrl } from '$lib/api';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { username } from '$lib/state/username.svelte';

  type Variant = 'head' | 'body' | 'skin' | 'body3d' | 'head3d';

  let { variant, title }: { variant: Variant; title: string } = $props();

  interface VariantConfig {
    url: string;
    width: number;
    height: number;
    /** 3D renders are smooth perspective images — everything else is pixel art. */
    pixelated: boolean;
    alt: string;
  }

  const config: VariantConfig = $derived.by(() => {
    const user = username.value;
    switch (variant) {
      case 'head':
        return {
          url: headRenderUrl(user, 128),
          width: 128,
          height: 128,
          pixelated: true,
          alt: `Minecraft head render of ${user}`
        };
      case 'body':
        return {
          url: bodyRenderUrl(user, 128),
          width: 128,
          height: 256,
          pixelated: true,
          alt: `Minecraft body render of ${user}`
        };
      case 'skin':
        return {
          url: skinUrl(user),
          width: 128,
          height: 128,
          pixelated: true,
          alt: `Raw Minecraft skin texture of ${user}`
        };
      case 'body3d':
        return {
          url: skin3dRenderUrl(user, 'body', 128),
          width: 128,
          height: 234,
          pixelated: false,
          alt: `3D Minecraft body render of ${user}`
        };
      case 'head3d':
        return {
          url: skin3dRenderUrl(user, 'head', 128),
          width: 138,
          height: 128,
          pixelated: false,
          alt: `3D Minecraft head render of ${user}`
        };
    }
  });

  // No effects needed: an image is "loading" until its URL matches the last
  // load/error event we saw.
  let loadedUrl = $state<string | null>(null);
  let failedUrl = $state<string | null>(null);
  const status = $derived(
    config.url === loadedUrl ? 'loaded' : config.url === failedUrl ? 'failed' : 'loading'
  );
</script>

<ShowcaseCard {title} url={config.url}>
  <div class="frame" style:width="{config.width}px" style:height="{config.height}px">
    {#if username.value !== ''}
      <img
        class={[{ pixelated: config.pixelated, hidden: status !== 'loaded' }]}
        src={config.url}
        alt={config.alt}
        width={config.width}
        height={config.height}
        onload={() => (loadedUrl = config.url)}
        onerror={() => (failedUrl = config.url)}
      />
    {/if}
    {#if status === 'loading'}
      <div class="skeleton" aria-hidden="true"></div>
    {:else if status === 'failed'}
      <p class="error">No skin found for this name</p>
    {/if}
  </div>
</ShowcaseCard>

<style>
  .frame {
    position: relative;
    display: grid;
    place-items: center;
  }

  img {
    grid-area: 1 / 1;
    max-width: 100%;
    object-fit: contain;
  }

  img.hidden {
    visibility: hidden;
  }

  .skeleton,
  .error {
    position: absolute;
    inset: 0;
  }

  /* Coarse checkerboard — the pixel grid as loading state */
  .skeleton {
    background: repeating-conic-gradient(
        var(--color-surface-raised) 0% 25%,
        var(--color-surface) 0% 50%
      )
      0 0 / 32px 32px;
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  .error {
    display: grid;
    place-items: center;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-danger);
    text-align: center;
    margin: 0;
  }

  @keyframes pulse {
    to {
      opacity: 0.5;
    }
  }
</style>
