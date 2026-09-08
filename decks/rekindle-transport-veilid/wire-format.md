---
layout: default
color: slate
---

# 64 bytes = one L1 cache line

<div class="wire-frame">
  <div class="wire-half">
    <div class="wire-label">32-byte Envelope</div>
    <div class="wire-field"><span class="wire-name">wire_version</span><span class="wire-desc">protocol evolution</span></div>
    <div class="wire-field"><span class="wire-name">lane</span><span class="wire-desc">Control / Data / Audit / Handoff</span></div>
    <div class="wire-field"><span class="wire-name">flags</span><span class="wire-desc">epoch bit 4 selects key generation</span></div>
    <div class="wire-field"><span class="wire-name">body_len</span><span class="wire-desc">payload length after header</span></div>
    <div class="wire-field"><span class="wire-name">session_seq</span><span class="wire-desc">monotonic, replay detection</span></div>
    <div class="wire-field wire-mac"><span class="wire-name">EMAC</span><span class="wire-desc">BLAKE3-keyed MAC over envelope</span></div>
  </div>
  <div class="wire-half">
    <div class="wire-label">32-byte StreamHeader</div>
    <div class="wire-field"><span class="wire-name">frame_class</span><span class="wire-desc">inline / bulk / control / audit</span></div>
    <div class="wire-field"><span class="wire-name">frame_kind</span><span class="wire-desc">57 typed kinds</span></div>
    <div class="wire-field"><span class="wire-name">stream_id</span><span class="wire-desc">multiplexed stream</span></div>
    <div class="wire-field"><span class="wire-name">header_flags</span><span class="wire-desc">per-stream options</span></div>
    <div class="wire-field"><span class="wire-name">nonce</span><span class="wire-desc">AEAD nonce, unique per frame</span></div>
    <div class="wire-field wire-mac"><span class="wire-name">HeaderMAC</span><span class="wire-desc">integrity of stream header</span></div>
  </div>
</div>

<div class="wire-note">
  <code>static_assertions::assert_eq_size!</code> enforces 64 bytes at compile time. Envelope is EMAC-verified before StreamHeader is decrypted — routing decisions happen without decrypting the payload.
</div>

<style>
.wire-frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
}

.wire-half {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
  border: 1px solid var(--scheme-border);
  border-radius: var(--aurora-radius-lg);
  padding: var(--aurora-space-3);
}

.wire-label {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-accent);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  border-bottom: 1px solid var(--scheme-border);
  margin-bottom: var(--aurora-space-1);
}

.wire-field {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--aurora-space-1) var(--aurora-space-2);
  border-radius: var(--aurora-radius-sm);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 50%, transparent);
}

.wire-mac {
  background: color-mix(in oklch, var(--aurora-lavender-400) 15%, transparent);
  border-inline-start: 2px solid var(--aurora-lavender-400);
}

.wire-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.wire-desc {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
}

.wire-note {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  margin-top: var(--aurora-space-3);
  text-align: center;
  line-height: var(--aurora-leading-snug);
}

.wire-note code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
  color: var(--scheme-heading);
}
</style>

<!--
- Envelope EMAC verified before StreamHeader decryption
- Routing decisions (lane, body_len, session_seq replay filter) without decrypting payload
- EMAC key: BLAKE3-keyed, HKDF labels "rti-envelope-d2l-v1" / "rti-envelope-l2d-v1"
- MAC fields highlighted: EMAC on envelope, HeaderMAC on stream header
- static_assertions::assert_eq_size! enforces 64 bytes at compile time
-->

---
layout: default
color: cream
class: dense
---

# Three AEAD ciphers

<div class="cipher-grid">
  <div class="cipher-header">Cipher</div>
  <div class="cipher-header">Throughput</div>
  <div class="cipher-header">Role</div>

  <div class="cipher-name">AES-256-GCM</div>
  <div class="cipher-cell">~3.8 GiB/s</div>
  <div class="cipher-cell">Mandatory. FIPS fallback. Available everywhere with AES-NI.</div>

  <div class="cipher-name cipher-highlight">AEGIS-128L</div>
  <div class="cipher-cell cipher-highlight">~14 GiB/s</div>
  <div class="cipher-cell cipher-highlight">Primary. 3.7× AES-GCM on same hardware. AES-NI only.</div>

  <div class="cipher-name">AEGIS-128X2</div>
  <div class="cipher-cell">~12 GiB/s</div>
  <div class="cipher-cell">Parallel lanes. Requires VAES for advantage over AEGIS-128L.</div>
