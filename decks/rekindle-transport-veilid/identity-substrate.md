---
layout: default
color: cream
---

# Identity from any signing key

<div class="ak-flow">
  <div class="ak-step ak-key">
    Signing key: any algorithm, any public key bytes
  </div>
  <div class="ak-arrow">↓ <code>Kappa::from_key(algorithm, public_key_bytes)</code></div>
  <div class="ak-step ak-hash">
    <code>SHA-256( len(algorithm) || algorithm || len(key) || key )</code>
  </div>
  <div class="ak-arrow">↓</div>
  <div class="ak-step ak-anchor">
    <strong>AnchorKappa</strong> — sealed newtype, no <code>From&lt;Kappa&gt;</code>, no <code>parse</code>
  </div>
</div>

<div class="ak-props">
  <div class="ak-prop">
    <div class="ak-prop-label">Deterministic</div>
    <div class="ak-prop-detail">Same key always produces same anchor</div>
  </div>
  <div class="ak-prop">
    <div class="ak-prop-label">Algorithm-separated</div>
    <div class="ak-prop-detail">Different algorithms produce different anchors from same key bytes</div>
  </div>
  <div class="ak-prop">
    <div class="ak-prop-label">Algorithm-agnostic</div>
    <div class="ak-prop-detail">ed25519, p256, secp256k1, ml-dsa-65, FROST threshold — same derivation path</div>
  </div>
</div>

AnchorKappa is the equality basis. Map key. Vault label. Epoch signer. Delegation root.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }

.ak-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  margin-top: var(--aurora-space-4);
}

.ak-step {
  padding: var(--aurora-space-2) var(--aurora-space-6);
  border-radius: var(--aurora-radius-md);
  font-size: var(--aurora-text-base);
  color: var(--scheme-heading);
  width: 80%;
  text-align: center;
}

.ak-step code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.ak-key    { background: color-mix(in oklch, var(--aurora-sky-200) 40%, transparent); }
.ak-hash   { background: color-mix(in oklch, var(--aurora-lavender-200) 40%, transparent); font-family: var(--aurora-font-mono); font-size: var(--aurora-text-sm); }
.ak-anchor { background: color-mix(in oklch, var(--aurora-mint-200) 40%, transparent); }

.ak-arrow {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-text-secondary);
  opacity: 0.6;
}

.ak-arrow code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
}

.ak-props {
  display: flex;
  gap: var(--aurora-space-4);
  justify-content: center;
  margin-top: var(--aurora-space-4);
}

.ak-prop {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
  flex: 1;
}

.ak-prop-label {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.ak-prop-detail {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  line-height: var(--aurora-leading-snug);
}
</style>

<!--
- Sealed newtype: only Kappa::from_key can produce AnchorKappa
- No From<Kappa>, no parse — unconstructible from arbitrary Kappa values
- Algorithm prefix in the hash input ensures ed25519 key ≠ p256 key even if bytes match
- FROST threshold keys: group public key → AnchorKappa, t-of-n signers behind one anchor
- See kappa-types/src/v1/identity.rs AnchorKappa, Kappa::from_key
-->

---
layout: default
color: slate
zoom: 0.9
---

# Attestation types

<div class="at-grid">
  <div class="at-header">Type</div>
  <div class="at-header">Signed by</div>
  <div class="at-header">What it proves</div>

  <div class="at-name">IdentityBinding</div>
  <div class="at-cell">unsigned</div>
  <div class="at-cell">External identifier bound to anchor via method at trust level</div>

  <div class="at-name">IdentityAssertion</div>
  <div class="at-cell">asserter COSE_Sign1</div>
  <div class="at-cell">Asserter claims fact about subject on facet</div>

  <div class="at-name">Succession</div>
  <div class="at-cell">old + new dual COSE_Sign1</div>
  <div class="at-cell">Old anchor succeeded by new anchor for stated reason</div>

  <div class="at-name">Revocation</div>
  <div class="at-cell">asserter COSE_Sign1</div>
  <div class="at-cell">Previous assertion voided for stated reason</div>

  <div class="at-name">RevocationCommitment</div>
  <div class="at-cell">anchor COSE_Sign1</div>
  <div class="at-cell">Pre-committed at origination, usable when key is lost</div>

  <div class="at-name">Watermark</div>
  <div class="at-cell">asserter COSE_Sign1</div>
  <div class="at-cell">All assertions by asserter before timestamp are invalid</div>

  <div class="at-name">HandleRecord</div>
  <div class="at-cell">unsigned</div>
  <div class="at-cell">Human-readable name bound to anchor in protocol</div>

  <div class="at-name">AbsenceProof</div>
  <div class="at-cell">unsigned</div>
  <div class="at-cell">Cryptographic evidence no assertion exists for subject on facet at epoch</div>

  <div class="at-name">ScopedProjection</div>
  <div class="at-cell">bidirectional proof</div>
  <div class="at-cell">Per-scope unlinkable derivation from anchor</div>

  <div class="at-name">DeviceBinding</div>
  <div class="at-cell">anchor COSE_Sign1</div>
  <div class="at-cell">Device signing key bound to anchor</div>

  <div class="at-name">PrekeyBinding</div>
  <div class="at-cell">anchor COSE_Sign1</div>
  <div class="at-cell">Prekey bundle hash bound to anchor at epoch</div>

  <div class="at-name">LocatorRecord</div>
  <div class="at-cell">anchor COSE_Sign1</div>
  <div class="at-cell">Network addressing entries with monotone epoch</div>

  <div class="at-name" v-mark.box.orange="1">IdentityTombstone</div>
  <div class="at-cell">anchor COSE_Sign1</div>
  <div class="at-cell">Voluntary identity termination at epoch, permanent removal from trust store</div>
</div>

All attestation types are content-addressed dCBOR, stored in BlobStore, linked by EdgeStore. 13 content types in `signed.rs::content_types`, distinctness enforced by compile-time test.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-2); }

