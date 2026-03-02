<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
  titleWidth?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
const gridCols = `${props.titleWidth || '1fr'} 2fr`
</script>

<template>
  <div class="slidev-layout side-title" :class="[schemeClass, props.class]" :style="{ gridTemplateColumns: gridCols }">
    <div class="title-side">
      <slot name="title" />
    </div>
    <div class="content-side">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.side-title {
  display: grid;
  gap: var(--aurora-space-8);
  padding: 2.5rem 3.5rem;
  height: 100%;
  align-items: center;
}

.title-side {
  border-right: 2px solid var(--scheme-border, var(--aurora-cream-400));
  padding-right: var(--aurora-space-6);
}

.side-title :deep(h1) {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
}
</style>
