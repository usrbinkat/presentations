---
layout: default
color: cream
class: dense reveal-build
---

# Construction: infrastructure

<div class="sl-flow">
  <div class="sl-step sl-s1">
    <span class="sl-num">1</span>
    <code>KappaNode::start(config)</code> → <code>(node, inbound_rx)</code>
  </div>
  <div class="sl-arrow">↓</div>
  <div class="sl-step sl-s2">
    <span class="sl-num">2</span>
    <code>node.allocate_route()</code> → <code>(route_id, blob)</code>
  </div>
  <div class="sl-arrow">↓</div>
  <div class="sl-step sl-s3">
    <span class="sl-num">3</span>
    <code>get_or_create_dht_record(_system)</code> → publish route blob to DHT
  </div>
</div>

Step 1 constructs TransportNode internally: VeilidAPI, attach, PeerRegistry, RouteManager, SharedState, RouteResolver, BroadcastManager, DeliveryEngine, MeshManager, TransferRegistry, BulkSender, dispatch_loop.

<style>
p { font-size: var(--aurora-text-xs); color: var(--scheme-text-secondary); margin-top: var(--aurora-space-2); line-height: var(--aurora-leading-snug); }

.sl-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
}

.sl-step {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-3);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  width: 90%;
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  border-inline-start: 3px solid var(--_sl-color);
  background: color-mix(in oklch, var(--_sl-color) 8%, transparent);
}

.sl-num {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--_sl-color);
  min-width: 1.2rem;
}

.sl-step code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.sl-arrow { color: var(--scheme-text-secondary); opacity: 0.4; }

.sl-s1 { --_sl-color: var(--aurora-mint-400); }
.sl-s2 { --_sl-color: var(--aurora-sky-400); }
.sl-s3 { --_sl-color: var(--aurora-lavender-400); }
</style>

<!--
- Step 1 is the heaviest: TransportNode 9-step acyclic construction
- Step 2: allocate_route blocks with exponential backoff, 30min hard deadline
- Step 3: route blob persisted in DHT so peers discover via profile subkey 6
- Steps 1-3 must complete before task spawning on the next slide
-->

---
layout: default
color: slate
class: dense reveal-build
---

# Construction: task spawning

<div class="sl-flow">
  <div class="sl-step sl-s4">
    <span class="sl-num">4</span>
    <code>tokio::spawn(dispatch::run_dispatch(inbound_rx, store, trigger_tx))</code>
  </div>
  <div class="sl-arrow">↓</div>
  <div class="sl-step sl-s5">
    <span class="sl-num">5</span>
    <code>tokio::spawn(publish_and_watch_epochs)</code>
  </div>
  <div class="sl-arrow">↓</div>
  <div class="sl-step sl-s6">
    <span class="sl-num">6</span>
    <code>ReconcileLoop::new(...).spawn(peer_source, shutdown_rx, trigger_rx)</code>
  </div>
  <div class="sl-arrow">↓</div>
  <div class="sl-step sl-s7">
    <span class="sl-num">7</span>
    Return <code>VeilidHandle</code> with shutdown_tx and all JoinHandles
  </div>
</div>

<style>
.sl-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-2);
  margin-top: var(--aurora-space-4);
}

.sl-step {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-3);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  width: 90%;
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  border-inline-start: 3px solid var(--_sl-color);
  background: color-mix(in oklch, var(--_sl-color) 8%, transparent);
}

.sl-num {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--_sl-color);
  min-width: 1.2rem;
}

.sl-step code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.sl-arrow { color: var(--scheme-text-secondary); opacity: 0.4; }

.sl-s4 { --_sl-color: #e2a832; }
.sl-s5 { --_sl-color: #d98032; }
.sl-s6 { --_sl-color: #cc5a3a; }
.sl-s7 { --_sl-color: var(--aurora-mint-400); }
</style>

<!--
- Step 4: dispatch loop is the sole inbound event consumer
- Step 5: per-namespace epoch root DHT publication + watch setup
- Step 6: ReconcileLoop select! on trigger_rx (immediate), tick (periodic), shutdown_rx
- Step 7: VeilidHandle owns shutdown control over all spawned tasks
-->

---
layout: default
color: cream
class: dense reveal-build
---

# Shutdown sequence

<div class="sd-flow">
  <div class="sd-step sd-s1"><span class="sd-num">1</span> <code>reconcile_shutdown_tx.send(())</code></div>
  <div class="sd-arrow">↓</div>
  <div class="sd-step sd-s2"><span class="sd-num">2</span> <code>await reconcile_handle</code></div>
  <div class="sd-arrow">↓</div>
  <div class="sd-step sd-s3"><span class="sd-num">3</span> <code>epoch_publish_handle.abort()</code></div>
  <div class="sd-arrow">↓</div>
  <div class="sd-step sd-s4"><span class="sd-num">4</span> <code>dispatch_handle.abort()</code></div>
  <div class="sd-arrow">↓</div>
  <div class="sd-step sd-s5"><span class="sd-num">5</span> <code>kappa_node.shutdown()</code></div>
</div>

<div class="abs-b" style="font-size: var(--aurora-text-xs); color: var(--scheme-text-secondary);">
Reconciliation drains before dispatch stops. Dispatch stops before Veilid detaches. Reversing order causes in-flight RPCs to fail with NotAttached.
</div>

<style>
.sd-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-2);
  margin-top: var(--aurora-space-4);
}

.sd-step {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-3);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  width: 75%;
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  border-inline-start: 3px solid var(--_sd-color);
  background: color-mix(in oklch, var(--_sd-color) 8%, transparent);
}

