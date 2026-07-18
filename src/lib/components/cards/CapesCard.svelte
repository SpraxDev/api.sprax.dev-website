<script lang="ts">
  import { CAPE_TYPES } from '$lib/api';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import CapePreview from './CapePreview.svelte';
</script>

<ShowcaseCard>
  <div class="providers">
    {#each CAPE_TYPES as type (type)}
      <CapePreview {type} />
    {/each}
  </div>
</ShowcaseCard>

<style>
  .providers {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--space-4);
    width: 100%;
  }
</style>
