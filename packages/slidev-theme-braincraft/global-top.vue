<!--
  global-top.vue — Renders on every slide above content.
  Opt-in via headmatter:
    themeConfig:
      showProgress: true
      showFooter: true

  Provenance states:
    clean:       QR links to immutable commit-pinned source.
    dirty:       QR falls back to themeConfig.qrUrl; dev marker shown.
    unavailable: QR falls back to themeConfig.qrUrl.
-->
<script setup lang="ts">
import { computed } from 'vue'

const configs = computed(() => $slidev?.configs || {})
const nav = computed(() => $nav)

const showFooter = computed(() => configs.value?.themeConfig?.showFooter ?? true)
const showProgress = computed(() => configs.value?.themeConfig?.showProgress ?? true)

// Commit-pinned provenance injected by gitMetadataPlugin in vite.config.ts.
// clean: sourceUrl is /blob/<sha>/..., commit-pinned, immutable.
// dirty: sourceUrl is empty, commit is the base HEAD, tree has local changes.
// unavailable: no Git context, all values empty.
const sourceUrl: string = typeof __SLIDEV_SOURCE_URL__ === 'string' ? __SLIDEV_SOURCE_URL__ : ''
const sourceCommit: string = typeof __SLIDEV_GIT_COMMIT__ === 'string' ? __SLIDEV_GIT_COMMIT__ : ''
const sourceState: string = typeof __SLIDEV_GIT_STATE__ === 'string' ? __SLIDEV_GIT_STATE__ : 'unavailable'
const buildDateStr: string = typeof __SLIDEV_BUILD_DATE__ === 'string' ? __SLIDEV_BUILD_DATE__ : ''

const qrUrl = computed(() => sourceUrl || configs.value?.themeConfig?.qrUrl || '')
const author = computed(() => configs.value?.author || '')
const title = computed(() => configs.value?.title || '')
const currentLayout = computed(() => nav.value?.currentLayout || '')
const hideQrLayouts = ['cover', 'end']
const currentPage = computed(() => nav.value?.currentPage || 1)
const total = computed(() => nav.value?.total || 0)
const progress = computed(() => total.value ? (currentPage.value / total.value) * 100 : 0)

const provenance = computed(() => {
  if (sourceState === 'dirty')
    return `local changes · base commit ${sourceCommit.slice(0, 12)}`
  if (sourceState === 'clean')
    return `commit ${sourceCommit.slice(0, 12)} · built ${buildDateStr}`
  return buildDateStr ? `source unavailable · built ${buildDateStr}` : 'source unavailable'
})

const showDirtyMarker = import.meta.env.DEV && sourceState === 'dirty'

// TODO: When Slidev exposes section metadata via $slidev.nav,
// replace continuous progress with section-based dots.
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
    :title="provenance"
    :data-source-state="sourceState"
    :data-source-commit="sourceCommit || undefined"
    :data-build-date="buildDateStr || undefined"
  >
    <QRCode :url="qrUrl" :size="48" label="" />
  </div>

  <div
    v-if="showDirtyMarker && qrUrl && !hideQrLayouts.includes(currentLayout)"
    class="source-state-marker"
    title="This presentation contains uncommitted changes"
  >
    <div class="source-state-label">
      DIRTY
    </div>
    <div class="source-state-hash">
      {{ sourceCommit.slice(0, 7) }}
    </div>
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

.source-state-marker {
  position: absolute;
  top: calc(var(--aurora-space-2) + 48px);
  right: var(--aurora-space-2);
  z-index: var(--aurora-z-navigation);
  font-family: var(--aurora-font-mono);
  text-align: center;
  color: #cc5a3a;
  background: oklch(95% 0.04 25 / 0.85);
  width: 48px;
  padding: 3px 0;
  border-radius: var(--aurora-radius-sm);
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  margin-top: 2px;
}

.source-state-label {
  font-size: 7px;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1;
}

.source-state-hash {
  font-size: 6px;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1;
  opacity: 0.7;
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
