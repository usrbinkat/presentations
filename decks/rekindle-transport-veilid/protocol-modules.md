---
layout: default
color: cream
class: dense
---

# Substrate primitives

<div class="sp-grid">
  <div class="sp-header">Primitive</div>
  <div class="sp-header">Operations</div>
  <div class="sp-header">Registry role</div>

  <div class="sp-name">IdentityBinding</div>
  <div class="sp-cell"><code>binding_put/get/delete/list_by_target</code></div>
  <div class="sp-cell">Stores external identifier → anchor mappings</div>

  <div class="sp-name">IdentityAssertion</div>
  <div class="sp-cell"><code>assertion_put/get/list_by_asserter/list_by_subject</code></div>
  <div class="sp-cell">Stores signed claims, indexed by subject and asserter</div>

  <div class="sp-name">Succession</div>
  <div class="sp-cell"><code>succession_insert/get/chain_get</code></div>
  <div class="sp-cell">Links old anchor to new, walkable chain</div>

  <div class="sp-name">Revocation</div>
  <div class="sp-cell"><code>revocation_put/get/list_by_asserter</code></div>
  <div class="sp-cell">Voids prior assertions</div>

  <div class="sp-name">Watermark</div>
  <div class="sp-cell"><code>watermark_put/get/list_by_asserter</code></div>
  <div class="sp-cell">Bulk invalidation by timestamp</div>

  <div class="sp-name">HandleRecord</div>
  <div class="sp-cell"><code>handle_put/get/list_by_anchor/delete/set_liveness</code></div>
  <div class="sp-cell">Human-readable name → anchor per protocol</div>

  <div class="sp-name">ScopedProjection</div>
  <div class="sp-cell"><code>derive_scoped_projection</code></div>
  <div class="sp-cell">Per-scope unlinkable derivation from anchor</div>

  <div class="sp-name">DeviceBinding</div>
  <div class="sp-cell"><code>device_binding_put/list/revoke</code></div>
  <div class="sp-cell">Device signing key → anchor</div>

  <div class="sp-name">PrekeyBinding</div>
  <div class="sp-cell"><code>prekey_binding_put/list/current</code></div>
  <div class="sp-cell">Prekey bundle hash → anchor at epoch</div>

  <div class="sp-name">LocatorRecord</div>
  <div class="sp-cell"><code>locator_put/get</code>, epoch rejection</div>
  <div class="sp-cell">Network addressing entries, monotone epoch</div>
</div>

The registry knows only these primitives. No protocol names, no protocol logic, no protocol-specific types.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-2); }

.sp-grid {
  display: grid;
  grid-template-columns: 9rem 14rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.sp-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.sp-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.sp-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
}

.sp-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- 10 primitives shown, AnchorKappa on identity slide, DelegationScope on delegation slide
- No primitive knows which protocol module uses it
- All content-addressed dCBOR, stored in BlobStore, linked via EdgeStore
- EntityKind is an IdentityAssertion with facet="entity-kind", not a separate primitive
-->

---
layout: default
color: slate
class: dense
---

# Protocol module composition

<div class="pm-grid">
  <div class="pm-header">Module</div>
  <div class="pm-header">Primitives composed</div>

  <div class="pm-name">oci</div>
  <div class="pm-cell">Blob, Tag, Edge, Namespace, Upload</div>

  <div class="pm-name">git</div>
  <div class="pm-cell">Blob, Tag, Edge, Namespace</div>

  <div class="pm-name">nix</div>
  <div class="pm-cell">Blob, Tag, Edge, Binding, Assertion</div>

  <div class="pm-name">s3</div>
  <div class="pm-cell">Blob, Tag, Namespace, Upload</div>

  <div class="pm-name">identity</div>
  <div class="pm-cell">Binding, Assertion, Succession, Revocation, Watermark, Handle, Delegation, Absence</div>

  <div class="pm-name">atproto</div>
  <div class="pm-cell">Binding, Handle, Blob, Tag, Succession</div>

  <div class="pm-name">distribution</div>
  <div class="pm-cell">Epoch, Tag, Edge</div>
</div>

Protocol modules import the registry. The registry never imports protocol modules.

<style>
p { font-size: var(--aurora-text-sm); color: var(--scheme-heading); margin-top: var(--aurora-space-3); }

.pm-grid {
  display: grid;
  grid-template-columns: 11rem 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-3);
  margin-top: var(--aurora-space-4);
  align-items: start;
}

