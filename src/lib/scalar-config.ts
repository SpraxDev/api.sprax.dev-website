import { API_BASE } from '$lib/api';
import type { Theme } from '$lib/state/theme.svelte';

/** Config for the `@scalar/api-reference` instance on the docs page. */
export function scalarConfig(effectiveTheme: Theme) {
  return {
    url: `${API_BASE}/openapi.json`,
    // Scalar's dark mode is driven by the site's theme toggle — one source
    // of truth, so Scalar's own toggle stays hidden
    forceDarkModeState: effectiveTheme,
    hideDarkModeToggle: true,
    // A plain reference: no MCP generator, no API-client button, and no
    // developer toolbar / Ask-AI chrome (not even on localhost)
    mcp: { disabled: true },
    hideClientButton: true,
    showDeveloperTools: 'never' as const,
    // Not in the public config type (yet), but honored at runtime:
    // kills the Ask-AI agent button, which otherwise shows on localhost
    ...{ agent: { disabled: true } },
    // Fonts are self-hosted by the site — don't fetch Scalar's CDN fonts
    withDefaultFonts: false,
    customCss: `
      .scalar-app {
        --scalar-font: 'Atkinson Hyperlegible Next Variable', system-ui, sans-serif;
        --scalar-font-code: 'Departure Mono', ui-monospace, monospace;
      }
      .dark-mode {
        --scalar-color-accent: #93cc72;
        --scalar-background-1: #0c1014;
        --scalar-background-2: #12171d;
        --scalar-background-3: #1a2129;
      }
      .light-mode {
        --scalar-color-accent: #417c28;
        --scalar-background-1: #eef1f4;
        --scalar-background-2: #f7f9fa;
        --scalar-background-3: #e2e8ed;
      }
    `
  };
}
