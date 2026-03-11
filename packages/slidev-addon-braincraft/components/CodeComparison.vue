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
const { beforeLabel = 'Before', afterLabel = 'After' } = defineProps<{
  beforeLabel?: string
  afterLabel?: string
}>()
</script>

<template>
  <div class="code-comparison">
    <div class="code-col">
      <div class="code-header code-header-before">
        {{ beforeLabel }}
      </div>
      <div class="code-body">
        <slot />
      </div>
    </div>
    <div class="code-col">
      <div class="code-header code-header-after">
        {{ afterLabel }}
      </div>
      <div class="code-body">
        <slot name="after" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.code-comparison {
  container-type: inline-size;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-4);
  width: 100%;
}

.code-col {
  border-radius: var(--aurora-radius-lg);
  overflow: hidden;
  border: 1px solid var(--scheme-border, var(--aurora-cream-400));
}

.code-header {
  padding: var(--aurora-space-2) var(--aurora-space-4);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-semibold);
  text-transform: uppercase;
  letter-spacing: var(--aurora-tracking-wide);
}

.code-header-before {
  background: color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 15%, var(--scheme-bg, var(--aurora-cream-100)));
  color: var(--scheme-heading, var(--aurora-slate-700));
}

.code-header-after {
  background: color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 25%, var(--scheme-bg, var(--aurora-cream-100)));
  color: var(--scheme-heading, var(--aurora-slate-700));
}

.code-body {
  padding: var(--aurora-space-4);
  background: var(--scheme-bg-code, var(--aurora-cream-100));
  font-size: clamp(0.65rem, 1.2vw, var(--aurora-text-sm));
  overflow-x: auto;
  overflow-y: hidden;
}

@container (max-width: 500px) {
  .code-comparison {
    grid-template-columns: 1fr;
  }
}
</style>
