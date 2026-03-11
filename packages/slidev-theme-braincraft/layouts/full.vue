<!--
  Layout: full
  Ontology tier: Utility (not in the ontology taxonomy)
  A maximum-content layout with reduced padding for tall code blocks,
  terminal output, or any content needing more vertical real estate.
  Standard slide padding is applied but tighter than default.
  For true edge-to-edge content, use the `background` prop or wrap
  content in a full-width div.
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
  <div class="slidev-layout full" :class="[schemeClass, className]" :style="bgStyle">
    <slot />
  </div>
</template>

<style scoped>
.full {
  padding: var(--aurora-space-4) var(--aurora-slide-padding-x);
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.full :deep(h1) {
  margin-bottom: var(--aurora-space-2);
}
</style>
