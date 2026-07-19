<script module lang="ts">
  export interface SkeletonLine {
    /** Indentation in ch (matches JSON.stringify's 2-space steps) */
    indent: number;
    /** Bar width in ch, mirroring the expected line's text length */
    width: number;
  }
</script>

<script lang="ts">
  let { lines }: { lines: SkeletonLine[] } = $props();
</script>

<!-- Shaped like the JSON it stands in for: same font metrics and line count,
     so the card doesn't shift when the real data arrives -->
<div class="skeleton" aria-hidden="true">
  {#each lines as line, index (index)}
    <div class="line" style:margin-left="{line.indent}ch" style:width="{line.width}ch"></div>
  {/each}
</div>

<style>
  /* Shrink-wraps like the <pre> it stands in for, so centered/stretched
     parents place both the same way */
  .skeleton {
    width: fit-content;
    max-width: 100%;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.8;
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  .line {
    height: 1lh;
    max-width: 100%;
    background: linear-gradient(var(--color-surface-raised) 0 0) 0 50% / 100% 0.9em no-repeat;
  }

  @keyframes pulse {
    to {
      opacity: 0.4;
    }
  }
</style>
