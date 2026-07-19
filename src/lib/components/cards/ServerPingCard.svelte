<script lang="ts">
  import { onMount } from 'svelte';
  import { serverPingUrl } from '$lib/api';
  import DebouncedTextInput from '$lib/components/DebouncedTextInput.svelte';
  import SampleServerChips from '$lib/components/SampleServerChips.svelte';
  import { parseHostInput } from '$lib/host-input';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { initialSampleServer } from '$lib/data/sample-servers';
  import { parseMotd, stripLegacyCodes } from '$lib/motd';

  interface PingResult {
    online?: boolean;
    rttInMs?: number;
    status?: {
      version?: { name?: string };
      players?: { online?: number; max?: number };
      description?: unknown;
      favicon?: string;
    };
  }

  let hostInput = $state('');

  onMount(() => {
    hostInput = initialSampleServer();
  });

  // One input handles "host", "host:port" and (bracketed) IPv6; the port
  // lands in the URL exactly when the user typed one.
  const parsed = $derived(parseHostInput(hostInput));
  const url = $derived(serverPingUrl(parsed.host, parsed.port));

  async function pingServer(requestUrl: string): Promise<PingResult> {
    const response = await fetch(requestUrl);
    const body = await response.json();
    if (!response.ok) {
      throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${response.status}`);
    }
    return body;
  }

  const request = $derived(parsed.host === '' ? null : pingServer(url));
</script>

{#snippet skeleton()}
  <!-- Mirrors the loaded layout: favicon, a two-line MOTD box (the in-game
       server list allows two lines), and the players/version meta line -->
  <div class="result" aria-hidden="true">
    <div class="favicon skeleton"></div>
    <div class="lines">
      <p class="motd"><span class="bar" style:width="28ch"></span>{'\n'}<span
          class="bar"
          style:width="34ch"
        ></span></p>
      <p class="meta"><span class="bar" style:width="36ch"></span></p>
    </div>
  </div>
{/snippet}

<ShowcaseCard
  title="Server ping"
  badge="experimental"
  badgeTitle="This endpoint is still in the works — expect bugs and unstable behavior"
  {url}
>
  <div class="body">
    <DebouncedTextInput
      bind:value={hostInput}
      label="Server address to ping, optionally with port"
      id="ping-host"
      placeholder="mc.example.org[:25565]"
    />

    <SampleServerChips bind:value={hostInput} />

    {#if request === null}
      {@render skeleton()}
    {:else}
      {#await request}
        {@render skeleton()}
      {:then result}
        {#if result.online === false}
          <p class="offline">Server is offline or unreachable</p>
        {:else}
          <div class="result">
            {#if result.status?.favicon}
              <img class="favicon pixelated" src={result.status.favicon} alt="" width="64" height="64" />
            {:else}
              <div class="favicon placeholder" aria-hidden="true"></div>
            {/if}
            <div class="lines">
              <p class="motd" aria-label="Message of the day">
                {#each parseMotd(result.status?.description) as line, lineIndex (lineIndex)}
                  {#if lineIndex > 0}<br />{/if}
                  {#each line as span, spanIndex (spanIndex)}
                    <span
                      style:color={span.color}
                      style:font-weight={span.bold ? 'bold' : undefined}
                      style:font-style={span.italic ? 'italic' : undefined}
                      class={{
                        underlined: span.underlined,
                        strikethrough: span.strikethrough,
                        obfuscated: span.obfuscated
                      }}>{span.obfuscated ? '▒'.repeat(span.text.length) : span.text}</span
                    >
                  {/each}
                {/each}
              </p>
              <p class="meta">
                <span class="players">
                  {result.status?.players?.online?.toLocaleString('en') ?? '?'}
                  / {result.status?.players?.max?.toLocaleString('en') ?? '?'} online
                </span>
                {#if result.status?.version?.name}
                  · {stripLegacyCodes(result.status.version.name)}
                {/if}
                {#if result.rttInMs != null}
                  · {result.rttInMs}ms
                {/if}
              </p>
            </div>
          </div>
        {/if}
      {:catch error}
        <p class="offline">{error.message}</p>
      {/await}
    {/if}

    <p class="hint">
      This endpoint is experimental — known bugs may cause failed or wrong results for some
      servers.
    </p>
  </div>
</ShowcaseCard>

<style>
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    width: 100%;
    /* Top-align so the input lines up with the neighboring card's when the
       grid row is stretched by taller content */
    align-self: stretch;
  }

  .result {
    display: flex;
    align-items: flex-start;
    gap: var(--space-3);
    min-height: 64px;
  }

  .favicon {
    width: 64px;
    height: 64px;
    flex-shrink: 0;
  }

  .favicon.placeholder {
    background: var(--color-surface-raised);
  }

  .lines {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    min-width: 0;
    flex: 1;
  }

  /* The MOTD is rendered like the in-game server list: pixel font on near-black */
  .motd {
    margin: 0;
    background: #0a0c0e;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    line-height: 1.9;
    white-space: pre;
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--color-border-strong) transparent;
  }

  .underlined {
    text-decoration: underline;
  }

  .strikethrough {
    text-decoration: line-through;
  }

  .meta {
    margin: 0;
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-muted);
  }

  .players {
    color: var(--color-accent-strong);
  }

  .offline {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-danger);
    margin: 0;
    min-height: 64px;
    display: grid;
    align-items: center;
  }

  .hint {
    margin: 0;
    font-size: var(--text-xs);
    color: var(--color-text-faint);
  }

  .skeleton {
    background: var(--color-surface-raised);
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  .bar {
    display: inline-block;
    max-width: 100%;
    height: 0.9em;
    vertical-align: middle;
    background: var(--color-surface-raised);
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    to {
      opacity: 0.4;
    }
  }
</style>
