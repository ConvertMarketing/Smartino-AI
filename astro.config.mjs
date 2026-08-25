// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * GitHub Pages serves this project site from a sub-path:
 *   https://convertmarketing.github.io/Smartino-AI/
 *
 * Every internal link and asset must therefore be prefixed with the base.
 * Use `import.meta.env.BASE_URL` in templates, never a bare "/" path.
 *
 * When a custom domain is attached later, the only change needed is to set
 * SITE_URL / BASE_PATH in the deploy workflow and add public/CNAME.
 */
const SITE_URL = process.env.SITE_URL ?? 'https://convertmarketing.github.io';
const BASE_PATH = process.env.BASE_PATH ?? '/Smartino-AI';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  build: {
    // Emit /about/index.html rather than /about.html so paths work identically
    // on GitHub Pages and in local preview.
    format: 'directory',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
