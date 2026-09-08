---
layout: default
color: cream
class: dense
---

# kappa-store traits used by reconciliation

<div class="st-grid">
  <div class="st-header">Trait</div>
  <div class="st-header">Methods called by reconciliation</div>
  <div class="st-header">Return type</div>

  <div class="st-name">NamespaceStore</div>
  <div class="st-cell"><code>namespace_list()</code>, <code>namespace_resolve(name)</code>, <code>namespace_get_meta(ns, key)</code>, <code>namespace_put_meta(ns, key, val)</code></div>
  <div class="st-cell"><code>Vec&lt;Namespace&gt;</code>, <code>Option&lt;Namespace&gt;</code>, <code>Option&lt;Vec&lt;u8&gt;&gt;</code>, <code>()</code></div>

  <div class="st-name">TagStore</div>
  <div class="st-cell"><code>tag_list(ns, limit, after)</code>, <code>tag_get(ns, name)</code>, <code>tag_put(ns, name, TagUpdate, clock)</code></div>
  <div class="st-cell"><code>Page&lt;TagEntry&gt;</code>, <code>Option&lt;TagEntry&gt;</code>, <code>()</code></div>

  <div class="st-name">EpochStore</div>
  <div class="st-cell"><code>epoch_current(ns)</code></div>
  <div class="st-cell"><code>(u64, String)</code> — epoch_number, root_kappa</div>

  <div class="st-name">BlobStore</div>
  <div class="st-cell"><code>blob_exists(kappa)</code>, <code>blob_get(kappa)</code>, <code>ingest_verified(data)</code></div>
  <div class="st-cell"><code>bool</code>, <code>Option&lt;Vec&lt;u8&gt;&gt;</code>, <code>Kappa</code></div>

</div>

<style>
.st-grid {
  display: grid;
  grid-template-columns: 8rem 1fr 12rem;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  align-items: start;
}

.st-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.st-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.st-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}

.st-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- Four traits touched by reconciliation: NamespaceStore, TagStore, EpochStore, BlobStore
- EdgeStore and SequenceStore not shown: application-layer, replicated indirectly via tag convergence
- tag_list with limit + after cursor: pagination for reconciliation responder
- epoch_current returns (u64, String): epoch number and root kappa hash
-->

---
layout: default
color: slate
class: dense
---

# Messaging and identity data

<div class="am-grid">
  <div class="am-header">Concept</div>
  <div class="am-header">Store representation</div>
  <div class="am-header">Reconciliation</div>

  <div class="am-name">Chat message</div>
  <div class="am-cell"><code>blob_put_verified</code> + <code>tag_set</code> in channel namespace</div>
  <div class="am-cell">Tag pull, blob fetched inline or bulk</div>

  <div class="am-name">Identity material</div>
  <div class="am-cell">Encrypted blob + tag in identity namespace</div>
  <div class="am-cell">Tag converges, blob fetched, decryption application-side</div>

  <div class="am-name">Community governance</div>
  <div class="am-cell">Blob + tag in community namespace</div>
  <div class="am-cell">Tag converges, manifest blob addressed by tag</div>

  <div class="am-name">Member registry</div>
  <div class="am-cell">One tag per member in community namespace</div>
  <div class="am-cell">Membership changes replicate as tag operations</div>
</div>

<style>
.am-grid {
  display: grid;
  grid-template-columns: 8rem 1fr 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: start;
}

.am-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.am-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) 0;
}

.am-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 40%, transparent);
}

.am-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- Chat: blob_put_verified stores content, tag_set indexes by channel/thread/time
- Identity: encrypted blob, transport and store never see plaintext key material
- Governance: manifest blob contains community rules, addressed by tag kappa
- Members: one tag per member, add/remove member = tag_put/tag_delete
-->

---
layout: default
color: cream
class: dense
---

# Encryption, persistence, and replication data

