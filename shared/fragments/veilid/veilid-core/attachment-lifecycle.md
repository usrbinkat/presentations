---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="/shared/veilid/veilid-core/attachment-lifecycle.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Attachment lifecycle state machine. Detached → Attaching → Weak → Good → Full → Detaching → Detached. Application calls attach() and detach(). Network autonomously progresses through attached tiers via the background tick. Height of each state box encodes operational readiness — taller = more capabilities available. Bar counts ⓪-⑤ map to AttachmentState::bar_count(). Dashed box spans tick-driven states. VeilidUpdate::Attachment fires on every transition.
-->
