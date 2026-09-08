---
layout: default
color: cream
class: dense
---

# Convergence guarantee matrix

<div class="gm-grid">
  <div class="gm-header">Condition</div>
  <div class="gm-header">Gossip</div>
  <div class="gm-header">DHT write</div>
  <div class="gm-header">Reconcile</div>
  <div class="gm-header">Convergence bound</div>

  <div class="gm-name">Both online</div>
  <div class="gm-cell gm-ok">delivered</div>
  <div class="gm-cell gm-ok">persisted</div>
  <div class="gm-cell">confirms</div>
  <div class="gm-cell gm-ok">one gossip round</div>

  <div class="gm-name">Writer online, reader offline</div>
  <div class="gm-cell gm-warn">dropped</div>
  <div class="gm-cell gm-ok">persisted</div>
  <div class="gm-cell">on attach</div>
  <div class="gm-cell">≤ reconcile_interval after attach</div>

  <div class="gm-name">Writer offline, reader online</div>
  <div class="gm-cell gm-dim">n/a</div>
  <div class="gm-cell gm-ok">persisted</div>
  <div class="gm-cell">reader polls, skips writer</div>
  <div class="gm-cell">when writer attaches</div>

  <div class="gm-name">Both offline then online</div>
  <div class="gm-cell gm-dim">n/a</div>
  <div class="gm-cell gm-warn">local only</div>
  <div class="gm-cell">mutual pull on attach</div>
  <div class="gm-cell">≤ reconcile_interval after both attach</div>

  <div class="gm-name">Intermittent connectivity</div>
  <div class="gm-cell gm-warn">partial</div>
  <div class="gm-cell gm-ok">persisted</div>
  <div class="gm-cell">fills gaps</div>
  <div class="gm-cell">≤ reconcile_interval</div>

  <div class="gm-name">Watch-driven</div>
  <div class="gm-cell gm-dim">n/a</div>
  <div class="gm-cell gm-ok">persisted</div>
  <div class="gm-cell">immediate trigger</div>
  <div class="gm-cell">ms after DHT write propagation</div>

  <div class="gm-name">N-node, full mesh (≤20)</div>
  <div class="gm-cell gm-ok">all peers</div>
  <div class="gm-cell gm-ok">persisted</div>
  <div class="gm-cell">confirms</div>
  <div class="gm-cell">immediate</div>

  <div class="gm-name">N-node, partial fanout (>20)</div>
  <div class="gm-cell gm-warn">D=6 or D=8 subset</div>
  <div class="gm-cell gm-ok">persisted</div>
  <div class="gm-cell">fills gaps for non-fanout peers</div>
  <div class="gm-cell">≤ reconcile_interval</div>
</div>

<style>
.gm-grid {
  display: grid;
  grid-template-columns: 12rem 5rem 5rem 10rem 12rem;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.gm-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.gm-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.gm-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 30%, transparent);
}

.gm-ok   { background: color-mix(in oklch, var(--aurora-mint-400) 12%, transparent) !important; }
.gm-warn { background: color-mix(in oklch, #e2a832 10%, transparent) !important; }
.gm-dim  { opacity: 0.4; }
</style>

<!--
- Gossip: latency optimization, drops on failure
- DHT: durability guarantee, replicated across network nodes
- Reconcile: convergence guarantee, fills gaps gossip missed
- Three mechanisms compose: no single tier covers all conditions alone
-->

---
layout: two-cols-title
color: slate
columns: 1fr 1fr
leftColor: sky
rightColor: mint
---

# Both online: write and read paths

::left::

### Writer

1. `store.tag_put(ns, name, Set{kappa}, clock.now())`
2. `store.epoch_advance(ns, root, count, now)`
3. `transport.write_record(epoch_record, 0, bytes)`
   <br><span style="font-size: var(--aurora-text-xs); opacity: 0.7">→ VeilidTransport → dht_writes::set → set_dht_value fanout</span>
4. `transport.deliver_community(id, gossip, Durable)`
   <br><span style="font-size: var(--aurora-text-xs); opacity: 0.7">→ DeliveryEngine → BroadcastManager → mesh peers</span>

::right::

### Reader

1. Receive `InboundEvent::Message { data }`
2. Decode gossip payload, extract tag entries
3. `store.tag_put(ns, name, Set{kappa}, clock.now())`
4. `store.epoch_advance(ns, root, count, now)`

If gossip is not received, reader discovers the change on next reconcile tick via epoch root comparison against the DHT record writer published in step 3.

<!--
- Writer step 3: DHT write is the durable fallback
- If gossip fails, reader discovers change via reconciliation against that DHT record
- Reader's epoch_advance seals its own state after applying received tags
- Both sides advance epoch independently, convergence via tag_put idempotency
-->

---
layout: default
color: cream
---

# Offline and reconnect conditions

<div class="off-grid">
  <div class="off-header">Condition</div>
  <div class="off-header">Writer behavior</div>
  <div class="off-header">Reader behavior</div>
  <div class="off-header">Convergence mechanism</div>

  <div class="off-name">Writer online, reader offline</div>
  <div class="off-cell">Publishes epoch to DHT. <code>deliver(Durable)</code> returns <code>sent=false, error=None</code>.</div>
  <div class="off-cell off-dim">Offline. Receives nothing.</div>
  <div class="off-cell">Reader's first reconcile tick after attach reads writer's epoch from DHT, pulls divergent tags.</div>

  <div class="off-name">Writer offline, reader online</div>
  <div class="off-cell off-dim">Offline. Writes to local store only.</div>
  <div class="off-cell">Reconcile tick: <code>fetch_epoch_root</code> returns Timeout. <code>PeerPhase::Failed</code>. Circuit breaker trips after threshold consecutive failures.</div>
  <div class="off-cell">When writer attaches: publishes epoch to DHT, route refresh publishes new route blob. Reader re-resolves via DHT profile.</div>

  <div class="off-name">Both offline then online</div>
  <div class="off-cell">Writes locally. Publishes epoch to DHT on attach.</div>
  <div class="off-cell">Writes locally. Publishes epoch to DHT on attach.</div>
  <div class="off-cell">Mutual reconciliation. <code>tag_put(Set)</code> is idempotent: set union convergence. <code>tag_put(CompareAndSwap)</code> rejects on version mismatch.</div>
</div>

<style>
.off-grid {
  display: grid;
  grid-template-columns: 9rem 1fr 1fr 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  align-items: start;
}

.off-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.off-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.off-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 30%, transparent);
}

