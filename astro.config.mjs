import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  markdown: {
    remarkRehype: {
      allowDangerousHtml: true,
    },
  },
});
