import { createApiReference } from '@scalar/api-reference';
import '@scalar/api-reference/style.css';
import { API_BASE } from '$lib/api';
import { scalarConfig } from '$lib/scalar-config';
import type { Theme } from '$lib/state/theme.svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { page } from 'vitest/browser';

/**
 * Guards the styling/config contract with `@scalar/api-reference` across
 * upgrades: Scalar honouring our CSS variables and hiding its own chrome is
 * a third-party promise, and some of it (`agent.disabled`) isn't even in the
 * public config type. Rendered against a local fixture so the suite stays
 * offline and independent of the live OpenAPI document.
 */
const FIXTURE = {
  openapi: '3.1.0',
  info: { title: 'Fixture API', version: '1.0.0' },
  paths: {
    '/thing': {
      get: { summary: 'Get a thing', responses: { '200': { description: 'ok' } } }
    }
  }
};

let app: { destroy?: () => void } | undefined;
let container: HTMLDivElement | undefined;

async function renderReference(theme: Theme): Promise<HTMLElement> {
  const { url: _liveDocument, ...config } = scalarConfig(theme);

  container = document.createElement('div');
  document.body.append(container);
  app = createApiReference(container, { ...config, content: FIXTURE });

  await expect.element(page.getByRole('heading', { name: 'Get a thing' })).toBeInTheDocument();
  // The Ask-AI/developer chrome mounts after the document does, so the
  // absence assertions would pass vacuously without settling first
  await new Promise((resolve) => setTimeout(resolve, 750));

  return container.querySelector('.scalar-app')!;
}

afterEach(() => {
  app?.destroy?.();
  container?.remove();
  app = container = undefined;
  // Scalar drives its own theme off these, so a leftover class would decide
  // the next test's colours
  document.body.classList.remove('dark-mode', 'light-mode');
});

describe('scalarConfig', () => {
  it('points at the live OpenAPI document', () => {
    expect(scalarConfig('dark').url).toBe(`${API_BASE}/openapi.json`);
  });

  it('applies the self-hosted fonts', async () => {
    const scalarApp = await renderReference('dark');
    const styles = getComputedStyle(scalarApp);

    expect(styles.fontFamily).toContain('Atkinson Hyperlegible Next Variable');
    expect(styles.getPropertyValue('--scalar-font-code')).toContain('Departure Mono');
  });

  it('applies our dark palette when the site is dark', async () => {
    const scalarApp = await renderReference('dark');
    const styles = getComputedStyle(scalarApp);

    expect(document.body).toHaveClass('dark-mode');
    expect(styles.getPropertyValue('--scalar-background-1')).toBe('#0c1014');
    expect(styles.getPropertyValue('--scalar-color-accent')).toBe('#93cc72');
  });

  it('applies our light palette when the site is light', async () => {
    const scalarApp = await renderReference('light');
    const styles = getComputedStyle(scalarApp);

    expect(document.body).toHaveClass('light-mode');
    expect(styles.getPropertyValue('--scalar-background-1')).toBe('#eef1f4');
    expect(styles.getPropertyValue('--scalar-color-accent')).toBe('#417c28');
  });

  it('keeps the developer and Ask-AI chrome hidden', async () => {
    const scalarApp = await renderReference('dark');

    // Matched on the visible labels: Scalar renders these as plain buttons
    // whose accessible name getByRole doesn't resolve. Each label is what the
    // commented flag removes, confirmed by re-rendering with it dropped.
    for (const label of ['Ask AI', 'VS Code', 'Cursor', 'Developer Tools', 'Configure', 'Share', 'Deploy']) {
      expect(page.getByText(label, { exact: true }).elements(), label).toHaveLength(0);
    }

    // mcp.disabled — the layer the editor links live in
    expect(scalarApp.querySelector('.scalar-mcp-layer')).toBeNull();
  });
});
