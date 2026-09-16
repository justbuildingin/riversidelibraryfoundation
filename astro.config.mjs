import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output. A landing page with form posts handled by Netlify needs no
// server, which is also what makes it cheap enough for a non-profit to run.
export default defineConfig({
  site: 'https://riversidelibraryfoundation.netlify.app',
  integrations: [sitemap()],
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
});
