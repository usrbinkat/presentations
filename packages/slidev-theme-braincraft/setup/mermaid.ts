// setup/mermaid.ts
// Mermaid diagram theme configuration matching Aurora palette.
// Source: Agent 2 (the-unnamed mermaid integration)

import { defineMermaidSetup } from '@slidev/types'

export default defineMermaidSetup(() => {
  return {
    theme: 'base',
    themeVariables: {
      // Aurora palette mapped to Mermaid variables
      primaryColor: '#C0A6DB',        // lavender-400
      primaryTextColor: '#322C42',    // slate-800
      primaryBorderColor: '#A483CE',  // lavender-500
      secondaryColor: '#A5D5C1',      // mint-400
      secondaryTextColor: '#322C42',  // slate-800
      secondaryBorderColor: '#87C1AB', // mint-500
      tertiaryColor: '#FFC4A8',       // peach-400
      tertiaryTextColor: '#322C42',   // slate-800
      tertiaryBorderColor: '#FFAF89', // peach-500
      lineColor: '#AFA8BD',           // slate-400
      textColor: '#322C42',           // slate-800
      mainBkg: '#FAF9F7',             // cream-100
      nodeBorder: '#AFA8BD',          // slate-400
      fontFamily: 'Inter, sans-serif',
    },
  }
})
