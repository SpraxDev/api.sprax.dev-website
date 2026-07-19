<script lang="ts">
  import type { Snippet } from 'svelte';
  import RequestUrl from './RequestUrl.svelte';

  let {
    title,
    badge,
    badgeTitle,
    url,
    children,
    params
  }: {
    title?: string;
    /** Small label next to the title, e.g. 'experimental' */
    badge?: string;
    /** Tooltip explaining the badge */
    badgeTitle?: string;
    url?: string;
    children: Snippet;
    params?: Snippet;
  } = $props();
</script>

<article class="card">
  {#if title != null}
    <h3>
      {title}
      {#if badge != null}
        <span class="badge" title={badgeTitle}>{badge}</span>
      {/if}
    </h3>
  {/if}
  <div class="preview">
    {@render children()}
  </div>
  {#if params != null}
    <details class="params">
      <summary>Parameters</summary>
      <div class="controls">
        {@render params()}
      </div>
    </details>
  {/if}
  {#if url != null}
    <RequestUrl {url} />
  {/if}
</article>

<style>
  .card {
    display: flex;
    flex-direction: column;
    /* Never let wide content (MOTDs, URLs) force the card past its grid track */
    min-width: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    transition: border-color 0.3s;
  }

  .card:hover {
    border-color: color-mix(in srgb, var(--glow-a) 55%, var(--color-border));
  }

  h3 {
    display: flex;
    align-items: baseline;
    gap: var(--space-2);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    padding: var(--space-3) var(--space-3) 0;
  }

  .badge {
    font-size: var(--text-xs);
    letter-spacing: 0.04em;
    color: var(--color-gold);
    border: 1px solid color-mix(in srgb, var(--color-gold) 50%, transparent);
    border-radius: var(--radius);
    padding: 0 var(--space-1);
    cursor: help;
  }

  .preview {
    flex: 1;
    display: grid;
    /* minmax(0, 1fr) caps the track at the card width so overflowing
       content scrolls inside its own box instead of widening the card */
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
    align-items: center;
    padding: var(--space-4) var(--space-3);
  }

  .params {
    border-top: 1px solid var(--color-border);
  }

  summary {
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-faint);
    cursor: pointer;
    user-select: none;
  }

  summary:hover {
    color: var(--color-accent);
  }

  .controls {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2) var(--space-4);
    padding: 0 var(--space-3) var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  /* Shared look for the small param controls the cards render into the slot */
  .controls :global(label) {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
  }

  .controls :global(input[type='number']),
  .controls :global(select) {
    background: var(--color-bg);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius);
    color: var(--color-text);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    padding: 2px var(--space-1);
  }

  .controls :global(input[type='number']) {
    width: 5.5rem;
  }

  .controls :global(input[type='checkbox']) {
    accent-color: var(--color-accent);
  }
</style>
