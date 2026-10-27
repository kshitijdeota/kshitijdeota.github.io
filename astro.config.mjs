import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const envBase = process.env.KDPX_BASE?.trim();
// e.g. KDPX_BASE=/kdpixels/ for the subfolder test deploy; production stays '/'
const base = envBase && envBase !== '/' ? `/${envBase.replace(/^\/|\/$/g, '')}/` : '/';

// https://astro.build/config
export default defineConfig({
  site: 'https://kdpixels.com',
  base,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [sitemap()],
});
