#!/usr/bin/env node
// Build all Slidev decks into the Astro dist directory.
// Each deck outputs to dist/{deck-name}/slides/ so the Astro site
// can serve deck detail pages at dist/{deck-name}/index.html and
// the Slidev SPA lives one level deeper at dist/{deck-name}/slides/.
//
// User flow:
//   /presentations/{deck}/        → Astro deck detail page
//   /presentations/{deck}/slides/ → Slidev SPA (full presentation)

import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const REPO_ROOT = resolve(import.meta.dirname, '..', '..', '..')
const DECKS_DIR = resolve(REPO_ROOT, 'decks')
const DIST_DIR = resolve(import.meta.dirname, 'dist')
const BASE = '/presentations'

const decks = readdirSync(DECKS_DIR).filter((name) => {
  const dir = resolve(DECKS_DIR, name)
  return statSync(dir).isDirectory() && existsSync(resolve(dir, 'slides.md'))
})

console.warn(`Building ${decks.length} decks into ${DIST_DIR}`)

for (const deck of decks) {
  const deckDir = resolve(DECKS_DIR, deck)
  const outDir = resolve(DIST_DIR, deck, 'slides')
  const base = `${BASE}/${deck}/slides/`

  console.warn(`  ${deck} → ${outDir}`)

  execFileSync('pnpm', ['exec', 'slidev', 'build', 'slides.md', '--base', base, '--out', outDir], {
    cwd: deckDir,
    stdio: 'inherit',
    env: { ...process.env },
  })
}

console.warn('All decks built.')