.pm-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.pm-name {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) 0;
}

.pm-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-300)) 40%, transparent);
}
</style>

<!--
- Each module is a thin orchestrator over substrate primitives
- OCI module: BlobStore for layer tarballs, TagStore for image tags, EdgeStore for layer lineage
- Nix module: IdentityBinding for nix signing key names, IdentityAssertion for narinfo signatures
- AT Protocol: Succession for DID:PLC rotation operations
- Distribution module: the reconciliation protocol from earlier sections, operates on EpochStore + TagStore
- kappa-module-identity: the identity substrate itself, composes all identity primitives
-->

---
layout: default
color: cream
class: dense
---

# Rekindle application mapping

<div class="ca-grid">
  <div class="ca-header">Concept</div>
  <div class="ca-header">Substrate primitive</div>

  <div class="ca-name">Identity root</div>
  <div class="ca-cell"><code>AnchorKappa::from_key("ed25519", key)</code></div>

  <div class="ca-name">Community pseudonym</div>
  <div class="ca-cell">ScopedProjection, scope_key = community governance key</div>

  <div class="ca-name">Key rotation</div>
  <div class="ca-cell">Succession dual COSE_Sign1 + auto-Watermark</div>

  <div class="ca-name">Device enrollment</div>
  <div class="ca-cell">DeviceBinding signed by anchor</div>

  <div class="ca-name">Prekey bundles</div>
  <div class="ca-cell">PrekeyBinding at epoch, <code>current</code> returns latest</div>

  <div class="ca-name">Network addressing</div>
  <div class="ca-cell">LocatorRecord with Mailbox + Route kinds, monotone epoch</div>
</div>

All six map to kappa-module-identity. No Rekindle-specific types in the substrate.

<style>
p { font-size: var(--aurora-text-xs); color: var(--scheme-text-secondary); margin-top: var(--aurora-space-2); }

.ca-grid {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: var(--aurora-space-1) var(--aurora-space-3);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.ca-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.ca-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.ca-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
}

.ca-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- All six Rekindle concepts map to kappa-module-identity
- ScopedProjection: community governance key as scope_key for unlinkable pseudonyms
- Succession: same primitive AT Protocol uses for DID:PLC rotation
- LocatorRecord: Mailbox for offline delivery, Route for direct send
-->

---
layout: default
color: slate
class: dense
---

# External protocol mapping

<div class="ca-grid">
  <div class="ca-header">Protocol concept</div>
  <div class="ca-header">Substrate primitive</div>
  <div class="ca-header">Module</div>

  <div class="ca-name">AT Protocol DID:PLC</div>
  <div class="ca-cell"><code>AnchorKappa::from_key</code> from PLC signing key</div>
  <div class="ca-cell">atproto</div>

  <div class="ca-name">AT Protocol handle</div>
  <div class="ca-cell">HandleRecord, <code>ProtocolId("atproto")</code></div>
  <div class="ca-cell">atproto</div>

  <div class="ca-name">Nix signing key</div>
  <div class="ca-cell">HandleRecord <code>ProtocolId("nix")</code> + IdentityBinding</div>
  <div class="ca-cell">nix</div>

  <div class="ca-name">Git commit signature</div>
  <div class="ca-cell">AnchorKappa from GPG/SSH key, Assertion facet="git-commit-sig"</div>
  <div class="ca-cell">identity</div>
</div>

Same primitives, different protocols. HandleRecord and IdentityAssertion reused across Nix, Git, AT Protocol.

<style>
p { font-size: var(--aurora-text-xs); color: var(--scheme-heading); margin-top: var(--aurora-space-2); }

.ca-grid {
  display: grid;
  grid-template-columns: 9rem 1fr 5rem;
  gap: var(--aurora-space-1) var(--aurora-space-2);
  margin-top: var(--aurora-space-3);
  align-items: center;
}

.ca-header {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.ca-name {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.ca-cell {
  font-size: var(--aurora-text-xs);
  padding: var(--aurora-space-1) var(--aurora-space-2);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
}

.ca-cell code {
  font-family: var(--aurora-font-mono);
  font-size: 0.65rem;
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- AT Protocol: Succession for DID:PLC rotation, same primitive as Rekindle key rotation
- Nix: HandleRecord for key name, IdentityBinding for key → anchor mapping
- Git: GPG or SSH key → AnchorKappa, commit signatures as IdentityAssertion
- All use the same substrate primitives, module provides protocol-specific orchestration
-->
