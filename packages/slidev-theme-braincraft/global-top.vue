<!--
  global-top.vue — Renders on every slide above content.
  Source: Agent 2 (Frankfurt: global-top.vue with opt-in via themeConfig)

  Opt-in via headmatter:
    themeConfig:
      showProgress: true
      showFooter: true
-->
<script setup lang="ts">
import { computed } from 'vue'

// $slidev, $nav are auto-injected by Slidev into <script setup> blocks
const configs = computed(() => $slidev?.configs || {})
const nav = computed(() => $nav)

const showFooter = computed(() => configs.value?.themeConfig?.showFooter ?? false)
const showProgress = computed(() => configs.value?.themeConfig?.showProgress ?? false)
const author = computed(() => configs.value?.author || '')
const title = computed(() => configs.value?.title || '')
const currentPage = computed(() => nav.value?.currentPage || 1)
const total = computed(() => nav.value?.total || 0)
</script>

<template>
  <!-- Progress bar -->
  <div
    v-if="showProgress && total"
    class="absolute top-0 left-0 right-0 h-1 z-50"
    style="background: var(--aurora-cream-300)"
  >
    <div
      class="h-full transition-all duration-300"
      :style="{
        width: `${(currentPage / total) * 100}%`,
        background: 'var(--aurora-lavender-400)',
      }"
    />
  </div>

  <!-- Footer -->
  <footer
    v-if="showFooter"
    class="absolute bottom-0 left-0 right-0 flex justify-between items-center px-6 py-2 text-xs z-50"
    style="color: var(--aurora-slate-400)"
  >
    <span>{{ author }}</span>
    <span>{{ title }}</span>
    <span v-if="total">{{ currentPage }} / {{ total }}</span>
  </footer>
</template>
