// styles/index.ts
// Import order matters — Slidev loads this in the style chain:
// reset > UnoCSS preflights > client styles > THIS > UnoCSS output
// Source: Agent 1 (virtual/styles.ts), Agent 2 (all official themes)

import '@slidev/client/styles/layouts-base.css'
import './aurora-tokens.css'
import './color-schemes.css'
import './dark-mode.css'
import './layouts.css'
import './code-theme.css'
import './transitions.css'