.sd-num {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--_sd-color);
  min-width: 1.2rem;
}

.sd-step code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.sd-arrow { color: var(--scheme-text-secondary); opacity: 0.4; }

.sd-s1 { --_sd-color: var(--aurora-mint-400); }
.sd-s2 { --_sd-color: var(--aurora-sky-400); }
.sd-s3 { --_sd-color: var(--aurora-lavender-400); }
.sd-s4 { --_sd-color: #e2a832; }
.sd-s5 { --_sd-color: #cc5a3a; }
</style>

<!--
- Step 1: stops reconcile loop from accepting new ticks or triggers
- Step 2: drains in-flight JoinSet tasks, waits for completion or timeout
- Step 3: stops periodic epoch root DHT publication and watch renewal
- Step 4: stops inbound event dispatch, no new AppCall responses
- Step 5: VeilidAPI::detach() + release_private_route()
-->

---
layout: default
color: slate
class: dense
---

# Concurrency: transport operations

<div class="cm-grid">
  <div class="cm-header">Component</div>
  <div class="cm-header">Bound</div>
  <div class="cm-header">Failure</div>
  <div class="cm-header">Recovery</div>

  <div class="cm-name">Reconcile per peer</div>
  <div class="cm-cell">JoinSet max 8</div>
  <div class="cm-cell">Panic: logged, peers_failed</div>
  <div class="cm-cell">Next round retries</div>

  <div class="cm-name">Per namespace</div>
  <div class="cm-cell">Sequential in peer task</div>
  <div class="cm-cell">Timeout: skip, continue</div>
  <div class="cm-cell">Next namespace</div>

  <div class="cm-name">Pagination</div>
  <div class="cm-cell">Sequential, max 100 pages</div>
  <div class="cm-cell">Timeout: break loop</div>
  <div class="cm-cell">Partial, next round</div>

  <div class="cm-name">Blob fetch</div>
  <div class="cm-cell">Sequential after tags</div>
  <div class="cm-cell">Inline fail: deferred</div>
  <div class="cm-cell">blob_exists next round</div>

  <div class="cm-name">Gossip broadcast</div>
  <div class="cm-cell">Parallel per peer</div>
  <div class="cm-cell">Per-peer counted</div>
  <div class="cm-cell">BroadcastReport</div>
</div>

<style>
.cm-grid {
  display: grid;
  grid-template-columns: 8rem 9rem 10rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: start;
}

.cm-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-1);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.cm-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) 0;
}

.cm-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 30%, transparent);
}
</style>

<!--
- JoinSet max 8: widest concurrent operation, bounded by config
- Per namespace sequential: one slow namespace doesn't block others
- Pagination max 100 pages: prevents unbounded pull from large namespaces
- Blob fetch sequential: inline fail adds to deferred, bulk lane is async
- Gossip parallel: per-peer failure counted in BroadcastReport
-->

---
layout: default
color: cream
class: dense
---

# Concurrency: infrastructure

<div class="cm-grid">
  <div class="cm-header">Component</div>
  <div class="cm-header">Bound</div>
  <div class="cm-header">Failure</div>
  <div class="cm-header">Recovery</div>

  <div class="cm-name">Inbound dispatch</div>
  <div class="cm-cell">Single task, sequential</div>
  <div class="cm-cell">reply_tx.send fails: logged</div>
  <div class="cm-cell">Next event</div>

  <div class="cm-name">Watch trigger</div>
  <div class="cm-cell">mpsc capacity 64</div>
  <div class="cm-cell">Channel full: dropped</div>
  <div class="cm-cell">Periodic tick catches up</div>

  <div class="cm-name">Epoch publication</div>
  <div class="cm-cell">Single task, periodic</div>
  <div class="cm-cell">DHT write fail: logged</div>
  <div class="cm-cell">Next namespace</div>

  <div class="cm-name">DHT write fanout</div>
  <div class="cm-cell">Veilid internal, width=10</div>
  <div class="cm-cell">TryAgain: queued</div>
  <div class="cm-cell">offline_subkey_writes</div>

  <div class="cm-name">Store writes</div>
  <div class="cm-cell">spawn_blocking</div>
  <div class="cm-cell">StoreError returned</div>
  <div class="cm-cell">Caller decides</div>
</div>

<style>
.cm-grid {
  display: grid;
  grid-template-columns: 8rem 9rem 10rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: start;
}

.cm-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-1);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.cm-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) 0;
}

.cm-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 30%, transparent);
}
</style>

<!--
- No component failure stalls another component
- Watch trigger capacity 64: dropped triggers caught by periodic tick
- Store writes via spawn_blocking: StoreError returned to caller
- DHT write fanout: Veilid internal, TryAgain queued for offline_subkey_writes
- Dispatch is single task: sequential processing, no concurrent event handling
-->
