<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'slate'}-scheme`
</script>

<template>
  <div class="slidev-layout end" :class="[schemeClass, props.class]">
    <div class="end-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.end {
  display: grid;
  place-items: center;
  padding: 2.5rem 3.5rem;
  height: 100%;
}

.end-content {
  text-align: center;
}

.end :deep(h1) {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
}

.end :deep(p) {
  font-size: var(--aurora-text-xl);
  margin-top: var(--aurora-space-4);
  opacity: 0.8;
}
</style>
