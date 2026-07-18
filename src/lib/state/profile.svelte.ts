import { profileUrl } from '$lib/api';
import { username } from './username.svelte';

async function fetchProfile(name: string): Promise<unknown> {
  const response = await fetch(profileUrl(name));
  const body = await response.json();
  if (!response.ok) {
    throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${response.status}`);
  }
  return body;
}

/**
 * The current player's profile request, shared by every consumer (profile
 * card, skin-by-URL card) so the profile is fetched once per username change.
 */
export class ProfileState {
  readonly request: Promise<unknown> | null = $derived(
    username.value === '' ? null : fetchProfile(username.value)
  );
}

export const profile = new ProfileState();
