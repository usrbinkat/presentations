import { describe, expect, it } from 'vitest'

describe('layout imports', () => {
  const layouts = [
    'default',
    'cover',
    'intro',
    'section',
    'two-cols',
    'center',
    'full',
    'two-cols-title',
    'side-title',
    'quote',
    'fact',
    'statement',
    'presenter',
    'figure',
    'end',
  ]

  for (const name of layouts) {
    it(`imports ${name} layout`, async () => {
      const mod = await import(`../layouts/${name}.vue`)
      expect(mod.default).toBeDefined()
    })
  }
})
