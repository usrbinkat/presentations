<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'lavender'}-scheme`
</script>

<template>
  <div class="slidev-layout quote" :class="[schemeClass, props.class]">
    <div class="quote-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.quote {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 5rem;
  height: 100%;
}

.quote-content {
  max-width: 85%;
}

.quote :deep(blockquote) {
  border-left: 4px solid var(--scheme-accent, var(--aurora-lavender-400));
  padding-left: var(--aurora-space-6);
  margin: 0;
}

.quote :deep(blockquote p) {
  font-size: var(--aurora-text-3xl);
  font-style: italic;
  font-weight: var(--aurora-font-light);
  line-height: var(--aurora-leading-relaxed);
  color: var(--scheme-text, var(--aurora-slate-800));
}

.quote :deep(blockquote cite),
.quote :deep(p:last-child) {
  font-size: var(--aurora-text-lg);
  font-style: normal;
  color: var(--scheme-text-secondary, var(--aurora-slate-600));
  margin-top: var(--aurora-space-4);
  display: block;
}
</style>
