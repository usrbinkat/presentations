# Veilid Transport — Speaker Outline

## Section map for recombination

| Arc                      | File                       | Audience            |
| ------------------------ | -------------------------- | ------------------- |
| Problem framing          | problem-framing.md         | Everyone            |
| Veilid substrate         | veilid-substrate.md        | Everyone            |
| Transport trait boundary | transport-trait.md         | Architects, Rust    |
| Crate topology           | crate-topology.md          | Architects, Rust    |
| Route resolution         | route-resolution.md        | P2P, network eng    |
| Transport tiers          | transport-tiers.md         | Protocol designers  |
| Delivery + convergence   | delivery-engine.md         | Protocol designers  |
| Gossip and mesh          | gossip-mesh.md             | Distributed systems |
| Reconciliation protocol  | reconciliation-protocol.md | Protocol designers  |
| Data paths               | data-paths.md              | Distributed systems |
| Store substrate          | store-substrate.md         | Application devs    |
| Identity substrate       | identity-substrate.md      | Identity, crypto    |
| Protocol modules         | protocol-modules.md        | Architects          |
| Node lifecycle           | node-lifecycle.md          | Operations, Rust    |
| Construction order       | construction-order.md      | Rust practitioners  |
| Lock-free primitives     | buff-primitives.md         | Lock-free, perf eng |
| Bulk transfer            | bulk-transfer.md           | Systems eng         |
| IPC wire format          | wire-format.md             | Crypto, security    |
| IPC key rotation         | key-rotation.md            | Crypto, security    |
| Application integration  | frame-router.md            | Application devs    |
| Cross-crate flow         | cross-crate-flow.md        | Everyone            |

## Recombination examples

30-min overview:
problem-framing + veilid-substrate (latency thresholds + constraints) +
crate-topology + transport-tiers + data-paths (guarantee matrix) +
cross-crate-flow + closer

45-min P2P practitioners:
problem-framing + veilid-substrate + route-resolution + delivery-engine +
gossip-mesh + reconciliation-protocol (wire format + pagination) +
data-paths + closer

45-min Rust systems:
crate-topology + transport-trait + construction-order + buff-primitives +
node-lifecycle + wire-format + closer

30-min security:
veilid-substrate (constraints) + wire-format + key-rotation +
transport-tiers (privacy column) + identity-substrate (trust FSM +
succession + tombstone) + closer

45-min application developers:
problem-framing + transport-trait + store-substrate + identity-substrate +
protocol-modules + reconciliation-protocol + frame-router +
cross-crate-flow + closer

60-min identity deep dive:
problem-framing + veilid-substrate + store-substrate + identity-substrate +
protocol-modules + cross-crate-flow + closer

90-min deep dive:
everything except wire-format + key-rotation

120-min full omnibus:
everything

## Theme machinery available for slide authoring

| Class                                                         | Effect                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------ |
| `dense`                                                       | Reduced padding, tighter title, smaller paragraph text |
| `reveal-build`                                                | v-click hides completely with slide-up entrance        |
| `compact-grid`                                                | Tight gap, xs font, 0.65rem code for grids             |
| `abs-b` / `abs-t` / `abs-br` / `abs-bl` / `abs-tr` / `abs-tl` | Absolute positioning within slide padding              |

Default v-click: fade to 40% opacity. Use `reveal-build` for vertical flow chains.

## Per-slide frontmatter options

| Option                   | Use                                          |
| ------------------------ | -------------------------------------------- |
| `routeAlias: name`       | Direct-linkable URL, used in TOC slide Links |
| `hideInToc: true`        | Exclude from Toc component                   |
| `clickAnimation: 'fade'` | Per-slide click animation override           |
| `class: dense`           | Apply dense spacing                          |
| `class: reveal-build`    | Apply build-up v-click behavior              |

## Excalidraw diagrams to be created

- crate-dependency-graph: 6-crate DAG with veilid-core at bottom, two application paths
- cross-crate-data-flow: full path from both applications through Transport trait to P2P
- route-resolution-pipeline: 5-step waterfall with circuit breaker
- gossip-mesh-fanout: 3-tier adaptive topology
- bulk-transfer-pipeline: chunked flow with CreditGuard + ReorderRing + Merkle
- construction-order: dual sequence (TransportNode + KappaNode)
- reorder-ring-anatomy: slot layout, cache-line padding, MP-fill/SC-drain
- delivery-tiers: durable vs ephemeral decision paths
- identity-lifecycle: origination → live → succession → tombstone with RotationEpoch
- session-anchor-derivation: lexicographic ordering + BLAKE3 derive_key

## Lint

`make lint` runs `scripts/lint-overflow.sh` via terminal-browser.
Checks: content overflow at all v-click states, title wrapping, minimum font size.
Exit 1 on any failure.
