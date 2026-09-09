---
layout: default
color: slate
class: dense
---

# Durable systems

<div class="ds-grid">
  <div class="ds-header ds-red">No blind failures</div>
  <div class="ds-header ds-orange">No compromising failures</div>
  <div class="ds-header ds-yellow">No meaningless noise</div>

  <div class="ds-cell ds-red">Actionable by design</div>
  <div class="ds-cell ds-orange">Clean by default</div>
  <div class="ds-cell ds-yellow">Quiet until it counts</div>

  <div v-click class="ds-cell ds-red">Root cause at a glance — source repo, commit, owner</div>
  <div v-click="1" class="ds-cell ds-orange">Crashed processes leave no dangling secrets</div>
  <div v-click="1" class="ds-cell ds-yellow">10,000 lines of INFO bury the 3 that matter</div>

  <div v-click="2" class="ds-cell ds-red">MTTD → zero. MTTR → minutes.</div>
  <div v-click="2" class="ds-cell ds-orange">A broken lock is not an open door</div>
  <div v-click="2" class="ds-cell ds-yellow">If nobody acts, the alert should not exist</div>
</div>

<div class="ds-key">MTTD — mean time to detect · MTTR — mean time to resolve</div>

<style>
h1 { text-align: center; }

.ds-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--aurora-space-4) var(--aurora-space-4);
  margin-top: var(--aurora-space-6);
}

.ds-header {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-bold);
  color: var(--_ds-color);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  border-bottom: 3px solid var(--_ds-color);
}

.ds-cell {
  font-size: var(--aurora-text-lg);
  color: var(--scheme-heading);
  text-align: center;
  padding: var(--aurora-space-3) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--_ds-color) 8%, transparent);
  line-height: var(--aurora-leading-snug);
}

.ds-key {
  font-size: var(--aurora-text-sm);
  color: var(--scheme-text-secondary);
  text-align: center;
  opacity: 0.6;
  margin-top: auto;
}

.ds-red    { --_ds-color: #cc5a3a; }
.ds-orange { --_ds-color: #d98032; }
.ds-yellow { --_ds-color: #e2a832; }
</style>

<!--
Durable systems — a design philosophy for any compute. Row 1 (fundamentals): the three-word mantras that define the posture. Row 2 (concrete): what it looks like in practice — root cause visible immediately, clean crash semantics, signal-to-noise discipline. Row 3 (industry): MTTD/MTTR as the measurable, the security metaphor, the alert hygiene test. Applies to apps, infra, hardware — anything that computes. ~25 seconds across 2 clicks.
-->

---
layout: statement
color: slate
class: reveal-build
---

# A leaky faucet under maintenance does not close the emergency room.

<v-click>

Scoped blast radius. Designed failure envelope. Allowable operations continue.

</v-click>

<!--
Graceful degradation is designed, not accidental. A broken subsystem doesn't cascade into unrelated services. The audience imagines their own systems. ~15 seconds.
-->
