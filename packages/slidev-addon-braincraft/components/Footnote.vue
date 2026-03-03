<!--
  Footnote.vue — Individual footnote with superscript marker.
  Source: Agent 2 (Academic theme Footnote)

  Usage:
    <Footnote number="1">Source: IEEE 2024</Footnote>
-->
<script setup lang="ts">
const { number } = defineProps<{
  number: string | number
}>()
</script>

<template>
  <span class="footnote-item">
    <sup class="footnote-marker">{{ number }}</sup>
    <span><slot /></span>
  </span>
</template>

<style scoped>
.footnote-item {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary, var(--aurora-slate-500));
}

.footnote-marker {
  color: var(--scheme-accent, var(--aurora-lavender-400));
  font-weight: var(--aurora-font-semibold);
}
</style>
