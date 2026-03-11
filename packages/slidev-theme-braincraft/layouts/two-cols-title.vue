<!--
  Layout: two-cols-title
  Ontology tier: Tier 3 Comparison (two-cols-header variant)
  A shared title spans the full width above two columns. Each column accepts
  independent content via `left` and `right` named slots. The title in the
  default slot unifies the comparison while the columns present the contrasting
  or complementary material. The `columns` prop controls the grid ratio.
-->
<script setup lang="ts">
import { handleBackground, useSchemeClass } from '../layoutHelper'

const { color, background, class: className, columns, leftColor, rightColor } = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() to detect type and apply correctly. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
  /** CSS grid-template-columns value for the two columns. Defaults to '1fr 1fr'. Accepts any valid grid track definition (e.g., '2fr 1fr'). */
  columns?: string
  /** Aurora color scheme for the left column only. Overrides the slide-level color for the left column. */
  leftColor?: string
  /** Aurora color scheme for the right column only. Overrides the slide-level color for the right column. */
  rightColor?: string
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'cream')
const gridCols = columns || '1fr 1fr'
const leftSchemeClass = leftColor ? useSchemeClass(leftColor) : undefined
const rightSchemeClass = rightColor ? useSchemeClass(rightColor) : undefined
</script>

<template>
  <div class="slidev-layout two-cols-title" :class="[schemeClass, className]" :style="bgStyle">
    <div class="title-area">
      <slot />
    </div>
    <div class="columns-area" :style="{ gridTemplateColumns: gridCols }">
      <div class="col-left" :class="leftSchemeClass">
        <slot name="left" />
      </div>
      <div class="col-right" :class="rightSchemeClass">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.two-cols-title {
  display: flex;
  flex-direction: column;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
}

.title-area {
  flex-shrink: 0;
  margin-bottom: var(--aurora-title-margin-bottom);
}

.columns-area {
  display: grid;
  gap: var(--aurora-content-gap);
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.columns-area .col-left,
.columns-area .col-right {
  min-height: 0;
  overflow: hidden;
}

.columns-area :deep(img) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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
