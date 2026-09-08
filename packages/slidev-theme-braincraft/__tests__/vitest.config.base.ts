import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Vitest config that sets a non-root base to simulate GitHub Pages subdirectory deployment.
// Vite derives import.meta.env.BASE_URL from the `base` config option.
// Used by layoutHelper.base.test.ts to verify resolveAssetUrl prepends correctly.
export default defineConfig({
  plugins: [vue()],
  base: '/presentations/deck/',
  test: {
    include: ['packages/slidev-theme-braincraft/__tests__/layoutHelper.base.test.ts'],
  },
})
