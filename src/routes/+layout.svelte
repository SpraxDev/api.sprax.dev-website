<script lang="ts">
  import '@fontsource-variable/atkinson-hyperlegible-next/index.css';
  import '$lib/styles/tokens.css';
  import '$lib/styles/global.css';
  import WipNotice from '$lib/components/WipNotice.svelte';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="shortcut icon" href="/favicon.ico" sizes="48x48 32x32 16x16" />
</svelte:head>

{@render children()}

<WipNotice />
