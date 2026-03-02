<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'lavender'}-scheme`
</script>

<template>
  <div class="slidev-layout statement" :class="[schemeClass, props.class]">
    <div class="statement-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.statement {
  display: grid;
  place-items: center;
  padding: 2.5rem 5rem;
  height: 100%;
}

.statement-content {
  text-align: center;
}

.statement :deep(p),
.statement :deep(h1),
.statement :deep(h2) {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-snug);
  text-wrap: balance;
  color: var(--scheme-heading, var(--aurora-lavender-500));
}
</style>
