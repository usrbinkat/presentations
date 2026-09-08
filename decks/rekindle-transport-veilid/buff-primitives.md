---
layout: default
color: cream
---

# Five primitives, zero runtime deps

<div class="bp-grid">
  <div class="bp-header">Primitive</div>
  <div class="bp-header">Pattern</div>
  <div class="bp-header">Consumers</div>

  <div class="bp-name">ReorderRing</div>
  <div class="bp-cell">MP-fill / SC-drain sequence-keyed reorder buffer</div>
  <div class="bp-cell">IPC bulk recv, Veilid bulk_transfer inbound, audit chain reorder</div>

  <div v-click="1" class="bp-name">SlabPool</div>
  <div v-click="1" class="bp-cell">Closed-loop pool with return-gated reclaim</div>
  <div v-click="1" class="bp-cell">IPC mmap wire bufs (send), recv plaintext bufs, io_uring FixedBuf handles</div>

  <div v-click="2" class="bp-name">CreditGuard</div>
  <div v-click="2" class="bp-cell">Open-loop CAS admission counter</div>
  <div v-click="2" class="bp-cell">IPC GlobalMemoryGuard, Veilid bulk transfer flow control</div>

  <div v-click="3" class="bp-name">DispatchQueue</div>
  <div v-click="3" class="bp-cell">Bounded MPMC fan-out with WakeSink</div>
  <div v-click="3" class="bp-cell">IPC rayon crypto dispatch (send + recv), audit dispatch</div>

  <div v-click="4" class="bp-name">Resequencer</div>
  <div v-click="4" class="bp-cell">DispatchQueue → parallel workers → ReorderRing</div>
  <div v-click="4" class="bp-cell">IPC BulkSender nonce-assign-before-dispatch, audit reorder + dispatch</div>
</div>

<style>
h1 { text-align: center; }

.bp-grid {
  display: grid;
  grid-template-columns: 10rem 1fr 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  align-items: start;
  margin-top: var(--aurora-space-4);
}

.bp-header {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.bp-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.bp-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}
</style>

<!--
- Resequencer = DispatchQueue → parallel workers → ReorderRing, composed not independent
- CreditGuard: 8 credits Veilid bulk transfer, configurable ceiling IPC GlobalMemoryGuard
- SlabPool: IPC mmap send bufs + recv plaintext bufs + io_uring FixedBuf handles
- DispatchQueue: IPC rayon AEAD dispatch on both send and recv paths
- ReorderRing: Veilid bulk_transfer inbound reassembly + IPC bulk recv + audit chain
-->

---
layout: default
color: slate
---

# Three decisions the crate refuses to make

<div class="seam-grid">
  <div class="seam-header seam-trait">Trait</div>
  <div class="seam-header seam-question">Question</div>
  <div class="seam-header seam-ipc">IPC impl</div>
  <div class="seam-header seam-trivial">Trivial impl</div>

  <div class="seam-name">ReturnGate</div>
  <div class="seam-cell">When is a slab reclaimable?</div>
  <div class="seam-cell seam-ipc">io_uring two-CQE <code>IORING_CQE_F_NOTIF</code></div>
  <div class="seam-cell seam-trivial"><code>ImmediateReturn</code></div>

  <div class="seam-name">SlotLifecycle</div>
  <div class="seam-cell">How is a reused slot reset?</div>
  <div class="seam-cell seam-ipc">Recv: <code>zeroize(buf)</code>. Send: truncate len</div>
  <div class="seam-cell seam-trivial"><code>NoOpLifecycle</code></div>

  <div class="seam-name">WakeSink</div>
  <div class="seam-cell">How is the consumer woken?</div>
  <div class="seam-cell seam-ipc"><code>TokioWake</code>: <code>Arc&lt;Notify&gt;</code></div>
  <div class="seam-cell seam-trivial"><code>SpinWake</code></div>
</div>

<style>
.seam-grid {
  display: grid;
  grid-template-columns: 8rem 1fr 1fr 10rem;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  align-items: center;
  margin-top: var(--aurora-space-6);
}

.seam-header {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.seam-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.seam-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}

.seam-cell.seam-ipc {
  background: color-mix(in oklch, var(--aurora-lavender-400) 12%, transparent);
}

.seam-cell.seam-trivial {
  background: color-mix(in oklch, var(--aurora-mint-400) 12%, transparent);
}

