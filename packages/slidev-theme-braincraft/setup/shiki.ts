// setup/shiki.ts
// Shiki code highlighting theme configuration.
// Source: Agent 2 (Neversink uses slack-dark/snazzy-light, the-unnamed uses custom JSON)

import { defineShikiSetup } from '@slidev/types'

export default defineShikiSetup(() => {
  return {
    themes: {
      dark: 'vitesse-dark',
      light: 'vitesse-light',
    },
  }
})
