<!--
  Pagination.vue — Slide number display.
  Source: Agent 2 (Academic theme Pagination component)

  Usage in slides.md:
    <Pagination />
    <Pagination x="l" y="b" />

  Or via global-bottom.vue for all slides.
-->
<script setup lang="ts">
import SlideCurrentNo from '@slidev/client/builtin/SlideCurrentNo.vue'
import SlidesTotal from '@slidev/client/builtin/SlidesTotal.vue'

const { x = 'r', y = 't' } = defineProps<{
  x?: 'l' | 'r'
  y?: 't' | 'b'
}>()

const posClass = [
  x === 'l' ? 'left-4' : 'right-4',
  y === 't' ? 'top-4' : 'bottom-4',
].join(' ')
</script>

<template>
  <div
    class="pagination absolute p-2 text-xs"
    :class="posClass"
    aria-label="Slide progress"
  >
    <SlideCurrentNo /> / <SlidesTotal />
  </div>
</template>

<style scoped>
.pagination {
  color: var(--scheme-text-secondary, var(--aurora-slate-400));
  z-index: var(--aurora-z-top);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
}
</style>
