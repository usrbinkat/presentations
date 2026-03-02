<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
  layoutClass?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
</script>

<template>
  <div class="slidev-layout two-cols" :class="[schemeClass, props.class]">
    <div class="col-left" :class="props.layoutClass">
      <slot />
      <slot name="left" />
    </div>
    <div class="col-right" :class="props.layoutClass">
      <slot name="right" />
    </div>
  </div>
</template>

<style scoped>
.two-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-6);
  padding: 2.5rem 3.5rem;
}
</style>
