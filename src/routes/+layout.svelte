<script lang="ts">
  import '@fontsource-variable/atkinson-hyperlegible-next/index.css';
  import '$lib/styles/tokens.css';
  import '$lib/styles/global.css';
  import favicon from '$lib/assets/favicon.svg';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
