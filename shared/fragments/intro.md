---
layout: presenter
color: cream
imageSrc: /shared/speakers/speaker-kat-morgan.jpg
---

<div class="intro">
  <div class="intro-name">Kat Morgan</div>
  <div class="intro-handle">@usrbinkat</div>
  <div class="intro-tagline">Educator · Innovator · Advocate</div>

  <hr class="intro-rule" />

  <div class="intro-section">
    <div class="intro-label">Experience</div>
    <div class="intro-detail">10+ years across Dell, Canonical, Red Hat, Kong, Pulumi, NASA, Microsoft, Cisco</div>
  </div>

  <div class="intro-section">
    <div class="intro-label">Projects</div>
    <div class="intro-detail">ContainerCraft · BrainCraft · OpenSovreign · ScopeCreap</div>
  </div>

  <div class="intro-links">
    <a href="https://github.com/usrbinkat" target="_blank">github.com/usrbinkat</a>
    <a href="https://linkedin.com/in/usrbinkat" target="_blank">linkedin.com/in/usrbinkat</a>
  </div>
</div>

<style>
.intro {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: var(--aurora-space-2);
}

.intro-name {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  line-height: 1.1;
}

.intro-handle {
  font-size: var(--aurora-text-lg);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-accent);
}

.intro-tagline {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-medium);
  color: var(--scheme-text-secondary);
  padding-top: var(--aurora-space-1);
}

.intro-rule {
  border: none;
  border-top: 2px solid color-mix(in oklch, var(--scheme-accent) 30%, transparent);
  margin: var(--aurora-space-4) 0;
}

.intro-section {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
  padding-bottom: var(--aurora-space-2);
}

.intro-label {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-medium);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--scheme-accent);
}

.intro-detail {
  font-size: var(--aurora-text-base);
  color: var(--scheme-text);
  line-height: var(--aurora-leading-relaxed);
}

.intro-links {
  display: flex;
  gap: var(--aurora-space-6);
  padding-top: var(--aurora-space-2);
}

.intro-links a {
  font-size: var(--aurora-text-sm);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color var(--aurora-duration-fast) var(--aurora-ease-out);
}

.intro-links a:hover {
  border-bottom-color: currentColor;
}
</style>

<!--
Speaker intro. No boilerplate component — hand-crafted for this talk. The photo carries the human connection. The right side is sparse and scannable: name, handle, tagline, experience, projects, links. The audience gets who you are in 5 seconds. ~10 seconds spoken.
-->
