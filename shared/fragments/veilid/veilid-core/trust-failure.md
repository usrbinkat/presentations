---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="shared/veilid/veilid-core/trust-failure.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Trust and failure model capstone. Three trust zones left-to-right: Application (full control, plaintext, identity known), Relay Network (opaque — each hop sees nonce + encrypted blob + next hop, NOT sender/destination/plaintext, encryption DH(PKn,SKapr) per hop), DHT Storage (remote nodes — signed by writer, data plaintext unless app provides encryption_key via XChaCha20 no-auth, seq+writer always visible, read unrestricted, write schema-enforced, schema immutable). Error severity: ERROR (terminal, no recovery — NotInitialized, Internal, Shutdown, InvalidTarget, InvalidArgument, MissingArgument, ParseError, Generic), WARN (operational — NoConnection, KeyNotFound, Unimplemented), DEBUG (retryable — TryAgain, Timeout, TransactionNotFound). Constraints: sender()=None under safety, DHT reads unrestricted, schema immutable, routes die silently, 32KB hard limit, no guaranteed delivery, 3 hardcoded bootstrap signing keys. Idempotency mandate from developer book. VLD0 Ed25519/X25519, VLD1 ML-DSA/ML-KEM post-quantum.
-->
