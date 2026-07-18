<script lang="ts">
  let {
    host = $bindable(),
    label,
    id
  }: { host: string; label: string; id: string } = $props();

  // Writable derived: typing edits the draft locally; sample-server chips
  // (which write `host` directly) re-derive it.
  let draft = $derived(host);
  let commitTimeout: ReturnType<typeof setTimeout> | undefined;

  function commit(): void {
    clearTimeout(commitTimeout);
    const value = draft.trim();
    if (value !== '') {
      host = value;
    }
  }

  function scheduleCommit(): void {
    clearTimeout(commitTimeout);
    commitTimeout = setTimeout(commit, 500);
  }
</script>

<label class="visually-hidden" for={id}>{label}</label>
<input
  {id}
  type="text"
  autocomplete="off"
  autocapitalize="off"
  spellcheck="false"
  placeholder="mc.example.org"
  bind:value={draft}
  oninput={scheduleCommit}
  onchange={commit}
  onkeydown={(event) => event.key === 'Enter' && commit()}
/>

<style>
  input {
    width: 100%;
    background: var(--color-bg);
    border: 1px solid var(--color-border-strong);
    border-radius: var(--radius);
    padding: var(--space-2) var(--space-3);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    transition: border-color 0.15s;
  }

  input::placeholder {
    color: var(--color-text-faint);
  }

  input:hover,
  input:focus {
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
</style>
