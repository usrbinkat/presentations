<!--
  MetricCard.vue — KPI/impact number display card.
  Shows a large metric value with label and optional icon.

  Usage in slides.md:
    <MetricCard value="99.9%" label="Reproducibility Rate" icon="i-carbon-chemistry" />
    <MetricCard value="42" label="Clusters Managed" color="mint" />
    <MetricCard value="<5min" label="Deploy Time" icon="i-carbon-rocket" color="peach" />
-->
<script setup lang="ts">
import { computed } from 'vue'

const {
  value,
  label,
  icon = '',
  color = 'lavender',
} = defineProps<{
  value: string | number
  label: string
  /** UnoCSS icon class, e.g. "i-carbon-chemistry" */
  icon?: string
  color?: 'lavender' | 'mint' | 'peach' | 'sky'
}>()

const accentColor = computed(() => {
  const map: Record<string, string> = {
    lavender: 'var(--aurora-lavender-400)',
    mint: 'var(--aurora-mint-400)',
    peach: 'var(--aurora-peach-400)',
    sky: 'var(--aurora-sky-400)',
  }
  return map[color] || map.lavender
})
</script>

<template>
  <figure
    class="metric-card"
    :style="{ borderTopColor: accentColor }"
    role="group"
    :aria-label="`${value} ${label}`"
  >
    <div v-if="icon" :class="icon" class="metric-icon" aria-hidden="true" />
    <div class="metric-value" :style="{ color: accentColor }">
      {{ value }}
    </div>
    <figcaption class="metric-label">
      {{ label }}
    </figcaption>
  </figure>
</template>

<style scoped>
.metric-card {
  container-type: inline-size;
  background: var(--scheme-bg, var(--aurora-cream-100));
  border-radius: var(--aurora-radius-lg);
  box-shadow: var(--scheme-shadow, var(--aurora-shadow-sm));
  border-top: 3px solid var(--aurora-lavender-400);
  padding: var(--aurora-space-6) var(--aurora-space-8);
  text-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-2);
  min-width: 10rem;
}

.metric-icon {
  font-size: var(--aurora-text-2xl);
  color: var(--scheme-accent, var(--aurora-lavender-400));
}

.metric-value {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
  letter-spacing: var(--aurora-tracking-tight);
  font-variant-numeric: tabular-nums;
  font-feature-settings: 'tnum' 1;
}

.metric-label {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-text-secondary, var(--aurora-slate-500));
  font-weight: var(--aurora-font-medium);
}

@container (max-width: 200px) {
  .metric-value {
    font-size: var(--aurora-text-2xl);
  }
  .metric-card {
    padding: var(--aurora-space-3) var(--aurora-space-4);
  }
}

/* Subgrid alignment — when MetricCard is inside a grid parent,
   the card adopts subgrid rows so icon/value/label align across siblings.
   The parent grid must define row tracks (e.g., grid-template-rows: subgrid)
   and each card must span the correct number of rows. */
@supports (grid-template-rows: subgrid) {
  .metric-card {
    &:where(.subgrid) {
      display: grid;
      grid-template-rows: subgrid;
      grid-row: span 3;
      justify-items: center;
    }
  }
}
</style>
