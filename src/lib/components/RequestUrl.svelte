<script lang="ts">
  let { url }: { url: string } = $props();

  let copied = $state(false);
  let resetTimeout: ReturnType<typeof setTimeout> | undefined;

  const displayUrl = $derived(url.replace(/^https:\/\//, ''));

  async function copy(): Promise<void> {
    await navigator.clipboard.writeText(url);
    copied = true;
    clearTimeout(resetTimeout);
    resetTimeout = setTimeout(() => (copied = false), 1500);
  }
</script>

<div class="request">
  <span class="method">GET</span>
  <code title={url}>{displayUrl}</code>
  <button type="button" class={{ copied }} onclick={copy}>
    {copied ? 'copied' : 'copy'}
  </button>
</div>

<style>
  .request {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    border-top: 1px solid var(--color-border);
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
  }

  .method {
    color: var(--color-gold);
    flex-shrink: 0;
  }

  /* The full URL stays in the DOM — selectable, and scrollable to its end.
     The scrollbar thumb only shows while hovering to keep the cards quiet. */
  code {
    color: var(--color-text-muted);
    overflow-x: auto;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }

  .request:hover code {
    scrollbar-color: var(--color-border-strong) transparent;
  }

  button {
    flex-shrink: 0;
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

  button.copied {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>