<div class="am-grid">
  <div class="am-header">Concept</div>
  <div class="am-header">Store representation</div>
  <div class="am-header">Reconciliation</div>

  <div class="am-name">MEK vault</div>
  <div class="am-cell">Encrypted blob, tag keyed by channel + generation</div>
  <div class="am-cell">Tag converges, blob opaque to transport and store</div>

  <div class="am-name">DM ratchet state</div>
  <div class="am-cell">Blob + tag in per-peer namespace</div>
  <div class="am-cell">Tag converges per peer namespace, encrypted blob</div>

  <div class="am-name">OCI / Git / NAR</div>
  <div class="am-cell">Blob + compression record + tag</div>
  <div class="am-cell">Tag converges, blob via bulk lane (16KB, CreditGuard)</div>

  <div class="am-name">Epoch-sealed state</div>
  <div class="am-cell"><code>epoch_advance(ns, root, count, now)</code></div>
  <div class="am-cell">Published to DHT subkey 0, watched, triggers reconciliation</div>
</div>

<style>
.am-grid {
  display: grid;
  grid-template-columns: 8rem 1fr 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: start;
}

.am-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.am-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-1) 0;
}

.am-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 40%, transparent);
}

.am-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- MEK vault: message encryption keys, encrypted at rest, opaque to every layer except the app
- DM ratchet: Triple Ratchet session state, per-peer namespace isolation
- OCI/Git/NAR: large blobs use bulk data lane, 16KB chunks, CreditGuard flow control
- Epoch: epoch_advance seals state root, DHT publication makes it discoverable by peers
-->

---
layout: full
color: cream
---

# DHT record persistence pattern

```rust
// kappa-server/src/v1/tasks/veilid.rs
const DHT_META_RECORD_KEY: &str = "_veilid/dht_record_key";
const DHT_META_WRITER_BYTES: &str = "_veilid/dht_writer_bytes";

async fn get_or_create_dht_record<T, S>(
    transport: &T,
    store: &S,
    ns: &kappa_types::namespace::NamespaceRef,
    meta_key_record: &str,
    meta_key_writer: &str,
) -> Option<(String, Vec<u8>)>
where
    T: Transport,
    S: KappaStore,
{
    if let Ok(key_bytes) = store.namespace_get_meta(ns, meta_key_record) {
        if let Ok(writer_bytes) = store.namespace_get_meta(ns, meta_key_writer) {
            let key = String::from_utf8(key_bytes).ok()?;
            return Some((key, writer_bytes));
        }
    }

    let schema = RecordSchema::SingleWriter { subkey_count: 1 };
    let (record, writer_bytes) = transport.create_record(schema).await.ok()?;
    let record_key = record.key().to_string();

    let _ = store.namespace_put_meta(ns, meta_key_record, record_key.as_bytes());
    let _ = store.namespace_put_meta(ns, meta_key_writer, &writer_bytes);

    Some((record_key, writer_bytes))
}
```

Same pattern for route blob DHT record with `DHT_META_ROUTE_RECORD_KEY` / `DHT_META_ROUTE_WRITER_BYTES` in `_system` namespace.

<style>
:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 0.8rem !important;
  line-height: 1.5 !important;
}
</style>

<!--
- Runs once per namespace per node startup
- Same pattern for route blob DHT record in _system namespace
- _veilid/dht_record_key: reopened on restart without re-creation
- _veilid/dht_writer_bytes: serialized keypair for open_record write access
- See kappa-transport-veilid/src/v1/dht.rs get_or_create_dht_record
-->

---
layout: default
color: slate
class: dense
---

# IdentityStore: identity and trust

