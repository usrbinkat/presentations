import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    include: ['packages/**/__tests__/**/*.test.ts', 'lib/**/__tests__/**/*.test.ts'],
    exclude: ['**/layoutHelper.base.test.ts'],
  },
})
