---
theme: slidev-theme-braincraft
addons:
  - slidev-addon-braincraft
  - slidev-addon-excalidraw
title: 'Veilid Transport — Peer-to-Peer Application Infrastructure'
info: |
  A 120-minute practitioner-level walkthrough of the Veilid P2P overlay
  network as application infrastructure. Covers the veilid-core substrate,
  the Transport trait abstraction, crate topology and boundary contracts,
  route resolution, delivery tiers, adaptive gossip, the reconciliation
  protocol, the store substrate, lock-free buffer primitives, IPC wire
  security, and application integration patterns across multiple consumers.
author: Kat Morgan - aka @usrbinkat
keywords: veilid,p2p,transport,rust,lock-free,dht,gossip,encryption,reconciliation,kappa,rekindle
colorSchema: auto
duration: '120min'
wakeLock: true
drawings:
  persist: true
themeConfig:
  qrUrl: https://github.com/usrbinkat
transition: aurora-fade
fonts:
  sans: Inter
  mono: Space Mono
---

---
layout: cover
color: slate
---

<div class="title-card">
  <h1>Veilid Transport</h1>
  <div class="title-sub">Peer-to-Peer Application Infrastructure</div>
  <hr class="title-rule" />
  <div class="title-speaker">Kat Morgan · @usrbinkat</div>
</div>

<style>
.title-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: var(--aurora-space-2);
}

.title-card h1 {
  font-size: var(--aurora-text-6xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading, white);
  line-height: 1.1;
  margin: 0;
}

.title-sub {
  font-size: var(--aurora-text-3xl);
  font-weight: var(--aurora-font-medium);
  color: var(--scheme-accent, var(--aurora-lavender-400));
}

.title-rule {
  border: none;
  border-top: 3px solid var(--scheme-accent, var(--aurora-lavender-400));
  width: 100%;
  margin: var(--aurora-space-4) 0;
}

.title-speaker {
  font-size: var(--aurora-text-xl);
  color: var(--scheme-heading, white);
  font-weight: var(--aurora-font-medium);
}
</style>

<!--
Title card.
-->

---
src: ../../shared/fragments/intro.md
---

layout: default
color: cream
routeAlias: toc

---

# Deck overview

<div class="toc">
  <div class="toc-col">
    <Link to="problem-space" class="toc-item">Problem Space</Link>
    <Link to="veilid-substrate" class="toc-item">Veilid Substrate</Link>
    <Link to="transport-trait" class="toc-item">Transport Trait Boundary</Link>
    <Link to="crate-topology" class="toc-item">Crate Topology</Link>
    <Link to="route-resolution" class="toc-item">Route Resolution</Link>
    <Link to="transport-tiers" class="toc-item">Transport Tiers</Link>
    <Link to="delivery" class="toc-item">Delivery and Convergence</Link>
    <Link to="gossip" class="toc-item">Gossip and Mesh</Link>
    <Link to="reconciliation" class="toc-item">Reconciliation Protocol</Link>
  </div>
  <div class="toc-col">
    <Link to="data-paths" class="toc-item">Data Paths</Link>
    <Link to="store" class="toc-item">Store Substrate</Link>
    <Link to="identity" class="toc-item">Identity Substrate</Link>
    <Link to="protocol-modules" class="toc-item">Protocol Modules</Link>
    <Link to="lifecycle" class="toc-item">Node Lifecycle</Link>
    <Link to="construction" class="toc-item">Construction Order</Link>
    <Link to="primitives" class="toc-item">Lock-Free Primitives</Link>
    <Link to="bulk-transfer" class="toc-item">Bulk Transfer</Link>
    <Link to="ipc-wire" class="toc-item">IPC Wire Security</Link>
    <Link to="integration" class="toc-item">Application Integration</Link>
  </div>
</div>

<style>
.toc {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-4);
  margin-top: var(--aurora-space-4);
}

.toc-col {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-2);
}

