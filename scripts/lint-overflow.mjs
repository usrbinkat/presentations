#!/usr/bin/env node
// scripts/lint-overflow.mjs
//
// CI lint checker: validates every slide at every v-click state for:
// - Vertical and horizontal content overflow
// - Title wrapping
// - Minimum readable font size (below 10px)
//
// Drives a headless Playwright Chromium instance against a running Slidev dev server.
// Navigates via ArrowRight, measures at every state, detects last-slide completion.
//
// Usage:
//   DECK=rekindle-transport-veilid PORT=3030 node scripts/lint-overflow.mjs
//
// Requires: playwright (declared in devDependencies)

import process from 'node:process'
import { chromium } from 'playwright'

const deck = process.env.DECK || 'rekindle-transport-veilid'
const port = process.env.PORT || process.argv[2] || 3030
const url = `http://localhost:${port}/1`

/** Measure the active slide's overflow, title wrap, and min font size */
async function measureState(page) {
  return page.evaluate(() => {
    const active = document.querySelector('.slidev-page-current [class*="aurora-"][class*="-scheme"]')
      || document.querySelector('[class*="aurora-"][class*="-scheme"]')
    if (!active || active.scrollHeight <= 0 || active.clientHeight <= 0)
      return null

    const vOverflow = Math.max(0, active.scrollHeight - active.clientHeight)
    const hOverflow = Math.max(0, active.scrollWidth - active.clientWidth)

    const h1 = active.querySelector('h1')
    let titleWraps = false
    if (h1) {
      const lh = getComputedStyle(h1).lineHeight
      const lhPx = lh === 'normal' ? Number.parseFloat(getComputedStyle(h1).fontSize) * 1.2 : Number.parseFloat(lh)
      titleWraps = h1.scrollHeight > lhPx * 1.5
    }

    let minFont = Infinity
    for (const el of active.querySelectorAll('*')) {
      if (el.children.length > 0 || !el.textContent.trim())
        continue
      // Walk ancestors to check effective visibility
      let hidden = false
      let node = el
      while (node && node !== active) {
        if (node.classList?.contains('slidev-vclick-hidden')) {
          if (Number.parseFloat(getComputedStyle(node).opacity) === 0) {
            hidden = true
            break
          }
        }
        node = node.parentElement
      }
      if (hidden)
        continue
      const fs = Number.parseFloat(getComputedStyle(el).fontSize)
      if (fs > 0 && fs < minFont)
        minFont = fs
    }

    const heading = h1 || active.querySelector('h2') || active.querySelector('h3')
    const title = heading?.textContent?.trim() || active.textContent?.trim().substring(0, 40) || ''

    return {
      vOverflow,
      hOverflow,
      titleWraps,
      minFont: minFont === Infinity ? 0 : Math.round(minFont),
      title,
    }
  })
}

/** Read the current slide number from Slidev's navigation UI */
async function getSlideNum(page) {
  const text = await page.textContent('nav >> text=/\\d+ \\/ \\d+/').catch(() => '')
  return text?.split('/')[0]?.trim() || '?'
}

async function main() {
  console.log(`deck: ${deck} on port ${port}`)
  console.log(`connecting to ${url}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 980, height: 552 } })

  await page.goto(url, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const totalText = await page.textContent('nav >> text=/\\d+ \\/ \\d+/')
  const total = Number.parseInt(totalText?.split('/')[1]?.trim() || '0')

  if (!total) {
    console.error('ERROR: could not detect slide count')
    await browser.close()
    process.exit(1)
  }

  console.log(`${total} slides detected`)
  console.log('')

  const findings = []
  let statesMeasured = 0
  let visitedLast = false
  const maxIterations = total * 20

  for (let i = 0; i < maxIterations; i++) {
    const slideNum = await getSlideNum(page)
    await page.waitForTimeout(150)

    const result = await measureState(page)
    statesMeasured++

    if (result) {
      const problems = []

      if (result.vOverflow > 4)
        problems.push(`overflow:+${result.vOverflow}px`)
      if (result.hOverflow > 0)
        problems.push(`h-overflow:+${result.hOverflow}px`)
      if (result.titleWraps)
        problems.push('title-wraps')
      if (result.minFont > 0 && result.minFont < 10)
        problems.push(`min-font:${result.minFont}px`)

      if (problems.length) {
        const msg = `slide ${slideNum}: "${result.title}" [ ${problems.join(' ')} ]`
        console.log(`  ✗ ${msg}`)
        findings.push({ slide: slideNum, ...result, problems })
      }
    }

    // Advance
    const prevSlide = slideNum
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(150)

    const nextSlide = await getSlideNum(page)

    // Detect end: on last slide, ArrowRight doesn't change slide number
    if (prevSlide === String(total) && nextSlide === String(total)) {
      await page.keyboard.press('ArrowRight')
      await page.waitForTimeout(150)
      const confirm = await getSlideNum(page)
      if (confirm === String(total)) {
        visitedLast = true
        break
      }
    }
  }

  console.log('')

  if (!visitedLast) {
    console.error(`ERROR: navigation budget exhausted before reaching slide ${total}`)
    console.error(`  measured ${statesMeasured} states`)
    await browser.close()
    process.exit(1)
  }

  console.log(`measured ${statesMeasured} click states across ${total} slides`)

  const overflows = findings.filter(f => f.problems.some(p => p.includes('overflow'))).length
  const wraps = findings.filter(f => f.problems.includes('title-wraps')).length
  const fonts = findings.filter(f => f.problems.some(p => p.includes('min-font'))).length

  if (findings.length) {
    console.log(`${overflows} overflow(s), ${wraps} title wrap(s), ${fonts} font warning(s)`)
    await browser.close()
    process.exit(1)
  }
  else {
    console.log('all slides pass')
    await browser.close()
    process.exit(0)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
