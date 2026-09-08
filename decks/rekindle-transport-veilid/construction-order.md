---
layout: two-cols-title
color: cream
columns: 1fr 1fr
leftColor: sky
rightColor: mint
---

# Two construction sequences

::left::

### TransportNode (inside rekindle-transport-veilid)

1. `VeilidAPI` → attach
2. `PeerRegistry`, `RouteManager`, `SharedState`
3. `RouteResolver(PeerRegistry, VeilidAPI, Config)`
4. `BroadcastManager(VeilidAPI, Config)`
5. `DeliveryEngine(RouteResolver, BroadcastManager)`
6. `MeshManager(RouteResolver, BroadcastManager)`
7. `TransferRegistry`, `BulkSender`
8. `(inbound_tx, inbound_rx)` mpsc channel
9. `dispatch_loop` spawned with all deps

Each step depends only on steps above it. No `Arc<Self>` cycles. No `init()` + `set_callback()` patterns.

::right::

### KappaNode (wraps TransportNode)

1. `KappaNode::start(config)` → constructs TransportNode
2. `allocate_route()` → route blob
3. Publish route blob to DHT
4. `spawn dispatch` with `inbound_rx` + store
5. `spawn epoch_publication` loop
6. `spawn ReconcileLoop` with trigger + shutdown channels
7. Return `VeilidHandle`

Steps 2-6 are spawned tasks. Step 1 is the TransportNode 9-step sequence on the left. The VeilidHandle owns shutdown control over steps 2-6.

<!--
- Left: TransportNode 9-step sequence, internal, pub(crate)
- Right: KappaNode wraps TransportNode at step 1
- Steps 2-6 on the right are spawned tasks that depend on step 1 completing
- VeilidHandle returned at step 7 owns shutdown control over all spawned tasks
-->

---
layout: default
color: slate
---

# Acyclic dependency graph

<div class="dep-grid">
  <div class="dep-header">Component</div>
  <div class="dep-header">Depends on</div>
  <div class="dep-header">Depended on by</div>

  <div class="dep-name">VeilidAPI</div>
  <div class="dep-cell">—</div>
  <div class="dep-cell">RouteResolver, BroadcastManager, dispatch_loop</div>

  <div class="dep-name">PeerRegistry</div>
  <div class="dep-cell">—</div>
  <div class="dep-cell">RouteResolver, MeshManager</div>

  <div class="dep-name">RouteResolver</div>
  <div class="dep-cell">PeerRegistry, VeilidAPI, Config</div>
  <div class="dep-cell">DeliveryEngine, MeshManager</div>

  <div class="dep-name">BroadcastManager</div>
  <div class="dep-cell">VeilidAPI, Config</div>
  <div class="dep-cell">DeliveryEngine, MeshManager</div>

  <div class="dep-name">DeliveryEngine</div>
  <div class="dep-cell">RouteResolver, BroadcastManager</div>
  <div class="dep-cell">dispatch_loop</div>

  <div class="dep-name">MeshManager</div>
  <div class="dep-cell">RouteResolver, BroadcastManager, PeerRegistry</div>
  <div class="dep-cell">dispatch_loop</div>

  <div class="dep-name">dispatch_loop</div>
  <div class="dep-cell">all of the above + inbound_tx</div>
  <div class="dep-cell">—</div>
</div>

No cycles. `dispatch_loop` is the only component that depends on everything else. It is spawned last and receives all subsystems as owned references.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }

.dep-grid {
  display: grid;
  grid-template-columns: 10rem 1fr 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  align-items: start;
}

.dep-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.dep-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.dep-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}
</style>

<!--
- Verifiable from constructor signatures in source
- dispatch_loop depends on everything: routing hub for all inbound I/O
- No cycles: topological sort of the dependency column produces the construction order
- See rekindle-transport-veilid/src/broadcast/node.rs TransportNode::start()
-->
