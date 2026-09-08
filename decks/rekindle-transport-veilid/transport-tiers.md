---
layout: default
color: cream
---

# Five transport tiers

<div class="tt-grid">
  <div class="tt-header">Tier</div>
  <div class="tt-header">Mechanism</div>
  <div class="tt-header">Latency</div>
  <div class="tt-header">Durability</div>
  <div class="tt-header">Ordering</div>

  <div class="tt-name">Control</div>
  <div class="tt-cell"><code>app_call</code> request/response, 32KB max each direction</div>
  <div class="tt-cell tt-fast">tens to hundreds of ms</div>
  <div class="tt-cell">In-flight only</div>
  <div class="tt-cell">Per-call ordered</div>

  <div v-click="1" class="tt-name">Gossip</div>
  <div v-click="1" class="tt-cell"><code>app_message</code> mesh broadcast, adaptive fanout</div>
  <div v-click="1" class="tt-cell tt-fast">tens of ms per peer</div>
  <div v-click="1" class="tt-cell">None</div>
  <div v-click="1" class="tt-cell">Lamport clock causal</div>

  <div v-click="2" class="tt-name">DHT</div>
  <div v-click="2" class="tt-cell">Record CRUD, 32KB per subkey, 65K subkeys per record</div>
  <div v-click="2" class="tt-cell tt-med">seconds for propagation</div>
  <div v-click="2" class="tt-cell">Replicated across DHT nodes</div>
  <div v-click="2" class="tt-cell">Per-subkey monotonic seq</div>

  <div v-click="3" class="tt-name">Watch</div>
  <div v-click="3" class="tt-cell"><code>watch_record</code> + <code>ValueChange</code> event</div>
  <div v-click="3" class="tt-cell tt-fast">ms after DHT write</div>
  <div v-click="3" class="tt-cell">Background reconciled</div>
  <div v-click="3" class="tt-cell">Subkey granularity</div>

  <div v-click="4" class="tt-name">Bulk Data</div>
  <div v-click="4" class="tt-cell">16KB chunks, CreditGuard 8 inflight, 4GB default ceiling</div>
  <div v-click="4" class="tt-cell tt-slow">sustained throughput</div>
  <div v-click="4" class="tt-cell">Per-chunk BLAKE3 + Merkle root</div>
  <div v-click="4" class="tt-cell">ReorderRing in-order delivery</div>
</div>

<style>
.tt-grid {
  display: grid;
  grid-template-columns: 5rem 1fr 9rem 10rem 10rem;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-4);
  align-items: center;
}

.tt-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.tt-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.tt-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 30%, transparent);
}

.tt-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.tt-fast { background: color-mix(in oklch, var(--aurora-mint-400) 12%, transparent) !important; }
.tt-med  { background: color-mix(in oklch, #e2a832 10%, transparent) !important; }
.tt-slow { background: color-mix(in oklch, var(--aurora-sky-400) 10%, transparent) !important; }
</style>

<!--
- Control tier: reconciliation RPCs 0x00-0x08
- Gossip tier: latency optimization, not delivery guarantee
- DHT tier: durability guarantee, survives node restarts
- Watch tier: reactive trigger, ms after DHT write propagation
- Bulk tier: sustained throughput, CreditGuard + ReorderRing from buff crate
-->

---
layout: default
color: slate
---

# How the tiers compose for convergence

<div class="compose-grid">
  <div class="compose-header">Operation</div>
  <div class="compose-header">Primary tier</div>
  <div class="compose-header">Fallback tier</div>
  <div class="compose-header">Guarantee</div>

  <div class="compose-name">Tag change notification</div>
  <div class="compose-cell">Gossip mesh broadcast</div>
  <div class="compose-cell">Reconciliation poll via Control</div>
  <div class="compose-cell">Gossip fails silently, reconciliation catches up within interval</div>

  <div class="compose-name">Epoch root publication</div>
  <div class="compose-cell">DHT write to subkey 0</div>
  <div class="compose-cell">Watch notification to watching peers</div>
  <div class="compose-cell">DHT persists across node restarts, watch triggers immediate reconciliation</div>

  <div class="compose-name">Tag convergence</div>
  <div class="compose-cell">Control: paginated pull via 0x05/0x06</div>
  <div class="compose-cell">MST diff via 0x03/0x04 reduces to O(delta)</div>
  <div class="compose-cell">All tags converge within reconciliation round</div>

  <div class="compose-name">Blob replication</div>
  <div class="compose-cell">Control: inline fetch 0x07/0x08 under 31KB</div>
  <div class="compose-cell">Bulk Data: chunked transfer over 31KB</div>
  <div class="compose-cell">BLAKE3 per-chunk, Merkle root verification</div>

  <div class="compose-name">Typing indicator</div>
  <div class="compose-cell">Gossip: Ephemeral delivery</div>
  <div class="compose-cell">None</div>
  <div class="compose-cell">Dropped if peer unreachable. Stale data is meaningless.</div>
</div>

<style>
.compose-grid {
  display: grid;
  grid-template-columns: 10rem 10rem 11rem 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  align-items: start;
}

.compose-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.compose-name {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.compose-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}
</style>

<!--
- Tag notification: gossip primary, reconcile poll fallback
- Epoch root: DHT write primary, watch notification to peers
- Tag convergence: Control paginated pull, MST diff reduces to O(delta)
- Blob replication: Control inline ≤31KB, Bulk lane >31KB
- Typing indicator: Gossip Ephemeral, no fallback, dropped if unreachable
-->