.seam-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- ReturnGate: io_uring two-CQE IORING_CQE_F_NOTIF tells when kernel finished with send buffer
- Without ReturnGate seam, buff crate would need io_uring as a dependency
- SlotLifecycle zeroize: recv buffers held plaintext AEAD output, must zero before reuse
- WakeSink TokioWake: Arc<Notify> bridges buff's consumer wake to tokio runtime
- ImmediateReturn, NoOpLifecycle, SpinWake: trivial impls for tests and non-io_uring consumers
-->

---
layout: default
color: slate
---

# Zero deps — CI enforced

```bash
# CI runs this check — any forbidden crate fails the build
cargo tree -p rekindle-transport-buff --no-default-features

# Forbidden: tokio, io-uring, snow, aws-lc-rs, blake3,
# any rekindle wire type, any transport crate
```

The three trait seams (ReturnGate, SlotLifecycle, WakeSink) are the mechanism that makes this possible. IPC plugs io_uring and zeroize through the seams. The buff crate never imports them.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }

:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 1.2rem !important;
  line-height: 1.8 !important;
}
</style>

<!--
- cargo tree --no-default-features must show zero forbidden crates
- Forbidden list: tokio, io-uring, snow, aws-lc-rs, blake3, rekindle wire types
- CI enforcement: build fails if any forbidden crate appears in the tree
- Trait seams are the boundary: ReturnGate, SlotLifecycle, WakeSink
-->

---
layout: default
color: cream
---

# ReorderRing: MP-fill / SC-drain

<div class="ring-layout">
  <div class="ring-diagram">
    <div class="ring-slots">
      <div class="ring-slot ring-empty">E</div>
      <div class="ring-slot ring-empty">E</div>
      <div class="ring-slot ring-empty">E</div>
      <div class="ring-slot ring-empty">E</div>
      <div class="ring-slot ring-filled">F4</div>
      <div class="ring-slot ring-filled">F5</div>
      <div class="ring-slot ring-empty">E</div>
      <div class="ring-slot ring-filled">F7</div>
    </div>
    <div class="ring-pointer">▲ next_deliver</div>
    <div class="ring-meta">window = 8 (power of 2) · mask = 7 · next_deliver = 4</div>
  </div>

  <div class="ring-drain">
    <div class="ring-drain-title">drain_contiguous:</div>
    <div class="ring-drain-step">seq4 → deliver ✓</div>
    <div class="ring-drain-step">seq5 → deliver ✓</div>
    <div class="ring-drain-step ring-drain-stop">seq6 → EMPTY → stop</div>
  </div>
</div>

<div class="ring-ordering">

### Memory ordering protocol

<div class="ring-cols">
  <div class="ring-col">
    <div class="ring-col-header ring-producer">Producer</div>
    <div class="ring-col-step">1. Acquire load <code>window_base</code></div>
    <div class="ring-col-step">2. Acquire load <code>slot.state</code></div>
    <div class="ring-col-step">3. Write seq + item via UnsafeCell</div>
    <div class="ring-col-step ring-col-fence">4. Release store FILLED <span class="ring-col-note">(publish fence)</span></div>
  </div>
  <div class="ring-col">
    <div class="ring-col-header ring-consumer">Consumer</div>
    <div class="ring-col-step">1. Acquire load <code>slot.state</code></div>
    <div class="ring-col-step">2. Read seq + item, <code>ptr::read</code> moves ownership</div>
    <div class="ring-col-step">3. Release store <code>window_base</code></div>
    <div class="ring-col-step ring-col-fence">4. Release store EMPTY <span class="ring-col-note">(reclaim fence)</span></div>
  </div>
</div>
</div>

<style>
.ring-layout {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-6);
  margin-top: var(--aurora-space-3);
}

.ring-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-2);
}

.ring-slots {
  display: flex;
  gap: 2px;
}

.ring-slot {
  width: 3rem;
  height: 2.5rem;
  display: grid;
  place-items: center;
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  border-radius: var(--aurora-radius-sm);
}

.ring-empty {
  background: color-mix(in oklch, var(--aurora-cream-400) 60%, transparent);
  color: var(--scheme-text-secondary);
}

.ring-filled {
  background: color-mix(in oklch, var(--aurora-mint-200) 60%, transparent);
  color: var(--aurora-mint-500);
  border: 1px solid var(--aurora-mint-400);
}

