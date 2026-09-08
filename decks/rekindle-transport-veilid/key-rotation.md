---
layout: default
color: cream
---

# Epoch-tagged key rotation

<div class="kr-protocol">
  <div class="kr-side">
    <div class="kr-label kr-init">Initiator</div>
    <div v-click="1" class="kr-step">Generate <code>chain_secret₁</code></div>
    <div v-click="1" class="kr-msg kr-out">ROTATE_INIT(chain_secret₁) →</div>
    <div v-click="3" class="kr-step"><code>combined = BLAKE3(cs₁ ∥ cs₂)</code></div>
    <div v-click="3" class="kr-step">Derive 9 new keys</div>
    <div v-click="4" class="kr-step kr-hot">Swap encoder to epoch=1 <strong>immediately</strong></div>
  </div>

  <div class="kr-center">
    <div class="kr-epoch-box">
      <div class="kr-epoch-label">1-bit epoch toggle</div>
      <div class="kr-epoch-bit">bit 4 of envelope flags</div>
    </div>
  </div>

  <div class="kr-side">
    <div class="kr-label kr-resp">Responder</div>
    <div v-click="2" class="kr-step">Generate <code>chain_secret₂</code></div>
    <div v-click="2" class="kr-msg kr-in">← ROTATE_COMMIT(chain_secret₂)</div>
    <div v-click="3" class="kr-step"><code>combined = BLAKE3(cs₁ ∥ cs₂)</code></div>
    <div v-click="3" class="kr-step">Derive 9 new keys</div>
    <div v-click="4" class="kr-step kr-deferred">Defer encoder swap until first epoch=1 frame arrives</div>
  </div>
</div>

<div v-click="5" class="kr-footer">
  <div class="kr-fact">Both decoder slots active during transition. <code>ZeroizeOnDrop</code> on old EpochKeys after retirement. Measured: 313µs idle rotation.</div>
</div>

<style>
h1 { text-align: center; }

.kr-protocol {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--aurora-space-4);
  margin-top: var(--aurora-space-4);
  align-items: start;
}

.kr-side {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-2);
}

.kr-label {
  font-size: var(--aurora-text-lg);
  font-weight: var(--aurora-font-bold);
  padding: var(--aurora-space-1) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  text-align: center;
}

.kr-init { color: var(--aurora-sky-400); background: color-mix(in oklch, var(--aurora-sky-400) 12%, transparent); }
.kr-resp { color: var(--aurora-mint-400); background: color-mix(in oklch, var(--aurora-mint-400) 12%, transparent); }

.kr-step {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--scheme-bg-code) 60%, transparent);
}

.kr-step code {
  font-family: var(--aurora-font-mono);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}

.kr-step.kr-hot {
  background: color-mix(in oklch, var(--aurora-sky-200) 40%, transparent);
  font-weight: var(--aurora-font-bold);
}

.kr-step.kr-deferred {
  background: color-mix(in oklch, var(--aurora-mint-200) 40%, transparent);
  font-weight: var(--aurora-font-bold);
}

.kr-msg {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  padding: var(--aurora-space-1) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
}

.kr-out {
  color: var(--aurora-sky-400);
  background: color-mix(in oklch, var(--aurora-sky-400) 8%, transparent);
  text-align: right;
}

.kr-in {
  color: var(--aurora-mint-400);
  background: color-mix(in oklch, var(--aurora-mint-400) 8%, transparent);
  text-align: left;
}

.kr-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.kr-epoch-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  padding: var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--aurora-lavender-200) 40%, transparent);
  border: 2px solid var(--aurora-lavender-400);
}

.kr-epoch-label {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.kr-epoch-bit {
  font-size: var(--aurora-text-xs);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-text-secondary);
}

.kr-footer {
  margin-top: var(--aurora-space-4);
  text-align: center;
}

.kr-fact {
  font-size: var(--aurora-text-base);
  color: var(--scheme-heading);
  padding: var(--aurora-space-3) var(--aurora-space-6);
  border-top: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
  line-height: var(--aurora-leading-relaxed);
}

.kr-fact code {
  font-family: var(--aurora-font-mono);
  background: transparent !important;
  padding: 0 !important;
  font-weight: var(--aurora-font-semibold);
}
</style>

<!--
- Initiator swaps encoder immediately: knows both chain_secrets, can derive combined key
- Responder defers encoder swap until first epoch=1 frame arrives from initiator
- Both decoder slots active during transition: epoch 0 and epoch 1 accepted simultaneously
- ZeroizeOnDrop on old EpochKeys after retirement, key material erased from memory
- 313µs idle rotation measured on IPC benchmark harness
- combined = BLAKE3(cs₁ ∥ cs₂), then 9 HKDF-SHA256 keys derived from combined
-->

---
layout: statement
color: slate
---

# One bit in the envelope tells the decoder which key generation to use. No negotiation. No version field. One bit.

<!--
- Bit 4 of envelope flags, read before AEAD decryption to select key slot
- No negotiation round-trip, no version field in header
- Only two key generations active simultaneously: current + rotating/retired
- 1-bit toggle is sufficient because rotation completes before next rotation starts
-->
