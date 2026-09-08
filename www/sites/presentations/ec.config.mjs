// @ts-check
import { createRequire } from 'node:module'
import { defineEcConfig } from 'astro-expressive-code'

const require = createRequire(import.meta.url)
const auroraDark = require('../../../packages/slidev-theme-braincraft/setup/aurora-dark.json')
const auroraLight = require('../../../packages/slidev-theme-braincraft/setup/aurora-light.json')

export default defineEcConfig({
  themes: [
    { ...auroraDark, name: 'dark' },
    { ...auroraLight, name: 'light' },
  ],

  styleOverrides: {
    borderColor: 'var(--code-border)',
    borderRadius: '0.75rem',
    borderWidth: '1px',
    codeBackground: 'var(--code-bg)',
    codeFontFamily: '\'Space Mono\', monospace',
    codeFontSize: '0.875rem',
    codeLineHeight: '1.7',
    codePaddingBlock: '1rem',
    codePaddingInline: '1rem',
    focusBorder: 'var(--focus)',
    uiFontFamily: '\'Inter\', system-ui, sans-serif',
    uiFontSize: '0.8rem',
    frames: {
      editorTabBarBackground: 'var(--surface-subtle)',
      editorActiveTabBackground: 'var(--code-bg)',
      editorActiveTabForeground: 'var(--text-primary)',
      terminalBackground: 'var(--code-bg)',
      terminalTitlebarBackground: 'var(--surface-subtle)',
      terminalTitlebarForeground: 'var(--text-tertiary)',
      terminalTitlebarBorderBottomColor: 'var(--code-border)',
      shadowColor: 'transparent',
    },
  },
})
