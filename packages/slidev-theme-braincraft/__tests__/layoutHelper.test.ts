import { describe, expect, it } from 'vitest'
import { handleBackground, resolveAssetUrl, useSchemeClass } from '../layoutHelper'

describe('resolveAssetUrl', () => {
  it('returns absolute URLs unchanged', () => {
    expect(resolveAssetUrl('https://example.com/img.png')).toBe('https://example.com/img.png')
  })

  it('returns root-relative paths unchanged', () => {
    expect(resolveAssetUrl('/assets/img.png')).toBe('/assets/img.png')
  })
})

describe('handleBackground', () => {
  it('returns undefined for undefined input', () => {
    expect(handleBackground(undefined)).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(handleBackground('')).toBeUndefined()
  })

  it('detects hex colors', () => {
    expect(handleBackground('#ff0000')).toEqual({ background: '#ff0000' })
  })

  it('detects rgb colors', () => {
    expect(handleBackground('rgb(255, 0, 0)')).toEqual({ background: 'rgb(255, 0, 0)' })
  })

  it('detects oklch colors', () => {
    expect(handleBackground('oklch(0.5 0.2 240)')).toEqual({ background: 'oklch(0.5 0.2 240)' })
  })

  it('detects hsl colors', () => {
    expect(handleBackground('hsl(0, 100%, 50%)')).toEqual({ background: 'hsl(0, 100%, 50%)' })
  })

  it('detects CSS variables', () => {
    expect(handleBackground('var(--my-color)')).toEqual({ background: 'var(--my-color)' })
  })

  it('detects linear gradients', () => {
    const grad = 'linear-gradient(135deg, red, blue)'
    expect(handleBackground(grad)).toEqual({ background: grad })
  })

  it('detects radial gradients', () => {
    const grad = 'radial-gradient(circle, red, blue)'
    expect(handleBackground(grad)).toEqual({ background: grad })
  })

  it('detects conic gradients', () => {
    const grad = 'conic-gradient(red, blue)'
    expect(handleBackground(grad)).toEqual({ background: grad })
  })

  it('wraps URLs as background-image', () => {
    const result = handleBackground('https://example.com/image.jpg')
    expect(result!.backgroundImage).toContain('url(')
    expect(result!.backgroundSize).toBe('cover')
    expect(result!.backgroundPosition).toBe('center')
  })

  it('applies dim overlay when dim is true', () => {
    const result = handleBackground('https://example.com/image.jpg', true)
    expect(result!.backgroundImage).toContain('linear-gradient')
    expect(result!.backgroundImage).toContain('url(')
  })
})

describe('useSchemeClass', () => {
  it('returns cream scheme by default', () => {
    expect(useSchemeClass()).toBe('aurora-cream-scheme')
  })

  it('returns specified scheme', () => {
    expect(useSchemeClass('lavender')).toBe('aurora-lavender-scheme')
  })

  it('uses custom fallback when color is undefined', () => {
    expect(useSchemeClass(undefined, 'slate')).toBe('aurora-slate-scheme')
  })

  it('uses custom fallback when color is empty string', () => {
    expect(useSchemeClass('', 'mint')).toBe('aurora-mint-scheme')
  })
})
