---
layout: full
color: slate
---

# Transport trait surface

```rust
// rekindle-types/src/transport.rs — representative subset, 30+ methods total
#[async_trait]
trait Transport: Send + Sync + 'static {
    // Lifecycle — no start(), construction is startup
    async fn shutdown(&self) -> TransportResult<()>;
    fn is_attached(&self) -> bool;

    // Messaging (32KB max per direction)
    async fn send_to_peer(&self, peer_key: &str, data: &[u8]) -> TransportResult<()>;
    async fn call_peer(&self, peer_key: &str, data: &[u8]) -> TransportResult<Vec<u8>>;

    // DHT records (32KB per subkey, 65K subkeys per record)
    async fn create_record(&self, schema: RecordSchema)
        -> TransportResult<(OpenRecord, Vec<u8>)>;
    async fn open_record(&self, key: &str, writer: Option<&[u8]>)
        -> TransportResult<OpenRecord>;
    async fn write_record(&self, record: &OpenRecord, subkey: u32,
        data: &[u8], writer: Option<&[u8]>) -> TransportResult<()>;
    async fn read_record(&self, record: &OpenRecord, subkey: u32,
        force_refresh: bool) -> TransportResult<Option<Vec<u8>>>;
    async fn watch_record(&self, record: &OpenRecord, subkeys: &[u32])
        -> TransportResult<WatchToken>;
    async fn close_record(&self, record: OpenRecord) -> TransportResult<()>;

    // Routes
    async fn allocate_route(&self) -> TransportResult<(String, Vec<u8>)>;
    fn route_blob(&self) -> Option<Vec<u8>>;
    fn cache_peer_route(&self, peer_key: &str, route_blob: Vec<u8>);
    async fn import_route(&self, route_blob: &[u8]) -> TransportResult<String>;

    // Gossip mesh
    async fn join_mesh(&self, community_id: &str) -> TransportResult<()>;
    async fn broadcast(&self, community_id: &str, data: &[u8])
        -> TransportResult<BroadcastReport>;

    // Delivery
    async fn deliver(&self, peer_key: &str, data: &[u8], d: Durability)
        -> DeliveryReport;
    async fn deliver_community(&self, community_id: &str, data: &[u8],
        d: Durability) -> DeliveryReport;

    // Bulk transfer
    async fn send_file(&self, peer_key: &str, path: &Path, media_type: &str)
        -> TransportResult<[u8; 16]>;

    // Diagnostics
    fn peer_count(&self) -> u32;
    fn is_public_internet_ready(&self) -> bool;
    fn circuit_summary(&self) -> (usize, usize, usize, usize);
}
```

<style>
:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 0.85rem !important;
  line-height: 1.55 !important;
}
</style>

<!--
- Representative subset shown, 30+ methods total on the trait
- All types from rekindle-types: OpenRecord, WatchToken, InspectResult, RecordSchema, BroadcastReport, DeliveryReport, Durability, TransferStatus
- write_record takes writer: Option<&[u8]> for write-as-member on SMPL records
- read_record takes force_refresh: bool to bypass local cache
- send_file returns [u8; 16] transfer_id, not a named type
- Default impls on deliver, deliver_community, send_file return failure — backends override
-->

---
layout: default
color: cream
class: dense
---

# InboundEvent variants

```rust
enum InboundEvent {
    Message { sender_key: Option<String>, data: Vec<u8> },
    Call { sender_key: Option<String>, data: Vec<u8>,
           reply_tx: oneshot::Sender<Vec<u8>> },
    RecordChange { record_key: String, subkeys: Vec<u32>,
                   count: u32, data: Option<Vec<u8>> },
    Event(TransportEvent),
    TransferOffer { transfer_id: [u8; 16], sender_peer_key: String,
                    filename: String, total_size: u64, media_type: String },
    TransferProgress { transfer_id: [u8; 16], filename: String,
                       total_size: u64, bytes_transferred: u64,
                       chunks_received: u32, chunk_count: u32,
                       status: TransferStatus },
    TransferComplete { transfer_id: [u8; 16], path: String, hash_match: bool },
    TransferFailed { transfer_id: [u8; 16], reason: String },
}

enum TransportEvent {
    Attached, Detached,
    RouteAllocated { route_id: String },
    RouteDied { route_id: String },
    WatchExpired { record_key: String },
    PeerCountChanged { count: u32 },
    PublicInternet { available: bool },
}
```

