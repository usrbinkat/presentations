<!--
  Footnotes.vue — Container for footnote items.
  Source: Agent 2 (Academic theme Footnotes — layout options)

  Usage (inline children):
    <Footnotes separator>
      <Footnote number="1">First source</Footnote>
      <Footnote number="2">Second source</Footnote>
    </Footnotes>

  Usage (numbered named slots):
    <Footnotes>
      <template #1>Mayer, R.E. (2009). Multimedia Learning.</template>
      <template #2>Miller, G.A. (1956). The Magical Number Seven.</template>
    </Footnotes>
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'

const { separator = true, x = 'l' } = defineProps<{
  separator?: boolean
  x?: 'l' | 'r'
}>()

const slots = useSlots()

// Collect numbered named slots (e.g. #1, #2, ...) sorted numerically
const numberedSlots = computed(() => {
  return Object.keys(slots)
    .filter(k => /^\d+$/.test(k))
    .sort((a, b) => Number(a) - Number(b))
})

const hasNumberedSlots = computed(() => numberedSlots.value.length > 0)
</script>

<template>
  <div
    class="footnotes-container"
    :class="x === 'l' ? 'footnotes-left' : 'footnotes-right'"
  >
    <hr v-if="separator" class="footnotes-separator">
    <div class="footnotes-list">
      <!-- Render numbered named slots as footnote items -->
      <template v-if="hasNumberedSlots">
        <span v-for="key in numberedSlots" :key="key" class="footnote-item">
          <sup class="footnote-marker">{{ key }}</sup>
          <span><slot :name="key" /></span>
        </span>
      </template>
      <!-- Fallback: render default slot children (inline Footnote components) -->
      <slot v-if="!hasNumberedSlots" />
    </div>
  </div>
</template>

<style scoped>
.footnotes-container {
  position: absolute;
  bottom: var(--aurora-space-4);
  padding-inline: var(--aurora-space-6);
  z-index: var(--aurora-z-modal);
}

.footnotes-left {
  left: 0;
}

.footnotes-right {
  right: 0;
}

.footnotes-list {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
}

.footnotes-separator {
  border-color: var(--scheme-border, var(--aurora-cream-400));
  margin-block-end: var(--aurora-space-2);
  width: 30%;
}

.footnote-item {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary, var(--aurora-slate-500));
}

.footnote-marker {
  color: var(--scheme-accent, var(--aurora-lavender-400));
  font-weight: var(--aurora-font-semibold);
}
</style>
