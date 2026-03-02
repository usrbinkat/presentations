<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
</script>

<template>
  <div class="slidev-layout default" :class="[schemeClass, props.class]">
    <slot />
  </div>
</template>

<style scoped>
.default {
  padding: 2.5rem 3.5rem;
}
</style>
