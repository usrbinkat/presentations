---
layout: default
color: slate
class: dense reveal-build
---

# Healthy habitats produce healthy habits

<div class="hab-chain">
  <div class="hab-step">
    <span class="hab-label">Outcome</span>
    <span class="hab-detail">Consistent, reproducible results</span>
  </div>
  <div class="hab-arrow">↑</div>
  <div class="hab-step">
    <span class="hab-label">Habit</span>
    <span class="hab-detail"><code>nix develop</code>, workspace convention, sealed configs</span>
  </div>
  <div class="hab-arrow">↑</div>
  <div class="hab-step hab-highlight">
    <span class="hab-label">Habitat</span>
    <span class="hab-detail"><code>/workspace/{user}/{server}/</code><code class="hab-root">{$WORKSPACE_ROOT}</code></span>
  </div>
</div>

<v-click>
<div class="hab-reframe">
  How many difficult things can we make easy, so that anyone can do them?
</div>
</v-click>

<style>
.hab-chain {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-top: var(--aurora-space-2);
}

.hab-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  padding: var(--aurora-space-2) var(--aurora-space-6);
  border-radius: var(--aurora-radius-md);
  background: color-mix(in oklch, var(--scheme-bg-code, var(--aurora-cream-200)) 60%, transparent);
  border: 1px solid color-mix(in oklch, var(--scheme-accent) 20%, transparent);
  width: 80%;
  text-align: center;
}

.hab-highlight {
  background: color-mix(in oklch, var(--aurora-lavender-200) 40%, transparent);
  border-color: color-mix(in oklch, var(--aurora-lavender-400) 50%, transparent);
}

.hab-label {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
}

.hab-detail {
  font-size: var(--aurora-text-base);
  color: var(--scheme-text-secondary);
  line-height: var(--aurora-leading-relaxed);
}

.hab-detail code {
  font-family: var(--aurora-font-mono);
  font-weight: var(--aurora-font-semibold);
  color: var(--scheme-heading);
  background: transparent !important;
  padding: 0 !important;
}

.hab-root {
  color: var(--scheme-accent) !important;
}

.hab-arrow {
  font-size: var(--aurora-text-2xl);
  color: var(--scheme-accent);
  line-height: 1;
}

.hab-reframe {
  text-align: center;
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-medium);
  font-style: italic;
  color: var(--scheme-heading);
  margin-top: var(--aurora-space-6);
  padding: var(--aurora-space-3) var(--aurora-space-6);
  border-top: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
}
</style>

<!--
The workspace is a habitat, not a platform. Habitats shape habits. Habits shape outcomes. The highlighted layer is where Konductor lives — the environment that makes the right thing the easy thing. Click reveals the OXO question: OXO made a potato peeler for people with arthritis and accidentally made the best potato peeler for everyone. Same principle. ~15 seconds.
-->
