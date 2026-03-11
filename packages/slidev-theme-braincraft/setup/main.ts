// setup/main.ts
// Global app setup for the Aurora/Braincraft Slidev theme.
// Runs once at app startup. Currently handles mermaid SVG containment.

import { defineAppSetup } from '@slidev/types'

export default defineAppSetup(() => {
  if (typeof document === 'undefined')
    return

  // Mermaid SVG Containment
  //
  // Problem: Slidev renders mermaid SVGs inside Shadow DOM containers.
  // The SVG gets hardcoded width/height attributes from mermaid's renderer.
  // External CSS cannot penetrate the shadow boundary to override these.
  // Result: diagrams overflow their slide, get clipped, or render tiny.
  //
  // Solution: MutationObserver watches for .mermaid elements (the shadow
  // host), reaches into the shadow root, finds the SVG, and forces it
  // to scale responsively within its container. Runs once per diagram
  // render, handles slide navigation and hot reload automatically.

  function fitMermaidSvg(host: Element) {
    const shadow = host.shadowRoot
    if (!shadow)
      return

    const svg = shadow.querySelector('svg')
    if (!svg)
      return

    // Strip ALL of mermaid's inline sizing so we control layout.
    svg.removeAttribute('width')
    svg.removeAttribute('height')
    svg.removeAttribute('style')

    // Scale to fit: constrain BOTH dimensions so the SVG scales
    // within the container regardless of aspect ratio. Tall diagrams
    // (nested subgraphs, TB flowcharts) are height-bound; wide
    // diagrams (LR flowcharts) are width-bound. The viewBox
    // handles proportional scaling automatically.
    svg.style.maxWidth = '100%'
    svg.style.maxHeight = '100%'
    svg.style.width = 'auto'
    svg.style.height = 'auto'
    svg.style.display = 'block'
    svg.style.margin = '0 auto'
  }

  // Observe the entire document for mermaid shadow hosts appearing
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement))
          continue

        // Direct match
        if (node.classList?.contains('mermaid')) {
          // Shadow root may not be attached yet — wait a frame
          requestAnimationFrame(() => fitMermaidSvg(node))
        }

        // Descendant match
        for (const el of node.querySelectorAll?.('.mermaid') ?? []) {
          requestAnimationFrame(() => fitMermaidSvg(el))
        }
      }
    }
  })

  observer.observe(document.body, { childList: true, subtree: true })

  // Also handle already-rendered mermaid diagrams (hot reload)
  requestAnimationFrame(() => {
    for (const el of document.querySelectorAll('.mermaid')) {
      fitMermaidSvg(el)
    }
  })
})
