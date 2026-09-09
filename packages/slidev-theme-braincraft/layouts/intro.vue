<!--
  Layout: intro
  Ontology tier: Tier 1 Structural
  The speaker introduction slide establishes credibility and human connection.
  The audience learns better from a presenter perceived as a real person.
  The presenter places name, role, and credential bullets in the default slot.
  For introducing other people (team members, personas), use `presenter` instead.
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
const schemeClass = useSchemeClass(color, 'cream')
</script>

<template>
  <div
    class="slidev-layout intro"
    :class="[schemeClass, className]"
    :style="bgStyle"
  >
    <div class="intro-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
}

.intro-content {
  max-width: 80%;
}
</style>
