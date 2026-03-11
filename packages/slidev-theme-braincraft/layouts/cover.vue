<!--
  Layout: cover
  Ontology tier: Tier 1 Structural
  The opening slide exploits the primacy effect — the audience forms a mental
  model of the entire talk in the first 10 seconds. The presenter uses the
  default slot for a headline and subtitle. The `background` prop accepts an
  image URL (auto-dimmed), CSS color, or gradient to set the visual tone.
-->
<script setup lang="ts">
import { handleBackground, useSchemeClass } from '../layoutHelper'

const { color, background, class: className } = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() with dimming enabled by default. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
}>()

const style = handleBackground(background, true)
const schemeClass = useSchemeClass(color, 'lavender')
</script>

<template>
  <div class="slidev-layout cover" :style="style" :class="[schemeClass, className]">
    <div class="cover-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
}

.cover-content {
  max-width: 80%;
  position: relative;
}

.cover-full .cover-content {
  max-width: 100%;
  width: 100%;
}

/* Ambient glow behind the title — subtle depth cue */
.cover-content::before {
  content: '';
  position: absolute;
  inset: -2rem;
  background: radial-gradient(
    ellipse at 30% 50%,
    color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 15%, transparent) 0%,
    transparent 70%
  );
  z-index: -1;
  pointer-events: none;
}

.cover :deep(h1) {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
  letter-spacing: var(--aurora-tracking-tight);
}

.cover :deep(p) {
  font-size: var(--aurora-text-xl);
  margin-top: var(--aurora-space-4);
  opacity: 0.8;
}
</style>
