---
layout: default
color: cream
---

# Reconciliation wire format

<div class="rw-grid">
  <div class="rw-header">Byte</div>
  <div class="rw-header">Name</div>
  <div class="rw-header">Direction</div>
  <div class="rw-header">Payload</div>
  <div class="rw-header">Response</div>

  <div class="rw-byte">0x00</div>
  <div class="rw-cell">PING</div>
  <div class="rw-cell">either → either</div>
  <div class="rw-cell">empty</div>
  <div class="rw-cell">0x00 empty</div>

  <div class="rw-byte">0x01</div>
  <div class="rw-cell">EPOCH_ROOT_REQ</div>
  <div class="rw-cell">initiator → responder</div>
  <div class="rw-cell">namespace UTF-8 bytes</div>
  <div class="rw-cell">0x02</div>

  <div class="rw-byte">0x02</div>
  <div class="rw-cell">EPOCH_ROOT_RESP</div>
  <div class="rw-cell">responder → initiator</div>
  <div class="rw-cell"><code>{ epoch_number: u64, root_kappa: String }</code></div>
  <div class="rw-cell">n/a</div>

  <div class="rw-byte" v-mark.box.mint="1">0x03</div>
  <div class="rw-cell">MST_SNAPSHOT_REQ</div>
  <div class="rw-cell">initiator → responder</div>
  <div class="rw-cell"><code>{ namespace, local_root_hash: [u8; 16] }</code></div>
  <div class="rw-cell">0x04</div>

  <div class="rw-byte" v-mark.box.mint="1">0x04</div>
  <div class="rw-cell">MST_SNAPSHOT_RESP</div>
  <div class="rw-cell">responder → initiator</div>
  <div class="rw-cell"><code>{ namespace, page_ranges_postcard: Vec&lt;u8&gt; }</code></div>
  <div class="rw-cell">n/a</div>

  <div class="rw-byte">0x05</div>
  <div class="rw-cell">DIFF_PULL_REQ</div>
  <div class="rw-cell">initiator → responder</div>
  <div class="rw-cell"><code>{ namespace, tag_names: Vec, cursor: Option }</code></div>
  <div class="rw-cell">0x06</div>

  <div class="rw-byte">0x06</div>
  <div class="rw-cell">DIFF_PULL_RESP</div>
  <div class="rw-cell">responder → initiator</div>
  <div class="rw-cell"><code>{ namespace, tags: Vec&lt;TagEntryWire&gt;, truncated, next_cursor }</code></div>
  <div class="rw-cell">n/a</div>

  <div class="rw-byte">0x07</div>
  <div class="rw-cell">BLOB_PULL_REQ</div>
  <div class="rw-cell">initiator → responder</div>
  <div class="rw-cell"><code>{ kappa: String }</code></div>
  <div class="rw-cell">0x08</div>

  <div class="rw-byte">0x08</div>
  <div class="rw-cell">BLOB_PULL_RESP</div>
  <div class="rw-cell">responder → initiator</div>
  <div class="rw-cell"><code>{ kappa, data: Vec&lt;u8&gt;, too_large: bool, size: u64 }</code></div>
  <div class="rw-cell">n/a</div>
</div>

All payloads are postcard-encoded after the protocol byte. Transport is Veilid `app_call`, 32KB max per direction. Bytes 0x09-0xFF return an error string on receive.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-text-secondary); }

.rw-grid {
  display: grid;
  grid-template-columns: 3rem 9rem 9rem 1fr 4rem;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.rw-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.rw-byte {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-accent);
}

.rw-cell {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) var(--aurora-space-1);
  line-height: var(--aurora-leading-snug);
}

.rw-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
}
</style>

<!--
- 9 protocol bytes, postcard encoding, over Veilid app_call 32KB max
- TagEntryWire: name: String, kappa: String, version: u64
- Bytes 0x09-0xFF return error string on receive
- Odd bytes are requests, even bytes are responses (except 0x00 ping)
-->

---
layout: default
color: slate
class: dense
---

# Paginated tag pull

<div class="pg-params">
  <div class="pg-param">
    <span class="pg-val">500</span>
    <span class="pg-label">tags per page</span>
  </div>
  <div class="pg-param">
    <span class="pg-val">100</span>
    <span class="pg-label">max pages per round</span>
  </div>
  <div class="pg-param">
    <span class="pg-val">cursor</span>
    <span class="pg-label">lexicographic resume</span>
  </div>
</div>

