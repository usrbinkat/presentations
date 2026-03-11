import type { Plugin } from 'vite'
// vite.config.ts
// Shared Vite config for all decks.
// Injects build-time git metadata for dynamic QR code URL generation.
//
// TODO: Commit-pinned QR URLs
// Replace 'main' with `git rev-parse HEAD` for immutable links:
//   1. Add to gitPlugin: const commit = execSync('git rev-parse HEAD').toString().trim()
//   2. Define __SLIDEV_GIT_COMMIT__: JSON.stringify(commit)
//   3. In global-top.vue: replace '/blob/main/' with `/blob/${__SLIDEV_GIT_COMMIT__}/`
//   4. This gives every built deck a QR code pointing to the exact source at that commit
//   5. Consider also injecting __SLIDEV_BUILD_DATE__ for provenance

import { execSync } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'vite'

function gitMetadataPlugin(): Plugin {
  return {
    name: 'slidev-git-metadata',
    config(_, { command: _cmd }) {
      try {
        const gitRoot = execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim()
        const remote = execSync('git remote get-url origin', { encoding: 'utf8' }).trim()

        // Convert any git remote URL format to a GitHub browse URL
        const repoUrl = remote
          .replace(/\.git$/, '')
          .replace(/^git@github\.com:/, 'https://github.com/')

        // Slidev sets cwd to the deck directory before Vite starts.
        // Compute the deck's slides.md path relative to the git root.
        const deckDir = path.relative(gitRoot, process.cwd())
        const slidesPath = deckDir ? `${deckDir}/slides.md` : 'slides.md'

        // Construct the full GitHub URL to the source file on main branch
        const sourceUrl = `${repoUrl}/blob/main/${slidesPath}`

        return {
          define: {
            __SLIDEV_SOURCE_URL__: JSON.stringify(sourceUrl),
          },
        }
      }
      catch {
        // Not a git repo or git not available — QR falls back to themeConfig.qrUrl
        return {}
      }
    },
  }
}

export default defineConfig({
  plugins: [gitMetadataPlugin()],
})
