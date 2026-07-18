<script lang="ts">
  import { onMount } from 'svelte';
  import { blocklistCheckUrl } from '$lib/api';
  import DebouncedTextInput from '$lib/components/DebouncedTextInput.svelte';
  import SampleServerChips from '$lib/components/SampleServerChips.svelte';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { pickRandomSampleServer } from '$lib/data/sample-servers';

  let host = $state('');

  onMount(() => {
    host = pickRandomSampleServer();
  });

  async function checkBlocklist(hostname: string): Promise<Record<string, boolean>> {
    const response = await fetch(blocklistCheckUrl(hostname));
    const body = await response.json();
    if (!response.ok) {
      throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${response.status}`);
    }
    return body;
  }

  const request = $derived(host === '' ? null : checkBlocklist(host));
</script>

{#snippet skeleton()}
  <div class="variants" aria-hidden="true">
    <span class="skeleton" style:width="70%"></span>
    <span class="skeleton" style:width="80%"></span>
    <span class="skeleton" style:width="60%"></span>
  </div>
{/snippet}

<ShowcaseCard title="Blocklist check" url={blocklistCheckUrl(host)}>
  <div class="body">
    <DebouncedTextInput
      bind:value={host}
      label="Server address to check against Mojang's blocklist"
      id="blocklist-host"
      placeholder="mc.example.org"
    />

    <SampleServerChips bind:value={host} />

    {#if request === null}
      {@render skeleton()}
    {:else}
      {#await request}
        {@render skeleton()}
      {:then result}
        <ul class="variants">
          {#each Object.entries(result) as [variant, blocked] (variant)}
            <li>
              <code>{variant}</code>
              <span class={['verdict', { blocked }]}>{blocked ? 'BLOCKED' : 'clean'}</span>
            </li>
          {/each}
        </ul>
      {:catch error}
        <p class="error">{error.message}</p>
      {/await}
    {/if}

    <p class="hint">
      Mojang blocks servers by hashed hostname pattern — every wildcard variant of the address is
      checked individually.
    </p>
  </div>
</ShowcaseCard>

<style>
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    width: 100%;
  }

  .variants {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .variants li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
    padding: var(--space-1) 0;
    border-bottom: 1px solid var(--color-border);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .variants li:last-child {
    border-bottom: none;
  }

  .variants code {
    color: var(--color-text-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .verdict {
    color: var(--color-accent);
    flex-shrink: 0;
  }

  .verdict.blocked {
    color: var(--color-danger);
  }

  .hint {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-faint);
  }

  span.skeleton {
    display: block;
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