.toc-item {
  font-size: var(--aurora-text-base);
  color: var(--scheme-heading) !important;
  text-decoration: none !important;
  padding: var(--aurora-space-1) var(--aurora-space-3);
  border-inline-start: 2px solid var(--scheme-accent);
  line-height: var(--aurora-leading-snug);
}

.toc-item:hover {
  color: var(--scheme-accent) !important;
}
</style>

---
layout: section
color: slate
transition: aurora-zoom
routeAlias: problem-space
---

# The Problem Space

Data availability, consistency, and provenance start with four engineering constraints.

<!--
- Ed25519 identity
- DHT + private route routing
- app_message / app_call delivery
- Noise + onion security
- Click 2 maps each to Veilid primitives
- Next slide: three abstraction layers
-->

---
src: ./problem-framing.md
---

---
src: ../../shared/fragments/veilid/veilid-core/api-surface.md
---

---
src: ../../shared/fragments/veilid/veilid-core/attachment-lifecycle.md
---

---
src: ../../shared/fragments/veilid/veilid-core/private-routing.md
---

---
src: ../../shared/fragments/veilid/veilid-core/messaging-primitives.md
---

---
src: ../../shared/fragments/veilid/veilid-core/dht-data-model.md
---

---
src: ../../shared/fragments/veilid/veilid-core/reactivity-watches.md
---

---
src: ../../shared/fragments/veilid/veilid-core/dht-transactions.md
---

---
src: ../../shared/fragments/veilid/veilid-core/trust-failure.md
---

---
src: ../../shared/fragments/veilid/veilid-core/configuration.md
---

---
src: ../../shared/fragments/veilid/veilid-core/component-architecture.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: veilid-substrate

---

# The Veilid Substrate

Messaging, DHT storage, private routes, operational latency, design constraints.

<!--
- VeilidAPI: startup, attach, routing_context, new_private_route
- RoutingContext: app_message, app_call, DHT CRUD, watches
- VeilidUpdate: AppMessage, AppCall, ValueChange, RouteChange
- sender()=None under safety routing
- Latency: ms established routes, seconds allocation/propagation
- 8 constraints that force design decisions in every consumer
-->

---
src: ./veilid-substrate.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: transport-trait

---

# The Transport Trait Boundary

One trait abstracts the substrate. No veilid-core types cross the boundary.

<!--
- Transport trait: no start method, construction is startup, shutdown + is_attached
- InboundEvent: sender_key is Option<String>, None under safety routing
- Visibility table: pub(crate) on broadcast/subscriptions
- transport_impl.rs is the sole type-system bridge
-->

---
src: ./transport-trait.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: crate-topology

---

# Crate Topology

Dependency graph, boundary contracts, and the facade crate.

<!--
- 6-crate dependency graph: veilid-core → transport-veilid → types ← kappa-transport-veilid → kappa-store
- Boundary contract per crate
- Facade crate: 25 lines, feature-gated re-export
- rekindle-transport-buff: zero runtime/transport/crypto deps, CI-enforced
-->

---
src: ./crate-topology.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: route-resolution

---

# Route Resolution

Cache-first resolution, DHT fallback, circuit breaker protection.

<!--
- Circuit breaker → cache → profile lookup → DHT read → import
- Cache-first: O(1) HashMap, serves 99%+ after initial contact
- DHT fallback: profile subkey 6, 8 attempts, 500ms→10s backoff
- Hot path vs cold path latency comparison
-->

---
src: ./route-resolution.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: transport-tiers

---

# Transport Tiers

Control, gossip, DHT, watch, bulk. Latency, durability, and ordering per tier.

<!--
- Control: app_call, reconciliation RPCs
- Gossip: app_message mesh broadcast, Lamport-ordered
- DHT: replicated record persistence, monotonic seq
- Watch: ValueChange reactive trigger
- Bulk: 16KB chunks, CreditGuard, ReorderRing, Merkle
- Composition table: which tier is primary/fallback per operation
-->