.off-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.off-dim { opacity: 0.5; }
</style>

<!--
- DHT persistence bridges all offline conditions
- Online peer's writes are readable by any peer that later attaches
- Circuit breaker: threshold consecutive failures → skip peer, stop hammering
- tag_put(Set) idempotent: set union convergence without coordination
- tag_put(CompareAndSwap) rejects on version mismatch: application chooses which
-->

---
layout: default
color: slate
class: dense
---

# Watch-driven reconciliation

<div class="wd-flow">
  <div class="wd-step wd-writer">
    Writer: <code>store.epoch_advance(ns)</code> → <code>transport.write_record(epoch_record, subkey_0, bytes)</code>
  </div>
  <div class="wd-arrow">↓ Veilid DHT propagation</div>
  <div class="wd-step wd-veilid">
    Veilid fires <code>VeilidUpdate::ValueChange { key, subkeys: [0], count }</code> to watching nodes
  </div>
  <div class="wd-arrow">↓ dispatch_loop converts to InboundEvent</div>
  <div class="wd-step wd-dispatch">
    Reader dispatch: receives <code>InboundEvent::RecordChange { key }</code>
    <div class="wd-detail">Sends <code>record_key</code> on <code>reconcile_trigger_tx</code> (mpsc, capacity 64)</div>
  </div>
  <div class="wd-arrow">↓ channel receive in ReconcileLoop</div>
  <div class="wd-step wd-reconcile">
    <code>ReconcileLoop</code>: <code>tokio::select!</code> matches trigger channel before tick interval
    <div class="wd-detail">Runs immediate reconciliation round. Resets periodic interval timer.</div>
  </div>
  <div class="wd-arrow">↓</div>
  <div class="wd-step wd-result">
    Epoch root comparison → tag pull → apply_tags → blob fetch → convergence
  </div>
</div>

<div class="wd-compare">
  <div class="wd-compare-item">
    <span class="wd-compare-label">Watch-driven latency</span>
    <span class="wd-compare-val wd-fast">ms after DHT write completes</span>
  </div>
  <div class="wd-compare-item">
    <span class="wd-compare-label">Polling-only latency</span>
    <span class="wd-compare-val wd-slow">up to reconcile_interval (default 30s)</span>
  </div>
</div>

<style>
.wd-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  margin-top: var(--aurora-space-3);
}

.wd-step {
  padding: var(--aurora-space-1) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  width: 90%;
  font-size: var(--aurora-text-xs);
  color: var(--scheme-heading);
  border-inline-start: 3px solid var(--_wd-color);
  background: color-mix(in oklch, var(--_wd-color) 8%, transparent);
}

.wd-step code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.wd-detail {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  margin-top: var(--aurora-space-1);
}

.wd-arrow {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  opacity: 0.6;
}

.wd-writer    { --_wd-color: var(--aurora-sky-400); }
.wd-veilid    { --_wd-color: #e2a832; }
.wd-dispatch  { --_wd-color: var(--aurora-lavender-400); }
.wd-reconcile { --_wd-color: var(--aurora-mint-400); }
.wd-result    { --_wd-color: var(--aurora-mint-400); }

.wd-compare {
  display: flex;
  gap: var(--aurora-space-6);
  justify-content: center;
  margin-top: var(--aurora-space-3);
}

.wd-compare-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
}

.wd-compare-label {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
}

.wd-compare-val {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  font-family: var(--aurora-font-mono);
  padding: var(--aurora-space-1) var(--aurora-space-3);
  border-radius: var(--aurora-radius-sm);
}

.wd-fast { color: var(--aurora-mint-300); background: color-mix(in oklch, var(--aurora-mint-400) 12%, transparent); }
.wd-slow { color: var(--aurora-peach-300); background: color-mix(in oklch, var(--aurora-peach-400) 10%, transparent); }
</style>

<!--
- mpsc trigger channel capacity 64
- Channel full: trigger dropped, periodic tick catches up at reconcile_interval
- tokio::select! in ReconcileLoop: trigger branch before tick branch
- Immediate reconcile resets the interval timer
- Latency: ms after DHT write propagation vs 30s default polling
-->
