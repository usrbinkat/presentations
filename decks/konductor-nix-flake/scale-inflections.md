---
layout: default
color: cream
---

# What breaks at 30 that worked at 3?

<div class="si-grid">
  <div class="si-header si-scale">Scale</div>
  <div class="si-header si-breaks">What breaks</div>
  <div class="si-header si-absorbs">What the platform absorbs</div>

  <div class="si-num">1 – 3</div>
  <div class="si-cell">Nothing yet — one person holds it all</div>
  <div v-click="1" class="si-cell si-mint">Convention feels optional (it isn't)</div>

  <div class="si-num">10 – 30</div>
  <div class="si-cell">Coordination cost exceeds coding cost</div>
  <div v-click="1" class="si-cell si-mint">Sealed configs, CI parity, workspace convention</div>

  <div class="si-num">100 – 300</div>
  <div class="si-cell">Org structure becomes the architecture</div>
  <div v-click="1" class="si-cell si-mint">Platform as the organizational constant</div>

  <div class="si-num">Multi-project</div>
  <div class="si-cell">Cross-project drift, vendor sprawl</div>
  <div v-click="1" class="si-cell si-mint">One workspace convention, one sealed source</div>
</div>

<style>
h1 { text-align: center; }

.si-grid {
  display: grid;
  grid-template-columns: 7rem 1fr 1fr;
  gap: var(--aurora-space-2) var(--aurora-space-4);
  align-items: center;
  margin-top: var(--aurora-space-6);
}

.si-header {
  font-size: var(--aurora-text-lg);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}

.si-num {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-bold);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-heading);
  font-variant-numeric: tabular-nums;
}

.si-cell {
  font-size: var(--aurora-text-lg);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading);
  background: color-mix(in oklch, var(--aurora-sky-200) 40%, transparent);
}

.si-cell.si-mint {
  background: color-mix(in oklch, var(--aurora-mint-200) 50%, transparent);
}
</style>

<!-- Scale inflection points. The thing that breaks is never the code — it's the coordination. At each inflection, the temptation is to add another tool, another team, another vendor. The platform absorbs that complexity instead of externalizing it. One more output, not one more stack. Click reveals what the platform absorbs at each scale. ~20 seconds. -->
