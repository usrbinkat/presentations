---
layout: default
color: cream
class: dense
---

# Application API surface

<div class="api-grid">
  <div class="api-header">Entry point</div>
  <div class="api-header">What it does</div>

  <div class="api-name"><code>api_startup(callback, config)</code></div>
  <div class="api-cell">Start a node. Callback receives <code>VeilidUpdate</code> events. Returns <code>VeilidAPI</code>.</div>

  <div class="api-name"><code>VeilidAPI.routing_context()</code></div>
  <div class="api-cell">Returns <code>RoutingContext</code> for messaging and DHT. Safety selection and sequencing configured here.</div>

  <div class="api-name"><code>VeilidAPI.new_private_route()</code></div>
  <div class="api-cell">Allocate route, test reachability, return <code>RouteBlob</code>. Blocks until test completes.</div>

  <div class="api-name"><code>VeilidAPI.app_call_reply(call_id, msg)</code></div>
  <div class="api-cell">Reply to an inbound <code>AppCall</code>. Must complete within RPC timeout.</div>
</div>

<style>
.api-grid {
  display: grid;
  grid-template-columns: 18rem 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  margin-top: var(--aurora-space-3);
  align-items: start;
}

.api-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.api-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) 0;
}

.api-name code { background: transparent !important; padding: 0 !important; }

.api-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 60%, transparent);
}

.api-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- These four are what application code calls directly
- attach(), import_remote_private_route(), shutdown() are transport-internal
- Transport wraps these during construction, covered in node lifecycle section
- routing_context() is where all messaging + DHT methods live (next slide)
-->

---
layout: default
color: cream
class: dense
---

# RoutingContext: messaging and DHT

<div class="rc-grid">
  <div class="rc-header">Method</div>
  <div class="rc-header">Direction</div>
  <div class="rc-header">Max size</div>
  <div class="rc-header">Returns</div>

  <div class="rc-name"><code>app_message(target, msg)</code></div>
  <div class="rc-cell">fire-and-forget send</div>
  <div class="rc-cell">32KB</div>
  <div class="rc-cell"><code>()</code></div>

  <div class="rc-name"><code>app_call(target, msg)</code></div>
  <div class="rc-cell">request/response</div>
  <div class="rc-cell">32KB each direction</div>
  <div class="rc-cell"><code>Vec&lt;u8&gt;</code></div>

  <div class="rc-name"><code>create_dht_record(schema)</code></div>
  <div class="rc-cell">local create</div>
  <div class="rc-cell">—</div>
  <div class="rc-cell"><code>DHTRecordDescriptor</code></div>

  <div class="rc-name"><code>get_dht_value(key, subkey, refresh)</code></div>
  <div class="rc-cell">local-first, network fallback</div>
  <div class="rc-cell">32KB per subkey</div>
  <div class="rc-cell"><code>Option&lt;ValueData&gt;</code></div>

  <div class="rc-name"><code>set_dht_value(key, subkey, data)</code></div>
  <div class="rc-cell">network fanout</div>
  <div class="rc-cell">32KB per subkey</div>
  <div class="rc-cell"><code>Option&lt;ValueData&gt;</code> on conflict</div>

  <div class="rc-name"><code>watch_dht_values(key, subkeys)</code></div>
  <div class="rc-cell">background reconciled</div>
  <div class="rc-cell">—</div>
  <div class="rc-cell"><code>bool</code></div>
</div>

<style>
.rc-grid {
  display: grid;
  grid-template-columns: 16rem 10rem 8rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.rc-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.rc-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) 0;
}

.rc-name code { background: transparent !important; padding: 0 !important; }

.rc-cell {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) var(--aurora-space-2);
}

.rc-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
}
</style>

<!--
- Two messaging primitives: app_message fire-forget, app_call req/resp
- 32KB max per direction on both
- DHT: local-first read, network fanout on write
- set_dht_value returns Some on conflict: network has newer data
- watch_dht_values records desire, returns immediately, background reconciled
-->

---
layout: default
color: slate
class: dense
---

# VeilidUpdate dispatch events

<div class="vu-grid">
  <div class="vu-header">Variant</div>
  <div class="vu-header">When</div>
  <div class="vu-header">Key fields</div>

  <div class="vu-name">AppMessage</div>
  <div class="vu-cell">Inbound fire-and-forget</div>
  <div class="vu-cell"><code>sender?</code>, <code>route_id?</code>, <code>message</code></div>

  <div class="vu-name">AppCall</div>
  <div class="vu-cell">Inbound request, needs reply</div>
  <div class="vu-cell"><code>sender?</code>, <code>route_id?</code>, <code>message</code>, <code>call_id</code></div>

  <div class="vu-name">ValueChange</div>
  <div class="vu-cell">Watched DHT record changed</div>
  <div class="vu-cell"><code>key</code>, <code>subkeys</code>, <code>count</code>, <code>value?</code></div>

  <div class="vu-name">RouteChange</div>
  <div class="vu-cell">Route died or released</div>
  <div class="vu-cell"><code>dead_routes</code>, <code>dead_remote_routes</code></div>
</div>

<style>
.vu-grid {
  display: grid;
  grid-template-columns: 8rem 12rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-3);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.vu-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.vu-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) 0;
}

.vu-cell {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) var(--aurora-space-2);
}

