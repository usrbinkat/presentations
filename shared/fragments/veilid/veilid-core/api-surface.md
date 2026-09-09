---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="shared/veilid/veilid-core/api-surface.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
The two-object API surface. api_startup produces VeilidAPI, routing_context() produces RoutingContext. UpdateCallback is the async return channel. Every method the application touches is on one of these two objects. Dashed callback bar shows push direction — events flow from network to application. Evidence artifacts show actual Rust type signatures. solid border = you call it, dashed border = it calls you.
-->
