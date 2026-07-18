<script lang="ts">
  import type { Snippet } from 'svelte';
  import RequestUrl from './RequestUrl.svelte';

  let { title, url, children }: { title: string; url: string; children: Snippet } = $props();
</script>

<article class="card">
  <h3>{title}</h3>
  <div class="preview">
    {@render children()}
  </div>
  <RequestUrl {url} />
</article>

<style>
  .card {
    display: flex;
    flex-direction: column;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    transition: border-color 0.3s;
  }

  .card:hover {
    border-color: color-mix(in srgb, var(--glow-a) 55%, var(--color-border));
  }

  h3 {
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    padding: var(--space-3) var(--space-3) 0;
  }

  .preview {
    flex: 1;
    display: grid;
    place-items: center;
    padding: var(--space-4) var(--space-3);
  }
</style>
