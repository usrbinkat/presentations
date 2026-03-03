<!--
  Layout: default
  Ontology tier: Tier 2 Single-Idea
  The general-purpose content slide. Predictable spatial grammar lets the
  audience focus on content rather than layout comprehension. The presenter
  uses this when no specialized layout better serves the material. CSS targets
  the first h1/h2 child to enforce a consistent title position across slides.
-->
<script setup lang="ts">
import { handleBackground, useSchemeClass } from '../layoutHelper'

const { color, background, class: className } = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() to detect type and apply correctly. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'cream')
</script>

<template>
  <div class="slidev-layout default" :class="[schemeClass, className]" :style="bgStyle">
    <slot />
  </div>
</template>

<style scoped>
.default {
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.default :deep(h1:first-child),
.default :deep(h2:first-child) {
  margin-block-start: 0;
  margin-block-end: var(--aurora-title-margin-bottom);
}
</style>
