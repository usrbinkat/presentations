<!--
  Layout: section
  Ontology tier: Tier 1 Structural
  Section slides reset the audience's attention clock by announcing a new
  narrative arc. The visual treatment differs from content slides — a subtle
  color-mix gradient, larger typography, vertically centered content, and a
  closing accent bar signal "release the previous context, prepare for new
  input." The presenter displays section slides briefly (~3-5 seconds
  spoken). The optional `sectionNumber` prop renders a decorative number
  above the title for wayfinding.

  Props:
    align: 'center' (default) | 'left' | 'right' — text alignment for the
           title and description. Center reads as a divider. Left reads as
           the opening of a narrative arc.

  The accent bar below the subtitle closes the composition so the slide
  reads as complete, not as a content slide waiting for clicks or diagrams.
-->
<script setup lang="ts">
import { computed } from 'vue'
import { handleBackground, useSchemeClass } from '../layoutHelper'

const {
  color,
  background,
  class: className,
  sectionNumber,
  align,
} = defineProps<{
  color?: string
  background?: string
  class?: string
  sectionNumber?: string | number
  /** Text alignment: 'center' (default), 'left', 'right' */
  align?: 'center' | 'left' | 'right'
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'mint')
const textAlign = computed(() => align || 'center')
</script>

<template>
  <div
    class="slidev-layout section"
    :class="[schemeClass, className]"
    :style="bgStyle"
  >
    <div class="section-content" :style="{ textAlign }">
      <div v-if="sectionNumber" class="section-number" aria-hidden="true">
        {{ sectionNumber }}
      </div>
      <slot />
      <div
        class="section-bar"
        aria-hidden="true"
        :style="{
          marginInline:
            textAlign === 'center'
              ? 'auto'
              : textAlign === 'right'
                ? '0 0'
                : '0 auto',
        }"
      />
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--aurora-space-12);
  height: 100%;
  background: linear-gradient(
    135deg,
    var(--scheme-bg) 0%,
    color-mix(in oklch, var(--scheme-accent, var(--aurora-mint-400)) 8%, var(--scheme-bg, var(--aurora-cream-100))) 100%
  );
}

.section-content {
  max-width: 75%;
}

.section-number {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-medium);
  color: var(--scheme-accent, var(--aurora-mint-400));
  opacity: 0.6;
  margin-block-end: var(--aurora-space-2);
  letter-spacing: var(--aurora-tracking-wide);
}

.section :deep(h1) {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  letter-spacing: var(--aurora-tracking-tight);
  border-bottom: none;
  padding-bottom: 0;
}

.section :deep(p) {
  font-size: var(--aurora-text-xl);
  color: var(--scheme-text-secondary);
  margin-top: var(--aurora-space-4);
  line-height: var(--aurora-leading-relaxed);
}

.section-bar {
  width: 4rem;
  height: 3px;
  margin-top: var(--aurora-space-6);
  background: var(--scheme-accent, var(--aurora-mint-400));
  border-radius: var(--aurora-radius-full, 9999px);
  opacity: 0.4;
}
</style>
