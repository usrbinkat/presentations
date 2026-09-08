#!/usr/bin/env node
// scripts/new-layout.mjs — Scaffold a new Slidev layout
// Usage: pnpm new-layout <layout-name>

import { existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'

const name = process.argv[2]

if (!name) {
  console.error('Usage: pnpm new-layout <layout-name>')
  process.exit(1)
}

const slug = name.toLowerCase().replace(/[^a-z0-9-]/g, '-')
const layoutDir = resolve(import.meta.dirname, '..', 'packages', 'slidev-theme-braincraft', 'layouts')
const filePath = resolve(layoutDir, `${slug}.vue`)

if (existsSync(filePath)) {
  console.error(`Layout already exists: layouts/${slug}.vue`)
  process.exit(1)
}

const template = `<!--
  Layout: ${slug}
  Communicative purpose: [FILL IN — what is the presenter trying to make the audience think/feel/understand?]
  Content zones: default slot
  Ontology tier: [FILL IN — Tier 1-10]
-->
<script setup lang="ts">
import { useSchemeClass } from '../layoutHelper'

const { color = 'lavender' } = defineProps<{
  color?: string
}>()

const schemeClass = useSchemeClass(color)
</script>

<template>
  <div class="slidev-layout ${slug}" :class="schemeClass">
    <slot />
  </div>
</template>

<style scoped>
.${slug} {
  height: 100%;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  display: flex;
  flex-direction: column;
}
</style>
`

writeFileSync(filePath, template)

console.log(`Created layouts/${slug}.vue`)
console.log(`  - Uses useSchemeClass() + Aurora spacing tokens`)
console.log(`  - Fill in the communicative purpose comment`)
console.log(`  - Add slots for content zones per ontology spec`)
