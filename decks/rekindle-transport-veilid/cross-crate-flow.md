---
layout: two-cols-title
color: cream
columns: 1fr 1fr
leftColor: sky
rightColor: mint
---

# Two applications, one transport boundary

::left::

### Rekindle path (encrypted messaging)

1. **rekindle-cli** / rekindle-client
2. → `IpcClient` AF_UNIX, Noise IK, AEGIS-128L
3. → `IpcServer` decrypts, routes via `FrameRouter`
4. → `DaemonRouter` dispatches `DaemonRequest`
5. → `Arc<dyn Transport>` (VeilidTransport)
6. → veilid-core P2P network

ChatService programs against the Transport trait for DHT records (profiles, mailboxes, channels), peer messaging (DM, gossip), mesh broadcast, and bulk file transfer.

::right::

### Kappa path (content-addressed registry)

1. **kappa-server** HTTP API + federation config
2. → `KappaNode` wraps TransportNode
3. → `dispatch::run_dispatch` handles inbound
4. → `ReconcileLoop` drives convergence
5. → `Transport` trait methods (VeilidTransport)
6. → veilid-core P2P network

ReconcileLoop programs against Transport for `call_peer` (reconciliation RPCs 0x00-0x08), `write_record` (epoch root publication), `watch_record` (reactive triggers), `send_file` (bulk blob transfer).

<!--
- Left: rekindle-cli → AF_UNIX Noise IK AEGIS-128L → IpcServer → DaemonRouter → Arc<dyn Transport>
- Right: kappa-server → KappaNode → Transport trait methods directly
- Both converge at VeilidTransport, sole veilid_core boundary
- Rekindle: IPC adds encryption + framing for same-host CLI/TUI ↔ daemon
- Kappa: no IPC layer, server process owns the Transport directly
-->

---
layout: default
color: slate
---

# Inbound return paths

<div class="rp-grid">
  <div class="rp-header rp-rekindle">Rekindle inbound</div>
  <div class="rp-header rp-kappa">Kappa inbound</div>

  <div class="rp-cell rp-rekindle">VeilidUpdate → dispatch_loop → <code>InboundEvent::Message</code></div>
  <div class="rp-cell rp-kappa">VeilidUpdate → dispatch_loop → <code>InboundEvent::Call</code></div>

  <div class="rp-cell rp-rekindle">→ <code>DaemonRouter::on_notify(payload)</code></div>
  <div class="rp-cell rp-kappa">→ <code>handle_reconcile_request(store, data)</code></div>

  <div class="rp-cell rp-rekindle">→ <code>ChatService</code> processes typed message</div>
  <div class="rp-cell rp-kappa">→ response sent via <code>reply_tx.send(bytes)</code></div>

  <div class="rp-cell rp-rekindle">→ UI update, notification</div>
  <div class="rp-cell rp-kappa">→ <code>RecordChange</code> key → <code>trigger_tx</code> → immediate reconcile</div>
</div>

<div class="rp-shared">

### Shared inbound events both applications handle

<div class="rp-shared-grid">
  <div class="rp-ev"><code>Event::RouteDied</code></div>
  <div class="rp-desc">Log warning, route refresh loop re-allocates on next tick</div>

  <div class="rp-ev"><code>Event::Attached</code></div>
  <div class="rp-desc">Log, mark node ready for operations</div>

  <div class="rp-ev"><code>TransferComplete</code></div>
  <div class="rp-desc">Log transfer_id + hash_match result</div>

  <div class="rp-ev"><code>TransferFailed</code></div>
  <div class="rp-desc">Log warning with transfer_id + reason string</div>
</div>
</div>

<style>
.rp-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  margin-top: var(--aurora-space-4);
}

.rp-header {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  border-bottom: 3px solid;
}

.rp-header.rp-rekindle { color: var(--aurora-sky-300); border-color: var(--aurora-sky-400); }
.rp-header.rp-kappa { color: var(--aurora-mint-300); border-color: var(--aurora-mint-400); }

.rp-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
}

.rp-cell.rp-rekindle { background: color-mix(in oklch, var(--aurora-sky-400) 10%, transparent); }
.rp-cell.rp-kappa { background: color-mix(in oklch, var(--aurora-mint-400) 10%, transparent); }

.rp-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.rp-shared { margin-top: var(--aurora-space-4); }

.rp-shared h3 {
  font-size: var(--aurora-text-sm) !important;
  border-bottom: none !important;
  padding-bottom: var(--aurora-space-1) !important;
}

.rp-shared-grid {
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-3);
}

.rp-ev {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-heading);
}

.rp-ev code { background: transparent !important; padding: 0 !important; }

.rp-desc {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
}
</style>

<!--
- Rekindle inbound: Message → DaemonRouter::on_notify → ChatService
- Kappa inbound: Call → handle_reconcile_request → reply_tx
- Kappa inbound: RecordChange → trigger_tx → immediate reconcile
- Both: RouteDied → route refresh loop re-allocates
- Both: TransferComplete/Failed → logged with transfer_id + result
-->
