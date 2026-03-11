---
layout: default
color: slate
---

# Thought to Action

<div class="tta">
  <div class="tta-spine"></div>

  <div class="tta-row tta-fast">
    <span class="tta-name">Thought</span>
    <span class="tta-dot"></span>
    <span class="tta-rate">seconds</span>
  </div>
  <div class="tta-row tta-slow-2">
    <span class="tta-name">Consensus</span>
    <span class="tta-dot"></span>
    <span class="tta-rate">hours — days</span>
  </div>
  <div class="tta-row tta-slow-3">
    <span class="tta-name">Procurement</span>
    <span class="tta-dot"></span>
    <span class="tta-rate">days — weeks</span>
  </div>
  <div class="tta-row tta-slow-3">
    <span class="tta-name">Financial</span>
    <span class="tta-dot"></span>
    <span class="tta-rate">days — weeks</span>
  </div>
  <div class="tta-row tta-slow-4">
    <span class="tta-name">Policy</span>
    <span class="tta-dot"></span>
    <span class="tta-rate">weeks — months</span>
  </div>
  <div class="tta-row tta-mid tta-highlight">
    <span class="tta-name">Platform</span>
    <span class="tta-dot"></span>
    <span class="tta-rate">hours — days</span>
  </div>
  <div class="tta-row tta-fast">
    <span class="tta-name">Compute</span>
    <span class="tta-dot"></span>
    <span class="tta-rate">seconds — minutes</span>
  </div>
  <div class="tta-row tta-done">
    <span class="tta-name">Action</span>
    <span class="tta-dot"></span>
    <span class="tta-rate">done</span>
  </div>

</div>

<style>
h1 { text-align: center; }

.tta {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-2);
  margin-top: var(--aurora-space-6);
  padding-inline: var(--aurora-space-8);
}

.tta-spine {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: color-mix(in oklch, var(--scheme-heading) 15%, transparent);
  transform: translateX(-50%);
}

.tta-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--aurora-space-4);
  align-items: center;
  padding: var(--aurora-space-1) 0;
  position: relative;
  z-index: 1;
}

.tta-name {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-semibold);
  color: var(--scheme-heading);
  text-align: end;
}

.tta-dot {
  width: 12px;
  height: 12px;
  border-radius: var(--aurora-radius-full);
  justify-self: center;
  background: var(--_dot-color);
}

.tta-rate {
  font-size: var(--aurora-text-base);
  font-family: var(--aurora-font-mono);
  color: var(--_dot-color);
  font-weight: var(--aurora-font-medium);
}

/* Duration heat: green → yellow → orange → red */
.tta-done  { --_dot-color: var(--aurora-mint-300); }
.tta-fast  { --_dot-color: var(--aurora-mint-400); }
.tta-mid   { --_dot-color: #e2c541; }
.tta-slow-2 { --_dot-color: #e2a832; }
.tta-slow-3 { --_dot-color: #d98032; }
.tta-slow-4 { --_dot-color: #cc5a3a; }

.tta-highlight {
  background: color-mix(in oklch, var(--aurora-mint-400) 8%, transparent);
  border-radius: var(--aurora-radius-md);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  margin-inline: calc(-1 * var(--aurora-space-4));
}

</style>

<!-- The thought-to-action model. Eight layers between an idea and production — each orbiting at a different speed. The vertical spine is the through-line. Most engineering effort optimizes the bottom (faster builds, better CI). Click reveals: most organizational latency lives in the middle — procurement, financial, policy, consensus. The platform layer is the hinge point. ~20 seconds. -->