</div>

<div class="abs-b" style="font-size: var(--aurora-text-xs); color: var(--scheme-text-secondary); text-align: center;">
Direction IDs D2L=[0,0,0,0] L2D=[0,0,0,1] as 4-byte nonce prefix prevent cross-direction nonce reuse.
</div>

<style>
h1 { text-align: center; }

.cipher-grid {
  display: grid;
  grid-template-columns: 10rem 8rem 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  align-items: center;
  margin-top: var(--aurora-space-4);
}

.cipher-header {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.cipher-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.cipher-cell {
  font-size: var(--aurora-text-base);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}

.cipher-name.cipher-highlight { color: var(--aurora-mint-500); }
.cipher-cell.cipher-highlight { background: color-mix(in oklch, var(--aurora-mint-200) 50%, transparent); }

.cipher-direction {
  margin-top: var(--aurora-space-4);
}

.cipher-direction h3 {
  font-size: var(--aurora-text-base) !important;
}

.cipher-direction :deep(.shiki),
.cipher-direction :deep(.shiki code),
.cipher-direction :deep(.shiki span),
.cipher-direction :deep(.shiki .line),
.cipher-direction :deep(pre),
.cipher-direction :deep(code) {
  font-size: 1.3rem !important;
  line-height: 1.8 !important;
}
</style>

<!--
- AEGIS-128L: 8 AES rounds in parallel via AES-NI, 14 GiB/s measured
- AES-256-GCM: 14 sequential rounds per block, 3.8 GiB/s, FIPS 140-2 mandatory fallback
- AEGIS-128X2: second parallel lane, requires VAES, slower without it
- Direction IDs: D2L=[0,0,0,0] L2D=[0,0,0,1], first 4 bytes of 12-byte nonce
- Same session keys, different direction IDs: nonce reuse structurally impossible
-->

---
layout: default
color: slate
---

# HKDF key derivation from Noise IK

```rust
// v4/wire/constants.rs — HKDF domain-separation labels
pub const LABEL_ENVELOPE_D2L: &str = "rti-envelope-d2l-v1";
pub const LABEL_ENVELOPE_L2D: &str = "rti-envelope-l2d-v1";
pub const LABEL_HEADER_D2L:   &str = "rti-header-d2l-v1";
pub const LABEL_HEADER_L2D:   &str = "rti-header-l2d-v1";
pub const LABEL_STREAM_D2L:   &str = "rti-stream-d2l-v1";
pub const LABEL_STREAM_L2D:   &str = "rti-stream-l2d-v1";
pub const LABEL_AUDIT_D2L:    &str = "rti-audit-d2l-v1";
pub const LABEL_AUDIT_L2D:    &str = "rti-audit-l2d-v1";
pub const LABEL_HANDOFF:      &str = "rti-handoff-v1";

// v4/crypto/keys.rs — all 9 derived from one HKDF-SHA256 extract
pub fn derive_all_keys(handshake_hash: &[u8; 32]) -> DerivedKeys;
pub fn derive_rotation_keys(combined_secret: &[u8; 32]) -> DerivedKeys;
```

Per-direction keys: envelope, header, and stream each have D2L and L2D variants. Audit has D2L and L2D. Handoff is bidirectional. Same derivation function used for initial handshake and rotation.

<style>
p { color: var(--scheme-heading); }

:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 1.1rem !important;
  line-height: 1.7 !important;
}
</style>

<!--
- 9 HKDF-SHA256 expand calls from Noise IK handshake hash
- Per-direction keys: envelope, header, stream each have D2L + L2D = 6 keys
- Audit has D2L + L2D = 2 keys, handoff is bidirectional = 1 key, total 9
- Compromising data lane key does not give control lane or audit lane key
- EMAC key shared across lanes: envelope MAC verified before lane selection
- Same derivation function for initial handshake and rotation (derive_rotation_keys)
-->
