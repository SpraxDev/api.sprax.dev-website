<script lang="ts">
  import { SAMPLE_SERVERS } from '$lib/data/sample-servers';

  let { value = $bindable() }: { value: string } = $props();
</script>

<div class="samples" role="group" aria-label="Sample servers">
  {#each SAMPLE_SERVERS as sample (sample)}
    <button
      type="button"
      class={['chip', { active: sample === value }]}
      onclick={() => (value = sample)}
    >
      {sample}
    </button>
  {/each}
</div>

<style>
  .samples {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .chip {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 2px var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-faint);
    cursor: pointer;
    transition:
      border-color 0.15s,
      color 0.15s;
  }

  .chip:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .chip.active {
    border-color: var(--color-border-strong);
    color: var(--color-text-muted);
  }
</style>
