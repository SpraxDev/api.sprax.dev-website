<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>API docs — Sprax API</title>
</svelte:head>

<main>
  <h1>API docs</h1>
  <p>
    The interactive API reference is being built right now. Until it lands, the
    <a href="https://github.com/SpraxDev/api.sprax.dev" target="_blank" rel="noopener noreferrer">GitHub repository</a> is the best place
    to explore the endpoints.
  </p>
  <p><a href={resolve('/')}>← Back to the showcase</a></p>
</main>

<style>
  main {
    max-width: 36rem;
    margin: 0 auto;
    padding: var(--space-16) var(--space-4);
  }

  h1 {
    font-size: var(--text-xl);
    text-transform: uppercase;
    margin-bottom: var(--space-4);
  }

  p {
    color: var(--color-text-muted);
  }
</style>
