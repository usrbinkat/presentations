---
layout: default
color: cream
class: dense
---

# Crate dependency graph

<div class="topo-grid">
  <div class="topo-header">Crate</div>
  <div class="topo-header">Role and boundary</div>

  <div class="topo-name">veilid-core</div>
  <div class="topo-cell">DHT, private routes, TCP/UDP/WS. Ed25519, X25519, XChaCha20, BLAKE3.</div>

  <div class="topo-name">rekindle-types</div>
  <div class="topo-cell">Transport trait and types. Zero implementation. Zero veilid-core types.</div>

  <div class="topo-name topo-hl">rekindle-transport-veilid</div>
  <div class="topo-cell topo-hl">Sole <code>veilid_core</code> importer. <code>pub(crate)</code> on internals. No veilid-core in public API.</div>

  <div class="topo-name">rekindle-transport-buff</div>
  <div class="topo-cell">Lock-free primitives. Zero runtime/transport/crypto deps. CI-enforced.</div>

  <div class="topo-name">kappa-transport-veilid</div>
  <div class="topo-cell">Reconciliation, dispatch, DHT persistence. Consumes Transport trait only.</div>

  <div class="topo-name">kappa-store</div>
  <div class="topo-cell">Persistence for blobs, tags, epochs, namespaces, edges, sequences.</div>
</div>

<style>
.topo-grid {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-3);
  align-items: start;
}

.topo-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.topo-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.topo-name.topo-hl { color: var(--scheme-accent); }

.topo-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 60%, transparent);
}

.topo-cell.topo-hl {
  background: color-mix(in oklch, var(--aurora-lavender-200) 50%, transparent);
}

.topo-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- rekindle-transport-veilid highlighted: sole veilid-core importer
- Everything else operates through Transport trait or store traits
- pub(crate) on broadcast + subscriptions enforces the boundary
- rekindle-transport-buff: cargo tree --no-default-features must show zero forbidden crates
- kappa-store consumed by both reconciliation and application code
-->

---
layout: default
color: slate
---

# The facade crate

```rust
// rekindle-transport/src/lib.rs — 25 lines total
pub use rekindle_types::transport::{Transport, InboundEvent, /* ... */};

#[cfg(feature = "veilid")]
pub mod veilid {
    pub use rekindle_transport_veilid::*;
}

#[cfg(feature = "ipc")]
pub mod ipc {
    pub use rekindle_transport_ipc::*;
}
```

Consumers depend on `rekindle-transport` with `features = ["veilid"]` or `features = ["ipc"]`. One dependency for either backend.

<style>
p { color: var(--scheme-heading); }

:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 1.3rem !important;
  line-height: 1.8 !important;
}
</style>

<!--
- 25 lines total, zero logic
- features = ["veilid"] or features = ["ipc"] selects the backend
- Consumers never depend on rekindle-transport-veilid or rekindle-transport-ipc directly
-->
