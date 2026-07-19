<script lang="ts">
  import { uuidUrl } from '$lib/api';
  import JsonSkeleton, { type SkeletonLine } from '$lib/components/JsonSkeleton.svelte';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { username } from '$lib/state/username.svelte';

  // Mirrors the known response shape: { "id": "<32 hex>", "name": "..." }
  const SKELETON_LINES: SkeletonLine[] = [
    { indent: 0, width: 1 },
    { indent: 2, width: 41 },
    { indent: 2, width: 19 },
    { indent: 0, width: 1 }
  ];

  async function fetchUuid(name: string): Promise<{ id: string; name: string }> {
    const response = await fetch(uuidUrl(name));
    const body = await response.json();
    if (!response.ok) {
      throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${response.status}`);
    }
    return body;
  }

  const request = $derived(username.value === '' ? null : fetchUuid(username.value));
</script>

{#snippet skeleton()}
  <JsonSkeleton lines={SKELETON_LINES} />
{/snippet}

<ShowcaseCard title="UUID lookup" url={uuidUrl(username.value)}>
  {#if request === null}
    {@render skeleton()}
  {:else}
    {#await request}
      {@render skeleton()}
    {:then result}
      <pre>{JSON.stringify(result, null, 2)}</pre>
    {:catch error}
      <p class="error">{error.message}</p>
    {/await}
  {/if}
</ShowcaseCard>

<style>
  pre {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.8;
    color: var(--color-accent-strong);
    margin: 0;
    max-width: 100%;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .error {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-danger);
    margin: 0;
  }
</style>
