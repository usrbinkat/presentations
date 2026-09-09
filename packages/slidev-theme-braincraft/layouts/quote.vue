<!--
  Layout: quote
  Ontology tier: Tier 2 Single-Idea
  Presents someone else's words with attribution. Authority anchoring — a
  well-chosen quote from a respected source pre-validates the presenter's
  argument. Visually distinct from `statement` via a decorative quotation mark
  (CSS ::before pseudo-element) and distinct typeface treatment so the audience
  instantly recognizes "these are someone else's words." The presenter places a
  blockquote in the default slot; the last paragraph or <cite> renders as
  the attribution line.
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
const schemeClass = useSchemeClass(color, 'lavender')
</script>

<template>
  <div
    class="slidev-layout quote"
    :class="[schemeClass, className]"
    :style="bgStyle"
  >
    <div class="quote-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.quote {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--aurora-slide-padding-y) var(--aurora-space-16);
  height: 100%;
}

.quote-content {
  max-width: 85%;
  position: relative;
}

.quote-content::before {
  content: '\201C';
  position: absolute;
  inset-block-start: calc(-1 * var(--aurora-space-6));
  inset-inline-start: calc(-1 * var(--aurora-space-8));
  font-size: clamp(4rem, 3rem + 4vw, 8rem);
  line-height: 1;
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-accent, var(--aurora-lavender-400));
  opacity: 0.2;
  pointer-events: none;
}

.quote :deep(blockquote) {
  border-inline-start: 4px solid var(--scheme-accent, var(--aurora-lavender-400));
  padding-inline-start: var(--aurora-space-6);
  margin: 0;
}

.quote :deep(blockquote p) {
  font-size: var(--aurora-text-3xl);
  font-style: italic;
  font-weight: var(--aurora-font-light);
  line-height: var(--aurora-leading-relaxed);
  color: var(--scheme-text, var(--aurora-slate-800));
}

.quote :deep(blockquote cite),
.quote :deep(p:last-child) {
  font-size: var(--aurora-text-lg);
  font-style: normal;
  color: var(--scheme-text-secondary, var(--aurora-slate-600));
  margin-top: var(--aurora-space-4);
  display: block;
}
</style>
