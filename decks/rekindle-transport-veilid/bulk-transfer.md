---
layout: default
color: cream
---

# Chunked bulk transfer

<div class="bt-params">
  <div class="bt-param">
    <span class="bt-val">16 KB</span>
    <span class="bt-label">chunk size</span>
  </div>
  <div class="bt-param">
    <span class="bt-val">8</span>
    <span class="bt-label">inflight credits</span>
  </div>
  <div class="bt-param">
    <span class="bt-val">4 GB</span>
    <span class="bt-label">default ceiling per transfer</span>
  </div>
  <div class="bt-param">
    <span class="bt-val">BLAKE3</span>
    <span class="bt-label">per-chunk + Merkle</span>
  </div>
</div>

<div class="bt-pipeline">
  <div v-click class="bt-stage bt-mint">
    <div class="bt-stage-name">CreditGuard</div>
    <div class="bt-stage-detail">Sender acquires a credit before sending each chunk. Receiver releases credits as chunks are verified. Backpressure is structural.</div>
  </div>
  <div class="bt-arrow">→</div>
  <div v-click class="bt-stage bt-sky">
    <div class="bt-stage-name">app_message</div>
    <div class="bt-stage-detail">Each chunk is a single Veilid <code>app_message</code>. No streaming, no connection — fire-and-forget per chunk.</div>
  </div>
  <div class="bt-arrow">→</div>
  <div v-click class="bt-stage bt-lavender">
    <div class="bt-stage-name">ReorderRing</div>
    <div class="bt-stage-detail">Receiver reassembles out-of-order chunks into sequence order. MP-fill from network, SC-drain to verification.</div>
  </div>
  <div class="bt-arrow">→</div>
  <div v-click class="bt-stage bt-peach">
    <div class="bt-stage-name">Merkle verify</div>
    <div class="bt-stage-detail">BLAKE3 per-chunk hash. Incremental Merkle root verification. Corrupted chunks detected and re-requested.</div>
  </div>
</div>

<style>
h1 { text-align: center; }

.bt-params {
  display: flex;
  justify-content: center;
  gap: var(--aurora-space-6);
  margin-top: var(--aurora-space-4);
  margin-bottom: var(--aurora-space-4);
}

.bt-param {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
}

.bt-val {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-bold);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-heading);
}

.bt-label {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-text-secondary);
}

.bt-pipeline {
  display: flex;
  align-items: stretch;
  gap: var(--aurora-space-2);
}

.bt-stage {
  flex: 1;
  padding: var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--_bt-color) 10%, transparent);
  border-top: 3px solid var(--_bt-color);
}

.bt-stage-name {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-heading);
  margin-bottom: var(--aurora-space-2);
}

.bt-stage-detail {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-text-secondary);
  line-height: var(--aurora-leading-snug);
}

.bt-stage-detail code {
  font-family: var(--aurora-font-mono);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.bt-arrow {
  display: flex;
  align-items: center;
  font-size: var(--aurora-text-xl);
  color: var(--scheme-text-secondary);
  opacity: 0.5;
}

.bt-mint     { --_bt-color: var(--aurora-mint-400); }
.bt-sky      { --_bt-color: var(--aurora-sky-400); }
.bt-lavender { --_bt-color: var(--aurora-lavender-400); }
.bt-peach    { --_bt-color: var(--aurora-peach-400); }
</style>

<!--
- 16KB chunks: fits under 32KB app_message limit with framing overhead
- 8 inflight credits: CreditGuard CAS counter, sender blocks when exhausted
- 4GB default ceiling: sender sends Offer with size, receiver responds Accept with its ceiling, sender proceeds or cancels based on negotiated limit
- BLAKE3 per-chunk: receiver verifies before releasing credit back to sender
- Merkle root: incremental hasher, verified against offered content_hash at Fin frame
- See rekindle-transport-veilid/src/bulk_transfer.rs
-->

---
layout: default
color: slate
---

# Bulk transfer in the reconciliation context

<div class="btc-grid">
  <div class="btc-header">Trigger</div>
  <div class="btc-header">Transport method</div>
  <div class="btc-header">Pipeline</div>
  <div class="btc-header">Completion signal</div>

  <div class="btc-name">Inline blob ≤ 31KB</div>
  <div class="btc-cell"><code>call_peer(0x07 BlobPullReq)</code></div>
  <div class="btc-cell">Single app_call round-trip. Response contains blob bytes.</div>
  <div class="btc-cell"><code>store.ingest_verified(data)</code> in same reconcile task</div>

  <div class="btc-name">Large blob &gt; 31KB</div>
  <div class="btc-cell"><code>send_file(peer, path, media_type)</code></div>
  <div class="btc-cell">BulkSender → 16KB chunks → CreditGuard (8 inflight) → app_message per chunk → ReorderRing on receiver → BLAKE3 per-chunk → Merkle root</div>
  <div class="btc-cell"><code>InboundEvent::TransferComplete { hash_match }</code></div>

  <div class="btc-name">Peer lacks blob</div>
  <div class="btc-cell">No transfer initiated</div>
  <div class="btc-cell">—</div>
  <div class="btc-cell">Added to <code>BlobFetchReport.deferred</code>, retried next round via <code>blob_exists</code> check</div>
</div>

`fetch_missing_blobs` dispatches based on the 0x08 response: `too_large: false` with data → inline store, `too_large: true` → bulk lane, empty data → deferred. The application does not choose the mechanism.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }

.btc-grid {
  display: grid;
  grid-template-columns: 7rem 10rem 1fr 12rem;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  align-items: start;
}

.btc-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.btc-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.btc-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-2) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}

.btc-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- Decision made by 0x08 response, not by initiator
- Inline: completes within the reconcile task, store.ingest_verified immediate
- Bulk: completes async, TransferComplete event arrives later via inbound channel
- Deferred: blob_exists returns false again next round, retried automatically
- See rekindle-transport-veilid/src/bulk_transfer.rs BulkSender, TransferRegistry
-->