<div class="pg-flow">
  <div class="pg-step">
    Send <code>0x05 DiffPullRequest { namespace, tag_names: [], cursor: None }</code>
  </div>
  <div class="pg-arrow">↓</div>
  <div class="pg-step">
    Receive <code>0x06 DiffPullResponse { tags: Vec&lt;TagEntryWire&gt;, truncated: bool, next_cursor }</code>
  </div>
  <div class="pg-arrow">↓</div>
  <div class="pg-step">
    <code>apply_tags</code>: for each tag, <code>store.tag_put(ns, name, TagUpdate::Set{kappa}, clock.now())</code>
  </div>
  <div class="pg-arrow">↓</div>
  <div class="pg-step pg-branch">
    if <code>truncated && page_count &lt; 100</code>: send <code>0x05 { cursor: next_cursor }</code>, repeat
  </div>
  <div class="pg-arrow">↓</div>
  <div class="pg-step pg-end">
    <code>!truncated</code> or <code>page_count >= 100</code>: namespace convergence complete for this peer
  </div>
</div>

<style>
.pg-params {
  display: flex;
  justify-content: center;
  gap: var(--aurora-space-6);
  margin-top: var(--aurora-space-3);
  margin-bottom: var(--aurora-space-3);
}

.pg-param {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
}

.pg-val {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-bold);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-heading);
}

.pg-label {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  text-align: center;
  max-width: 12rem;
}

.pg-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
}

.pg-step {
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  width: 90%;
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}

.pg-step code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.pg-branch {
  background: color-mix(in oklch, var(--aurora-sky-400) 12%, transparent);
}

.pg-end {
  background: color-mix(in oklch, var(--aurora-mint-400) 12%, transparent);
}

.pg-arrow { color: var(--scheme-text-secondary); opacity: 0.5; }
</style>

<!--
- Responder: tag_list(ns, limit=500, after=cursor)
- Exceeds 500: truncated=true, next_cursor=last tag name
- Initiator loops with cursor until !truncated or 100 pages
- Cursor is lexicographic: tag names sorted, resume after last received
-->

---
layout: default
color: cream
class: dense reveal-build
---

# MST diff: O(delta) bandwidth

<div class="mst-flow">
  <div class="mst-step mst-local">
    <span class="mst-num">1</span>
    Build local MST from <code>tag_list(namespace)</code>, compute 16-byte root hash
  </div>
  <div class="mst-arrow">↓</div>
  <div class="mst-step mst-send">
    <span class="mst-num">2</span>
    Send <code>0x03 { namespace, local_root_hash }</code>
  </div>
  <div class="mst-arrow">↓</div>
  <div class="mst-step mst-recv">
    <span class="mst-num">3</span>
    Receive <code>0x04 { namespace, page_ranges_postcard }</code>
  </div>
  <div class="mst-arrow">↓</div>
  <div class="mst-step mst-local">
    <span class="mst-num">4</span>
    Diff page ranges, extract inconsistent key name ranges
  </div>
  <div class="mst-arrow">↓</div>
  <div class="mst-step mst-send">
    <span class="mst-num">5</span>
    Send <code>0x05 { namespace, tag_names: inconsistent_names }</code>
  </div>
</div>

<style>
.mst-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  margin-top: var(--aurora-space-3);
}

.mst-step {
  display: flex;
  align-items: flex-start;
  gap: var(--aurora-space-3);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  width: 90%;
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  line-height: var(--aurora-leading-snug);
}

.mst-num {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-accent);
  min-width: 1.2rem;
  padding-top: 0.1rem;
}

.mst-detail {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  margin-top: var(--aurora-space-1);
}

.mst-step code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.mst-local { background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 50%, transparent); }
.mst-send  { background: color-mix(in oklch, var(--aurora-sky-200) 40%, transparent); }
.mst-recv  { background: color-mix(in oklch, var(--aurora-mint-200) 40%, transparent); }

.mst-arrow { color: var(--scheme-text-secondary); opacity: 0.5; }
</style>

<!--
- Steps 1, 4: local computation, no network
- Steps 2, 3, 5: wire exchanges via 0x03, 0x04, 0x05
- 10,000-tag namespace with 50 divergent: transfers ~50 entries not 10,000
- Fallback to full paginated pull when: empty namespace degenerate MST, page_ranges exceed 32KB, 0x03/0x04 timeout
- try_mst_diff in reconcile.rs, falls back automatically
-->

---
layout: default
color: slate
---

# Blob fetch after tag convergence

<div class="bf-grid">
  <div class="bf-header">Condition</div>
  <div class="bf-header">Wire exchange</div>
  <div class="bf-header">Store operation</div>
  <div class="bf-header">Outcome</div>

  <div class="bf-name">Blob ≤ 31KB</div>
  <div class="bf-cell">Send <code>0x07 { kappa }</code>, receive <code>0x08 { data, too_large: false }</code></div>
  <div class="bf-cell"><code>store.ingest_verified(data)</code></div>
  <div class="bf-cell bf-ok">Fetched, one round-trip</div>

  <div class="bf-name">Blob &gt; 31KB</div>
  <div class="bf-cell">Receive <code>0x08 { too_large: true, size }</code></div>
  <div class="bf-cell">Queued for bulk data lane via <code>send_file</code></div>
  <div class="bf-cell bf-deferred">Fetched asynchronously via chunked transfer</div>

  <div class="bf-name">Peer lacks blob</div>
  <div class="bf-cell">Receive <code>0x08 { data: empty }</code></div>
  <div class="bf-cell">Added to <code>BlobFetchReport.deferred</code></div>
  <div class="bf-cell bf-retry">Retried next reconciliation round</div>
