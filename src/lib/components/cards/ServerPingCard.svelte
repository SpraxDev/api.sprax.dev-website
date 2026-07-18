<script lang="ts">
  import { onMount } from 'svelte';
  import { serverPingUrl } from '$lib/api';
  import DebouncedTextInput from '$lib/components/DebouncedTextInput.svelte';
  import { parseHostInput } from '$lib/host-input';
  import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';
  import { SAMPLE_SERVERS, pickRandomSampleServer } from '$lib/data/sample-servers';
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
    hostInput = pickRandomSampleServer();
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
  <div class="result skeleton-row" aria-hidden="true">
    <div class="favicon skeleton"></div>
    <div class="lines">
      <span class="skeleton" style:width="80%"></span>
      <span class="skeleton" style:width="55%"></span>
    </div>
  </div>
{/snippet}

<ShowcaseCard title="Server ping" {url}>
  <div class="body">
    <DebouncedTextInput
      bind:value={hostInput}
      label="Server address to ping, optionally with port"
      id="ping-host"
      placeholder="mc.example.org[:25565]"
    />

    <div class="samples" role="group" aria-label="Sample servers">
      {#each SAMPLE_SERVERS as sample (sample)}
        <button
          type="button"
          class={['chip', { active: sample === hostInput }]}
          onclick={() => (hostInput = sample)}
        >
          {sample}
        </button>
      {/each}
    </div>

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
  </div>
</ShowcaseCard>

<style>
  .body {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
    width: 100%;
  }

  .samples {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-1);
  }

  .chip {
    background: none;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: 2px var(--space-2);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-text-faint);
    cursor: pointer;
    transition:
      border-color 0.15s,
      color 0.15s;
  }

  .chip:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .chip.active {
    border-color: var(--color-border-strong);
    color: var(--color-text-muted);
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

  .skeleton-row .lines {
    justify-content: center;
  }

  span.skeleton {
    display: block;
    height: var(--space-3);
  }

  .skeleton {
    background: var(--color-surface-raised);
    animation: pulse 1.2s ease-in-out infinite alternate;
  }

  @keyframes pulse {
    to {
      opacity: 0.4;
    }
  }
</style>
