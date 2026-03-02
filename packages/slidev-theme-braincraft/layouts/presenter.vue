<script setup lang="ts">
import { resolveAssetUrl } from '../layoutHelper'

const props = defineProps<{
  color?: string
  class?: string
  imageSrc?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
const imageUrl = props.imageSrc ? resolveAssetUrl(props.imageSrc) : undefined
</script>

<template>
  <div class="slidev-layout presenter" :class="[schemeClass, props.class, { 'has-image': imageUrl }]">
    <div v-if="imageUrl" class="presenter-image">
      <img :src="imageUrl" alt="Speaker" />
    </div>
    <div class="presenter-bio">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.presenter {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--aurora-space-8);
  padding: 2.5rem 3.5rem;
  height: 100%;
  align-items: center;
}

.presenter.has-image {
  grid-template-columns: 1fr 2fr;
}

.presenter-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.presenter-image img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: var(--aurora-radius-xl);
  object-fit: cover;
  box-shadow: var(--aurora-shadow-md);
}

.presenter :deep(h1) {
  font-size: var(--aurora-text-3xl);
  font-weight: var(--aurora-font-bold);
}

.presenter :deep(h2) {
  font-size: var(--aurora-text-xl);
  color: var(--scheme-accent, var(--aurora-lavender-400));
  font-weight: var(--aurora-font-medium);
}
</style>
