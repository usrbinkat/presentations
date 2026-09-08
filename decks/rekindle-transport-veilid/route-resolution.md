---
layout: default
color: cream
class: dense reveal-build
---

# Route resolution pipeline

<div class="rr-pipeline">
  <div class="rr-step">
    <div class="rr-badge rr-red">1</div>
    <div class="rr-name">Circuit breaker check</div>
    <div class="rr-fail">→ CircuitOpen</div>
  </div>

  <div v-click class="rr-step">
    <div class="rr-badge rr-orange">2</div>
    <div class="rr-name">PeerRegistry cache hit</div>
    <div class="rr-ok">→ Found(PeerTarget)</div>
  </div>

  <div v-click class="rr-step">
    <div class="rr-badge rr-yellow">3</div>
    <div class="rr-name"><code>peer_to_profile</code> lookup</div>
    <div class="rr-fail">→ UnknownPeer</div>
  </div>

  <div v-click class="rr-step">
    <div class="rr-badge rr-mint">4</div>
    <div class="rr-name">DHT read profile subkey 6</div>
    <div class="rr-fail">→ NoRoute</div>
  </div>

  <div v-click class="rr-step">
    <div class="rr-badge rr-lavender">5</div>
    <div class="rr-name"><code>cache_route</code> + <code>import_route</code></div>
    <div class="rr-ok">→ Found(PeerTarget)</div>
  </div>
</div>

<style>
.rr-pipeline {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
}

.rr-step {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: var(--aurora-space-3);
  align-items: center;
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 60%, transparent);
}

.rr-badge {
  width: 1.8rem;
  height: 1.8rem;
  border-radius: var(--aurora-radius-full);
  display: grid;
  place-items: center;
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: white;
}

.rr-red     { background: #cc5a3a; }
.rr-orange  { background: #d98032; }
.rr-yellow  { background: #e2a832; }
.rr-mint    { background: oklch(60% 0.16 160); }
.rr-lavender { background: oklch(60% 0.16 300); }

.rr-name {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.rr-name code {
  font-family: var(--aurora-font-mono);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
  color: var(--scheme-heading);
}

.rr-ok {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--aurora-mint-400);
  white-space: nowrap;
}

.rr-fail {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--aurora-peach-400);
  white-space: nowrap;
}
</style>

<!--
- Step 1: threshold consecutive failures (default 5), CircuitOpen without I/O
- Step 2: O(1) HashMap, serves 99%+ after initial contact, parking_lot RwLock read
- Step 3: maps peer public key to DHT profile record key, unknown if no mapping
- Step 4: 8 attempts, 500ms→10s exponential backoff, one DHT round-trip
- Step 5: install blob into Veilid routing table, cache in PeerRegistry with TTL
- ResolveResult enum: Found, UnknownPeer, NoRoute, CircuitOpen
-->

---
layout: default
color: slate
class: dense
---

# Cache-first, network-last

<div class="cache-grid">
  <div class="cache-header cache-hot">Hot path (cached)</div>
  <div class="cache-header cache-cold">Cold path (DHT)</div>

  <div class="cache-cell cache-hot">O(1) HashMap, sub-µs</div>
  <div class="cache-cell cache-cold">8 attempts, 500ms → 10s backoff</div>

  <div class="cache-cell cache-hot">PeerRegistry with TTL expiry</div>
  <div class="cache-cell cache-cold">DHT subkey 6 of peer's profile</div>

  <div class="cache-cell cache-hot">Invalidated on import failure</div>
  <div class="cache-cell cache-cold">Cached on success, back to hot path</div>
</div>

<div class="abs-b" style="font-size: var(--aurora-text-xs); color: var(--scheme-text-secondary); text-align: center;">
Hot path serves 99%+ of lookups. Cold path for first contact and route rotation.
</div>

<style>
.cache-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  margin-top: var(--aurora-space-4);
}

.cache-header {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  border-bottom: 3px solid;
}

.cache-header.cache-hot { color: var(--aurora-mint-300); border-color: var(--aurora-mint-400); }
.cache-header.cache-cold { color: var(--aurora-sky-300); border-color: var(--aurora-sky-400); }

.cache-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  text-align: center;
}

.cache-cell.cache-hot { background: color-mix(in oklch, var(--aurora-mint-400) 10%, transparent); }
.cache-cell.cache-cold { background: color-mix(in oklch, var(--aurora-sky-400) 10%, transparent); }
</style>

<!--
- Hot: parking_lot RwLock read guard, read-heavy no contention
- Cold: one DHT fanout read, profile subkey 6, exponential backoff
- Cold result cached on success, peer pays DHT cost once per TTL
- TTL expiry or import failure invalidates, next resolve goes cold
-->
