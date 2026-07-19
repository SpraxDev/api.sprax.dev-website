<script lang="ts">
  import { onMount } from 'svelte';
  import { theme } from '$lib/state/theme.svelte';

  onMount(() => theme.init());

  const switchesTo = $derived(theme.effective === 'dark' ? 'light' : 'dark');
</script>

<button
  type="button"
  onclick={() => theme.toggle()}
  title="Switch to {switchesTo} theme"
>
  {#if theme.effective === 'dark'}
    <!-- Sun -->
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
      />
    </svg>
  {:else}
    <!-- Crescent moon -->
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  {/if}
  <span class="visually-hidden">Switch to {switchesTo} theme</span>
</button>

<style>
  button {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
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

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