.ring-pointer {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-accent);
  padding-inline-start: 12.5rem;
}

.ring-meta {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  font-family: var(--aurora-font-mono);
}

.ring-drain {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
}

.ring-drain-title {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.ring-drain-step {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  color: var(--aurora-mint-400);
  padding-inline-start: var(--aurora-space-3);
}

.ring-drain-stop {
  color: var(--aurora-peach-400);
}

.ring-ordering {
  margin-top: var(--aurora-space-3);
}

.ring-ordering h3 {
  font-size: var(--aurora-text-base) !important;
  border-bottom: none !important;
  padding-bottom: 0 !important;
}

.ring-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-4);
  margin-top: var(--aurora-space-2);
}

.ring-col {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
}

.ring-col-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  padding-bottom: var(--aurora-space-1);
  border-bottom: 2px solid;
}

.ring-col-header.ring-producer { color: var(--aurora-sky-400); border-color: var(--aurora-sky-400); }
.ring-col-header.ring-consumer { color: var(--aurora-mint-400); border-color: var(--aurora-mint-400); }

.ring-col-step {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  font-family: var(--aurora-font-mono);
}

.ring-col-step code {
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.ring-col-fence {
  background: color-mix(in oklch, var(--aurora-lavender-200) 30%, transparent);
  border-radius: var(--aurora-radius-sm);
}

.ring-col-note {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  font-style: italic;
}
</style>

<!--
- Producer Release FILLED pairs with consumer Acquire load slot.state
- Consumer Release EMPTY pairs with next producer Acquire load
- Derived from crossbeam ArrayQueue stamp + disruptor-rs Cursor
- Adapted for MP-fill / SC-drain: multiple producers, single contiguous consumer
- CachePadded per slot prevents false sharing between adjacent cores
- drain_contiguous: delivers seq 4, 5, stops at empty seq 6, resumes when filled
-->

---
layout: default
color: slate
---

# Verification strategy

<div class="ver-grid">
  <div class="ver-item">
    <div class="ver-title"><span class="ver-count">5</span> loom modules</div>
    <div class="ver-scope">one per primitive</div>
    <div class="ver-detail">Exhaustive state-space exploration of atomic orderings under all possible thread interleavings</div>
  </div>
  <div class="ver-item">
    <div class="ver-title"><span class="ver-count">3</span> proptest harnesses</div>
    <div class="ver-scope">fill, drain, reclaim</div>
    <div class="ver-detail">Arbitrary operation sequences, property: no lost items, no double-deliver</div>
  </div>
  <div class="ver-item">
    <div class="ver-title"><span class="ver-count">1</span> counting-allocator</div>
    <div class="ver-scope">zero steady-state alloc</div>
    <div class="ver-detail">Global alloc counter must not change after init during fill/drain cycles</div>
  </div>
  <div class="ver-item">
    <div class="ver-title"><span class="ver-count">1</span> compile_fail</div>
    <div class="ver-scope">SlabGuard is !Send</div>
    <div class="ver-detail">The type system prevents cross-thread slab escape; adding Send breaks the build</div>
  </div>
</div>

<style>
.ver-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: var(--aurora-space-4);
  margin-top: var(--aurora-space-4);
  flex: 1;
}

.ver-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: var(--aurora-space-4) var(--aurora-space-5);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
  border-inline-start: 3px solid var(--aurora-mint-400);
}

.ver-title {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-bold);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-heading);
}

.ver-count {
  color: var(--aurora-mint-300);
}

.ver-scope {
  font-size: var(--aurora-text-base);
  color: var(--scheme-accent);
  font-weight: var(--aurora-font-medium);
  margin-top: var(--aurora-space-2);
}

.ver-detail {
  font-size: var(--aurora-text-base);
  color: var(--scheme-text-secondary);
  line-height: var(--aurora-leading-relaxed);
  margin-top: auto;
}

.ver-detail code {
  font-family: var(--aurora-font-mono);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
  color: var(--scheme-heading);
}
</style>

<!--
- loom::model: exhaustive interleaving enumeration, not sampling
- 5 modules: one per primitive, small window sizes for tractable state space
- counting-allocator: global alloc counter must not change after init during fill/drain
- compile_fail via trybuild: SlabGuard !Send, refactor that adds Send breaks the doctest
- proptest: arbitrary fill/drain/reclaim sequences, property: no lost items, no double-deliver
-->
