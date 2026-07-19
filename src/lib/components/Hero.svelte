<script lang="ts">
  import { username } from '$lib/state/username.svelte';
  import { onMount } from 'svelte';

  // Writable derived: typing edits the draft locally, the dice button
  // (which writes username.value) re-derives it.
  let draft = $derived(username.value);
  let commitTimeout: ReturnType<typeof setTimeout> | undefined;

  onMount(() => {
    // Initial name is picked client-side so the prerendered HTML stays username-agnostic.
    if (username.value === '') {
      username.randomize();
    }
    return () => clearTimeout(commitTimeout);
  });

  function commit(): void {
    clearTimeout(commitTimeout);
    const name = draft.trim();
    if (name !== '') {
      username.value = name;
    }
  }

  function scheduleCommit(): void {
    clearTimeout(commitTimeout);
    commitTimeout = setTimeout(commit, 500);
  }

  function randomize(): void {
    clearTimeout(commitTimeout);
    username.randomize();
  }
</script>

<section class="hero">
  <p class="eyebrow">api.sprax.dev</p>
  <h1>Minecraft profiles, skins &amp; blocklist data</h1>
  <p class="tagline">A free public REST API — type any username and try it live</p>

  <div class="input-row">
    <label class="visually-hidden" for="global-username">Minecraft username</label>
    <input
      id="global-username"
      type="text"
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
      placeholder="Minecraft username or UUID…"
      bind:value={draft}
      oninput={scheduleCommit}
      onchange={commit}
      onkeydown={(event) => event.key === 'Enter' && commit()}
    />
    <button type="button" class="dice" onclick={randomize} title="Random player">
      <!-- Pixel-art die: 14-unit grid at 28px = exact 2x scale, so edges stay crisp -->
      <svg viewBox="0 0 14 14" width="28" height="28" shape-rendering="crispEdges" aria-hidden="true">
        <path fill="currentColor" d="M2 1h10v1h1v10h-1v1H2v-1H1V2h1z" />
        <g class="pips">
          <rect x="3" y="3" width="2" height="2" />
          <rect x="9" y="3" width="2" height="2" />
          <rect x="6" y="6" width="2" height="2" />
          <rect x="3" y="9" width="2" height="2" />
          <rect x="9" y="9" width="2" height="2" />
        </g>
      </svg>
      <span class="visually-hidden">Pick a random player</span>
    </button>
  </div>
</section>

<style>
  .hero {
    text-align: center;
    padding: var(--space-16) var(--space-4) var(--space-12);
  }

  .eyebrow {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-gold);
    letter-spacing: 0.1em;
    margin: 0 0 var(--space-4);
  }

  h1 {
    font-size: clamp(1.5rem, 4.5vw, var(--text-3xl));
    text-transform: uppercase;
    letter-spacing: 0.02em;
    max-width: 44rem;
    margin: 0 auto;
    text-wrap: balance;
  }

  .tagline {
    color: var(--color-text-muted);
    max-width: 34rem;
    margin: var(--space-4) auto var(--space-8);
  }

  .input-row {
    display: flex;
    justify-content: center;
    gap: var(--space-2);
    max-width: 28rem;
    margin: 0 auto;
  }

  input {
    flex: 1;
    min-width: 0;
    background: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius);
    padding: var(--space-3) var(--space-4);
    font-family: var(--font-mono);
    font-size: var(--text-lg);
    transition: border-color 0.15s;
  }

  input::placeholder {
    color: var(--color-text-faint);
  }

  input:hover,
  input:focus {
    border-color: var(--color-accent);
  }

  .dice {
    display: grid;
    place-items: center;
    aspect-ratio: 1;
    background: var(--color-surface);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius);
    color: var(--color-text-muted);
    cursor: pointer;
    transition:
      border-color 0.15s,
      color 0.15s;
  }

  .dice:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .dice:active svg {
    transform: rotate(90deg);
  }

  /* Pips are punched out of the die in the button's background color */
  .pips {
    fill: var(--color-surface);
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
