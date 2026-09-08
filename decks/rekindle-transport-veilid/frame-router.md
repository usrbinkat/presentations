---
layout: full
color: slate
---

# IPC dispatch: FrameRouter trait

```rust
trait FrameRouter: Send + Sync + 'static {
    fn on_request(&self, info: ConnInfo, message_id: u64, clearance: u8, payload: &[u8]);
    fn on_reply(&self, info: ConnInfo, message_id: u64, correlation_id: u64, payload: &[u8]);
    fn on_notify(&self, info: ConnInfo, message_id: u64, clearance: u8, payload: &[u8]);
    fn on_publish(&self, info: ConnInfo, sub_id: u64, topic_hash: u64, seq: u64, payload: &[u8]);
    fn on_reject(&self, info: ConnInfo, rejected_id: u64, reason_code: u16, detail: &[u8]);
    fn on_bulk_complete(&self, info: ConnInfo, stream_id: u32, transfer_id: u128, /* ... */);
    fn on_bulk_failed(&self, info: ConnInfo, stream_id: u32, transfer_id: u128, reason: &str);
    fn on_ack(&self, info: ConnInfo, message_ids: &[u64]);
    fn on_connection_state_change(&self, info: ConnInfo, old: Phase, new: Phase);
    fn route_frame(&self, info: ConnInfo, class: FrameClass, kind: FrameKind, payload: &[u8]);
}
```

One method per frame kind. `route_frame` handles unrecognized kinds — the control loop calls it only when no specific method matches. The transport calls the trait; the application implements it.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }

:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 0.82rem !important;
  line-height: 1.55 !important;
}
</style>

<!--
- 10 methods, one per frame kind
- route_frame: fallback for unrecognized kinds, called only when no specific method matches
- DaemonRouter in rekindle-node implements this trait
- Bridges to DaemonRequest/DaemonResponse dispatch + SubscriptionRegistry pub-sub fan-out
- See rekindle-transport-ipc/src/handlers/frame_router.rs
-->

---
layout: full
color: slate
---

# Veilid dispatch: InboundEvent match

```rust
pub async fn run_dispatch(
    mut inbound_rx: mpsc::Receiver<InboundEvent>,
    store: Arc<dyn KappaStore>,
    trigger_tx: mpsc::Sender<String>,
) {
    while let Some(event) = inbound_rx.recv().await {
        match event {
            InboundEvent::Call { data, reply_tx, .. } => {
                match handle_reconcile_request(&*store, &data) {
                    Ok(response) => { let _ = reply_tx.send(response); }
                    Err(e) => {
                        tracing::warn!("reconcile request failed: {e}");
                        let _ = reply_tx.send(format!("error: {e}").into_bytes());
                    }
                }
            }
            InboundEvent::RecordChange { key, .. } => {
                let _ = trigger_tx.try_send(key);  // capacity 64, drop on full
            }
            InboundEvent::Event(TransportEvent::RouteDied { route_id }) => {
                tracing::warn!(%route_id, "route died, will re-allocate on next refresh");
            }
            InboundEvent::TransferComplete { transfer_id, hash_match, .. } => {
                tracing::info!(%transfer_id, %hash_match, "bulk transfer complete");
            }
            InboundEvent::TransferFailed { transfer_id, reason, .. } => {
                tracing::warn!(%transfer_id, %reason, "bulk transfer failed");
            }
            other => {
                tracing::debug!(?other, "unhandled inbound event");
            }
        }
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
  font-size: 0.78rem !important;
  line-height: 1.5 !important;
}
</style>

<!--
- Call arm: protocol byte dispatch to handle_reconcile_request, response via reply_tx
- RecordChange arm: key pushed to reconcile_trigger_tx, capacity 64
- try_send on trigger channel: backpressure drops, periodic tick catches up
- Unhandled variants logged at debug, not silently dropped
- See kappa-transport-veilid/src/v1/dispatch.rs run_dispatch
-->

---
layout: full
color: cream
class: dense
---

# Two dispatch patterns

<CodeComparison beforeLabel="IPC: trait methods" afterLabel="Veilid: match arms">

```rust
impl FrameRouter for DaemonRouter {
    fn on_request(&self, ...) { /* dispatch */ }
    fn on_publish(&self, ...) { /* fan out */ }
    fn route_frame(&self, ...) { /* log */ }
}
```

<template #after>

```rust
match event {
    InboundEvent::Call { .. } => { /* dispatch */ }
    InboundEvent::RecordChange { .. } => { /* trigger */ }
    other => { /* log */ }
}
```

</template>
</CodeComparison>

<div class="abs-b" style="font-size: var(--aurora-text-xs); color: var(--scheme-text-secondary); text-align: center;">
Both: one handler per inbound type, exhaustive dispatch, unrecognized inputs logged. IPC uses trait vtable. Veilid uses enum match + mpsc.
</div>

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }
</style>

<!--
- IPC: transport owns control loop, calls trait methods on the application
- Veilid: application owns recv loop, matches on enum variants from channel
- Both: exhaustive typed dispatch, no string matching
- Both: unknown/unrecognized inputs produce logged errors, not silent drops
- Shared principle: one handler per inbound type
-->