.at-grid {
  display: grid;
  grid-template-columns: 10rem 9rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.at-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.at-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.at-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
}
</style>

<!--
- All stored as content-addressed dCBOR in BlobStore, linked via EdgeStore
- Signed types with COSE content_type in signed.rs::content_types:
  - IdentityAssertion, Succession, Revocation, RevocationCommitment
  - Watermark, ScopedProjection, DeviceBinding, PrekeyBinding
  - LocatorRecord, IdentityTombstone
- Unsigned types, no content_type constant:
  - IdentityBinding, HandleRecord, AbsenceProof
- Additional content_types not in this table: DelegationScope, TimeAttestation
- Succession requires dual signature: old key + new key both sign
- RevocationCommitment created at key origination, exercised on key loss
- IdentityTombstone: TrustEvent::TombstoneReceived, permanent removal
-->

---
layout: default
color: cream
zoom: 0.9
---

# Trust state machine

<div class="ts-grid">
  <div class="ts-header">Current</div>
  <div class="ts-header">Event</div>
  <div class="ts-header">New state</div>
  <div class="ts-header">Latch</div>

  <div class="ts-cell">any</div>
  <div class="ts-cell">RootObserved</div>
  <div class="ts-cell ts-ok">Pinned</div>
  <div class="ts-cell">unchanged</div>

  <div class="ts-cell">any, latch=false</div>
  <div class="ts-cell">UnexplainedRootChange</div>
  <div class="ts-cell ts-warn">PinViolation</div>
  <div class="ts-cell">false</div>

  <div class="ts-cell">any, latch=true</div>
  <div class="ts-cell">UnexplainedRootChange</div>
  <div class="ts-cell ts-err">VerificationViolation</div>
  <div class="ts-cell">true</div>

  <div class="ts-cell">any</div>
  <div class="ts-cell">RotationProofVerified</div>
  <div class="ts-cell">unchanged</div>
  <div class="ts-cell">unchanged</div>

  <div class="ts-cell">any</div>
  <div class="ts-cell">VerificationSucceeded</div>
  <div class="ts-cell ts-verified">Verified</div>
  <div class="ts-cell ts-set">SET</div>

  <div class="ts-cell">PinViolation</div>
  <div class="ts-cell">UserAcknowledged</div>
  <div class="ts-cell ts-ok">Pinned</div>
  <div class="ts-cell">unchanged</div>

  <div class="ts-cell">VerifViolation</div>
  <div class="ts-cell">UserAcknowledged</div>
  <div class="ts-cell ts-ok">Pinned</div>
  <div class="ts-cell">unchanged</div>

  <div class="ts-cell">Verified</div>
  <div class="ts-cell">VerificationWithdrawn</div>
  <div class="ts-cell ts-ok">Pinned</div>
  <div class="ts-cell ts-clear">CLEARED</div>

  <div class="ts-cell">any, latch=false</div>
  <div class="ts-cell">RevocationReceived</div>
  <div class="ts-cell ts-warn">PinViolation</div>
  <div class="ts-cell">false</div>

  <div class="ts-cell">any, latch=true</div>
  <div class="ts-cell">RevocationReceived</div>
  <div class="ts-cell ts-err">VerificationViolation</div>
  <div class="ts-cell">true</div>

  <div class="ts-cell">any, latch=false</div>
  <div class="ts-cell" v-mark.underline.orange="1">TombstoneReceived</div>
  <div class="ts-cell ts-warn">PinViolation</div>
  <div class="ts-cell">false</div>

  <div class="ts-cell">any, latch=true</div>
  <div class="ts-cell">TombstoneReceived</div>
  <div class="ts-cell ts-err">VerificationViolation</div>
  <div class="ts-cell">true</div>
