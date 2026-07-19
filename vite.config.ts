import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        // Force runes mode for the project, except for libraries. Can be removed in svelte 6.
        runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      },
      adapter: adapter(),
      // With adapter-static the policy is emitted as a <meta http-equiv> tag in
      // every prerendered page; SvelteKit adds hashes for its inline init
      // scripts automatically. (frame-ancestors/report-uri/sandbox would be
      // ignored in meta tags — set those via nginx if ever needed.)
      csp: {
        mode: 'auto',
        directives: {
          'default-src': ['none'],
          'script-src': ['self'],
          'script-src-attr': [
            'self',

            'unsafe-hashes',
            'sha256-7dQwUgLau1NFCCGjfn9FsYptB6ZtWxJin6VohGIu20I=',  // https://github.com/sveltejs/svelte/issues/14014
          ],
          'style-src': ['self', 'unsafe-inline'],
          'font-src': ['self'],
          'img-src': ['self', 'data:', 'https://api.sprax.dev'],
          'media-src': ['none'],
          'frame-src': ['none'],
          'manifest-src': ['none'],
          'connect-src': ['self', 'https://api.sprax.dev'],
          'worker-src': ['none'],
          'base-uri': ['none'],
          'form-action': ['none'],
          'frame-ancestors': ['none'],
          'object-src': ['none'],
        },
      }
    })
  ],
  test: {
    expect: { requireAssertions: true },
    coverage: {
      // istanbul instead of v8 because the browser tests also run in Firefox (v8 is Chromium-only)
      provider: 'istanbul',
      include: ['src/**/*.{js,ts,svelte}'],
    },
    projects: [
      {
        extends: './vite.config.ts',
        test: {
          name: 'client',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'firefox', headless: true }, { browser: 'chromium', headless: true }]
          },
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**']
        }
      },

      {
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
        }
      }
    ]
  }
});
