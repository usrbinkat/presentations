<!--
  Footnotes.vue — Container for footnote items.
  Source: Agent 2 (Academic theme Footnotes — layout options)

  Usage:
    <Footnotes separator>
      <Footnote number="1">First source</Footnote>
      <Footnote number="2">Second source</Footnote>
    </Footnotes>
-->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  separator?: boolean
  x?: 'l' | 'r'
}>(), {
  separator: true,
  x: 'l',
})
</script>

<template>
  <div
    class="absolute bottom-4 px-6"
    :class="props.x === 'l' ? 'left-0' : 'right-0'"
    style="z-index: 40;"
  >
    <hr v-if="props.separator" style="border-color: var(--aurora-cream-400); margin-bottom: 0.5rem; width: 30%;" />
    <div class="flex flex-col gap-1">
      <slot />
    </div>
  </div>
</template>
