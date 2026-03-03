<!--
  Layout: section
  Ontology tier: Tier 1 Structural
  Section slides reset the audience's attention clock by announcing a new
  narrative arc. The visual treatment differs from content slides — a subtle
  color-mix gradient and larger typography signal "release the previous context,
  prepare for new input." The presenter displays section slides briefly (~3-5
  seconds spoken). The optional `sectionNumber` prop renders a decorative
  number above the title for wayfinding.
-->
<script setup lang="ts">
import { handleBackground, useSchemeClass } from '../layoutHelper'

const { color, background, class: className, sectionNumber } = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() to detect type and apply correctly. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
  /** Optional section number displayed as a large decorative numeral. Rendered aria-hidden as a visual anchor for audience orientation. */
  sectionNumber?: string | number
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'mint')
</script>

<template>
  <div class="slidev-layout section" :class="[schemeClass, className]" :style="bgStyle">
    <div class="section-content">
      <div v-if="sectionNumber" class="section-number" aria-hidden="true">
        {{ sectionNumber }}
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--aurora-space-6);
  height: 100%;
  background:
    linear-gradient(
      135deg,
      var(--scheme-bg) 0%,
      color-mix(in oklch, var(--scheme-accent, var(--aurora-mint-400)) 8%, var(--scheme-bg, var(--aurora-cream-100))) 100%
    );
}

.section-content {
  text-align: center;
}

.section-number {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-medium);
  color: var(--scheme-accent, var(--aurora-mint-400));
  opacity: 0.6;
  margin-block-end: var(--aurora-space-2);
  letter-spacing: var(--aurora-tracking-wide);
}

.section :deep(h1) {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  letter-spacing: var(--aurora-tracking-tight);
}
</style>
