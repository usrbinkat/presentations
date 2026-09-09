<!--
  Layout: end
  Ontology tier: Tier 1 Structural
  The closing slide exploits the recency effect — audiences remember the final
  visual disproportionately. The presenter closes with a substantive takeaway
  in the default slot, not a generic "Thank You." The optional `cta` slot holds
  QR codes, contact links, or follow-up actions that the audience scans while
  the presenter fields questions.
-->
<script setup lang="ts">
import { handleBackground, useSchemeClass } from '../layoutHelper'

const {
  color,
  background,
  class: className,
} = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() to detect type and apply correctly. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'slate')
</script>

<template>
  <div
    class="slidev-layout end"
    :class="[schemeClass, className]"
    :style="bgStyle"
  >
    <div class="end-content">
      <div class="end-takeaway">
        <slot />
      </div>
      <div v-if="$slots.cta" class="end-cta">
        <slot name="cta" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.end {
  display: grid;
  place-items: center;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
}

.end-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-content-gap);
  position: relative;
}

/* Ambient glow — mirrored from cover for visual bookending */
.end-content::before {
  content: '';
  position: absolute;
  inset: -2rem;
  background: radial-gradient(
    ellipse at 70% 50%,
    color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 15%, transparent) 0%,
    transparent 70%
  );
  z-index: -1;
  pointer-events: none;
}

.end-takeaway :deep(h1) {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
}

.end-takeaway :deep(p) {
  font-size: var(--aurora-text-xl);
  margin-top: var(--aurora-space-4);
  opacity: 0.8;
}

.end-cta {
  margin-top: var(--aurora-space-4);
}
</style>
