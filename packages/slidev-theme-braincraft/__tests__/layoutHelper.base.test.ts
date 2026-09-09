// Tests resolveAssetUrl with a non-root BASE_URL to verify
// GitHub Pages subdirectory deployment behavior.
//
// Vitest 5 hardcodes base:'/' in its plugin config hook. The vite
// base option cannot override import.meta.env.BASE_URL in tests.
// vi.stubEnv is the correct API: it modifies process.env which
// flows into the worker's metaEnv that import.meta.env reads from.

import { describe, expect, it, vi } from 'vitest'
import { resolveAssetUrl } from '../layoutHelper'

describe('resolveAssetUrl with non-root BASE_URL', () => {
  it('prepends BASE_URL to root-relative paths', () => {
    vi.stubEnv('BASE_URL', '/presentations/deck/')
    expect(resolveAssetUrl('/assets/img.png')).toBe(
      '/presentations/deck/assets/img.png',
    )
    vi.unstubAllEnvs()
  })

  it('prepends BASE_URL to shared asset paths', () => {
    vi.stubEnv('BASE_URL', '/presentations/deck/')
    expect(resolveAssetUrl('/shared/speakers/speaker-kat-morgan.jpg')).toBe(
      '/presentations/deck/shared/speakers/speaker-kat-morgan.jpg',
    )
    vi.unstubAllEnvs()
  })

  it('does not double-prepend on absolute URLs', () => {
    vi.stubEnv('BASE_URL', '/presentations/deck/')
    expect(resolveAssetUrl('https://example.com/img.png')).toBe(
      'https://example.com/img.png',
    )
    vi.unstubAllEnvs()
  })
})
