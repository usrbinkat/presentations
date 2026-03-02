<!--
  Admonition.vue — Callout box component.
  Types: info, tip, warning, danger, note
  Source: Agent 2 (Neversink Admonition + Smile Alert patterns)

  Usage in slides.md:
    <Admonition type="tip" title="Pro Tip">
      Content here supports **markdown** rendering.
    </Admonition>
-->
<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'note'
  title?: string
}>(), {
  type: 'info',
  title: '',
})

const styles = computed(() => {
  const map: Record<string, { bg: string, border: string, icon: string }> = {
    info: {
      bg: 'var(--aurora-info-light)',
      border: 'var(--aurora-info)',
      icon: '\u{1F4A1}',
    },
    tip: {
      bg: 'oklch(92% 0.06 160)',
      border: 'var(--aurora-mint-400)',
      icon: '\u2705',
    },
    warning: {
      bg: 'var(--aurora-warning-light)',
      border: 'var(--aurora-warning)',
      icon: '\u26A0\uFE0F',
    },
    danger: {
      bg: 'var(--aurora-danger-light)',
      border: 'var(--aurora-danger)',
      icon: '\u{1F6A8}',
    },
    note: {
      bg: 'oklch(92% 0.06 300)',
      border: 'var(--aurora-lavender-400)',
      icon: '\u{1F4DD}',
    },
  }
  return map[props.type] || map.info
})

const displayTitle = computed(() => {
  if (props.title) return props.title
  return props.type.charAt(0).toUpperCase() + props.type.slice(1)
})
</script>

<template>
  <div
    class="admonition"
    :style="{
      background: styles.bg,
      borderLeft: `4px solid ${styles.border}`,
    }"
  >
    <div class="admonition-header">
      <span class="admonition-icon">{{ styles.icon }}</span>
      <span class="admonition-title">{{ displayTitle }}</span>
    </div>
    <div class="admonition-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.admonition {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin: 0.5rem 0;
  font-size: 0.9em;
}

.admonition-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
}

.admonition-icon {
  font-size: 1.1em;
}

.admonition-content {
  opacity: 0.9;
}

html.dark .admonition {
  background: oklch(25% 0.03 var(--hue, 300)) !important;
}
</style>
