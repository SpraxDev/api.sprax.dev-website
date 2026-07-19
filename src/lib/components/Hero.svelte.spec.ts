import { KNOWN_USERNAMES } from '$lib/data/known-usernames';
import { username } from '$lib/state/username.svelte';
import { beforeEach, describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page, userEvent } from 'vitest/browser';
import Hero from './Hero.svelte';

describe('Hero.svelte', () => {
  beforeEach(() => {
    // The username state is a shared module — reset it between tests.
    username.value = '';
  });

  it('picks a curated username on mount', async () => {
    render(Hero);

    const input = page.getByLabelText('Minecraft username');
    await expect.element(input).toBeInTheDocument();
    expect(KNOWN_USERNAMES).toContain(username.value);
    await expect.element(input).toHaveValue(username.value);
  });

  it('commits a typed username to the shared state on Enter', async () => {
    render(Hero);

    const input = page.getByLabelText('Minecraft username');
    await input.fill('Herobrine');
    await userEvent.keyboard('{Enter}');

    expect(username.value).toBe('Herobrine');
  });

  it('re-rolls to a different curated username when the dice is clicked', async () => {
    render(Hero);
    const before = username.value;

    await page.getByRole('button', { name: 'Pick a random player' }).click();

    expect(username.value).not.toBe(before);
    expect(KNOWN_USERNAMES).toContain(username.value);
  });
});
