---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="/shared/veilid/veilid-core/component-architecture.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Component architecture. 8 components in dependency-ordered registration: ProtectedStore → Crypto → TableStore → RoutingTable → StorageManager → NetworkManager → RPCProcessor → AttachmentManager. Four lifecycle phases: init (forward order, failure triggers reverse terminate of already-inited), post_init (forward, resolves cross-component deps, EventBus subscriptions), pre_terminate (reverse, shuts down background tasks needing other components), terminate (reverse, final cleanup, warns on leaked Arc refs). EventBus starts before init, stops after terminate. TickTask pattern uses registry.lookup (not direct Arc) to avoid circular references. VeilidComponent trait: init, post_init, pre_terminate, terminate. Each component's role: ProtectedStore (OS keychain), Crypto (VLD0/VLD1 cryptosystems), TableStore (encrypted persistent KV), RoutingTable (Kademlia buckets + route spec store), StorageManager (DHT CRUD + watches + transactions), NetworkManager (TCP/UDP/WS connections + bootstrap + VICE), RPCProcessor (Cap'n Proto + fanout + operation routing), AttachmentManager (attach/detach state machine + background tick).
-->
