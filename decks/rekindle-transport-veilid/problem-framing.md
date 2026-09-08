---
layout: default
color: cream
---

# State replication without servers

<div class="hard-grid">
  <div class="hard-header hard-red">Identity</div>
  <div class="hard-header hard-orange">Routing</div>
  <div class="hard-header hard-yellow">Delivery</div>
  <div class="hard-header hard-mint">Security</div>

  <div v-click="1" class="hard-cell hard-red">No CA, no OAuth. Peers prove identity with keypairs alone.</div>
  <div v-click="1" class="hard-cell hard-orange">No DNS, no static IP. Peers move, change networks, disappear for days.</div>
  <div v-click="1" class="hard-cell hard-yellow">No server to store-and-forward. Messages must reach peers behind NAT, offline, or across continents.</div>
  <div v-click="1" class="hard-cell hard-mint">Every hop is untrusted. Encryption is structural, not optional.</div>

  <div v-click="2" class="hard-cell hard-red">Veilid: Ed25519 keypairs, DHT-published profiles</div>
  <div v-click="2" class="hard-cell hard-orange">Veilid: private routes, relay nodes, DHT-backed route publication</div>
  <div v-click="2" class="hard-cell hard-yellow">Veilid: <code>app_message</code> + <code>app_call</code> + DHT persistence + watches</div>
  <div v-click="2" class="hard-cell hard-mint">Veilid: Noise framework, onion-routed private routes, forward secrecy</div>
</div>

<style>
h1 { text-align: center; }

.hard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
}

.hard-header {
  font-size: var(--aurora-text-lg);
  font-weight: var(--aurora-font-bold);
  color: var(--_hard-color);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  border-bottom: 3px solid var(--_hard-color);
}

.hard-cell {
  font-size: var(--aurora-text-base);
  color: var(--scheme-heading);
  text-align: center;
  padding: var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--_hard-color) 8%, transparent);
  line-height: var(--aurora-leading-snug);
}

.hard-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  background: transparent !important;
  padding: 0 !important;
  color: var(--scheme-heading);
}

.hard-red    { --_hard-color: #cc5a3a; }
.hard-orange { --_hard-color: #d98032; }
.hard-yellow { --_hard-color: #e2a832; }
.hard-mint   { --_hard-color: var(--aurora-mint-400); }
</style>

<!--
Row 1: the problems. Row 2: the Veilid primitives that address each.
-->

---
layout: default
color: cream
---

# Three transport layers

<div class="provides-grid">
  <div class="provides-header provides-veilid">veilid-core provides</div>
  <div class="provides-header provides-transport">Transport trait exposes</div>
  <div class="provides-header provides-app">Applications call</div>

  <div class="provides-cell provides-veilid">Encrypted overlay network</div>
  <div class="provides-cell provides-transport"><code>send_to_peer</code>, <code>call_peer</code></div>
  <div class="provides-cell provides-app">Reconciliation RPCs, chat DMs, voice signaling</div>

  <div class="provides-cell provides-veilid">DHT record CRUD + watches</div>
  <div class="provides-cell provides-transport"><code>create</code>, <code>read</code>, <code>write</code>, <code>watch</code>, <code>inspect</code></div>
  <div class="provides-cell provides-app">Epoch roots, namespace manifests, membership state</div>

  <div class="provides-cell provides-veilid">Private route allocation + import</div>
  <div class="provides-cell provides-transport"><code>allocate_route</code>, <code>cache_peer_route</code></div>
  <div class="provides-cell provides-app">Peer discovery, route publication, route refresh</div>

  <div class="provides-cell provides-veilid">Kademlia routing + relay</div>
  <div class="provides-cell provides-transport"><code>join_mesh</code>, <code>broadcast</code></div>
  <div class="provides-cell provides-app">Community announcements, tag change notifications</div>

  <div class="provides-cell provides-veilid"><code>app_message</code> 32KB fire-forget</div>
  <div class="provides-cell provides-transport"><code>deliver(Durable|Ephemeral)</code></div>
  <div class="provides-cell provides-app">Typing indicators, cursor positions, ephemeral signals</div>
</div>

<style>
h1 { text-align: center; }

.provides-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
}

.provides-header {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  border-bottom: 3px solid;
}

.provides-header.provides-veilid { color: var(--aurora-sky-400); border-color: var(--aurora-sky-400); }
.provides-header.provides-transport { color: var(--aurora-lavender-400); border-color: var(--aurora-lavender-400); }
.provides-header.provides-app { color: var(--aurora-mint-400); border-color: var(--aurora-mint-400); }

.provides-cell {
  font-size: var(--aurora-text-sm);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
}

.provides-cell.provides-veilid { background: color-mix(in oklch, var(--aurora-sky-200) 40%, transparent); }
.provides-cell.provides-transport { background: color-mix(in oklch, var(--aurora-lavender-200) 40%, transparent); }
.provides-cell.provides-app { background: color-mix(in oklch, var(--aurora-mint-200) 40%, transparent); }

.provides-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
Veilid primitive, trait abstraction, application operation.
-->
