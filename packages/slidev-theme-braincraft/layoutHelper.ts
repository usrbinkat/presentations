// layoutHelper.ts
// Shared layout utilities for slidev-theme-braincraft.
// Sources:
//   - handleBackground/resolveAssetUrl: Agent 1 (client/layoutHelper.ts), Agent 2 (all official themes)
//   - 12-col grid helpers: Agent 2 (Neversink layoutHelper.ts)

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

  if (isColor) {
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
 * 12-column grid helpers (from Neversink, Agent 2).
 * Maps semantic column names to CSS grid-column spans.
 */
type ColumnSize =
  | 'is-full' | 'is-half'
  | 'is-one-third' | 'is-two-thirds'
  | 'is-one-quarter' | 'is-three-quarters'
  | 'is-one-sixth' | 'is-five-sixths'

const COLUMN_MAP: Record<ColumnSize, number> = {
  'is-full': 12,
  'is-half': 6,
  'is-one-third': 4,
  'is-two-thirds': 8,
  'is-one-quarter': 3,
  'is-three-quarters': 9,
  'is-one-sixth': 2,
  'is-five-sixths': 10,
}

export function computeColumnSpan(size: string): number {
  if (size in COLUMN_MAP)
    return COLUMN_MAP[size as ColumnSize]
  // Try numeric (1-12)
  const n = Number.parseInt(size, 10)
  if (n >= 1 && n <= 12)
    return n
  return 6 // default half
}

/**
 * 2-letter alignment codes to CSS class mapping (Neversink pattern, Agent 2).
 * First letter: l=left, c=center, r=right
 * Second letter: t=top, m=middle, b=bottom
 */
type AlignCode = 'lt' | 'lm' | 'lb' | 'ct' | 'cm' | 'cb' | 'rt' | 'rm' | 'rb'

const ALIGN_MAP: Record<AlignCode, string> = {
  lt: 'items-start justify-start',
  lm: 'items-start justify-center',
  lb: 'items-start justify-end',
  ct: 'items-center justify-start',
  cm: 'items-center justify-center',
  cb: 'items-center justify-end',
  rt: 'items-end justify-start',
  rm: 'items-end justify-center',
  rb: 'items-end justify-end',
}

export function computeAlignment(code?: string): string {
  if (!code)
    return ''
  return ALIGN_MAP[code as AlignCode] || ''
}
