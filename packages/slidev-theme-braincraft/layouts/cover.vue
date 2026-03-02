<script setup lang="ts">
import { handleBackground } from '../layoutHelper'

const props = defineProps<{
  background?: string
  color?: string
  class?: string
}>()

const style = handleBackground(props.background, true)
const schemeClass = `aurora-${props.color || 'lavender'}-scheme`
</script>

<template>
  <div class="slidev-layout cover" :style="style" :class="[schemeClass, props.class]">
    <div class="cover-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cover {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2.5rem 3.5rem;
}

.cover-content {
  max-width: 80%;
}

.cover :deep(h1) {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
  letter-spacing: var(--aurora-tracking-tight);
}

.cover :deep(p) {
  font-size: var(--aurora-text-xl);
  margin-top: var(--aurora-space-4);
  opacity: 0.8;
}
</style>
