<!--
  TerminalEmbed.vue — Embedded terminal iframe with PDF/export fallback.
  In presenter/SPA mode, renders an iframe pointing to the terminal URL.
  For PDF/export, shows fallbackImage or a styled placeholder.

  Usage in slides.md:
    <TerminalEmbed src="https://ttyd.example.com" fallbackImage="/screenshot.png" />
    <TerminalEmbed src="https://ttyd.lab.local:7681" height="500px" />
-->
<script setup lang="ts">
import { computed } from 'vue'

const {
  src,
  fallbackImage = '',
  height = '400px',
} = defineProps<{
  src: string
  fallbackImage?: string
  height?: string
}>()

const isPrint = computed(() => {
  if (typeof window === 'undefined')
    return true
  // Slidev export uses Playwright, not print media — check for export mode
  if ((window as any).__slidev_export)
    return true
  return window.matchMedia?.('print')?.matches ?? false
})
</script>

<template>
  <div class="terminal-embed" :style="{ height }">
    <template v-if="isPrint && fallbackImage">
      <img
        :src="fallbackImage"
        alt="Terminal screenshot"
        class="terminal-fallback-img"
      >
    </template>
    <template v-else-if="isPrint">
      <div class="terminal-fallback">
        <div class="terminal-fallback-icon">
          &#9608;&#9608;&#9608;
        </div>
        <div class="terminal-fallback-url">
          {{ src }}
        </div>
      </div>
    </template>
    <template v-else>
      <iframe
        :src="src"
        :title="`Terminal: ${src}`"
        class="terminal-iframe"
        frameborder="0"
        allow="clipboard-read; clipboard-write"
      />
    </template>
  </div>
</template>

<style scoped>
.terminal-embed {
  border: 2px solid var(--scheme-border, var(--aurora-cream-400));
  border-radius: var(--aurora-radius-lg);
  overflow: hidden;
  background: var(--aurora-slate-900);
  width: 100%;
}

.terminal-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.terminal-fallback-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--aurora-slate-900);
}

.terminal-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--aurora-space-4);
  background: var(--aurora-slate-900);
}

.terminal-fallback-icon {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-2xl);
  color: var(--scheme-accent, var(--aurora-mint-400));
  opacity: 0.6;
}

.terminal-fallback-url {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary, var(--aurora-slate-400));
  word-break: break-all;
  text-align: center;
  padding: 0 var(--aurora-space-4);
}
</style>