</div>

<style>
.ts-grid {
  display: grid;
  grid-template-columns: 8rem 10rem 10rem 5rem;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.ts-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.ts-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  color: var(--scheme-heading);
}

.ts-ok       { color: var(--aurora-mint-400); font-weight: var(--aurora-font-bold); }
.ts-warn     { color: #e2a832; font-weight: var(--aurora-font-bold); }
.ts-err      { color: #cc5a3a; font-weight: var(--aurora-font-bold); }
.ts-verified { color: var(--aurora-lavender-400); font-weight: var(--aurora-font-bold); }
.ts-set      { color: var(--aurora-lavender-400); font-weight: var(--aurora-font-bold); }
.ts-clear    { color: var(--aurora-sky-400); font-weight: var(--aurora-font-bold); }
</style>

<!--
- Latch is set by VerificationSucceeded, cleared only by VerificationWithdrawn
- All other transitions preserve the latch
- Latch=true means the user previously verified this peer interactively
- UnexplainedRootChange with latch=true → VerificationViolation (more severe than PinViolation)
- trust_transition is a pure function: (current, latch, event) → (new_state, new_latch)
- See kappa-types/src/v1/verified.rs trust_transition
-->

---
layout: default
color: slate
class: dense
---

# Succession chain

<div class="sc-flow">
  <div class="sc-step">
    <code>anchor</code> epoch 0
    <div class="sc-detail">Original key, AnchorKappa from key bytes</div>
  </div>
  <div class="sc-arrow">── dual sign ──→</div>
  <div class="sc-step">
    <code>anchor₁</code> epoch 1
    <div class="sc-detail">Old key signs new, new key signs old</div>
  </div>
  <div class="sc-arrow">── dual sign ──→</div>
  <div class="sc-step">
    <code>anchor₂</code> epoch 2
    <div class="sc-detail">Each link verified independently</div>
  </div>
</div>

<div class="sc-verify">

### verify_succession_chain

- Contiguity: `old_anchor` == previous link's `new_anchor`
- Cryptographic: dual COSE_Sign1 via `key_resolver`
- Monotone: `RotationEpoch::next()` increments by 1
- Bounded: `SUCCESSION_CHAIN_MAX` = 64
- Acyclic: `HashSet` of visited anchor `key_bytes`

</div>

<style>
.sc-flow {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--aurora-space-2);
  margin-top: var(--aurora-space-4);
}

.sc-step {
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 50%, transparent);
  text-align: center;
  flex: 1;
  max-width: 12rem;
}

.sc-step code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  background: transparent !important;
  padding: 0 !important;
  color: var(--scheme-heading);
}

.sc-detail {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  margin-top: var(--aurora-space-1);
  line-height: var(--aurora-leading-snug);
}

.sc-arrow {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-accent);
  white-space: nowrap;
}

.sc-verify { margin-top: var(--aurora-space-3); }

.sc-verify h3 {
  font-size: var(--aurora-text-sm) !important;
  border-bottom: none !important;
  padding-bottom: 0 !important;
}
</style>

<!--
- Dual signature: both old key and new key must sign the succession
- Old key signing new anchor proves the old key authorized the rotation
- New key signing old anchor proves the new key holder knows the old anchor
- succession_resolve walks the chain to the head, max 256 hops, cycle detection via HashSet
- Watermark auto-created on succession: invalidates pre-rotation assertions by old key
- See kappa-store/src/v1/identity_ops.rs verify_succession_chain
-->

---
layout: default
color: cream
class: dense
---

# Delegation chain

