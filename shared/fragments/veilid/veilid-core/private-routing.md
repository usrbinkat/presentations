---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="shared/veilid/veilid-core/private-routing.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Private routing. Safety routes protect the sender (SafetySelection on RoutingContext, transparent). Private routes protect the receiver (new_private_route → blob → DHT → import). Both compose independently through relay nodes that serve dual purpose: NAT traversal (VICE) and privacy hop. TX side controls safety chain. RX side controls private chain. sender() = None under safety routing. RouteChanged fires when routes die. ROUT+SGNL+RLAY node capabilities required for relay participation.
-->
