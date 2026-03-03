// layoutHelper.ts
// Shared layout utilities for slidev-theme-braincraft.
// Sources:
//   - handleBackground/resolveAssetUrl: Agent 1 (client/layoutHelper.ts), Agent 2 (all official themes)
//   - 12-col grid helpers: Agent 2 (Neversink layoutHelper.ts)

/**
 * Layout Slot Naming Convention
 *
 * All layouts MUST use these standardized slot names:
 * - `default` — primary content area (every layout)
 * - `title` — heading/title zone (layouts with dedicated title area)
 * - `subtitle` — secondary heading (cover, intro)
 * - `left` / `right` — column content (two-cols, two-cols-title, side-title, comparison)
 * - `footer` — bottom zone (rarely used, prefer Footnote component)
 * - `media` — image/video/diagram area (image, image-text, figure, video)
 * - `caption` — description for media content (figure, image-caption)
 * - `meta` — metadata zone (date, tags, category — cover, end)
 *
 * Layout Props Convention (for ontology scale):
 * - `color` — scheme color (lavender|mint|peach|sky), consumed by useSchemeClass()
 * - `background` — CSS color, gradient, or image URL, consumed by handleBackground()
 * - `class` — additional CSS classes to merge onto root element
 *
 * All layouts MUST:
 * - Call useSchemeClass(props.color) and bind result to root element
 * - Set height: 100% on root element
 * - Use Aurora spacing tokens (never hardcoded rem/px for padding/margin)
 * - Use logical properties (inline-start/end, block-start/end)
 */

import type { CSSProperties } from 'vue'

export function resolveAssetUrl(url: string): string {
  if (url.startsWith('/') || url.startsWith('http'))
    return url
  return new URL(url, import.meta.url).href
}

export function handleBackground(
  background?: string,
  dim = false,
): CSSProperties | undefined {
  if (!background)
    return undefined

  const isColor = background.startsWith('#')
    || background.startsWith('rgb')
    || background.startsWith('oklch')
    || background.startsWith('hsl')
    || background.startsWith('var(')

  const isGradient = background.startsWith('linear-gradient')
    || background.startsWith('radial-gradient')
    || background.startsWith('conic-gradient')

  if (isColor || isGradient) {
    return { background }
  }

  const url = resolveAssetUrl(background)
  const style: CSSProperties = {
    backgroundImage: dim
      ? `linear-gradient(oklch(0% 0 0 / 0.4), oklch(0% 0 0 / 0.6)), url(${url})`
      : `url(${url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }
  return style
}

/**
 * Compute the Aurora color scheme class name.
 * Used by every layout to map the `color` prop to a CSS class.
 */
export function useSchemeClass(color?: string, fallback = 'cream'): string {
  return `aurora-${color || fallback}-scheme`
}

/**
 * Shared composable for all layout components.
 * Provides scheme class, background style, and common props processing.
 * Every layout should call this in <script setup>.
 *
 * Existing layouts that only need useSchemeClass() don't need to migrate —
 * this is a convenience wrapper for new layouts and future refactors.
 */
export function useLayoutProps(
  props: { color?: string, background?: string, class?: string },
  options: { defaultScheme?: string } = {},
) {
  const schemeClass = useSchemeClass(props.color, options.defaultScheme)
  const backgroundStyle = props.background ? handleBackground(props.background) : undefined

  return {
    schemeClass,
    backgroundStyle,
  }
}