<div class="dc-flow">
  <div class="dc-step dc-root">
    <div class="dc-label">Root authority</div>
    <div class="dc-caps">{read, write, admin}</div>
    <div class="dc-depth">max_depth: 3</div>
  </div>
  <div class="dc-arrow">↓ signed by root, intersection</div>
  <div class="dc-step dc-d1">
    <div class="dc-label">delegate₁</div>
    <div class="dc-caps">{read, write, admin} ∩ {read, write, admin} = <strong>{read, write, admin}</strong></div>
    <div class="dc-depth">max_depth: 2</div>
  </div>
  <div class="dc-arrow">↓ signed by delegate₁, intersection</div>
  <div class="dc-step dc-d2">
    <div class="dc-label">delegate₂</div>
    <div class="dc-caps">{read, write, admin} ∩ {read, write} = <strong>{read, write}</strong></div>
    <div class="dc-depth">max_depth: 1</div>
  </div>
  <div class="dc-arrow">↓ signed by delegate₂, intersection</div>
  <div class="dc-step dc-d3">
    <div class="dc-label">delegate₃</div>
    <div class="dc-caps">{read, write} ∩ {read} = <strong>{read}</strong></div>
    <div class="dc-depth">remaining_depth: 0 — cannot redelegate</div>
  </div>
</div>

<div class="abs-b" style="font-size: var(--aurora-text-xs); color: var(--scheme-text-secondary); text-align: center;">
Each link: intersect capabilities, decrement depth, check expiry, verify signature. Empty intersection = revocation. Max depth 4.
</div>

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }

.dc-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  margin-top: var(--aurora-space-3);
}

.dc-step {
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  width: 80%;
  text-align: center;
}

.dc-root { background: color-mix(in oklch, var(--aurora-mint-200) 40%, transparent); }
.dc-d1   { background: color-mix(in oklch, var(--aurora-sky-200) 40%, transparent); }
.dc-d2   { background: color-mix(in oklch, var(--aurora-lavender-200) 40%, transparent); }
.dc-d3   { background: color-mix(in oklch, #e2a832 15%, transparent); }

.dc-label {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.dc-caps {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-heading);
  margin-top: var(--aurora-space-1);
}

.dc-depth {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
}

.dc-arrow {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  opacity: 0.6;
}
</style>

<!--
- CapabilitySet is a BTreeSet<Capability>: intersection narrows, union widens, empty = revoked
- EffectiveAuthority: the verified result after walking the chain
- Delegation edges stored in EdgeStore, verified by verify_delegation_chain
- Each link also checks valid_from/valid_until against now_ms
- Custom{name} capability: application-defined, still participates in intersection
- See kappa-store/src/v1/identity_ops.rs verify_delegation_chain
-->

---
layout: default
color: slate
class: dense
---

# Unlinkable identity per scope

<div class="sp-formula">
  <code>projected_kappa = SHA-256( BLAKE3(anchor_secret || scope_key) )</code>
</div>

<div class="sp-props">
  <div class="sp-prop">
    <div class="sp-prop-label">Deterministic</div>
    <div class="sp-prop-detail">same anchor + same scope_key = same projected_kappa</div>
  </div>
  <div class="sp-prop">
    <div class="sp-prop-label">Unlinkable across scopes</div>
    <div class="sp-prop-detail">same anchor + different scope_key = different projected_kappa</div>
  </div>
  <div class="sp-prop">
    <div class="sp-prop-label">Unlinkable across anchors</div>
    <div class="sp-prop-detail">different anchor + same scope_key = different projected_kappa</div>
  </div>
</div>

<div class="sp-proof">

### ProjectionProof: bidirectional binding

- `anchor_signs_projected`: anchor key signs the projected kappa bytes
- `projected_signs_anchor`: projected key signs the anchor kappa bytes
- Both must verify — cross-direction forgery rejected: one key cannot produce both signatures

</div>

<style>
.sp-formula {
  text-align: center;
  margin-top: var(--aurora-space-6);
  padding: var(--aurora-space-3) var(--aurora-space-6);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
  border-radius: var(--aurora-radius-md);
}

.sp-formula code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-lg);
  background: transparent !important;
  padding: 0 !important;
  color: var(--scheme-heading);
}

.sp-props {
  display: flex;
  gap: var(--aurora-space-4);
  justify-content: center;
  margin-top: var(--aurora-space-4);
}

.sp-prop {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--scheme-heading) 6%, transparent);
  flex: 1;
}

