<!--
  Layout: statement
  Ontology tier: Tier 2 Single-Idea
  A single powerful sentence displayed large with maximum whitespace. The
  presenter's own words — no quotation marks, no attribution. Whitespace
  communicates significance: when information density drops to one claim,
  the audience reads it as "this is important enough to stand alone." The
  auditory channel (presenter elaboration) gets full attention.
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
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground(). Enables the statement-highlight variant when a colored background is applied. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'lavender')
</script>

<template>
  <div
    class="slidev-layout statement"
    :class="[schemeClass, className]"
    :style="bgStyle"
  >
    <div class="statement-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.statement {
  display: grid;
  place-items: center;
  padding: var(--aurora-slide-padding-y) var(--aurora-space-16);
  height: 100%;
}

.statement-content {
  text-align: center;
}

.statement :deep(p),
.statement :deep(h1),
.statement :deep(h2) {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-snug);
  text-wrap: balance;
  color: var(--scheme-heading, var(--aurora-slate-700));
  text-shadow: 0 2px 16px color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 20%, transparent);
}
</style>
