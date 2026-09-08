---
layout: default
color: cream
---

# Adaptive gossip fanout

<div class="gm-grid">
  <div class="gm-header gm-size">Community size</div>
  <div class="gm-header gm-fanout">Fanout degree</div>
  <div class="gm-header gm-rationale">Rationale</div>

  <div class="gm-num">0</div>
  <div class="gm-cell">0</div>
  <div class="gm-cell gm-dim">No peers to gossip to</div>

  <div v-click="1" class="gm-num">1 – 20</div>
  <div v-click="1" class="gm-cell gm-highlight">N (full mesh)</div>
  <div v-click="1" class="gm-cell">Low overhead. Every peer sees every message. Guaranteed delivery at small scale.</div>

  <div v-click="2" class="gm-num">21 – 60</div>
  <div v-click="2" class="gm-cell">D = 6</div>
  <div v-click="2" class="gm-cell">O(log N) propagation. Balances redundancy against bandwidth.</div>

  <div v-click="3" class="gm-num">61+</div>
  <div v-click="3" class="gm-cell">D = 8</div>
  <div v-click="3" class="gm-cell">Higher redundancy compensates for partition probability at scale.</div>
</div>

<style>
h1 { text-align: center; }

.gm-grid {
  display: grid;
  grid-template-columns: 8rem 10rem 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  align-items: center;
  margin-top: var(--aurora-space-6);
}

.gm-header {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.gm-num {
  font-size: var(--aurora-text-lg);
  font-weight: var(--aurora-font-bold);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-heading);
  font-variant-numeric: tabular-nums;
}

.gm-cell {
  font-size: var(--aurora-text-lg);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}

.gm-cell.gm-highlight {
  background: color-mix(in oklch, var(--aurora-mint-200) 50%, transparent);
  font-weight: var(--aurora-font-bold);
}

.gm-cell.gm-dim { opacity: 0.5; }
</style>

<!--
- Full mesh ≤20: every peer sends to every other peer, N×(N-1) total, 380 at N=20
- D=6 at 21-60: epidemic gossip O(log N) rounds, full coverage in 3 rounds at D=6
- D=8 at 61+: route staleness and churn correlate with size, D=8 adds redundancy
- Literature: Kermarrec et al, fanout D ≥ ln(N)+c for high probability propagation
- fanout_degree is a match on online_count, returns 0, N, 6, or 8
-->

---
layout: default
color: slate
---

# Dedup, clocks, and rate limiting

<div class="dedup-grid">
  <div class="dedup-header dedup-blake">DedupCache</div>
  <div class="dedup-header dedup-clock">LamportClock</div>
  <div class="dedup-header dedup-rate">RateLimiter</div>

  <div class="dedup-cell dedup-blake">BLAKE3 hash → u64 truncation</div>
  <div class="dedup-cell dedup-clock">Monotonic logical timestamp per community</div>
  <div class="dedup-cell dedup-rate">Per-sender sliding window</div>

  <div class="dedup-cell dedup-blake">8 bytes per entry in the seen-set</div>
  <div class="dedup-cell dedup-clock">Causal ordering without synchronized clocks</div>
  <div class="dedup-cell dedup-rate">10 messages/second per sender</div>

  <div class="dedup-cell dedup-blake">Prevents reprocessing of gossip messages already seen</div>
  <div class="dedup-cell dedup-clock">Resolves message ordering in the gossip mesh</div>
  <div class="dedup-cell dedup-rate">Prevents a single peer from flooding the mesh</div>
</div>

<style>
.dedup-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--aurora-space-3);
  margin-top: var(--aurora-space-6);
}

.dedup-header {
  font-size: var(--aurora-text-lg);
  font-weight: var(--aurora-font-bold);
  color: var(--_dedup-color);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  border-bottom: 3px solid var(--_dedup-color);
}

.dedup-cell {
  font-size: var(--aurora-text-base);
  color: var(--scheme-heading);
  text-align: center;
  padding: var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--_dedup-color) 10%, transparent);
  line-height: var(--aurora-leading-snug);
}

.dedup-blake  { --_dedup-color: var(--aurora-lavender-300); }
.dedup-clock  { --_dedup-color: var(--aurora-mint-300); }
.dedup-rate   { --_dedup-color: var(--aurora-sky-300); }
</style>

<!--
- DedupCache: BLAKE3 truncated to u64, 8 bytes per entry vs 32-byte full hash
- FIFO eviction at 10K entries, collision probability negligible at 64 bits
- LamportClock: increment on send, max(local, remote)+1 on receive
- Causal ordering without synchronized clocks across peers
- RateLimiter: sliding window per sender public key, default 10 msg/sec
- Prevents single compromised peer from flooding the entire mesh
-->

---
layout: default
color: cream
---

# Mesh lifecycle

<div class="ml-spine">
  <div class="ml-step ml-green">
    <span class="ml-phase">Populate</span>
    <span class="ml-detail">On community join: select D peers weighted by uptime + route freshness. Build initial fanout set.</span>
  </div>
  <div class="ml-arrow">↓</div>
  <div class="ml-step ml-yellow">
    <span class="ml-phase">Refresh</span>
    <span class="ml-detail">Periodic: re-evaluate peer health. Replace unresponsive peers. Re-balance fanout if community size crosses tier boundary.</span>
  </div>
  <div class="ml-arrow">↓</div>
  <div class="ml-step ml-red">
    <span class="ml-phase">Evict</span>
    <span class="ml-detail">On peer departure or circuit breaker trip: remove from mesh, select replacement, no message loss (gossip redundancy absorbs it).</span>
  </div>
</div>

<style>
.ml-spine {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-3);
  margin-top: var(--aurora-space-6);
}

.ml-step {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-4);
  padding: var(--aurora-space-3) var(--aurora-space-6);
  border-radius: var(--aurora-radius-md);
  width: 85%;
  border-inline-start: 4px solid var(--_ml-color);
  background: color-mix(in oklch, var(--_ml-color) 8%, transparent);
}

.ml-phase {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  min-width: 6rem;
}

.ml-detail {
  font-size: var(--aurora-text-base);
  color: var(--scheme-text-secondary);
  line-height: var(--aurora-leading-snug);
}

.ml-arrow {
  color: var(--scheme-text-secondary);
  opacity: 0.5;
}

.ml-green  { --_ml-color: var(--aurora-mint-400); }
.ml-yellow { --_ml-color: #e2a832; }
.ml-red    { --_ml-color: #cc5a3a; }
</style>

<!--
- Populate: select D peers weighted by uptime + route freshness from PeerRegistry
- Refresh: re-evaluate health, replace unresponsive, adjust D if tier boundary crossed
- Evict: circuit breaker tripped or stale_member_ttl exceeded
- Single eviction doesn't cause message loss: D-1 remaining peers still propagate
- populate_mesh, refresh_mesh, evict_stale_members in mesh_manager module
-->