</div>

`collect_missing_blobs` calls `store.blob_exists(kappa)` for each received tag after `apply_tags`. Missing blobs are dispatched through `fetch_missing_blobs` which selects inline or bulk based on the response.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }

.bf-grid {
  display: grid;
  grid-template-columns: 6rem 1fr 12rem 10rem;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  align-items: start;
}

.bf-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.bf-name {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.bf-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-2) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}

.bf-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.bf-ok       { background: color-mix(in oklch, var(--aurora-mint-400) 12%, transparent) !important; }
.bf-deferred { background: color-mix(in oklch, var(--aurora-sky-400) 10%, transparent) !important; }
.bf-retry    { background: color-mix(in oklch, #e2a832 10%, transparent) !important; }
</style>

<!--
- 31KB threshold: 32KB app_call limit minus protocol byte + postcard framing
- Initiator always sends 0x07 regardless of expected size
- Responder decides: inline data if ≤31KB, signal too_large if over, empty if missing
- Bulk lane blobs complete asynchronously via TransferComplete event
- Deferred blobs rediscovered next round via blob_exists check
-->

---
layout: full
color: slate
---

# Responder dispatch

```rust
pub fn handle_reconcile_request<S>(store: &S, data: &[u8]) -> Result<Vec<u8>, String>
where S: NamespaceStore + TagStore + EpochStore + BlobStore,
{
    let proto_byte = data.first().ok_or("empty request")?;
    let payload = &data[1..];

    match proto_byte {
        0x00 => Ok(vec![0x00]),                                    // PING → PONG

        0x01 => {                                                  // EPOCH_ROOT_REQ
            let namespace = std::str::from_utf8(payload).map_err(|e| e.to_string())?;
            let ns = store.namespace_resolve(namespace).ok_or("unknown namespace")?;
            let (epoch_number, root_kappa) = store.epoch_current(&ns);
            let resp = EpochRootResponse { epoch_number, root_kappa };
            encode_response(0x02, &resp)
        }

        0x03 => {                                                  // MST_SNAPSHOT_REQ
            let req: MstSnapshotRequest = postcard::from_bytes(payload)?;
            let ns = store.namespace_resolve(&req.namespace)?;
            let mst = build_mst_from_tags(store, &ns);
            let page_ranges = mst.serialize_page_ranges();
            encode_response(0x04, &MstSnapshotResponse { namespace: req.namespace, page_ranges })
        }

        0x05 => {                                                  // DIFF_PULL_REQ
            let req: DiffPullRequest = postcard::from_bytes(payload)?;
            let ns = store.namespace_resolve(&req.namespace)?;
            let (tags, truncated, next_cursor) = if req.tag_names.is_empty() {
                let page = store.tag_list(&ns, MAX_PULL_TAGS, req.cursor.as_deref());
                (page.entries, page.has_more, page.next_after)
            } else {
                let tags = req.tag_names.iter()
                    .filter_map(|name| store.tag_get(&ns, name).map(|t| t.into()))
                    .collect();
                (tags, false, None)
            };
            encode_response(0x06, &DiffPullResponse { namespace: req.namespace, tags, truncated, next_cursor })
        }

        0x07 => {                                                  // BLOB_PULL_REQ
            let req: BlobPullRequest = postcard::from_bytes(payload)?;
            match store.blob_get(&req.kappa) {
                Some(blob) if blob.len() <= MAX_INLINE_BLOB => {
                    encode_response(0x08, &BlobPullResponse { kappa: req.kappa, data: blob, too_large: false, size: blob.len() as u64 })
                }
                Some(blob) => {
                    encode_response(0x08, &BlobPullResponse { kappa: req.kappa, data: vec![], too_large: true, size: blob.len() as u64 })
                }
                None => {
                    encode_response(0x08, &BlobPullResponse { kappa: req.kappa, data: vec![], too_large: false, size: 0 })
                }
            }
        }

        _ => Err(format!("unknown protocol byte: 0x{:02x}", proto_byte)),
    }
}
```

<style>
:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 0.7rem !important;
  line-height: 1.45 !important;
}
</style>

<!--
- Exhaustive match on protocol byte, unknown → error string
- 0x05 branch: tag_names empty → full paginated pull; populated → selective MST diff pull
- 0x07 branch: blob ≤ MAX_INLINE_BLOB → inline; over → too_large; missing → empty
- MAX_INLINE_BLOB = 31KB constant
- See kappa-transport-veilid/src/v1/dispatch.rs handle_reconcile_request
-->
