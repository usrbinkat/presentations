<!--
  Admonition.vue — Callout box component.
  Types: info, tip, warning, danger, note
  Uses UnoCSS icon classes (requires presetIcons in uno.config.ts).
-->
<script setup lang="ts">
import { computed, useId } from 'vue'

const { type = 'info', title = '' } = defineProps<{
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'note'
  title?: string
}>()

const id = useId()

const typeConfig = computed(() => {
  const map: Record<
    string,
    { bg: string, darkBg: string, border: string, icon: string }
  > = {
    info: {
      bg: 'var(--aurora-info-light)',
      darkBg: 'oklch(25% 0.03 240)',
      border: 'var(--aurora-info)',
      icon: 'i-carbon-information',
    },
    tip: {
      bg: 'oklch(92% 0.06 160)',
      darkBg: 'oklch(25% 0.03 160)',
      border: 'var(--aurora-mint-400)',
      icon: 'i-carbon-checkmark-filled',
    },
    warning: {
      bg: 'var(--aurora-warning-light)',
      darkBg: 'oklch(25% 0.03 85)',
      border: 'var(--aurora-warning)',
      icon: 'i-carbon-warning-alt',
    },
    danger: {
      bg: 'var(--aurora-danger-light)',
      darkBg: 'oklch(25% 0.03 25)',
      border: 'var(--aurora-danger)',
      icon: 'i-carbon-error',
    },
    note: {
      bg: 'oklch(92% 0.06 300)',
      darkBg: 'oklch(25% 0.03 300)',
      border: 'var(--aurora-lavender-400)',
      icon: 'i-carbon-notebook',
    },
  }
  return map[type] || map.info
})

const displayTitle = computed(() => {
  if (title)
    return title
  return type.charAt(0).toUpperCase() + type.slice(1)
})
</script>

<template>
  <div
    class="admonition"
    role="note"
    :aria-labelledby="`${id}-title`"
    :style="{
      '--admonition-bg': typeConfig.bg,
      '--admonition-bg-dark': typeConfig.darkBg,
      '--admonition-border': typeConfig.border,
    }"
  >
    <div class="admonition-header">
      <div
        :class="typeConfig.icon"
        class="admonition-icon"
        aria-hidden="true"
      />
      <span :id="`${id}-title`" class="admonition-title">{{
        displayTitle
      }}</span>
    </div>
    <div class="admonition-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.admonition {
  padding: var(--aurora-space-3) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  margin: var(--aurora-space-2) 0;
  font-size: var(--aurora-text-sm);
  background: light-dark(var(--admonition-bg), var(--admonition-bg-dark));
  border-inline-start: 4px solid var(--admonition-border);
}

.admonition-header {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-2);
  font-weight: var(--aurora-font-semibold);
  margin-bottom: var(--aurora-space-1);
}

.admonition-icon {
  font-size: var(--aurora-text-base);
  color: var(--admonition-border);
}

.admonition-content {
  opacity: 0.9;
}
</style>
