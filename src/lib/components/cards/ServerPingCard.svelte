<script lang="ts">
  import { onMount } from 'svelte';
  import { serverPingUrl } from '$lib/api';
  import DebouncedTextInput from '$lib/components/DebouncedTextInput.svelte';
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

  let host = $state('');
  let port = $state<number | undefined>(undefined);

  onMount(() => {
    host = pickRandomSampleServer();
  });

  function parsePort(value: number): number | undefined {
    return Number.isFinite(value) && value >= 1 && value <= 65535 ? Math.round(value) : undefined;
  }

  async function pingServer(hostname: string, portNumber?: number): Promise<PingResult> {
    const response = await fetch(serverPingUrl(hostname, portNumber));
    const body = await response.json();
    if (!response.ok) {
      throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${response.status}`);
    }
    return body;
  }

  const request = $derived(host === '' ? null : pingServer(host, port));
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

<ShowcaseCard title="Server ping" url={serverPingUrl(host, port)}>
  <div class="body">
    <div class="input-row">
      <div class="host">
        <DebouncedTextInput
          bind:value={host}
          label="Server address to ping"
          id="ping-host"
          placeholder="mc.example.org"
        />
      </div>
      <label class="visually-hidden" for="ping-port">Port (optional)</label>
      <input
        id="ping-port"
        class="port"
        type="number"
        min="1"
        max="65535"
        placeholder="25565"
        value={port ?? ''}
        onchange={(event) => (port = parsePort(event.currentTarget.valueAsNumber))}
      />
    </div>

    <div class="samples" role="group" aria-label="Sample servers">
      {#each SAMPLE_SERVERS as sample (sample)}
        <button
          type="button"
          class={['chip', { active: sample === host }]}
          onclick={() => (host = sample)}
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

  .input-row {
    display: flex;
    gap: var(--space-2);
  }

  .host {
    flex: 1;
    min-width: 0;
  }

  .port {
    width: 6.5rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius);
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    transition: border-color 0.15s;
  }

  .port::placeholder {
    color: var(--color-text-faint);
  }

  .port:hover,
  .port:focus {
    border-color: var(--color-accent);
  }

  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
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