.vu-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- These four are what the application dispatch loop matches on
- Attachment and Shutdown are transport-internal, handled by the node
- sender is None under safety routing, covered in constraints slide
- ValueChange drives reactive reconciliation in the data paths section
- RouteChange triggers route re-allocation via the refresh loop
-->

---
layout: default
color: cream
class: dense
---

# Latency thresholds and tier selection

<div class="lat-grid">
  <div class="lat-header">Threshold</div>
  <div class="lat-header">Transport tier</div>
  <div class="lat-header">Use case</div>
  <div class="lat-header">Durability</div>

  <div class="lat-cell lat-fast">&lt; 30ms</div>
  <div class="lat-cell"><code>app_message</code> on established route</div>
  <div class="lat-cell">Real-time voice, video, cursor sync</div>
  <div class="lat-cell">Ephemeral, dropped on failure</div>

  <div class="lat-cell lat-fast">&lt; 300ms</div>
  <div class="lat-cell"><code>app_call</code> on established route</div>
  <div class="lat-cell">Reconciliation RPCs, interactive req/resp</div>
  <div class="lat-cell">In-flight only, no persistence</div>

  <div class="lat-cell lat-med">Seconds</div>
  <div class="lat-cell">DHT write propagation, route allocation</div>
  <div class="lat-cell">Epoch root and route blob publication</div>
  <div class="lat-cell">Replicated across DHT nodes</div>

  <div class="lat-cell lat-slow">reconcile_interval</div>
  <div class="lat-cell">Reconciliation poll + tag pull</div>
  <div class="lat-cell">Convergence ceiling, gossip + watch fallback</div>
  <div class="lat-cell">Store write + DHT persistence</div>
</div>

<style>
.lat-grid {
  display: grid;
  grid-template-columns: 7rem 12rem 12rem 10rem;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.lat-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.lat-cell {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  line-height: var(--aurora-leading-snug);
}

.lat-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.lat-fast { background: color-mix(in oklch, var(--aurora-mint-400) 12%, transparent); }
.lat-med  { background: color-mix(in oklch, #e2a832 10%, transparent); }
.lat-slow { background: color-mix(in oklch, #cc5a3a 10%, transparent); }
</style>

<!--
- < 30ms: voice/video viable, app_message with LowLatency stability preference
- < 300ms: reconciliation RPCs on established routes
- deliver(Durable) sends gossip AND writes DHT concurrently, both paths fire
- reconcile_interval: convergence ceiling when gossip + watches both miss
- Local operations (sub-µs cache hit, sub-ms DHT local read) don't influence tier choice
-->

---
layout: default
color: slate
class: dense
---

# Messaging constraints

<div class="con-grid">
  <div class="con-header">Constraint</div>
  <div class="con-header">Implication</div>

  <div class="con-name">32KB message limit</div>
  <div class="con-cell">Bulk data must be chunked. Reconciliation responses must be paginated.</div>

  <div class="con-name"><code>sender() = None</code> under safety routing</div>
  <div class="con-cell">Embed sender identity in every payload. Gossip, DM, and transfer frames carry <code>sender_peer_key</code>.</div>

  <div class="con-name"><code>TryAgain</code> on route allocation</div>
  <div class="con-cell">Exponential backoff with deadline. 500ms → 15s intervals, 30-minute hard deadline.</div>

  <div class="con-name">No guaranteed message ordering</div>
  <div class="con-cell"><code>PreferOrdered</code> is best-effort. Applications use Lamport clocks + ReorderRing.</div>
</div>

<style>
.con-grid {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  margin-top: var(--aurora-space-3);
  align-items: start;
}

.con-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.con-name {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.con-name code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
}

.con-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 40%, transparent);
}

.con-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- 32KB limit: forces bulk transfer chunking and reconciliation pagination
- sender()=None: sender_peer_key embedded in every gossip, DM, transfer payload
- TryAgain: route allocation retries with backoff, 30min hard deadline
- Ordering: Lamport clocks for causal order, ReorderRing for sequence reassembly
-->

---
layout: default
color: cream
class: dense
---

# Storage and routing constraints

<div class="con-grid">
  <div class="con-header">Constraint</div>
  <div class="con-header">Implication</div>

  <div class="con-name">DHT records must be open</div>
  <div class="con-cell"><code>open_dht_record</code> before get/set/watch/inspect. Retry with backoff on KeyNotFound.</div>

  <div class="con-name"><code>set_dht_value</code> returns <code>Some</code> on conflict</div>
  <div class="con-cell">Network has newer data. Handle stale writes with set_and_verify backoff loop.</div>

  <div class="con-name">Watches are background-reconciled</div>
  <div class="con-cell"><code>watch_dht_values</code> records desire, returns immediately. Background task negotiates.</div>

  <div class="con-name">Routes die silently</div>
  <div class="con-cell"><code>RouteChange</code> notifies of dead routes. Consumer re-allocates. Periodic refresh loop.</div>
</div>

<style>
.con-grid {
  display: grid;
  grid-template-columns: 12rem 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  margin-top: var(--aurora-space-3);
  align-items: start;
}

.con-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.con-name {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.con-name code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
}

.con-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 40%, transparent);
}

.con-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- Records must be open: open_dht_record with retry backoff on KeyNotFound, 8 attempts
- set_dht_value conflict: network holds newer seq, set_and_verify loop with exponential backoff
- Watches: background task negotiates with remote node, ValueChange fires on success
- Route death: RouteChange event, periodic refresh loop re-allocates at configurable interval
-->
