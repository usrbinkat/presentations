---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="shared/veilid/veilid-core/messaging-primitives.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Messaging primitives. app_call (request/response, blocks on rpc.timeout_ms, returns Vec<u8>) vs app_message (fire-and-forget, returns ()). Both share the same TX → route → callback path. app_call has a return path via app_call_reply(call_id, response). app_message terminates at the callback. The amber return arrow is the visual hero — its presence vs absence IS the distinction. sender() = None under safety routing applies to both. 32KB per direction. Callback types: VeilidAppCall has call_id, VeilidAppMessage does not.
-->
