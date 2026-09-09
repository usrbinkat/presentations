<!--
  HeroBlock.vue — Prominent display container for hero content.
  Provides a contained, styled block that visually elevates its content
  above surrounding elements. Use for key patterns, formulas, URLs,
  commands, or any single piece of information that should be the
  dominant visual element on a slide.

  Usage in slides.md:
    <HeroBlock>
      /workspace/{user}/{server}/{namespace}/
    </HeroBlock>

    <HeroBlock align="left" size="lg">
      nix develop .#full
    </HeroBlock>

  Props:
    align  — text alignment: "center" (default), "left", "right"
    size   — text scale: "md" (default), "lg", "xl"
    mono   — use monospace font (default true)
-->
<script setup lang="ts">
import { computed } from 'vue'

const {
  align = 'center',
  size = 'md',
  mono = true,
} = defineProps<{
  /** Text alignment within the block */
  align?: 'left' | 'center' | 'right'
  /** Text size preset */
  size?: 'md' | 'lg' | 'xl'
  /** Use monospace font (default true) */
  mono?: boolean
}>()

const sizeMap: Record<string, string> = {
  md: 'clamp(1.4rem, 2.8vw, 2.1rem)',
  lg: 'clamp(1.6rem, 3.2vw, 2.5rem)',
  xl: 'clamp(2rem, 4vw, 3rem)',
}

const style = computed(() => ({
  textAlign: align,
  fontSize: sizeMap[size] || sizeMap.md,
  fontFamily: mono ? 'var(--aurora-font-mono)' : 'inherit',
}))
</script>

<template>
  <div class="hero-block" :style="style">
    <slot />
  </div>
</template>

<style scoped>
.hero-block {
  font-weight: var(--aurora-font-bold);
  letter-spacing: -0.02em;
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading, var(--aurora-slate-700));
  padding: var(--aurora-space-4) var(--aurora-space-8);
  margin-block: var(--aurora-space-3);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 80%, transparent);
  border-radius: var(--aurora-radius-lg);
  border: 1px solid color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 25%, transparent);
  box-shadow: var(--aurora-shadow-sm);
}

/* Prevent nested code from double-styling */
.hero-block :deep(code) {
  background: transparent !important;
  padding: 0 !important;
  font-size: inherit !important;
  color: inherit !important;
}
</style>
