---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="/shared/veilid/veilid-core/dht-transactions.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
DHT transactions. Three-phase distributed protocol: Begin (Kademlia fanout to lock DHT nodes, each returns xid + expiration + per-subkey seqs, merged via max_assign), operations (get/set/inspect against locked node set, set uses same seq conflict detection as non-transactional), End (consensus barrier — no more operations), Commit (consensus barrier — atomic write application, auto-promotes no-change nodes). Rollback is best-effort fire-and-forget from any stage. Keepalive RPCs maintain lock expiration during long transactions. Stage state machine: Init → Begin → [operations] → End → Commit, with Failed and Rollback branching from any stage. Max 32 records. Online-only. public_transaction_limit: 4, member_transaction_limit: 1. Drop without commit/rollback logs warning and tears down in background.
-->
