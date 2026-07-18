<script lang="ts">
  import { abridgeStrings } from '$lib/abridge';
  import { profileUrl } from '$lib/api';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { profile } from '$lib/state/profile.svelte';
  import { username } from '$lib/state/username.svelte';

  let expanded = $state(false);

  const request = $derived(profile.request);
</script>

{#snippet skeleton()}
  <div class="skeleton" aria-hidden="true">
    <span style:width="70%"></span>
    <span style:width="90%"></span>
    <span style:width="85%"></span>
    <span style:width="50%"></span>
  </div>
{/snippet}

<ShowcaseCard title="Profile" url={profileUrl(username.value)}>
  <div class="body">
    {#if request === null}
      {@render skeleton()}
    {:else}
      {#await request}
        {@render skeleton()}
      {:then result}
        <pre class={{ expanded }}>{JSON.stringify(
            expanded ? result : abridgeStrings(result),
            null,
            2
          )}</pre>
        <button type="button" onclick={() => (expanded = !expanded)}>
          {expanded ? 'Collapse' : 'Expand full JSON'}
        </button>
      {:catch error}
        <p class="error">{error.message}</p>
      {/await}
    {/if}
  </div>
</ShowcaseCard>

<style>
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    width: 100%;
    min-width: 0;
  }

  pre {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.8;
    color: var(--color-accent-strong);
    margin: 0;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  pre.expanded {
    max-height: 20rem;
    overflow-y: auto;
  }

  button {
    align-self: flex-start;
    background: none;
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius);
    padding: 2px var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
      border-color 0.15s,
      color 0.15s;
  }

  button:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
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
