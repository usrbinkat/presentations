<!--
  Layout: two-cols
  Ontology tier: Tier 3 Comparison
  Two parallel content areas of equal weight. Dual encoding — presenting two
  related pieces of information side-by-side lets the audience's visual system
  process relationships (similarity, contrast, complementarity) that sequential
  presentation obscures. The presenter places left-column content in the default
  slot and right-column content in the `right` named slot.
-->
<script setup lang="ts">
import { handleBackground, useSchemeClass } from '../layoutHelper'

const { color, background, class: className, layoutClass, leftColor, rightColor } = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() to detect type and apply correctly. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
  /** Additional CSS class applied to the columns grid container. */
  layoutClass?: string
  /** Aurora color scheme for the left column only. Overrides the slide-level color for the left column. */
  leftColor?: string
  /** Aurora color scheme for the right column only. Overrides the slide-level color for the right column. */
  rightColor?: string
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'cream')
const leftSchemeClass = leftColor ? useSchemeClass(leftColor) : undefined
const rightSchemeClass = rightColor ? useSchemeClass(rightColor) : undefined
</script>

<template>
  <div class="slidev-layout two-cols" :class="[schemeClass, className]" :style="bgStyle">
    <div class="col-left" :class="[layoutClass, leftSchemeClass]">
      <slot />
      <slot name="left" />
    </div>
    <div class="col-right" :class="[layoutClass, rightSchemeClass]">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-content-gap);
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
  overflow: hidden;
}

.col-left,
.col-right {
  min-height: 0;
  overflow: hidden;
}

/* Constrain images within columns */
.col-left :deep(img),
.col-right :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.two-cols :deep(h1:first-child),
.two-cols :deep(h2:first-child) {
  margin-block-start: 0;
  margin-block-end: var(--aurora-title-margin-bottom);
}

/* When columns receive a per-column color scheme, elevate them into cards */
.col-left[class*="-scheme"],
.col-right[class*="-scheme"] {
  padding: var(--aurora-space-6);
  border-radius: var(--aurora-radius-xl);
  border: var(--aurora-border-medium) solid var(--scheme-border, var(--aurora-cream-400));
  box-shadow: var(--scheme-shadow, var(--aurora-shadow-sm));
  background-color: var(--scheme-bg);
}
</style>
