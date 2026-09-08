// Build-time deck metadata loader.
// Reads frontmatter from each decks/*/slides.md via the yaml package
// and counts slides by counting --- separators per the Slidev spec.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import YAML from 'yaml'

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

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match)
    return {}
  try {
    return YAML.parse(match[1]) || {}
  }
  catch {
    return {}
  }
}

function countSlides(slidesPath: string): number {
  const content = readFileSync(slidesPath, 'utf8')
  const deckDir = dirname(slidesPath)

  // Slidev slide separators: a line that is exactly '---' at the start of a line.
  // The first --- pair is the global frontmatter. After that, each --- is a slide
  // separator. Per-slide frontmatter uses --- pairs within slides.
  // Simple heuristic: count all --- lines, subtract 1 for the opening frontmatter,
  // divide remaining by 1 (each separator = one slide boundary).
  const lines = content.split('\n')
  const separators = lines.filter(line => line.trimEnd() === '---')
  // slides = separators - 1 (opening) / each pair is one slide boundary
  // Simplified: number of slides ≈ floor(separators / 2)
  let count = Math.max(1, Math.floor(separators.length / 2))

  // Count slides in src: imported files
  const srcMatches = content.matchAll(/^src: (\S+)$/gm)
  for (const srcMatch of srcMatches) {
    const relPath = srcMatch[1]
    const absPath = resolve(deckDir, relPath)
    if (existsSync(absPath)) {
      const subContent = readFileSync(absPath, 'utf8')
      const subLines = subContent.split('\n')
      const subSeps = subLines.filter(line => line.trimEnd() === '---')
      count += Math.max(1, Math.floor(subSeps.length / 2))
    }
  }

  return count
}

export function loadDecks(): DeckMeta[] {
  const deckDirs = readdirSync(DECKS_DIR).filter((name: string) => {
    const dir = resolve(DECKS_DIR, name)
    return statSync(dir).isDirectory() && existsSync(resolve(dir, 'slides.md'))
  })

  return deckDirs.map((slug: string) => {
    const slidesPath = resolve(DECKS_DIR, slug, 'slides.md')
    const content = readFileSync(slidesPath, 'utf8')
    const fm = parseFrontmatter(content)

    const title = typeof fm.title === 'string' ? fm.title : slug
    const info = typeof fm.info === 'string' ? fm.info.trim() : ''
    const author = typeof fm.author === 'string' ? fm.author : ''
    const duration = typeof fm.duration === 'string' ? fm.duration : ''

    let keywords: string[] = []
    if (typeof fm.keywords === 'string') {
      keywords = fm.keywords.split(',').map((k: string) => k.trim()).filter(Boolean)
    }
    else if (Array.isArray(fm.keywords)) {
      keywords = fm.keywords.map(String)
    }

    return {
      slug,
      title,
      description: info,
      author,
      keywords,
      duration,
      slideCount: countSlides(slidesPath),
    }
  }).sort((a: DeckMeta, b: DeckMeta) => b.slideCount - a.slideCount)
}
