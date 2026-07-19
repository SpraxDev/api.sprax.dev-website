<script lang="ts">
  import { onMount } from 'svelte';

  let visible = $state(false);

  onMount(() => {
    // Use onMount so pre-rendered HTML does not carry the notice
    visible = true;
  });

  function dismiss(): void {
    visible = false;
  }
</script>

{#if visible}
  <div class="notice" role="status">
    <div class="text">
      <p class="heading">Work in progress</p>
      <p>
        This website is still under construction — some features may be broken, incomplete or
        change without notice.
      </p>
    </div>
    <button type="button" onclick={dismiss} aria-label="Dismiss notice">
      <svg viewBox="0 0 14 14" width="12" height="12" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path d="M2 2l10 10M12 2L2 12" />
      </svg>
    </button>
  </div>
{/if}

<style>
  .notice {
    position: fixed;
    inset: auto var(--space-4) var(--space-4) auto;
    z-index: 100;
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    max-width: 22rem;
    padding: var(--space-3) var(--space-3) var(--space-3) var(--space-4);
    background: var(--color-surface);
    border: 1px solid var(--color-gold);
    border-radius: var(--radius);
    box-shadow: 0 4px 24px color-mix(in srgb, var(--color-bg) 60%, transparent);
  }

  @media (max-width: 32rem) {
    .notice {
      inset: auto var(--space-2) var(--space-2) var(--space-2);
      max-width: none;
    }
  }

  .text p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  .heading {
    font-family: var(--font-display);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-gold);
    margin-bottom: var(--space-1);
  }

  button {
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    color: var(--color-text-muted);
    cursor: pointer;
  }

  button:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>
