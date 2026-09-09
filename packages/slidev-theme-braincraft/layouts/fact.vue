<!--
  Layout: fact
  Ontology tier: Tier 2 Single-Idea
  A single number or metric displayed at maximum visual impact. The isolation
  effect (Von Restorff) makes a visually distinctive data point more memorable
  than the same number embedded in a table. The presenter places the metric in
  an h1 and a label in a paragraph. The optional `context` slot holds delta
  information (e.g., "up from 12% last year") below the primary metric.
  Tabular-nums ensures uniform digit width for clean alignment.
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
const schemeClass = useSchemeClass(color, 'mint')
</script>

<template>
  <div
    class="slidev-layout fact"
    :class="[schemeClass, className]"
    :style="bgStyle"
  >
    <div class="fact-content">
      <slot />
      <div v-if="$slots.context" class="fact-context">
        <slot name="context" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fact {
  display: grid;
  place-items: center;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
}

.fact-content {
  text-align: center;
}

.fact :deep(h1) {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
  color: var(--scheme-heading, var(--aurora-slate-700));
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 12px color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 25%, transparent);
}

.fact :deep(p) {
  font-size: var(--aurora-text-xl);
  color: var(--scheme-text-secondary, var(--aurora-slate-600));
  margin-top: var(--aurora-space-4);
}

.fact-context {
  font-size: var(--aurora-text-base);
  color: var(--scheme-text-secondary, var(--aurora-slate-500));
  margin-top: var(--aurora-space-2);
  opacity: 0.7;
}
</style>
