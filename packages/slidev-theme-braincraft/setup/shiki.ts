// setup/shiki.ts
// Shiki code highlighting configuration with notation transformers.
// These enable // [!code highlight], // [!code ++], // [!code focus], etc.

import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import { defineShikiSetup } from '@slidev/types'
import auroraDark from './aurora-dark.json'
import auroraLight from './aurora-light.json'

export default defineShikiSetup(() => {
  return {
    themes: {
      dark: auroraDark,
      light: auroraLight,
    },
    transformers: [
      transformerNotationHighlight(),
      transformerNotationDiff(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
      transformerNotationWordHighlight(),
    ],
  }
})
