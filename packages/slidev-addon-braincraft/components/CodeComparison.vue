<!--
  CodeComparison.vue — Side-by-side before/after code blocks.
  Uses a 2-column grid with labeled headers.

  Usage in slides.md:
    <CodeComparison>
      before code here
      <template #after>
        after code here
      </template>
    </CodeComparison>

    <CodeComparison beforeLabel="v1 API" afterLabel="v2 API">
      old code
      <template #after>
        new code
      </template>
    </CodeComparison>
-->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  beforeLabel?: string
  afterLabel?: string
}>(), {
  beforeLabel: 'Before',
  afterLabel: 'After',
})
</script>

<template>
  <div class="code-comparison">
    <div class="code-col">
      <div class="code-header code-header-before">{{ props.beforeLabel }}</div>
      <div class="code-body">
        <slot />
      </div>
    </div>
    <div class="code-col">
      <div class="code-header code-header-after">{{ props.afterLabel }}</div>
      <div class="code-body">
        <slot name="after" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-4);
  width: 100%;
}

.code-col {
  border-radius: var(--aurora-radius-lg);
  overflow: hidden;
  border: 1px solid var(--aurora-cream-400);
}

.code-header {
  padding: var(--aurora-space-2) var(--aurora-space-4);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--aurora-tracking-wide);
}

.code-header-before {
  background: oklch(90% 0.06 60);
  color: var(--aurora-slate-700);
}

.code-header-after {
  background: oklch(90% 0.06 160);
  color: var(--aurora-slate-700);
}

.code-body {
  padding: var(--aurora-space-4);
  background: var(--aurora-cream-100);
  font-size: var(--aurora-text-sm);
  overflow-x: auto;
}

html.dark .code-col {
  border-color: var(--aurora-slate-700);
}

html.dark .code-header-before {
  background: oklch(30% 0.06 60);
  color: var(--aurora-cream-300);
}

html.dark .code-header-after {
  background: oklch(30% 0.06 160);
  color: var(--aurora-cream-300);
}

html.dark .code-body {
  background: var(--aurora-slate-800);
}
</style>
