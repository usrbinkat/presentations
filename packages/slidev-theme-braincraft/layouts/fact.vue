<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'mint'}-scheme`
</script>

<template>
  <div class="slidev-layout fact" :class="[schemeClass, props.class]">
    <div class="fact-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fact {
  display: grid;
  place-items: center;
  padding: 2.5rem 3.5rem;
  height: 100%;
}

.fact-content {
  text-align: center;
}

.fact :deep(h1) {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
  color: var(--scheme-heading, var(--aurora-mint-500));
}

.fact :deep(p) {
  font-size: var(--aurora-text-xl);
  color: var(--scheme-text-secondary, var(--aurora-slate-600));
  margin-top: var(--aurora-space-4);
}
</style>
