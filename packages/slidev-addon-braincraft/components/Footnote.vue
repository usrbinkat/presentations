<!--
  Footnote.vue — Individual footnote with superscript marker.
  Source: Agent 2 (Academic theme Footnote)

  Usage:
    <Footnote number="1">Source: IEEE 2024</Footnote>
-->
<script setup lang="ts">
const props = defineProps<{
  number: string | number
}>()
</script>

<template>
  <div class="footnote-item" style="font-size: 0.75em; color: var(--aurora-slate-500);">
    <sup style="color: var(--aurora-lavender-400); font-weight: 600;">{{ props.number }}</sup>
    <span><slot /></span>
  </div>
</template>
