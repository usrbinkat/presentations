import slidevConfig from '@slidev/client/uno.config'
// uno.config.ts
// Extend Slidev's UnoCSS config with project-specific safelist.
// Source: antfu/talks pattern (Agent 4)
import { defineConfig } from 'unocss'

export default defineConfig({
  ...slidevConfig,
  safelist: [
    // Admonition component icons
    'i-carbon-information',
    'i-carbon-checkmark-filled',
    'i-carbon-warning-alt',
    'i-carbon-error',
    'i-carbon-notebook',
    // MetricCard icons used in decks
    'i-carbon-time',
    'i-carbon-cloud',
    'i-carbon-rocket',
    'i-carbon-chemistry',
    'i-carbon-misuse-outline',
    'i-carbon-grid',
    'i-carbon-assembly-cluster',
    'i-carbon-color-palette',
    ...(slidevConfig.safelist || []),
  ],
})
