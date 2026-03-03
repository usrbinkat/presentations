import { describe, expect, it, vi } from 'vitest'

// Mock @slidev/client/builtin — not available outside Slidev runtime
vi.mock('@slidev/client/builtin', () => ({
  SlideCurrentNo: { name: 'SlideCurrentNo', render: () => null },
  SlidesTotal: { name: 'SlidesTotal', render: () => null },
}))

describe('component imports', () => {
  it('imports Admonition', async () => {
    const mod = await import('../components/Admonition.vue')
    expect(mod.default).toBeDefined()
  })

  it('imports QRCode', async () => {
    const mod = await import('../components/QRCode.vue')
    expect(mod.default).toBeDefined()
  })

  it('imports MetricCard', async () => {
    const mod = await import('../components/MetricCard.vue')
    expect(mod.default).toBeDefined()
  })

  it('imports SpeakerBio', async () => {
    const mod = await import('../components/SpeakerBio.vue')
    expect(mod.default).toBeDefined()
  })

  it('imports CodeComparison', async () => {
    const mod = await import('../components/CodeComparison.vue')
    expect(mod.default).toBeDefined()
  })

  it('imports TerminalEmbed', async () => {
    const mod = await import('../components/TerminalEmbed.vue')
    expect(mod.default).toBeDefined()
  })

  it('imports Pagination', async () => {
    const mod = await import('../components/Pagination.vue')
    expect(mod.default).toBeDefined()
  })

  it('imports Footnote', async () => {
    const mod = await import('../components/Footnote.vue')
    expect(mod.default).toBeDefined()
  })

  it('imports Footnotes', async () => {
    const mod = await import('../components/Footnotes.vue')
    expect(mod.default).toBeDefined()
  })
})
