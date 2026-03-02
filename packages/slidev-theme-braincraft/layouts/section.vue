<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'mint'}-scheme`
</script>

<template>
  <div class="slidev-layout section" :class="[schemeClass, props.class]">
    <div class="section-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 3.5rem;
}

.section-content {
  text-align: center;
}

.section :deep(h1) {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
}
</style>
