---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="shared/veilid/veilid-core/reactivity-watches.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Reactivity — watches and events. watch_dht_values records a desire. Background task negotiates with DHT nodes. ValueChanged push arrives (or fallback polling catches it). Change inspection confirms subkeys differ. VeilidUpdate::ValueChange fires to callback. count decrements — at 0 the watch dies. Green cycle arrow shows re-negotiation loop. Notification path: writer → DHT node → detects change → push to watcher → inspect → callback. Red dashed fallback bar: polling catches missed push notifications. Complete VeilidUpdate enum shown with ValueChange highlighted. Constraints: public_watch_limit 32, member_watch_limit 8, max_watch_expiration_ms 600000, one watch per record.
-->
