// eslint.config.js
import antfu from '@antfu/eslint-config'

export default antfu({
  vue: true,
  typescript: true,
  ignores: [
    'node_modules',
    'dist',
    '.slidev',
    'sources/',
    // Documentation markdown contains YAML/JSON code fences that the
    // eslint markdown processor parses as live code, producing false
    // positives. These files are prose, not executable source.
    'docs/**/*.md',
  ],
})
