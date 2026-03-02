<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
</script>

<template>
  <div class="slidev-layout full" :class="[schemeClass, props.class]">
    <slot />
  </div>
</template>

<style scoped>
.full {
  padding: 0;
  height: 100%;
  width: 100%;
}
</style>
