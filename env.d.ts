/// <reference types="vite/client" />

// Build-time constants injected by gitMetadataPlugin in vite.config.ts.
// Vite `define` replaces these identifiers with string literals at compile time.
// Outside Git (source archives, CI without checkout), values are empty strings.
declare const __SLIDEV_SOURCE_URL__: string
declare const __SLIDEV_GIT_COMMIT__: string
declare const __SLIDEV_GIT_STATE__: 'clean' | 'dirty' | 'unavailable'
declare const __SLIDEV_BUILD_DATE__: string

// CSS side-effect imports (TypeScript 6 requires explicit declarations)
declare module '*.css'

// Slidev runtime globals injected by the CLI at build time
declare const $slidev: any
declare const $nav: any

// Untyped npm packages
declare module 'qrcode'

// Slidev client modules without published type declarations
declare module '@slidev/client/styles/layouts-base.css'
declare module '@slidev/client/uno.config' {
  import type { UserConfig } from 'unocss'

  const config: UserConfig
  export default config
}

// Slidev client subpath stubs — prevent vue-tsc from following raw .ts
// source into @slidev/client's transitive dependency graph
declare module '@slidev/client/builtin/SlideCurrentNo.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}
declare module '@slidev/client/builtin/SlidesTotal.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent
  export default component
}
