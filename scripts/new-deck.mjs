#!/usr/bin/env node
// scripts/new-deck.mjs — Scaffold a new Slidev deck
// Usage: pnpm new-deck <deck-name>

import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const name = process.argv[2]

if (!name) {
  console.error('Usage: pnpm new-deck <deck-name>')
  process.exit(1)
}

const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
const deckDir = resolve(import.meta.dirname, '..', 'decks', slug)

if (existsSync(deckDir)) {
  console.error(`Deck already exists: decks/${slug}/`)
  process.exit(1)
}

// Create directory structure
mkdirSync(resolve(deckDir, 'public'), { recursive: true })
writeFileSync(resolve(deckDir, 'public', '.gitkeep'), '')

// package.json
const pkg = {
  name: `@braincraft/deck-${slug}`,
  private: true,
  scripts: {
    dev: 'slidev',
    build: 'slidev build',
    export: 'slidev export',
  },
  dependencies: {
    '@slidev/cli': 'catalog:',
    'slidev-theme-braincraft': 'workspace:*',
    'slidev-addon-braincraft': 'workspace:*',
  },
}
writeFileSync(resolve(deckDir, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`)

// slides.md
const title = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
const slides = `---
theme: slidev-theme-braincraft
addons:
  - slidev-addon-braincraft
title: "${title}"
info: |
  ${title}
author: usrbinkat
keywords: braincraft
colorSchema: auto
transition: aurora-fade
fonts:
  sans: Inter
  mono: Space Mono
---

---
layout: cover
color: lavender
---

# ${title}

Subtitle here

<!--
Speaker notes go here.
-->

---
src: ../../shared/fragments/intro.md
---

---
src: ../../shared/fragments/thanks.md
---
`

writeFileSync(resolve(deckDir, 'slides.md'), slides)

// vite.config.ts — re-export shared config so plugins load from deck cwd
writeFileSync(resolve(deckDir, 'vite.config.ts'), `export { default } from '../../vite.config'\n`)

console.log(`Created decks/${slug}/`)
console.log(`  - package.json`)
console.log(`  - slides.md (with cover + intro + thanks)`)
console.log(`  - vite.config.ts (re-exports shared config)`)
console.log(`  - public/.gitkeep`)
console.log(``)
console.log(`Next: cd decks/${slug} && pnpm exec slidev dev`)