.sp-prop-label {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.sp-prop-detail {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
}

.sp-proof { margin-top: var(--aurora-space-4); }

.sp-proof h3 {
  font-size: var(--aurora-text-sm) !important;
  border-bottom: none !important;
  padding-bottom: 0 !important;
}
</style>

<!--
- Use case: pseudonym per community, scope_key = community governance key
- Anchor never revealed to the community, only the projected_kappa
- Bidirectional proof: user proves two projections share an anchor without revealing it
- Cross-direction forgery: attacker with one key cannot produce both signatures
-->

---
layout: default
color: cream
class: dense
---

# Identity lifecycle

<div class="lc-flow">
  <div class="lc-step lc-origin">
    <div class="lc-phase">Origination</div>
    <div class="lc-detail"><code>AnchorKappa::from_key</code> + <code>RevocationCommitment</code> pre-committed</div>
    <div class="lc-epoch">RotationEpoch::ORIGIN (0)</div>
  </div>
  <div class="lc-arrow">↓</div>
  <div class="lc-step lc-live">
    <div class="lc-phase">Live</div>
    <div class="lc-detail">Pinned. Assertions, bindings, handles, devices, prekeys, locators active.</div>
    <div class="lc-epoch">RotationEpoch(0)</div>
  </div>
  <div class="lc-arrow">↓ Succession dual COSE_Sign1</div>
  <div class="lc-step lc-rotated">
    <div class="lc-phase">Rotated</div>
    <div class="lc-detail">New anchor live. Old watermarked. Configurable grace window (default 14 days).</div>
    <div class="lc-epoch">RotationEpoch(1)</div>
  </div>
  <div class="lc-arrow">↓ IdentityTombstone signed at epoch</div>
  <div class="lc-step lc-dead">
    <div class="lc-phase">Tombstoned</div>
    <div class="lc-detail">TombstoneReceived. Removed from trust store. Dead set. Sessions torn down.</div>
    <div class="lc-epoch">Terminal</div>
  </div>
</div>

<style>
.lc-flow {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  margin-top: var(--aurora-space-3);
}

.lc-step {
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  width: 85%;
  border-inline-start: 4px solid var(--_lc-color);
  background: color-mix(in oklch, var(--_lc-color) 8%, transparent);
}

.lc-phase {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.lc-detail {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  line-height: var(--aurora-leading-snug);
  margin-top: var(--aurora-space-1);
}

.lc-detail code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.lc-epoch {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  color: var(--scheme-accent);
  margin-top: var(--aurora-space-1);
}

.lc-arrow {
  font-size: var(--aurora-text-xs);
  color: var(--scheme-text-secondary);
  opacity: 0.6;
}

.lc-origin  { --_lc-color: var(--aurora-mint-400); }
.lc-live    { --_lc-color: var(--aurora-sky-400); }
.lc-rotated { --_lc-color: var(--aurora-lavender-400); }
.lc-dead    { --_lc-color: #cc5a3a; }
</style>

<!--
- Origination: RevocationCommitment pre-committed for key-loss recovery
- Live: all identity operations available, trust state transitions active
- Rotated: succession_put_with_default_watermark auto-creates Watermark
- RotationGrace.is_within_grace: old-anchor material accepted during grace window
- Tombstoned: IdentityTombstone verified, anchor permanently dead
- RotationEpoch tracks progression: ORIGIN(0) → next() per succession
-->

---
layout: default
color: slate
---

# Deterministic session identifier

```rust
// kappa-types/src/v1/identity.rs
const SESSION_ANCHOR_DOMAIN: &str = "kappa identity session anchor v1";

pub fn derive_session_anchor(a: &Kappa, b: &Kappa) -> Result<SessionAnchor, StoreError> {
    if a == b { return Err(StoreError::Rejected("self-session".into())); }

    let (lo, hi) = if a.key_bytes() < b.key_bytes() {
        (a.key_bytes(), b.key_bytes())
    } else {
        (b.key_bytes(), a.key_bytes())
    };

    let mut ikm = Vec::with_capacity(lo.len() + hi.len());
    ikm.extend_from_slice(lo);
    ikm.extend_from_slice(hi);

    Ok(SessionAnchor(blake3::derive_key(SESSION_ANCHOR_DOMAIN, &ikm)))
}
```

<div class="sa-props">
  <div class="sa-prop"><strong>Symmetric:</strong> <code>derive(a, b) == derive(b, a)</code></div>
  <div class="sa-prop"><strong>Deterministic:</strong> same inputs always produce same output</div>
  <div class="sa-prop"><strong>Self-rejected:</strong> <code>derive(a, a)</code> returns <code>StoreError::Rejected</code></div>
  <div class="sa-prop"><strong>32 bytes:</strong> BLAKE3 derive_key output, domain-separated</div>
</div>

<style>
.sa-props {
  display: flex;
  flex-wrap: wrap;
  gap: var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  justify-content: center;
}

.sa-prop {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}

.sa-prop code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 0.82rem !important;
  line-height: 1.5 !important;
}
</style>

<!--
- Lexicographic ordering of key_bytes ensures symmetry without sorting
- BLAKE3 derive_key with domain string prevents cross-protocol collision
- Self-session rejection: a peer cannot create a session with itself
- Used for: DM session identification, vault label, prekey bundle lookup
- Both peers compute independently, no round-trip needed to agree on session ID
-->
