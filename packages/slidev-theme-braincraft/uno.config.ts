// uno.config.ts for the theme package
// Extends Slidev's UnoCSS config with:
// - presetIcons (100,000+ icons as CSS classes)
// - Transformer directives (@apply in style blocks)
// - Transformer variant groups (hover:(x y z))
// - Custom animation keyframes
// - Glass morphism and gradient shortcuts

import base from '@slidev/client/uno.config'
import { defineConfig, presetIcons, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  ...base,
  presets: [
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/',
      // For offline use, install: @iconify-json/carbon, @iconify-json/logos
    }),
    ...(base.presets || []),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
    ...(base.transformers || []),
  ],
  shortcuts: {
    ...((base as any).shortcuts || {}),
    // Aurora color shortcuts
    'text-aurora-primary': 'text-[var(--aurora-lavender-400)]',
    'text-aurora-secondary': 'text-[var(--aurora-mint-400)]',
    'text-aurora-accent': 'text-[var(--aurora-peach-400)]',
    'bg-aurora-cream': 'bg-[var(--aurora-cream-100)]',
    'bg-aurora-slate': 'bg-[var(--aurora-slate-800)]',
    // Layout helpers
    'aurora-center': 'flex items-center justify-center',
    'aurora-stack': 'flex flex-col gap-4',
    // Glass morphism
    'aurora-glass': 'backdrop-blur-md bg-white/10 border border-white/20 rounded-xl',
    'aurora-glass-dark': 'backdrop-blur-md bg-black/20 border border-white/10 rounded-xl',
    // Text gradient
    'aurora-text-gradient': 'bg-gradient-to-r from-[var(--aurora-lavender-400)] to-[var(--aurora-mint-400)] bg-clip-text text-transparent',
  },
  theme: {
    animation: {
      keyframes: {
        'fade-in-up': '{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}',
        'fade-in-down': '{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}',
        'scale-in': '{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}',
        'slide-in-left': '{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}',
        'slide-in-right': '{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}',
      },
      durations: {
        'fade-in-up': '0.5s',
        'fade-in-down': '0.5s',
        'scale-in': '0.4s',
        'slide-in-left': '0.5s',
        'slide-in-right': '0.5s',
      },
      timingFns: {
        'fade-in-up': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'fade-in-down': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'scale-in': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'slide-in-left': 'cubic-bezier(0.175, 0.885, 0.32, 1.05)',
        'slide-in-right': 'cubic-bezier(0.175, 0.885, 0.32, 1.05)',
      },
    },
  },
  safelist: [
    'i-carbon-terminal',
    'i-carbon-code',
    'i-carbon-document',
    'i-carbon-checkmark-filled',
    'i-carbon-warning',
    'i-carbon-warning-alt',
    'i-carbon-information',
    'i-carbon-error',
    'i-carbon-notebook',
  ],
})