---
src: ./transport-tiers.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: delivery

---

# Delivery and Convergence

Durable writes survive offline peers. Ephemeral signals die with the moment.

<!--
- Durable: DHT write first, send failure silent, DeliveryReport error=None
- Ephemeral: no DHT, send failure reported, error=Some
- Full write path: tag_put → epoch_advance → DHT write → gossip → peer applies
- Connects back to transport tiers: Durable uses DHT+Gossip, Ephemeral uses Gossip only
-->

---
src: ./delivery-engine.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: gossip

---

# Gossip and Mesh

Adaptive fanout, deduplication, causal ordering, rate limiting.

<!--
- Full mesh ≤20, D=6 at 21-60, D=8 at 61+
- DedupCache: BLAKE3→u64, 8 bytes/entry
- LamportClock: causal order without NTP
- RateLimiter: 10/sec/sender
- Lifecycle: populate → refresh → evict
-->

---
src: ./gossip-mesh.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: reconciliation

---

# Reconciliation Protocol

Protocol bytes, pagination, MST diff, blob fetch, responder dispatch.

<!--
- Protocol bytes 0x00-0x08, postcard encoding, over Veilid app_call
- Pagination: 500 tags/page, cursor-based, 100 page max
- MST diff: 0x03/0x04 snapshot exchange → selective 0x05 pull, O(delta)
- Blob fetch: 0x07/0x08 inline ≤31KB, bulk lane >31KB
- Responder dispatch: exhaustive match on protocol byte
-->

---
src: ./reconciliation-protocol.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: data-paths

---

# Data Paths

Convergence: all replicas reach the same state. The bound is how long that takes.

<!--
- Guarantee matrix: 8 conditions × gossip/DHT/reconcile/convergence
- Both-online bidirectional: writer and reader vertical flows
- Offline conditions: writer-on/reader-off, reverse, both-off-then-on
- Watch-driven: DHT ValueChange → trigger channel → immediate reconcile
-->

---
src: ./data-paths.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: store

---

# The Store Substrate

Persistence for blobs, tags, epochs, and namespaces. Application data mapping. DHT publication.

<!--
- kappa-store traits: NamespaceStore, TagStore, EpochStore, BlobStore
- Application mapping: messages, identity, communities, MEK vaults, OCI layers
- DHT record persistence: get_or_create_dht_record pattern
- _veilid/dht_record_key and _veilid/dht_writer_bytes metadata keys
-->

---
src: ./store-substrate.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: identity

---

# Identity Substrate

Identity from signing keys. Attestations, trust, rotation, delegation, unlinkable projection.

<!--
- AnchorKappa derivation: SHA-256 of algorithm-prefixed key bytes
- 12 attestation types, all dCBOR in BlobStore, linked via EdgeStore
- Trust state machine: 4 states, 8 events, latch set by verification
- Succession chain: dual-signed links, monotone epochs, max depth 64
- Delegation chain: capability intersection, depth decrement, max depth 4
- Scoped projection: per-scope unlinkable derivation, bidirectional proof
-->

---
src: ./identity-substrate.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: protocol-modules

---

# Protocol Module Composition

OCI, Git, Nix, AT Protocol, and messaging each compose the same storage and identity primitives.

<!--
- 12 substrate primitives with CRUD operations
- 7 protocol modules, each composing a subset of primitives
- Application mapping: how Rekindle, AT Protocol, Nix, Git map to primitives
- Registry never imports protocol modules; protocol modules import the registry
-->

---
src: ./protocol-modules.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: lifecycle

---

# Node Lifecycle and Concurrency

Construction sequence, shutdown ordering, concurrency bounds, failure isolation.

<!--
- start_veilid: 7-step construction, KappaNode wraps TransportNode
- Shutdown: 5 steps in dependency order, reconcile drains before dispatch stops
- Concurrency: 10 components, each with bound/failure/recovery
- JoinSet max 8 peers, mpsc capacity 64 triggers, sequential per namespace
-->

