<!--
  QRCode.vue — Generates real, scannable QR codes.
  Requires the 'qrcode' npm package in slidev-addon-braincraft dependencies.

  Usage:
    <QRCode url="https://github.com/usrbinkat" label="GitHub" />
    <QRCode url="https://git.braincraft.io" :size="250" />
-->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const { url, size = 200, label = '' } = defineProps<{
  url: string
  size?: number
  label?: string
}>()

const qrDataUrl = ref('')

async function generateQR() {
  try {
    const { default: QRCode } = await import('qrcode')
    qrDataUrl.value = await QRCode.toDataURL(url, {
      width: size * 2, // 2x for retina displays
      margin: 2,
      color: {
        dark: '#322C42', // --aurora-slate-800
        light: '#FDFCFB', // --aurora-cream-50
      },
      errorCorrectionLevel: 'M',
    })
  }
  catch {
    qrDataUrl.value = ''
  }
}

onMounted(generateQR)
watch(() => url, generateQR)
</script>

<template>
  <div class="qr-wrapper">
    <img
      v-if="qrDataUrl"
      :src="qrDataUrl"
      :alt="`QR code for ${url}`"
      :width="size"
      :height="size"
      class="qr-image"
    >
    <div v-else class="qr-placeholder" :style="{ width: `${size}px`, height: `${size}px` }">
      {{ url }}
    </div>
    <div v-if="label" class="qr-label">
      {{ label }}
    </div>
    <a
      :href="url"
      target="_blank"
      rel="noopener noreferrer"
      class="qr-link"
    >{{ url }}</a>
  </div>
</template>

<style scoped>
.qr-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-3);
}

.qr-image {
  border-radius: var(--aurora-radius-md);
  box-shadow: var(--aurora-shadow-sm);
}

.qr-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--aurora-slate-400);
  border-radius: var(--aurora-radius-md);
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary, var(--aurora-slate-500));
  word-break: break-all;
  text-align: center;
  padding: var(--aurora-space-4);
}

.qr-label {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-text-secondary, var(--aurora-slate-500));
  font-weight: var(--aurora-font-medium);
}

.qr-link {
  font-size: var(--aurora-text-xs);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-text-secondary, var(--aurora-slate-500));
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color var(--aurora-duration-fast) var(--aurora-ease-out);
  word-break: break-all;
  text-align: center;
}

.qr-link:hover {
  border-bottom-color: currentColor;
}
</style>
