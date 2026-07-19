<script lang="ts">
  import { abridgeStrings } from '$lib/abridge';
  import { profileUrl } from '$lib/api';
  import JsonSkeleton, { type SkeletonLine } from '$lib/components/JsonSkeleton.svelte';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { profile } from '$lib/state/profile.svelte';
  import { username } from '$lib/state/username.svelte';

  let expanded = $state(false);

  const request = $derived(profile.request);

  // Mirrors the collapsed (abridged) profile JSON line by line:
  // id, name, properties[{name, value…, signature…}], profileActions
  const SKELETON_LINES: SkeletonLine[] = [
    { indent: 0, width: 1 },
    { indent: 2, width: 41 },
    { indent: 2, width: 19 },
    { indent: 2, width: 16 },
    { indent: 4, width: 1 },
    { indent: 6, width: 20 },
    { indent: 6, width: 52 },
    { indent: 6, width: 56 },
    { indent: 4, width: 1 },
    { indent: 2, width: 2 },
    { indent: 2, width: 21 },
    { indent: 0, width: 1 }
  ];
</script>

{#snippet skeleton()}
  <JsonSkeleton lines={SKELETON_LINES} />
  <!-- Same metrics as the real button (text is invisible) → identical height -->
  <div class="button-placeholder" aria-hidden="true">Expand full JSON</div>
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

  /* Mirrors the button's box exactly; only the text is hidden */
  .button-placeholder {
    align-self: flex-start;
    padding: 2px var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: transparent;
    border: 1px solid transparent;
    background: var(--color-surface-raised);
    border-radius: var(--radius);
    animation: pulse 1.2s ease-in-out infinite alternate;
    user-select: none;
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