---
src: ./node-lifecycle.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: construction

---

# Construction Order

Acyclic dependency graph. Two construction sequences. No cycles.

<!--
- TransportNode 9-step sequence, internal, pub(crate)
- KappaNode wraps TransportNode, spawns tasks, returns VeilidHandle
- dispatch_loop depends on everything, spawned last
-->

---
src: ./construction-order.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: primitives

---

# Lock-Free Primitives

Reorder buffers, slab pools, credit guards, dispatch queues. Shared by IPC and Veilid transports.

<!--
- ReorderRing, SlabPool, CreditGuard, DispatchQueue, Resequencer
- Three trait seams: ReturnGate, SlotLifecycle, WakeSink
- Zero deps enforced by cargo tree in CI
- ReorderRing memory ordering: MP-fill / SC-drain, CachePadded slots
- Verification: 5 loom modules, 3 proptest, counting-allocator, compile_fail
-->

---
src: ./buff-primitives.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: bulk-transfer

---

# Bulk Transfer

Chunked file delivery with credit-based flow control and Merkle integrity verification.

<!--
- 16KB chunks, 8 inflight credits, 4GB default ceiling negotiated via Offer/Accept
- Pipeline: CreditGuard → app_message → ReorderRing → Merkle verify
- Reconciliation context: inline ≤31KB via 0x07/0x08, bulk >31KB via send_file
- Connects back to buff primitives: CreditGuard and ReorderRing from that section
-->

---
src: ./bulk-transfer.md
---

layout: section
color: slate
transition: aurora-zoom
routeAlias: ipc-wire

---

# IPC Wire Security

Frame layout, AEAD cipher selection, per-lane key derivation, epoch-tagged rotation.

<!--
- 32-byte envelope + 32-byte StreamHeader, static_assertions enforced
- EMAC verified before StreamHeader decryption
- AES-256-GCM mandatory FIPS, AEGIS-128L primary 14 GiB/s, AEGIS-128X2 VAES
- Direction IDs D2L/L2D prevent nonce reuse across directions
- 9 HKDF-SHA256 keys from Noise IK, per-lane isolation
-->

---
src: ./wire-format.md
---

src: ./key-rotation.md

---
layout: section
color: slate
transition: aurora-zoom
routeAlias: integration
---

# Application Integration

IPC trait dispatch and Veilid channel dispatch. Inbound event routing for both applications.

<!--
- IPC: FrameRouter trait, 10 methods, transport calls the trait
- Veilid: InboundEvent match, application owns the loop
- Both: exhaustive typed dispatch, no string matching, unknown → error
- CodeComparison side-by-side of trait impl vs match block
-->

---
src: ./frame-router.md
---

src: ./cross-crate-flow.md

---
layout: statement
color: slate
---

<div class="closer">
  <div class="closer-left">
    <span>Centralized</span>
    <hr class="closer-sep" />
    <span>Opaque</span>
    <hr class="closer-sep" />
    <span>Fragile</span>
  </div>
  <div class="closer-right">
    <span>Peer-to-peer</span>
    <hr class="closer-sep" />
    <span>Auditable</span>
    <hr class="closer-sep" />
    <span>Resilient</span>
  </div>
</div>

<style>
.closer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: var(--aurora-space-12);
}

.closer-left, .closer-right {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-12);
}

.closer-left span {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  color: oklch(100% 0 0 / 0.15);
  text-decoration: line-through;
  text-decoration-thickness: 3px;
  line-height: 1.1;
}

.closer-sep {
  border: none;
  border-top: 1px solid oklch(100% 0 0 / 0.08);
  width: 100%;
  margin: 0;
}

.closer-right span {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading, white);
  line-height: 1.1;
}
</style>

<!--
Ghost column vs solid column.
-->

---
src: ../../shared/fragments/thanks.md
---
