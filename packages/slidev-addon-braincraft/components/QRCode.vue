<!--
  QRCode.vue — QR code placeholder for audience scanning.
  Renders a styled placeholder square with the URL text.
  Full QR generation would require an external library; this is a
  dependency-free visual placeholder.

  Usage in slides.md:
    <QRCode url="https://slides.braincraft.io" label="Follow along" />
    <QRCode url="https://github.com/usrbinkat" :size="250" />
-->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  url: string
  size?: number
  label?: string
}>(), {
  size: 200,
  label: '',
})
</script>

<template>
  <div class="qr-wrapper">
    <div
      class="qr-box"
      :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    >
      <div class="qr-grid">
        <div class="qr-corner qr-corner-tl" />
        <div class="qr-corner qr-corner-tr" />
        <div class="qr-corner qr-corner-bl" />
      </div>
      <div class="qr-url">{{ props.url }}</div>
    </div>
    <div v-if="props.label" class="qr-label">{{ props.label }}</div>
  </div>
</template>

<style scoped>
.qr-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-3);
}

.qr-box {
  position: relative;
  border: 3px solid var(--aurora-slate-700);
  border-radius: var(--aurora-radius-md);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--aurora-space-4);
  overflow: hidden;
}

.qr-grid {
  position: absolute;
  inset: 8px;
}

.qr-corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border: 4px solid var(--aurora-slate-800);
  border-radius: 2px;
}

.qr-corner::after {
  content: '';
  position: absolute;
  top: 4px;
  left: 4px;
  width: 8px;
  height: 8px;
  background: var(--aurora-slate-800);
  border-radius: 1px;
}

.qr-corner-tl { top: 0; left: 0; }
.qr-corner-tr { top: 0; right: 0; }
.qr-corner-bl { bottom: 0; left: 0; }

.qr-url {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--aurora-slate-600);
  word-break: break-all;
  text-align: center;
  line-height: var(--aurora-leading-snug);
  z-index: 1;
  max-width: 80%;
}

.qr-label {
  font-size: var(--aurora-text-sm);
  color: var(--aurora-slate-500);
  font-weight: var(--aurora-font-medium);
}

html.dark .qr-box {
  background: var(--aurora-cream-50);
  border-color: var(--aurora-slate-400);
}

html.dark .qr-corner {
  border-color: var(--aurora-slate-700);
}

html.dark .qr-corner::after {
  background: var(--aurora-slate-700);
}

html.dark .qr-label {
  color: var(--aurora-slate-400);
}
</style>