`TransportNode::start(config)` returns `(Self, mpsc::Receiver<InboundEvent>)`. The receiver is the only inbound I/O path. No callback traits, no `RwLock<Option<Arc<dyn>>>` registration.

<style>
:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 0.78rem !important;
  line-height: 1.4 !important;
}
</style>

<!--
- TransportNode::start(config) returns (Self, mpsc::Receiver<InboundEvent>)
- sender_key: Option<String>, None under safety routing
- RecordChange.record_key not key, TransferOffer.sender_peer_key not sender
- TransferProgress carries 7 fields: id, filename, total, transferred, chunks_received, chunk_count, status
- TransportEvent: PeerCountChanged not PeerCount, PublicInternet not PublicInternetReady, WatchExpired.record_key not key
- Transfer IDs are [u8; 16], no TransferId type exists
-->

---
layout: default
color: slate
---

# The visibility boundary

<div class="vis-grid">
  <div class="vis-header">Module</div>
  <div class="vis-header">Visibility</div>
  <div class="vis-header">Contains veilid-core types</div>

  <div class="vis-name"><code>broadcast::*</code></div>
  <div class="vis-cell"><code>pub(crate)</code></div>
  <div class="vis-cell vis-yes">Yes — VeilidAPI, RoutingContext, KeyPair, DHTReportScope</div>

  <div class="vis-name"><code>subscriptions::*</code></div>
  <div class="vis-cell"><code>pub(crate)</code></div>
  <div class="vis-cell vis-yes">Yes — VeilidUpdate variant matching</div>

  <div class="vis-name"><code>transport_impl.rs</code></div>
  <div class="vis-cell"><code>pub</code></div>
  <div class="vis-cell vis-boundary">Boundary: converts between trait types and veilid-core types</div>

  <div class="vis-name"><code>resolver</code></div>
  <div class="vis-cell"><code>pub</code></div>
  <div class="vis-cell vis-no">No veilid-core types in public methods. <code>new()</code> is <code>pub(crate)</code>.</div>

  <div class="vis-name"><code>delivery</code></div>
  <div class="vis-cell"><code>pub</code></div>
  <div class="vis-cell vis-no">No — accepts <code>&[u8]</code>, returns <code>DeliveryReport</code></div>

  <div class="vis-name"><code>gossip</code></div>
  <div class="vis-cell"><code>pub</code></div>
  <div class="vis-cell vis-no">No — DedupCache, LamportClock, GossipMesh are self-contained</div>

  <div class="vis-name"><code>config</code>, <code>shared</code>, <code>error</code></div>
  <div class="vis-cell"><code>pub</code></div>
  <div class="vis-cell vis-no">No — TransportConfig, SharedState, error taxonomy</div>
</div>

<style>
.vis-grid {
  display: grid;
  grid-template-columns: 10rem 6rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  align-items: center;
}

.vis-header {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.vis-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-heading);
}

.vis-name code { background: transparent !important; padding: 0 !important; }

.vis-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  color: var(--scheme-heading);
}

.vis-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
}

.vis-yes      { background: color-mix(in oklch, #cc5a3a 10%, transparent); }
.vis-boundary { background: color-mix(in oklch, #e2a832 10%, transparent); }
.vis-no       { background: color-mix(in oklch, var(--aurora-mint-400) 10%, transparent); }
</style>

<!--
- Red: broadcast/*, subscriptions/* — contain VeilidAPI, RoutingContext, KeyPair
- Yellow: transport_impl.rs — converts between rekindle-types and veilid-core types
- Green: resolver, delivery, gossip, config, shared, error — zero veilid-core types
- RouteResolver::new() takes VeilidAPI param (pub fn but only called internally)
- Forcing function: should be pub(crate), kappa never calls it directly
-->
