---
layout: cover
color: slate
class: cover-full
---

<div class="pop-chart">
  <div class="pop-title">If GitHub was a country</div>

  <div class="pop-row">
    <span class="pop-name">China</span>
    <div class="pop-track"><div class="pop-bar" style="width: 100%"></div></div>
    <span class="pop-num">1.41B</span>
  </div>
  <div class="pop-row">
    <span class="pop-name">United States</span>
    <div class="pop-track"><div class="pop-bar" style="width: 24.7%"></div></div>
    <span class="pop-num">349M</span>
  </div>
  <div class="pop-row pop-github">
    <span class="pop-name">GitHub</span>
    <div class="pop-track"><div class="pop-bar" style="width: 12.8%"></div></div>
    <span class="pop-num">180M</span>
  </div>
  <div class="pop-row">
    <span class="pop-name">Russia</span>
    <div class="pop-track"><div class="pop-bar" style="width: 10.2%"></div></div>
    <span class="pop-num">143M</span>
  </div>

  <div class="pop-source">worldpopulationreview.com</div>
</div>

<style>
.pop-chart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  gap: var(--aurora-space-6);
}

.pop-title {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  color: var(--aurora-lavender-400);
  text-align: center;
  padding-bottom: var(--aurora-space-6);
  letter-spacing: 0.02em;
}

.pop-source {
  font-size: var(--aurora-text-xs);
  color: oklch(100% 0 0 / 0.12);
  text-align: center;
  padding-top: var(--aurora-space-2);
}

.pop-row {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-4);
}

.pop-name {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-medium);
  color: oklch(100% 0 0 / 0.6);
  text-align: right;
  white-space: nowrap;
  width: 10rem;
  flex-shrink: 0;
}

.pop-track {
  flex: 1;
  height: 2.8rem;
}

.pop-bar {
  height: 100%;
  border-radius: var(--aurora-radius-sm);
  background: oklch(100% 0 0 / 0.12);
}

.pop-num {
  font-size: var(--aurora-text-lg);
  font-weight: var(--aurora-font-medium);
  color: oklch(100% 0 0 / 0.4);
  font-family: var(--aurora-font-mono);
  white-space: nowrap;
  width: 5rem;
  text-align: left;
  flex-shrink: 0;
}

/* GitHub row */
.pop-github .pop-name {
  color: white;
  font-weight: var(--aurora-font-bold);
  font-size: var(--aurora-text-2xl);
}

.pop-github .pop-bar {
  background: var(--aurora-lavender-400);
  box-shadow: 0 0 20px oklch(70% 0.16 300 / 0.3);
}

.pop-github .pop-num {
  color: white;
  font-weight: var(--aurora-font-bold);
  font-size: var(--aurora-text-xl);
}
</style>

<!-- Population scale. No clicks — fly past this one. China, USA, GitHub, Russia. The lavender bar between USA and Russia makes 180M tangible. Speaker doesn't need to say much — the chart says it all. ~5 seconds. -->
