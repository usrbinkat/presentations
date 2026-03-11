<!--
  global-top.vue — Renders on every slide above content.
  Opt-in via headmatter:
    themeConfig:
      showProgress: true
      showFooter: true
-->
<script setup lang="ts">
import { computed } from 'vue'

const configs = computed(() => $slidev?.configs || {})
const nav = computed(() => $nav)

const showFooter = computed(() => configs.value?.themeConfig?.showFooter ?? true)
const showProgress = computed(() => configs.value?.themeConfig?.showProgress ?? true)

// Dynamic QR: points to the deck's slides.md on GitHub.
// __SLIDEV_SOURCE_URL__ is injected at build time by the gitMetadataPlugin
// in vite.config.ts. It resolves to the GitHub blob URL for this deck's
// slides.md on the main branch. Falls back to themeConfig.qrUrl.
const sourceUrl: string = typeof __SLIDEV_SOURCE_URL__ === 'string' ? __SLIDEV_SOURCE_URL__ : ''
const qrUrl = computed(() => sourceUrl || configs.value?.themeConfig?.qrUrl || '')
const author = computed(() => configs.value?.author || '')
const title = computed(() => configs.value?.title || '')
const currentLayout = computed(() => nav.value?.currentLayout || '')
const hideQrLayouts = ['cover', 'end']
const currentPage = computed(() => nav.value?.currentPage || 1)
const total = computed(() => nav.value?.total || 0)
const progress = computed(() => total.value ? (currentPage.value / total.value) * 100 : 0)

// TODO: When Slidev exposes section metadata via $slidev.nav,
// replace continuous progress with section-based dots.
// See PRESENTATION_PRINCIPLES.md: "Section-based progress...
// is more useful than a continuous bar because it maps to
// conceptual chunks, not arbitrary slide counts."
</script>

<template>
  <div
    v-if="showProgress && total"
    class="progress-track"
    role="progressbar"
    :aria-valuenow="currentPage"
    :aria-valuemin="1"
    :aria-valuemax="total"
  >
    <div
      class="progress-fill"
      :style="{ width: `${progress}%` }"
    />
  </div>

  <div
    v-if="qrUrl && !hideQrLayouts.includes(currentLayout)"
    class="persistent-qr"
  >
    <QRCode :url="qrUrl" :size="48" label="" />
  </div>

  <footer
    v-if="showFooter"
    class="global-footer"
  >
    <span>{{ author }}</span>
    <span>{{ title }}</span>
    <span v-if="total">{{ currentPage }} / {{ total }}</span>
  </footer>
</template>

<style scoped>
.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: var(--aurora-z-top);
  background: var(--scheme-border, var(--aurora-cream-300));
}

.progress-fill {
  height: 100%;
  background: var(--scheme-accent, var(--aurora-lavender-400));
  transition: width var(--aurora-duration-normal) var(--aurora-ease-spring);
  will-change: width;
}

@media (prefers-reduced-motion: reduce) {
  .progress-fill {
    transition: none;
  }
}

.persistent-qr {
  position: absolute;
  top: var(--aurora-space-2);
  right: var(--aurora-space-2);
  z-index: var(--aurora-z-navigation);
  opacity: var(--aurora-opacity-subtle);
  transition: opacity var(--aurora-duration-fast) var(--aurora-ease-out);
  pointer-events: auto;
}

.persistent-qr:hover {
  opacity: 0.8;
}

.persistent-qr :deep(.qr-wrapper) {
  gap: 0;
}

.persistent-qr :deep(.qr-label),
.persistent-qr :deep(.qr-link) {
  display: none;
}

.global-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--aurora-space-2) var(--aurora-space-6);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary, var(--aurora-slate-400));
  z-index: var(--aurora-z-navigation);
}
</style>
