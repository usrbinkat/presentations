---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="shared/veilid/veilid-core/configuration.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Configuration as operational bounds. Five budget columns: Connection (max_connections 32-512, per-IP limits, frequency caps), Route (default_hop_count 1, max 4, stability Reliable, sequencing PreferOrdered), DHT Consensus (consensus_width 10, set/get value counts 5/3, fanout 6/5, watch limits pub 32 mem 8, txn limits pub 4 mem 1), Time (rpc.timeout 5000ms, get/set_value_timeout 10000ms, max_watch_expiration 600000ms), Space (remote_max_records 128, remote_max_mb 256, per-subkey 32KB, record total 1MB, max_subkey_count 1024). Config tree: VeilidConfig → network (routing_table, rpc, dht, protocol, privacy, tls) + protected_store + table_store + block_store + internal (footgun). validate() enforces all constraints. network_key_password creates private network.
-->
