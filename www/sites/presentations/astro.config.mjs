import tailwindcss from '@tailwindcss/vite'
import expressiveCode from 'astro-expressive-code'
import { defineConfig, fontProviders } from 'astro/config'

export default defineConfig({
  site: 'https://usrbinkat.github.io',
  base: '/presentations',
  integrations: [expressiveCode()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        // Allow reading deck frontmatter and shared Shiki themes from repo root
        allow: ['../../..'],
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-sans',
      weights: ['300', '400', '500', '600', '700'],
    },
    {
      provider: fontProviders.google(),
      name: 'Space Mono',
      cssVariable: '--font-mono',
      weights: ['400', '700'],
      styles: ['normal', 'italic'],
    },
  ],
  prefetch: {
    defaultStrategy: 'hover',
  },
})
