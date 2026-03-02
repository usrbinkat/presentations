<!--
  MetricCard.vue — KPI/impact number display card.
  Shows a large metric value with label and optional icon.

  Usage in slides.md:
    <MetricCard value="99.9%" label="Reproducibility Rate" icon="🔬" />
    <MetricCard value="42" label="Clusters Managed" color="mint" />
    <MetricCard value="<5min" label="Deploy Time" icon="🚀" color="peach" />
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  value: string | number
  label: string
  icon?: string
  color?: 'lavender' | 'mint' | 'peach' | 'sky'
}>(), {
  icon: '',
  color: 'lavender',
})

const accentColor = computed(() => {
  const map: Record<string, string> = {
    lavender: 'var(--aurora-lavender-400)',
    mint: 'var(--aurora-mint-400)',
    peach: 'var(--aurora-peach-400)',
    sky: 'var(--aurora-sky-400)',
  }
  return map[props.color] || map.lavender
})
</script>

<template>
  <div class="metric-card" :style="{ borderTopColor: accentColor }">
    <div v-if="props.icon" class="metric-icon">{{ props.icon }}</div>
    <div class="metric-value" :style="{ color: accentColor }">{{ props.value }}</div>
    <div class="metric-label">{{ props.label }}</div>
  </div>
</template>

<style scoped>
.metric-card {
  background: var(--aurora-cream-100);
  border-radius: var(--aurora-radius-lg);
  box-shadow: var(--aurora-shadow-sm);
  border-top: 3px solid var(--aurora-lavender-400);
  padding: var(--aurora-space-6) var(--aurora-space-8);
  text-align: center;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-2);
  min-width: 160px;
}

.metric-icon {
  font-size: var(--aurora-text-2xl);
}

.metric-value {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-tight);
  letter-spacing: var(--aurora-tracking-tight);
}

.metric-label {
  font-size: var(--aurora-text-sm);
  color: var(--aurora-slate-500);
  font-weight: var(--aurora-font-medium);
}

html.dark .metric-card {
  background: var(--aurora-slate-800);
}

html.dark .metric-label {
  color: var(--aurora-slate-400);
}
</style>
