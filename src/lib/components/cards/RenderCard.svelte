<script lang="ts">
  import { bodyRenderUrl, headRenderUrl } from '$lib/api';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { username } from '$lib/state/username.svelte';

  let { variant, title }: { variant: 'head' | 'body'; title: string } = $props();

  const width = 128;
  const height = $derived(variant === 'head' ? 128 : 256);
  const url = $derived(
    variant === 'head' ? headRenderUrl(username.value, width) : bodyRenderUrl(username.value, width)
  );

  // No effects needed: an image is "loading" until its URL matches the last
  // load/error event we saw.
  let loadedUrl = $state<string | null>(null);
  let failedUrl = $state<string | null>(null);
  const status = $derived(
    url === loadedUrl ? 'loaded' : url === failedUrl ? 'failed' : 'loading'
  );
</script>

<ShowcaseCard {title} {url}>
  <div class="frame" style:width="{width}px" style:height="{height}px">
    {#if username.value !== ''}
      <img
        class={['pixelated', { hidden: status !== 'loaded' }]}
        src={url}
        alt="Minecraft {variant} render of {username.value}"
        {width}
        {height}
        onload={() => (loadedUrl = url)}
        onerror={() => (failedUrl = url)}
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
