<script lang="ts">
  let {
    title,
    description,
    path
  }: {
    title: string;
    description: string;
    /** Canonical path of the page, e.g. '/' or '/docs' */
    path: string;
  } = $props();

  const SITE_ORIGIN = 'https://api.sprax.dev';
  const url = $derived(`${SITE_ORIGIN}${path}`);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="SpraxAPI" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content="{SITE_ORIGIN}/og.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="The api.sprax.dev landing page: a username input above live Minecraft skin render previews" />
  <meta name="twitter:card" content="summary_large_image" />

  <!-- Discord uses this for the embed accent color -->
  <meta name="theme-color" content="#7cb65b" />
</svelte:head>
