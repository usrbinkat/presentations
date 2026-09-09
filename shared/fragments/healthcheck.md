---
layout: cover
color: slate
class: hc-slide
---

<div class="healthcheck">
  <div class="hc-header">Health Check</div>
  <hr class="hc-fold" />
  <div class="hc-section">
    <div class="hc-label">Repo Health</div>
    <div class="hc-row" :class="{ 'hc-pass': $clicks >= 1 }">
      <span class="hc-icon"></span>
      <span class="hc-req">README.md</span>
      <span class="hc-sep">·</span>
      <span class="hc-sad">Where do I even start?</span>
      <span class="hc-happy">Just works</span>
    </div>
    <div class="hc-row" :class="{ 'hc-pass': $clicks >= 2 }">
      <span class="hc-icon"></span>
      <span class="hc-req">Prerequisites</span>
      <span class="hc-sep">·</span>
      <span class="hc-sad">Ask someone who knows</span>
      <span class="hc-happy">Already there</span>
    </div>
    <div class="hc-row" :class="{ 'hc-pass': $clicks >= 3 }">
      <span class="hc-icon"></span>
      <span class="hc-req">CI/CD</span>
      <span class="hc-sep">·</span>
      <span class="hc-sad">Works on my machine</span>
      <span class="hc-happy">Same everywhere</span>
    </div>
    <div class="hc-row" :class="{ 'hc-pass': $clicks >= 4 }">
      <span class="hc-icon"></span>
      <span class="hc-req">CONTRIBUTING.md</span>
      <span class="hc-sep">·</span>
      <span class="hc-sad">Easier to rewrite it myself</span>
      <span class="hc-happy">Read once, contribute anywhere</span>
    </div>
  </div>
  <hr class="hc-fold" />
  <div class="hc-section">
    <div class="hc-label">Project Health</div>
    <div class="hc-row" :class="{ 'hc-pass': $clicks >= 5 }">
      <span class="hc-icon"></span>
      <span class="hc-req">First PR</span>
      <span class="hc-sep">·</span>
      <span class="hc-sad">Not worth the setup</span>
      <span class="hc-happy">Worth a one-line fix</span>
    </div>
    <div class="hc-row" :class="{ 'hc-pass': $clicks >= 6 }">
      <span class="hc-icon"></span>
      <span class="hc-req">Second repo</span>
      <span class="hc-sep">·</span>
      <span class="hc-sad">Start from scratch, again</span>
      <span class="hc-happy">Same as the first</span>
    </div>
    <div class="hc-row" :class="{ 'hc-pass': $clicks >= 7 }">
      <span class="hc-icon"></span>
      <span class="hc-req">Conventions</span>
      <span class="hc-sep">·</span>
      <span class="hc-sad">Every repo is a surprise</span>
      <span class="hc-happy">Consistent, predictable, intuitive</span>
    </div>
  </div>
  <div v-click="7" class="hidden"></div>
</div>

<style>
.hc-slide {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x) !important;
}

.healthcheck {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: var(--aurora-space-2);
}

.hc-header {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-semibold);
  color: oklch(100% 0 0 / 0.5);
  text-align: center;
  padding-bottom: var(--aurora-space-3);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hc-section {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-4);
  width: 100%;
  max-width: 64rem;
}

.hc-fold {
  border: none;
  border-top: 1px solid oklch(100% 0 0 / 0.15);
  margin: var(--aurora-space-3) 0;
  width: 100%;
  max-width: 64rem;
}

.hc-label {
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--scheme-accent, var(--aurora-lavender-400));
  padding-bottom: var(--aurora-space-1);
}

/* Four-column grid: icon | requirement | sep | condition — no reflow */
.hc-row {
  display: grid;
  grid-template-columns: 1.2rem 14rem 1rem 1fr;
  align-items: center;
  column-gap: var(--aurora-space-3);
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-medium);
  color: var(--scheme-heading, white);
  line-height: var(--aurora-leading-snug);
}

.hc-icon {
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  flex-shrink: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%23e53e3e' d='M2.343 13.657A8 8 0 1 1 13.658 2.343 8 8 0 0 1 2.343 13.657ZM6.03 4.97a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042L6.94 8 4.97 9.97a.749.749 0 0 0 .326 1.275.749.749 0 0 0 .734-.215L8 9.06l1.97 1.97a.749.749 0 0 0 1.275-.326.749.749 0 0 0-.215-.734L9.06 8l1.97-1.97a.749.749 0 0 0-.326-1.275.749.749 0 0 0-.734.215L8 6.94Z'/%3E%3C/svg%3E") no-repeat center / contain;
  transition: background var(--aurora-duration-normal) var(--aurora-ease-out);
}

.hc-req {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-base);
  color: var(--scheme-accent, var(--aurora-lavender-400));
  white-space: nowrap;
}

.hc-sep {
  text-align: center;
  color: oklch(100% 0 0 / 0.4);
  font-size: var(--aurora-text-lg);
}

/* Stack sad/happy in same grid cell — no reflow on swap */
.hc-row > :nth-child(4),
.hc-row > :nth-child(5) {
  grid-column: 4;
  grid-row: 1;
}

.hc-sad {
  opacity: 0.55;
  font-style: italic;
}

.hc-happy {
  visibility: hidden;
  opacity: 0;
}

/* Green state — swap icon, swap text */
.hc-pass .hc-icon {
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='%2338a169' d='M8 16A8 8 0 1 1 8 0a8 8 0 0 1 0 16Zm3.78-9.72a.751.751 0 0 0-.018-1.042.751.751 0 0 0-1.042-.018L6.75 9.19 5.28 7.72a.751.751 0 0 0-1.042.018.751.751 0 0 0-.018 1.042l2 2a.75.75 0 0 0 1.06 0Z'/%3E%3C/svg%3E") no-repeat center / contain;
}

.hc-pass .hc-sad {
  visibility: hidden;
  opacity: 0;
}

.hc-pass .hc-happy {
  visibility: visible;
  opacity: 1;
}

</style>

<!--
Health check transformation. Starts all red — the current reality. Each click heals one line: red X + frustrated condition → green check + aspirational condition. Four-column CSS grid locks all columns in place — no reflow on swap. Requirement column in mono/lavender is the cognitive anchor. Middle dot separator at 20% opacity creates subtle visual channel between keys and values. Title crosses start red, turn white when all checks go green. Last flip: "Worth it for a one-line fix" — the Pringles moment. ~45 seconds.
-->
