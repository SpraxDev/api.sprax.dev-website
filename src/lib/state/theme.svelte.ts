export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Theme state: follows the system preference until the user explicitly
 * toggles, which persists an override (also applied pre-paint by the inline
 * script in app.html).
 */
export class ThemeState {
  /** Explicit user choice; null = follow the system */
  choice = $state<Theme | null>(null);
  system = $state<Theme>('dark');

  readonly effective: Theme = $derived(this.choice ?? this.system);

  #initialized = false;

  /** Client-only; called from the toggle's onMount. Safe to call twice. */
  init(): void {
    if (this.#initialized) return;
    this.#initialized = true;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      this.choice = stored;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    this.system = media.matches ? 'dark' : 'light';
    media.addEventListener('change', (event) => {
      this.system = event.matches ? 'dark' : 'light';
    });
  }

  toggle(): void {
    const next: Theme = this.effective === 'dark' ? 'light' : 'dark';
    this.choice = next;
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.theme = next;
  }
}

export const theme = new ThemeState();
