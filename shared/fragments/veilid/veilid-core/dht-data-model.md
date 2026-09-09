---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="/shared/veilid/veilid-core/dht-data-model.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
DHT data model. Schema (DFLT single-owner, SMPL partitioned members) defines write access. Schema + owner hash to RecordKey — deterministic, immutable. Subkeys individually versioned with monotonic seq. Write path: validate writer against schema → sign → fanout to consensus_width nodes → conflict check (highest seq wins, first-write-wins at same seq, idempotent at same seq+data). Returns None on success, Some(data) on conflict. Offline writes queued locally, flushed on attach. ValueData::MAX_LEN: 32768, MAX_SUBKEY_COUNT: 1024, MAX_RECORD_DATA_SIZE: 1MB.
-->
