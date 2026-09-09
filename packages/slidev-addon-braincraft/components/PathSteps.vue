<!--
  PathSteps.vue — Staircase layout for progressive path/hierarchy decomposition.
  Each direct child element becomes a step, indented progressively to form
  a visual staircase. The component provides the staircase structure;
  the slide author provides the content.

  Usage in slides.md:
    <PathSteps>
      <div>First segment — top of the staircase</div>
      <div>Second segment — indented one level</div>
      <div>Third segment — indented two levels</div>
      <div>Fourth segment — indented three levels</div>
    </PathSteps>

    <PathSteps :indent="64">
      <div>Wider indent per step</div>
      <div>For shorter content</div>
    </PathSteps>

  Props:
    indent  — px per step (default 48)
    gap     — gap between steps, any CSS value (default uses aurora-space-3)
-->
<script setup lang="ts">
const {
  indent = 48,
  gap,
  steps = 4,
} = defineProps<{
  /** Pixels of additional inline-start padding per step */
  indent?: number
  /** CSS gap value between steps */
  gap?: string
  /** Total number of steps — used to calculate reverse margin on the end side */
  steps?: number
}>()
</script>

<template>
  <div
    class="path-steps"
    :style="{
      '--ps-indent': `${indent}px`,
      '--ps-steps': steps,
      'gap': gap || undefined,
    }"
    role="list"
    aria-label="Progressive breakdown"
  >
    <slot />
  </div>
</template>

<style scoped>
.path-steps {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-3);
  counter-reset: step-counter;
}

/* Base step styling */
.path-steps :deep(> *) {
  counter-increment: step-counter;
  padding-block: var(--aurora-space-3);
  padding-inline-end: var(--aurora-space-5);
  padding-inline-start: calc(var(--aurora-space-10));
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 60%, transparent);
  border-radius: var(--aurora-radius-md);
  border-inline-start: 3px solid color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 40%, transparent);
  transition: border-color var(--aurora-duration-fast) var(--aurora-ease-out);
  position: relative;
}

.path-steps :deep(> *:hover) {
  border-inline-start-color: var(--scheme-accent, var(--aurora-lavender-400));
}

/* Staircase indentation via nth-child — CSS counters cannot be used in calc() */
/* Start side staggers in, end side staggers out — both sides form a diagonal */
.path-steps :deep(> *:nth-child(1)) {
  margin-inline-start: 0;
  margin-inline-end: calc(var(--ps-indent) * (var(--ps-steps) - 1));
}
.path-steps :deep(> *:nth-child(2)) {
  margin-inline-start: calc(var(--ps-indent) * 1);
  margin-inline-end: calc(var(--ps-indent) * (var(--ps-steps) - 2));
}
.path-steps :deep(> *:nth-child(3)) {
  margin-inline-start: calc(var(--ps-indent) * 2);
  margin-inline-end: calc(var(--ps-indent) * (var(--ps-steps) - 3));
}
.path-steps :deep(> *:nth-child(4)) {
  margin-inline-start: calc(var(--ps-indent) * 3);
  margin-inline-end: calc(var(--ps-indent) * (var(--ps-steps) - 4));
}
.path-steps :deep(> *:nth-child(5)) {
  margin-inline-start: calc(var(--ps-indent) * 4);
  margin-inline-end: calc(var(--ps-indent) * (var(--ps-steps) - 5));
}
.path-steps :deep(> *:nth-child(6)) {
  margin-inline-start: calc(var(--ps-indent) * 5);
  margin-inline-end: calc(var(--ps-indent) * (var(--ps-steps) - 6));
}

/* Step number badge via counter — counter() works in content */
.path-steps :deep(> *::before) {
  content: counter(step-counter);
  position: absolute;
  inset-inline-start: var(--aurora-space-3);
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: var(--aurora-radius-full);
  background: color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 18%, transparent);
  color: var(--scheme-heading, var(--aurora-slate-700));
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-semibold);
  font-variant-numeric: tabular-nums;
}

/* Code within steps should inherit naturally */
.path-steps :deep(> * code) {
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
  color: var(--scheme-heading, var(--aurora-slate-700));
}

/* Staggered entry animation */
@media (prefers-reduced-motion: no-preference) {
  .path-steps :deep(> *) {
    animation: ps-enter var(--aurora-duration-normal) var(--aurora-ease-out) both;
  }

  .path-steps :deep(> *:nth-child(1)) {
    animation-delay: 0ms;
  }
  .path-steps :deep(> *:nth-child(2)) {
    animation-delay: 120ms;
  }
  .path-steps :deep(> *:nth-child(3)) {
    animation-delay: 240ms;
  }
  .path-steps :deep(> *:nth-child(4)) {
    animation-delay: 360ms;
  }
  .path-steps :deep(> *:nth-child(5)) {
    animation-delay: 480ms;
  }
  .path-steps :deep(> *:nth-child(6)) {
    animation-delay: 600ms;
  }

  @keyframes ps-enter {
    from {
      opacity: 0;
      transform: translateX(-12px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}
</style>
