// Build-time deck metadata loader.
// Reads frontmatter from each decks/*/slides.md and counts slides
// across all src: imported sub-slide files.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'

// Astro sets cwd to the project root (www/sites/presentations/) during build.
// Navigate up 3 levels to reach the repo root where decks/ lives.
const REPO_ROOT = resolve(process.cwd(), '..', '..', '..')
const DECKS_DIR = resolve(REPO_ROOT, 'decks')

interface DeckMeta {
  slug: string
  title: string
  description: string
  author: string
  keywords: string[]
  duration: string
  slideCount: number
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match)
    return {}
  const lines = match[1].split('\n')
  const result: Record<string, string> = {}
  let currentKey = ''
  let multiline = false

  for (const line of lines) {
    if (multiline) {
      if (line.startsWith('  ') || line.startsWith('\t')) {
        result[currentKey] = `${(result[currentKey] || '') + line.trim()} `
        continue
      }
      multiline = false
    }
    const kvMatch = line.match(/^(\w[\w-]*):\s?(.*)$/)
    if (kvMatch) {
      currentKey = kvMatch[1]
      const value = kvMatch[2].trim()
      if (value === '|' || value === '>') {
        multiline = true
        result[currentKey] = ''
      }
      else {
        result[currentKey] = value.replace(/^['"]|['"]$/g, '')
      }
    }
  }
  return result
}

function countSlides(slidesPath: string): number {
  const content = readFileSync(slidesPath, 'utf8')
  const separators = content.split('\n').filter(line => line === '---').length
  let count = Math.floor(separators / 2)

  // Count slides in src: imported files
  const srcImports = content.match(/^src: (\S+)$/gm) || []
  const deckDir = dirname(slidesPath)
  for (const imp of srcImports) {
    const relPath = imp.replace(/^src: /, '').trim()
    const absPath = resolve(deckDir, relPath)
    if (existsSync(absPath)) {
      const subContent = readFileSync(absPath, 'utf8')
      const subSeps = subContent.split('\n').filter(line => line === '---').length
      count += Math.floor(subSeps / 2)
    }
  }

  return count
}

export function loadDecks(): DeckMeta[] {
  const deckDirs = readdirSync(DECKS_DIR).filter((name) => {
    const dir = resolve(DECKS_DIR, name)
    return statSync(dir).isDirectory() && existsSync(resolve(dir, 'slides.md'))
  })

  return deckDirs.map((slug) => {
    const slidesPath = resolve(DECKS_DIR, slug, 'slides.md')
    const content = readFileSync(slidesPath, 'utf8')
    const fm = parseFrontmatter(content)

    return {
      slug,
      title: fm.title || slug,
      description: fm.info?.trim() || '',
      author: fm.author || '',
      keywords: (fm.keywords || '').split(',').map(k => k.trim()).filter(Boolean),
      duration: fm.duration || '',
      slideCount: countSlides(slidesPath),
    }
  }).sort((a, b) => b.slideCount - a.slideCount) // largest deck first
}
