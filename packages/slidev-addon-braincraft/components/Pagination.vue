<!--
  Pagination.vue — Slide number display.
  Source: Agent 2 (Academic theme Pagination component)

  Usage in slides.md:
    <Pagination />
    <Pagination x="l" y="b" />

  Or via global-bottom.vue for all slides.
-->
<script setup lang="ts">
import { SlideCurrentNo, SlidesTotal } from '@slidev/client/builtin'

const props = withDefaults(defineProps<{
  x?: 'l' | 'r'
  y?: 't' | 'b'
}>(), {
  x: 'r',
  y: 'b',
})

const posClass = [
  props.x === 'l' ? 'left-4' : 'right-4',
  props.y === 't' ? 'top-4' : 'bottom-4',
].join(' ')
</script>

<template>
  <div class="absolute p-2 text-xs" :class="posClass" style="color: var(--aurora-slate-400); z-index: 50;">
    <SlideCurrentNo /> / <SlidesTotal />
  </div>
</template>
