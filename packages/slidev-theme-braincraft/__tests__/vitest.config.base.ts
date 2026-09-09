import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

// Vitest 5 hardcodes base:'/' — the vite base option cannot override
// import.meta.env.BASE_URL in tests. The test uses vi.stubEnv instead.
// This config exists only to run the base URL test in isolation with
// its own include glob.
export default defineConfig({
  plugins: [vue()],
  test: {
    include: [
      'packages/slidev-theme-braincraft/__tests__/layoutHelper.base.test.ts',
    ],
  },
})
