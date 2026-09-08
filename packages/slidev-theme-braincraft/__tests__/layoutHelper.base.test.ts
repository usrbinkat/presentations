// Tests resolveAssetUrl with a non-root BASE_URL to verify
// GitHub Pages subdirectory deployment behavior.
// This file uses vitest.config.base.ts which sets BASE_URL to '/presentations/deck/'.

import { describe, expect, it } from 'vitest'
import { resolveAssetUrl } from '../layoutHelper'

describe('resolveAssetUrl with non-root BASE_URL', () => {
  it('prepends BASE_URL to root-relative paths', () => {
    // import.meta.env.BASE_URL is '/presentations/deck/' via define override
    expect(resolveAssetUrl('/assets/img.png')).toBe('/presentations/deck/assets/img.png')
  })

  it('prepends BASE_URL to shared asset paths', () => {
    expect(resolveAssetUrl('/shared/speakers/speaker-kat-morgan.jpg'))
      .toBe('/presentations/deck/shared/speakers/speaker-kat-morgan.jpg')
  })

  it('does not double-prepend on absolute URLs', () => {
    expect(resolveAssetUrl('https://example.com/img.png')).toBe('https://example.com/img.png')
  })
})
