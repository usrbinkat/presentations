import type { Plugin } from 'vite'

import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import sirv from 'sirv'
import { defineConfig } from 'vite'
import { buildDate, git, repositoryUrl } from '../../lib/git-utils.ts'

// Theme-level Vite config loaded automatically by Slidev's resolveViteConfigs
// because theme roots are included in options.roots.
//
// gitMetadataPlugin: injects commit-pinned source provenance for QR code generation.
// sharedAssetsPlugin: serves shared/assets/ as /shared/ in dev, emits into build output.

type SourceState = 'clean' | 'dirty' | 'unavailable'

function gitMetadataPlugin(): Plugin {
  return {
    name: 'slidev-git-metadata',

    config(_, { command }) {
      let commit = ''
      let sourceUrl = ''
      let sourceState: SourceState = 'unavailable'

      try {
        const gitRoot = git('rev-parse', '--show-toplevel')
        const remote = repositoryUrl(git('remote', 'get-url', 'origin'))
        const status = git('status', '--porcelain', '--untracked-files=normal')

        commit = git('rev-parse', 'HEAD')
        sourceState = status ? 'dirty' : 'clean'

        const deckDir = path
          .relative(gitRoot, process.cwd())
          .split(path.sep)
          .join('/')

        const slidesPath = deckDir ? `${deckDir}/slides.md` : 'slides.md'

        // A dirty working tree has no immutable remote representation.
        if (sourceState === 'clean')
          sourceUrl = `${remote}/blob/${commit}/${slidesPath}`
      }
      catch {
        // Builds outside Git use themeConfig.qrUrl.
      }

      if (command === 'build' && sourceState === 'dirty') {
        console.warn(
          '[slidev-git-metadata] Building from a dirty working tree; '
          + 'the source QR will use themeConfig.qrUrl because no remote '
          + 'commit represents the rendered presentation.',
        )
      }

      return {
        define: {
          __SLIDEV_SOURCE_URL__: JSON.stringify(sourceUrl),
          __SLIDEV_GIT_COMMIT__: JSON.stringify(commit),
          __SLIDEV_GIT_STATE__: JSON.stringify(sourceState),
          __SLIDEV_BUILD_DATE__: JSON.stringify(buildDate()),
        },
      }
    },
  }
}

/**
 * Serve shared/assets/ as /shared/ in dev, emit into build output.
 *
 * Dev: sirv middleware handles path safety, MIME types, streaming.
 * Build: generateBundle walks the directory and emits each file.
 */
function sharedAssetsPlugin(): Plugin {
  let sharedDir: string

  return {
    name: 'slidev-shared-assets',
    enforce: 'pre',
    configResolved() {
      try {
        const gitRoot = git('rev-parse', '--show-toplevel')
        sharedDir = path.resolve(gitRoot, 'shared', 'assets')
      }
      catch {
        sharedDir = ''
      }
    },
    configureServer(server) {
      if (!sharedDir || !fs.existsSync(sharedDir))
        return
      server.middlewares.use('/shared', sirv(sharedDir, { dev: true }))
    },
    generateBundle() {
      if (!sharedDir || !fs.existsSync(sharedDir))
        return
      const walk = (dir: string, prefix: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          if (entry.name === '.gitkeep')
            continue
          const full = path.join(dir, entry.name)
          const rel = prefix ? `${prefix}/${entry.name}` : entry.name
          if (entry.isDirectory()) {
            walk(full, rel)
          }
          else {
            this.emitFile({
              type: 'asset',
              fileName: `shared/${rel}`,
              source: fs.readFileSync(full),
            })
          }
        }
      }
      walk(sharedDir, '')
    },
  }
}

export default defineConfig({
  plugins: [gitMetadataPlugin(), sharedAssetsPlugin()],
})
