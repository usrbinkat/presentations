// Build-time constants injected by gitMetadataPlugin in vite.config.ts.
// Vite `define` replaces these identifiers with string literals at compile time.
// Outside Git (source archives, CI without checkout), values are empty strings.
declare const __SLIDEV_SOURCE_URL__: string
declare const __SLIDEV_GIT_COMMIT__: string
declare const __SLIDEV_GIT_STATE__: 'clean' | 'dirty' | 'unavailable'
declare const __SLIDEV_BUILD_DATE__: string
