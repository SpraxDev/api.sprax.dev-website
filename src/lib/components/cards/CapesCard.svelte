<script lang="ts">
  import { CAPE_TYPES } from '$lib/api';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import CapePreview from './CapePreview.svelte';

  let size = $state(100);

  function clampSize(value: number): number {
    return Number.isFinite(value) ? Math.min(1024, Math.max(8, Math.round(value))) : 100;
  }
</script>

<ShowcaseCard>
  <div class="providers">
    {#each CAPE_TYPES as type (type)}
      <CapePreview {type} {size} />
    {/each}
  </div>

  {#snippet params()}
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
    <span class="note">applies to the rendered Mojang/OptiFine capes — LabyMod is served as-is</span>
  {/snippet}
</ShowcaseCard>

<style>
  .providers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--space-4);
    width: 100%;
  }

  .note {
    color: var(--color-text-faint);
  }
</style>
