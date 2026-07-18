import { pickRandomUsername } from '$lib/data/known-usernames';

/**
 * Global username state driving every preview card on the page.
 * The initial value is picked client-side (see Hero) so the prerendered
 * HTML stays username-agnostic.
 */
export class UsernameState {
  value = $state('');

  randomize(): void {
    this.value = pickRandomUsername(this.value);
  }
}

export const username = new UsernameState();
