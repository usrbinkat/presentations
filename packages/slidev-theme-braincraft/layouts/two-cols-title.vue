<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
  columns?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
const gridCols = props.columns || '1fr 1fr'
</script>

<template>
  <div class="slidev-layout two-cols-title" :class="[schemeClass, props.class]">
    <div class="title-area">
      <slot />
    </div>
    <div class="columns-area" :style="{ gridTemplateColumns: gridCols }">
      <div class="col-left">
        <slot name="left" />
      </div>
      <div class="col-right">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.two-cols-title {
  display: flex;
  flex-direction: column;
  padding: 2.5rem 3.5rem;
  height: 100%;
}

.title-area {
  flex-shrink: 0;
  margin-bottom: var(--aurora-space-6);
}

.columns-area {
  display: grid;
  gap: var(--aurora-space-6);
  flex: 1;
  min-height: 0;
}
</style>
