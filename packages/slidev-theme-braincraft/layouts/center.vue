<!--
  Layout: center
  Ontology tier: Utility (not in the ontology taxonomy)
  A utility layout that centers all content both horizontally and vertically.
  The presenter uses this when no communicative-specific layout applies but
  centered presentation is needed. Accepts a `background` prop for visual
  flexibility.
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
  <div class="slidev-layout center" :class="[schemeClass, className]" :style="bgStyle">
    <div class="center-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.center {
  display: grid;
  place-items: center;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
}

.center-content {
  text-align: center;
  max-width: 75ch;
}
</style>
