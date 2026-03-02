// uno.config.ts for the theme package
// Extends Slidev's UnoCSS config with Aurora shortcuts.
// Source: Agent 3 (ktym4a programmatic generation), Agent 4 (antfu pattern)

import { defineConfig } from 'unocss'
import base from '@slidev/client/uno.config'

export default defineConfig({
  ...base,
  shortcuts: {
    // Aurora color shortcuts
    'text-aurora-primary': 'text-[var(--aurora-lavender-400)]',
    'text-aurora-secondary': 'text-[var(--aurora-mint-400)]',
    'text-aurora-accent': 'text-[var(--aurora-peach-400)]',
    'bg-aurora-cream': 'bg-[var(--aurora-cream-100)]',
    'bg-aurora-slate': 'bg-[var(--aurora-slate-800)]',
    // Layout helpers
    'aurora-center': 'flex items-center justify-center',
    'aurora-stack': 'flex flex-col gap-4',
  },
})
