<script lang="ts">
  import { resolve } from '$app/paths';
  import { API_BASE } from '$lib/api';
</script>

<div class="card">
  <div class="columns">
    <div>
      <h3>Base URL</h3>
      <code>{API_BASE}</code>
      <p>
        v2 endpoints (<code class="inline">/mc/v2/…</code>) are current. v1 is kept for
        compatibility and currently serves skin renders and capes.
      </p>
    </div>
    <div>
      <h3>Free to use</h3>
      <p>
        No API key, no signup — fair use. You <strong>must</strong> send a descriptive
        <code class="inline">User-Agent</code> (include a version, ideally a contact URL).
      </p>
    </div>
    <div>
      <h3>Resources</h3>
      <ul>
        <li><a href={resolve('/docs')}>Interactive API reference</a></li>
        <li><a href="{API_BASE}/openapi.json">OpenAPI specification</a></li>
        <li>
          <a href="https://github.com/SpraxDev/api.sprax.dev" target="_blank" rel="noopener noreferrer">
            Source on GitHub
          </a>
          <span class="muted">(GPL-3.0)</span>
        </li>
      </ul>
    </div>
  </div>
</div>

<style>
  .card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    padding: var(--space-4);
  }

  .columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(14rem, 100%), 1fr));
    gap: var(--space-6);
  }

  h3 {
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-text-muted);
    margin: 0 0 var(--space-2);
  }

  code {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-accent-strong);
    margin-bottom: var(--space-2);
  }

  code.inline {
    display: inline;
    font-size: var(--text-xs);
    color: var(--color-text);
    margin: 0;
  }

  p {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-text-muted);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
    font-size: var(--text-sm);
  }

  .muted {
    color: var(--color-text-faint);
    font-size: var(--text-xs);
  }
</style>
