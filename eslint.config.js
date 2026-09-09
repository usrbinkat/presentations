// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    formatters: {
      css: true,
      // markdown: false — Slidev uses --- as slide separators, not horizontal
      // rules. Prettier's markdown formatter strips "duplicate" --- lines and
      // destroys frontmatter blocks. Do not enable markdown formatting.
      markdown: false,
      // slidev: false — same reason as markdown. The slidev formatter uses
      // prettier-plugin-slidev which still runs prettier on markdown content.
      slidev: false,
    },
    ignores: [
      'node_modules',
      'dist',
      '.slidev',
      'sources/',
      'docs/**/*.md',
      'www/**',
    ],
  },
  // Slidev markdown: one H1 per slide, heading levels reset per slide,
  // images in HTML templates don't have markdown alt text syntax.
  // These document-level markdown rules are structurally incompatible
  // with Slidev's slide-per-separator model.
  {
    files: ['**/*.md'],
    rules: {
      'markdown/no-multiple-h1': 'off',
      'markdown/heading-increment': 'off',
      'markdown/require-alt-text': 'off',
    },
  },
)
