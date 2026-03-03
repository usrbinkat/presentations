// setup/mermaid.ts
// Mermaid diagram theme configuration matching Aurora palette.
// Uses theme: 'base' with themeVariables so Mermaid applies colors
// via its own theming system (inline styles). CSS overrides in
// aurora-tokens.css handle dark mode since this setup runs once at init.

import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  const isDark = typeof document !== 'undefined'
    && document.documentElement.classList.contains('dark')

  if (isDark) {
    return {
      theme: 'base',
      themeVariables: {
        // Dark mode — cream text on slate nodes
        primaryColor: '#49425A', // slate-600 node fill
        primaryTextColor: '#FAF9F7', // cream-100
        primaryBorderColor: '#615870', // slate-500
        secondaryColor: '#49425A', // slate-600
        secondaryTextColor: '#FAF9F7', // cream-100
        secondaryBorderColor: '#615870', // slate-500
        tertiaryColor: '#49425A', // slate-600
        tertiaryTextColor: '#FAF9F7', // cream-100
        tertiaryBorderColor: '#615870', // slate-500
        lineColor: '#AFA8BD', // slate-400
        textColor: '#FAF9F7', // cream-100
        mainBkg: '#322C42', // slate-700
        nodeBorder: '#615870', // slate-500
        clusterBkg: '#2B2535', // slate-800
        clusterBorder: '#615870', // slate-500
        edgeLabelBackground: '#322C42', // slate-700
        noteTextColor: '#FAF9F7', // cream-100
        noteBkgColor: '#322C42', // slate-700
        noteBorderColor: '#615870', // slate-500
        actorTextColor: '#FAF9F7', // cream-100
        actorBkg: '#49425A', // slate-600
        actorBorder: '#615870', // slate-500
        actorLineColor: '#615870', // slate-500
        signalColor: '#FAF9F7', // cream-100
        fontFamily: 'Inter, sans-serif',
        fontSize: '14px',
        curve: 'basis',
        nodeRadius: 12,
      },
    }
  }

  return {
    theme: 'base',
    themeVariables: {
      // Light mode — dark authoritative text on soft pastel nodes
      primaryColor: '#D8C9E8', // lavender-300 node fill
      primaryTextColor: '#49425A', // slate-700
      primaryBorderColor: '#AFA8BD', // slate-400
      secondaryColor: '#C3E9D7', // mint-300 node fill
      secondaryTextColor: '#49425A', // slate-700
      secondaryBorderColor: '#AFA8BD', // slate-400
      tertiaryColor: '#FFD9C7', // peach-300 node fill
      tertiaryTextColor: '#49425A', // slate-700
      tertiaryBorderColor: '#AFA8BD', // slate-400
      lineColor: '#AFA8BD', // slate-400
      textColor: '#49425A', // slate-700
      mainBkg: '#F5F3F0', // cream-200
      nodeBorder: '#AFA8BD', // slate-400
      clusterBkg: '#FAF9F7', // cream-100
      clusterBorder: '#DDD7CE', // cream-400
      edgeLabelBackground: '#FAF9F7', // cream-100
      noteTextColor: '#49425A', // slate-700
      noteBkgColor: '#F5F3F0', // cream-200
      noteBorderColor: '#C0A6DB', // lavender-400
      fontFamily: 'Inter, sans-serif',
      fontSize: '14px',
      curve: 'basis',
      nodeRadius: 12,
    },
  }
})
