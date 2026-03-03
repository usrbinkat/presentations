<!--
  Layout: side-title
  Ontology tier: Utility (maps to image-text variant in the ontology)
  A title column sits beside a content column, separated by a vertical border.
  The presenter places the heading in the `title` named slot and the body
  content in the default slot. The `titleWidth` prop controls the left
  column's share of the grid.
-->
<script setup lang="ts">
import { handleBackground, useSchemeClass } from '../layoutHelper'

const { color, background, class: className, titleWidth } = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() to detect type and apply correctly. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
  /** CSS width or grid fraction for the title column. Defaults to '1fr'. The content column is always '2fr'. */
  titleWidth?: string
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'cream')
const gridCols = `${titleWidth || '1fr'} 2fr`
</script>

<template>
  <div class="slidev-layout side-title" :class="[schemeClass, className]" :style="[bgStyle, { gridTemplateColumns: gridCols }]">
    <div class="title-side">
      <slot name="title" />
    </div>
    <div class="content-side">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.side-title {
  display: grid;
  gap: var(--aurora-space-8);
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
  align-items: start;
}

.title-side {
  border-inline-end: var(--aurora-border-medium) solid var(--scheme-border, var(--aurora-cream-400));
  padding-inline-end: var(--aurora-space-6);
}

.side-title :deep(h1) {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
}
</style>