<div class="is-grid">
  <div class="is-header">Section</div>
  <div class="is-header">Key methods</div>
  <div class="is-header">Key type</div>

  <div class="is-name">Bindings</div>
  <div class="is-cell"><code>binding_put</code>, <code>binding_get</code>, <code>list_by_target</code></div>
  <div class="is-cell">(ns_uuid, source) cross-namespace</div>

  <div class="is-name">Assertions</div>
  <div class="is-cell"><code>assertion_put</code>, <code>assertion_get</code>, <code>list_by_subject_filtered</code></div>
  <div class="is-cell">kappa key_bytes</div>

  <div class="is-name">Revocations</div>
  <div class="is-cell"><code>revocation_put</code>, <code>revocation_get</code>, <code>list_by_asserter</code></div>
  <div class="is-cell">kappa key_bytes</div>

  <div class="is-name">Successions</div>
  <div class="is-cell"><code>succession_insert</code>, <code>succession_get</code>, <code>chain_get</code></div>
  <div class="is-cell">old anchor → new kappa</div>

  <div class="is-name">Watermarks</div>
  <div class="is-cell"><code>watermark_put</code>, <code>watermark_get</code>, <code>list_by_asserter</code></div>
  <div class="is-cell">kappa key_bytes</div>

  <div class="is-name">Handles</div>
  <div class="is-cell"><code>handle_put</code>, <code>handle_get</code>, <code>list_by_anchor</code>, <code>set_liveness</code></div>
  <div class="is-cell">"protocol:handle"</div>

  <div class="is-name">Sessions</div>
  <div class="is-cell"><code>session_put</code>, <code>session_get</code>, <code>session_evict</code></div>
  <div class="is-cell">token string, expiry-evictable</div>

  <div class="is-name">Credentials</div>
  <div class="is-cell"><code>credential_put</code>, <code>credential_get</code>, <code>credential_rotate</code></div>
  <div class="is-cell">id string, grace period rotation</div>
</div>

<style>
.is-grid {
  display: grid;
  grid-template-columns: 7rem 1fr 10rem;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.is-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-1);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.is-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.is-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
}

.is-cell code {
  font-size: 0.6rem;
  background: transparent !important;
  padding: 0 !important;
}
</style>

<!--
- 8 core sections: bindings, assertions, revocations, successions, watermarks, handles, sessions, credentials
- Bindings are cross-namespace: binding_get(source) searches all namespaces
- Sessions expiry-evictable: session_evict(now) clears expired tokens
- Credentials support grace period rotation: old hash valid during grace_ms
-->

---
layout: default
color: cream
class: dense
---

# IdentityStore: operational sections

<div class="is-grid">
  <div class="is-header">Section</div>
  <div class="is-header">Key methods</div>
  <div class="is-header">Key type</div>

  <div class="is-name">Trust</div>
  <div class="is-cell"><code>trust_position_get</code>, <code>trust_position_put</code></div>
  <div class="is-cell">singleton</div>

  <div class="is-name">Devices</div>
  <div class="is-cell"><code>device_binding_put</code>, <code>list</code>, <code>revoke</code></div>
  <div class="is-cell">anchor key_bytes</div>

  <div class="is-name">Prekeys</div>
  <div class="is-cell"><code>prekey_binding_put</code>, <code>list</code>, <code>current</code></div>
  <div class="is-cell">anchor, current = max epoch</div>

  <div class="is-name">Locators</div>
  <div class="is-cell"><code>locator_put</code>, <code>locator_get</code></div>
  <div class="is-cell">anchor, stale epoch rejected</div>

  <div class="is-name">Commitments</div>
  <div class="is-cell"><code>revocation_commitment_put</code>, <code>get</code></div>
  <div class="is-cell">anchor key_bytes</div>

  <div class="is-name">Index</div>
  <div class="is-cell"><code>assertion_index_put</code>, <code>query</code>, <code>cursor</code></div>
  <div class="is-cell">subject → Vec&lt;Kappa&gt;</div>

  <div class="is-name">Delegations</div>
  <div class="is-cell">EdgeStore edges, <code>verify_delegation_chain</code></div>
  <div class="is-cell">edge semantics, not IdentityStore methods</div>
</div>

<style>
.is-grid {
  display: grid;
  grid-template-columns: 8rem 1fr 11rem;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.is-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.is-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.is-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
}

.is-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.6rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- 15 sections on one trait: IdentityStore: Send + Sync
- Bindings are cross-namespace: binding_get(source) searches all namespaces
- Successions keyed by old anchor, walkable chain via succession_chain_get
- Handles use compound "protocol:handle" key for cross-protocol uniqueness
- Sessions are expiry-evictable: session_evict(now) clears expired tokens
- Credentials support grace period rotation: old hash valid during grace_ms
- Locators reject stale epoch on put: monotone epoch enforcement
- Delegations use EdgeStore edges, not IdentityStore methods directly
- Business logic in identity_ops.rs free functions, not on the trait
- See kappa-store/src/v1/traits/identity.rs
-->
