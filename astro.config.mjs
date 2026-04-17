import { defineConfig } from 'astro/config';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  output: 'static',

  markdown: {
    remarkRehype: {
      allowDangerousHtml: true,
    },
  },

  adapter: cloudflare()
});