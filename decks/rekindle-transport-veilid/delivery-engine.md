---
layout: two-cols-title
color: cream
columns: 1fr 1fr
leftColor: lavender
rightColor: sky
---

# Two delivery durability tiers

::left::

### Durable

- DHT write **first** — data persists in the network
- Direct send is best-effort **after** DHT write
- On send failure: **silent** — DHT covers delivery
- Recipient reads from DHT on reconnect or reconciliation

Use for: chat messages, file transfers, channel operations, epoch publications, tag updates

::right::

### Ephemeral

- No DHT write — direct send is the **only** path
- On send failure: **message dropped**
- No retry, no persistence, no fallback

Use for: typing indicators, presence updates, voice signaling, cursor positions

<!--
- Durable: DHT is the delivery mechanism, direct send is the optimization
- Ephemeral: data is worthless if stale, no persistence path
- Chat messages, file transfers, epoch publications → Durable
- Typing indicators, cursor positions, voice signaling → Ephemeral
-->

---
layout: default
color: slate
---

# Delivery decision paths

<div class="dt-grid">
  <div class="dt-header dt-durable">Durable path</div>
  <div class="dt-header dt-ephemeral">Ephemeral path</div>

  <div class="dt-cell dt-durable">1. Write to DHT</div>
  <div class="dt-cell dt-ephemeral">1. Resolve route via 5-step pipeline</div>

  <div class="dt-cell dt-durable">2. Resolve route via 5-step pipeline</div>
  <div class="dt-cell dt-ephemeral">2. Direct send via <code>app_message</code></div>

  <div class="dt-cell dt-durable">3. Direct send via <code>app_message</code></div>
  <div class="dt-cell dt-ok">3a. Delivered</div>

  <div class="dt-cell dt-ok">4a. Delivered</div>
  <div class="dt-cell dt-drop">3b. Send failed — message lost</div>

  <div class="dt-cell dt-fallback">4b. Send failed — silent, DHT persists</div>
  <div class="dt-cell"></div>
</div>

<style>
.dt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  margin-top: var(--aurora-space-6);
}

.dt-header {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-bold);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  border-bottom: 3px solid;
}

.dt-header.dt-durable { color: var(--aurora-lavender-300); border-color: var(--aurora-lavender-400); }
.dt-header.dt-ephemeral { color: var(--aurora-sky-300); border-color: var(--aurora-sky-400); }

.dt-cell {
  font-size: var(--aurora-text-base);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  text-align: center;
}

.dt-cell.dt-durable { background: color-mix(in oklch, var(--aurora-lavender-400) 10%, transparent); }
.dt-cell.dt-ephemeral { background: color-mix(in oklch, var(--aurora-sky-400) 10%, transparent); }

.dt-cell.dt-ok {
  background: color-mix(in oklch, var(--aurora-mint-400) 15%, transparent);
  color: var(--aurora-mint-300);
}

.dt-cell.dt-fallback {
  background: color-mix(in oklch, var(--aurora-lavender-400) 12%, transparent);
  color: var(--aurora-lavender-300);
  font-size: var(--aurora-text-sm);
}

.dt-cell.dt-drop {
  background: color-mix(in oklch, var(--aurora-peach-400) 15%, transparent);
  color: var(--aurora-peach-300);
}

.dt-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  background: transparent !important;
  padding: 0 !important;
}
</style>

<!--
- Durable: 4 steps, DHT write precedes direct send
- Durable send failure: DeliveryReport sent=false, error=None
- Ephemeral: 3 steps, no DHT safety net
- Ephemeral send failure: DeliveryReport sent=false, error=Some(reason)
-->

---
layout: default
color: cream
class: dense reveal-build
---

# The actual write path

<div class="wp-flow">
  <div class="wp-step wp-app">
    <code>store.tag_put(ns, name, TagUpdate::Set{kappa}, clock.now())</code>
  </div>
  <div class="wp-arrow">↓</div>
  <div class="wp-step wp-store">
    <code>store.epoch_advance(ns, state_root, tag_count, now)</code>
  </div>
  <div class="wp-arrow">↓</div>
  <div class="wp-step wp-transport">
    <code>transport.write_record(epoch_record, subkey_0, epoch_bytes)</code>
  </div>
  <div class="wp-arrow">↓</div>
  <div class="wp-step wp-gossip">
    <code>transport.deliver_community(community, gossip_bytes, Durable)</code>
  </div>
  <div class="wp-arrow">↓</div>
  <div class="wp-step wp-peer">
    Peer receives <code>InboundEvent::Message</code>, applies tag, advances epoch
  </div>
</div>

<style>
.wp-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  margin-top: var(--aurora-space-4);
}

.wp-step {
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  width: 85%;
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  border-inline-start: 4px solid var(--_wp-color);
  background: color-mix(in oklch, var(--_wp-color) 8%, transparent);
}

.wp-detail {
  font-family: var(--aurora-font-sans);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  margin-top: var(--aurora-space-1);
}

.wp-step code { background: transparent !important; padding: 0 !important; }

.wp-arrow { color: var(--scheme-text-secondary); opacity: 0.5; }

.wp-app       { --_wp-color: var(--aurora-mint-400); }
.wp-store     { --_wp-color: #e2a832; }
.wp-transport { --_wp-color: var(--aurora-lavender-400); }
.wp-gossip    { --_wp-color: var(--aurora-sky-400); }
.wp-peer      { --_wp-color: #d98032; }
</style>

<!--
- tag_put: local, synchronous, fsync
- epoch_advance: seals state root into epoch chain
- write_record: VeilidTransport → dht_writes::set → set_dht_value fanout to consensus_width
- deliver_community: DeliveryEngine → BroadcastManager → send_raw to mesh peers
- Peer: reads tag from gossip payload, writes to local store, epoch_advance
- If gossip fails: peer discovers change via reconciliation epoch root compare
-->
