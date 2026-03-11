---
layout: cover
color: slate
---

<div class="riddle">
  <div class="riddle-above">
    It grows with headcount.<br/>
    Outlives all migrations.<br/>
    Nobody measures it.<br/>
    Nobody owns it.
  </div>
  <hr class="riddle-line" />
  <div class="riddle-below">Everyone feels it.</div>
</div>

<style>
.riddle {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading, white);
  text-align: left;
}

.riddle-above {
  padding-bottom: var(--aurora-space-4);
}

.riddle-line {
  border: none;
  border-top: 3px solid var(--scheme-accent, var(--aurora-lavender-400));
  width: 100%;
  margin: 0;
}

.riddle-below {
  padding-top: var(--aurora-space-4);
  opacity: 0.85;
}
</style>
