<script lang="ts">
  import { uuidUrl } from '$lib/api';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { username } from '$lib/state/username.svelte';

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
  <div class="skeleton" aria-hidden="true">
    <span style:width="60%"></span>
    <span style:width="90%"></span>
    <span style:width="40%"></span>
  </div>
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

  .skeleton {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    width: 100%;
  }

  .skeleton span {
    height: var(--space-3);
    background: var(--color-surface-raised);
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  .error {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-danger);
    margin: 0;
  }

  @keyframes pulse {
    to {
      opacity: 0.4;
    }
  }
</style>
