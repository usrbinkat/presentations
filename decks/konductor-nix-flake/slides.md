---
theme: slidev-theme-braincraft
addons:
  - slidev-addon-braincraft
  - slidev-addon-excalidraw
title: 'Cloud Taming — A Human Friendly DevOps Experience'
info: |
  How a single source of truth eliminates the invisible tax of environment
  drift, surface fragmentation, and tooling misalignment — across developers,
  platforms, CI, security, and the budget that pays for all of it.
author: Kat Morgan - aka @usrbinkat
keywords: nix,developer-experience,platform-engineering,reproducibility,pki,supply-chain,kubevirt,multi-player
colorSchema: auto
themeConfig:
  qrUrl: https://github.com/usrbinkat
transition: aurora-fade
fonts:
  sans: Inter
  mono: Space Mono
---

---
layout: cover
color: slate
---

<div class="title-card">
  <h1>Cloud Taming</h1>
  <div class="title-sub">A Human Friendly DevOps Experience</div>
  <hr class="title-rule" />
  <div class="title-speaker">Kat Morgan · Tech Lead, Product Innovation · Cisco Security</div>
  <div class="title-meta">SCALE 23x · Ballroom A · Friday, March 6, 2026 · 10:00 – 11:00</div>
</div>

<style>
.title-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  gap: var(--aurora-space-2);
}

.title-card h1 {
  font-size: var(--aurora-text-6xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading, white);
  line-height: 1.1;
  margin: 0;
}

.title-sub {
  font-size: var(--aurora-text-3xl);
  font-weight: var(--aurora-font-medium);
  color: var(--scheme-accent, var(--aurora-lavender-400));
}

.title-rule {
  border: none;
  border-top: 3px solid var(--scheme-accent, var(--aurora-lavender-400));
  width: 100%;
  margin: var(--aurora-space-4) 0;
}

.title-speaker {
  font-size: var(--aurora-text-xl);
  color: var(--scheme-heading, white);
  font-weight: var(--aurora-font-medium);
}

.title-meta {
  font-size: var(--aurora-text-base);
  color: oklch(100% 0 0 / 0.5);
  font-family: var(--aurora-font-mono);
}
</style>

<!--
Title card. Audience orients: who, where, when. ~10 seconds while people settle.
-->

---

src: ../../shared/fragments/riddle.md

---

src: ../../shared/fragments/intro.md

---
layout: default
color: cream
---

<div class="jeopardy-title">

# What is <span class="jeopardy-blank">&nbsp;</span>?

</div>

<hr class="jeopardy-divider" />

<div class="jeopardy-grid">
  <div class="jeopardy-header peach-header">Waste</div>
  <div class="jeopardy-header sky-header">Drift</div>
  <div class="jeopardy-header lavender-header">Uncertainty</div>

  <div v-click="1" class="jeopardy-cell peach">CI Failures</div>
  <div v-click="1" class="jeopardy-cell sky">CI vs "It works on my machine"</div>
  <div v-click="1" class="jeopardy-cell lavender">How many engineers does it take to build it from scratch?</div>

  <div v-click="2" class="jeopardy-cell peach">AI Cost</div>
  <div v-click="2" class="jeopardy-cell sky">Yet Another YAML Engineer</div>
  <div v-click="2" class="jeopardy-cell lavender">How many engineers does it take to debug an outage?</div>

  <div v-click="3" class="jeopardy-cell peach">Educational Cost</div>
  <div v-click="3" class="jeopardy-cell sky">"What are the requirements again?"</div>
  <div v-click="3" class="jeopardy-cell lavender">How many engineers does it take to change a default?</div>
</div>

<style>
.jeopardy-title {
  text-align: center;
  padding-top: var(--aurora-space-4);
}

.jeopardy-title h1 {
  font-size: var(--aurora-text-4xl);
  border-bottom: none;
}

.jeopardy-divider {
  border: none;
  border-top: var(--aurora-border-thin) solid var(--scheme-border);
  margin: var(--aurora-space-3) 0;
}

.jeopardy-blank {
  border-bottom: 3px solid var(--scheme-heading);
  display: inline-block;
  min-width: 6rem;
}

.jeopardy-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: var(--aurora-space-3);
  flex: 1;
  align-content: start;
  padding-top: var(--aurora-space-4);
}

.jeopardy-header {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-bold);
  text-align: center;
  padding-bottom: var(--aurora-space-2);
  color: var(--scheme-heading);
}

.jeopardy-header.peach-header { border-bottom: var(--aurora-border-medium) solid var(--aurora-peach-400); }
.jeopardy-header.sky-header { border-bottom: var(--aurora-border-medium) solid var(--aurora-sky-400); }
.jeopardy-header.lavender-header { border-bottom: var(--aurora-border-medium) solid var(--aurora-lavender-400); }

.jeopardy-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: var(--aurora-text-lg);
  font-weight: var(--aurora-font-medium);
  padding: var(--aurora-space-4) var(--aurora-space-3);
  border-radius: var(--aurora-radius-lg);
  min-height: 4.5rem;
  line-height: var(--aurora-leading-snug);
}

.jeopardy-cell.peach {
  background: oklch(95% 0.04 60);
  border: var(--aurora-border-thin) solid var(--aurora-peach-300);
  color: var(--aurora-slate-700);
}

.jeopardy-cell.sky {
  background: oklch(95% 0.04 220);
  border: var(--aurora-border-thin) solid var(--aurora-sky-300);
  color: var(--aurora-slate-700);
}

.jeopardy-cell.lavender {
  background: oklch(95% 0.04 300);
  border: var(--aurora-border-thin) solid var(--aurora-lavender-300);
  color: var(--aurora-slate-700);
}
</style>

<!--
Jeopardy reveal. The riddle answer isn't one word — it's three dimensions of the same invisible problem. Waste: where the hours and money go. Drift: what diverges without alarms. Uncertainty: questions nobody in the room can answer. Each row lands simultaneously across all three columns so the audience processes the pattern, not individual items. The "how many engineers" escalation in Uncertainty is a lightbulb joke that stops being funny. ~30 seconds across all clicks.
-->

---

src: ../../shared/fragments/riddle.md

---
layout: two-cols
color: cream
layoutClass: flex flex-col justify-center
---

# 180 million developers on GitHub alone.

<v-click>

- 36 million new accounts last year
- 80% use AI coding tools in their first week
- 4 out of 5 contributions happen in private repos
- Less than 1 in 20 repos have a contributor guide

</v-click>

::right::

<div class="relative flex items-center justify-center h-full">
  <img src="/octoverse-2025.png" class="rounded-lg shadow-lg max-h-full max-w-full object-contain" />
  <div class="absolute bottom-0 right-8 source-qr">
    <QRCode url="https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1" :size="120" label="" />
  </div>
</div>

<style>
.source-qr :deep(.qr-wrapper) { gap: 0; }
.source-qr :deep(.qr-label),
.source-qr :deep(.qr-link) { display: none; }
</style>

<!--
Planet scale. 180M+ developers on GitHub (Octoverse 2025). 36.2M new in one year. 80% of new devs use Copilot week 1 — AI agents are developers now. 81.5% private repo contributions = the tax is mostly invisible. Only 5.5% of repos have contributor guides — onboarding is broken at industry scale. ~15 seconds.
-->

---

src: ../../shared/fragments/github-population.md

---

src: ../../shared/fragments/healthcheck.md

---
layout: cover
color: slate
class: cover-full
---

<div class="scale-punch">
  <div class="scale-above">
    Not even 1 million repos clear that bar.
  </div>
  <hr class="scale-line" />
  <div v-click class="scale-below">
    Another 499 million are even further behind.
  </div>
</div>

<style>
.scale-punch {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  height: 100%;
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-snug);
  color: var(--scheme-heading, white);
  text-align: left;
}

.scale-above {
  padding-bottom: var(--aurora-space-4);
}

.scale-line {
  border: none;
  border-top: 3px solid var(--scheme-accent, var(--aurora-lavender-400));
  width: 100%;
  margin: 0;
}

.scale-below {
  padding-top: var(--aurora-space-4);
  opacity: 0.85;
}
</style>

<!--
The math. 5.5% of repos have contributor guides = ~1M repos "doing it right" out of 518M total. The click reveals the scale of the problem they just saw the stats for. Drifting + undocumented + onboarding = maps back to the Jeopardy grid (Drift + Uncertainty + Waste). "Engineers and AI agents" seeds the multi-player arc. ~10 seconds.
-->

---

src: ./thought-to-action.md

---
layout: section
color: slate
transition: aurora-zoom
---

# The {un}Conventional Path

Solve six problems in four steps

<!--
Triple entendre. "Conventional" as in the established norm. "un" in curly braces = Nix expression syntax AND "unconventional." "Path" as in /the/literal/path/. We're about to make a filesystem path carry a LOT of weight. ~5 seconds.
-->

---
layout: default
color: cream
---

<div class="flex flex-col h-full">
<div class="flex-none" style="flex-basis: 35%">

<HeroBlock size="lg">
  <span style="color: var(--scheme-text-secondary); opacity: 0.5">/</span>workspace<span style="color: var(--scheme-text-secondary); opacity: 0.5">/</span><span style="color: var(--scheme-accent); font-style: italic">{user}</span><span style="color: var(--scheme-text-secondary); opacity: 0.5">/</span><span style="color: var(--scheme-accent); font-style: italic">{server}</span><span style="color: var(--scheme-text-secondary); opacity: 0.5">/</span><span style="color: var(--scheme-accent); font-style: italic">{namespace}</span><span style="color: var(--scheme-text-secondary); opacity: 0.5">/</span>
</HeroBlock>
</div>
<div class="flex-1 flex items-start">

<PathSteps :indent="48">
  <div v-click><code>/workspace</code> — a dedicated encrypted volume, not a directory. Derived from the devcontainer convention, evolved for every platform. Separates work from home — <code>/workspace</code> shares safely, <code>/home</code> stays sovereign.</div>
  <div v-click><code>/workspace/usrbinkat</code> — user isolation. Humans, AI agents, CI runners — each gets their own subtree with independent group ownership.</div>
  <div v-click><code>/workspace/usrbinkat/github.com</code> — git server encoded in the path. Repos from 20 servers coexist. Reconstruct any remote from the filesystem.</div>
  <div v-click><code>/workspace/usrbinkat/github.com/containercraft</code> — namespace. The path is objective, predictable, derivable. Collision is structurally impossible.</div>
</PathSteps>

</div>
</div>

<!--
Walk through one segment per click. Each "step" in the staircase is a step on The Conventional Path — the double entendre pays off visually. /workspace is convention evolved from devcontainers. /user separates work from home and allows group sharing. /server means you derive the remote from the path. /namespace means two orgs with a repo called "infra" never collide. ~40 seconds across 4 clicks.
-->

---
layout: default
color: cream
---

# `workspace.git` — one repo to rule them all

<v-click>

```
https://{server}/{namespace}/workspace.git
→ /workspace/{user}/{server}/{namespace}/

├── .envrc                # sets $WORKSPACE_ROOT — every automation keys off this
├── lefthook.yml          # git hooks — shared across all repos in the namespace
├── .mise.toml            # task runner config — same tasks, every repo
├── .prettierrc.yaml      # formatting — one config, not one per repo
├── .config/mise/tasks/   # shared automation scripts
├── k9/                   # the Konductor flake
├── infrastructure/       # Pulumi IaC
└── presentations/        # this slide deck
```

</v-click>

<v-click>

Clone `workspace.git` first. Every repo cloned inside inherits `.envrc`, hooks, task automation,
formatting. Forgejo Actions Runner clones it before the calling repo — so CI runs the same developer
automation without a separate CI-specific copy. One repo is the policy layer for an entire
namespace.

</v-click>

<!--
workspace.git is the special repo name convention. Clone it first at the namespace root. .envrc sets $WORKSPACE_ROOT. lefthook, mise, prettier, all shared config lives here. Every other repo cloned inside inherits it via direnv and path convention. Forgejo Actions Runner clones workspace.git before the triggering repo so CI has the same automation. Not "project-wide tooling" — it's the policy layer for the namespace. ~25 seconds.
-->

---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="./workspace-tree.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Active multi-player. Not independent multi-user — collaborative multi-actor. The workspace convention turns a four-segment path into a security boundary that the operating system enforces. ~20 seconds.
-->

---
layout: statement
color: slate
---

# One root to rule them all.

<div class="root-stage">
  <span v-click class="root-left">/workspace/usrbinkat/github.com/</span>
  <span class="root-center">$WORKSPACE_ROOT</span>
  <div v-click="1" class="root-right">
    <span>/konductor</span>
    <span>/infrastructure</span>
    <span>/frontend</span>
    <span>/backend</span>
  </div>
</div>

<style>
h1 {
  font-size: var(--aurora-text-5xl) !important;
}

h1 + hr {
  border-top-width: 3px !important;
  margin-top: var(--aurora-space-4) !important;
}

.root-stage {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: baseline;
  white-space: nowrap;
  margin-top: var(--aurora-space-12);
}

.root-center {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-accent);
  background: color-mix(in oklch, var(--scheme-accent) 15%, transparent);
  border-radius: var(--aurora-radius-md);
  padding: var(--aurora-space-1) var(--aurora-space-3);
}

.root-left, .root-right {
  position: absolute;
  font-size: var(--aurora-text-lg);
  font-family: var(--aurora-font-mono);
  color: var(--scheme-heading);
  opacity: 0.5;
  top: 50%;
  transform: translateY(-50%);
}

.root-left { right: calc(50% + 15rem); }
.root-right {
  left: calc(50% + 15rem);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--aurora-space-1);
}
</style>

<!--
The Lord of the Rings callback earns a grin. $WORKSPACE_ROOT dominates at center. One click fades in the surrounding path segments small and dim — decorating, not competing. ~8 seconds.
-->

---

src: ./habitat.md

---
layout: section
color: slate
transition: aurora-zoom
---

# Should Not vs. Cannot

What if the architecture made policy convenient?

<!--
"Should Not vs Cannot" — the mnemonic. The question reframes: we don't dismiss policy, we make it effortless. The audience imagines their own org. ~5 seconds.
-->

---
layout: cover
color: slate
class: cover-full
---

<div class="pivot">
  <div class="pivot-label pivot-top">The policy.</div>
  <hr class="pivot-rule" />
  <div class="pivot-quote pivot-policy">Developers <strong>should not</strong> use different linter configs.</div>
  <div class="pivot-arrow">↓</div>
  <div v-click class="pivot-quote pivot-build">Developers <strong>cannot</strong> use different linter configs.</div>
  <hr v-click="1" class="pivot-rule" />
  <div v-click="1" class="pivot-label pivot-bottom">The architecture.</div>
</div>

<style>
.pivot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: var(--aurora-space-5);
}

.pivot-label {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-medium);
  letter-spacing: 0.05em;
}

.pivot-top {
  color: var(--aurora-sky-400);
}

.pivot-bottom {
  color: var(--aurora-mint-400);
}

.pivot-rule {
  border: none;
  border-top: 2px solid oklch(100% 0 0 / 0.2);
  width: 92%;
  margin: 0;
}

.pivot-quote {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  line-height: var(--aurora-leading-snug);
  text-align: center;
  max-width: none;
}

.pivot-policy {
  color: oklch(100% 0 0 / 0.6);
}

.pivot-build {
  color: var(--scheme-heading, white);
}

.pivot-arrow {
  font-size: var(--aurora-text-3xl);
  color: var(--scheme-accent);
  opacity: 0.6;
}

.pivot-quote strong {
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>

<!--
The sandwich. Policy at top (sky, dimmed) — the audience recognizes the familiar failure. One click: "cannot" appears bold below the arrow, bottom rule and conclusion fade in. The visual weight shifts downward — from policy to construction. ~10 seconds.
-->

---
layout: default
color: cream
---

# Confidence. Conformity. Simplicity.

<div class="sc-grid">
  <div class="sc-corner"></div>
  <div class="sc-header sc-policy">Should Not <span class="sc-dim">(policy)</span></div>
  <div class="sc-header sc-build">Cannot <span class="sc-dim">(construction)</span></div>

  <div class="sc-actor">Junior</div>
  <div class="sc-cell sc-policy">ship inconsistent formatting</div>
  <div v-click="1" class="sc-cell sc-build">the formatter binary IS the config</div>

  <div class="sc-actor">Senior</div>
  <div class="sc-cell sc-policy">maintain separate configs per team</div>
  <div v-click="1" class="sc-cell sc-build">one sealed source, consumed everywhere</div>

  <div class="sc-actor">Agent</div>
  <div class="sc-cell sc-policy">use different tool versions</div>
  <div v-click="1" class="sc-cell sc-build">same sealed binaries in every <code>$PATH</code></div>

  <div class="sc-actor">Runner</div>
  <div class="sc-cell sc-policy">drift from developer environments</div>
  <div v-click="1" class="sc-cell sc-build">same Nix expression as every developer</div>
</div>

<style>
h1 { text-align: center; }

.sc-grid {
  display: grid;
  grid-template-columns: 8rem 1fr 1fr;
  gap: var(--aurora-space-3) var(--aurora-space-4);
  align-items: center;
  margin-top: var(--aurora-space-4);
}

.sc-corner { /* empty top-left cell */ }

.sc-header {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding-bottom: var(--aurora-space-2);
  border-bottom: var(--aurora-border-medium) solid;
}

.sc-header.sc-policy { border-color: var(--aurora-sky-400); }
.sc-header.sc-build { border-color: var(--aurora-mint-400); }

.sc-dim { opacity: 0.5; font-weight: var(--aurora-font-medium); }

.sc-actor {
  font-size: var(--aurora-text-base);
  font-weight: var(--aurora-font-semibold);
  color: var(--scheme-heading);
  font-family: var(--aurora-font-mono);
}

.sc-cell {
  font-size: var(--aurora-text-lg);
  padding: var(--aurora-space-2) var(--aurora-space-3);
  border-radius: var(--aurora-radius-md);
  line-height: var(--aurora-leading-snug);
}

.sc-cell.sc-policy {
  background: color-mix(in oklch, var(--aurora-sky-200) 60%, transparent);
  color: var(--scheme-heading);
}

.sc-cell.sc-build {
  background: color-mix(in oklch, var(--aurora-mint-200) 60%, transparent);
  color: var(--scheme-heading);
}

.sc-cell code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  font-weight: var(--aurora-font-semibold);
  background: transparent !important;
  padding: 0 !important;
  color: var(--scheme-heading);
}
</style>

<!--
All four actors in one grid. The "should not" column is visible immediately — the audience recognizes their own org. One click reveals the entire "cannot" column. The visual shift from sky to mint IS the argument. No marathon. ~15 seconds.
-->

---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="./wrapper-anatomy.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Show the anatomy. The config lives alongside the nix file as a real dotfile — not generated, not abstracted. You develop and test it like any config. The wrapper just seals it. Architecture all the way down to the minutia. And the reach: every editor and AI tool that calls these gets the sealed version automatically. ~25 seconds.
-->

---
layout: statement
color: lavender
---

# Editors are orthogonal to guarantees.

Pick vscode, vim, cursor, windsurf, zed. The habitat guarantees consistency.

<!--
The debate becomes preference, not risk. Everyone in the room has an editor opinion. This slide resolves the tension: your preference is yours, the guarantee is structural. ~8 seconds.
-->

---
layout: section
color: slate
transition: aurora-zoom
---

# One expression — macOS, Linux, containers, VMs, cloud images, CI

What happens when adding a deployment target is just another output?

<!--
The list in the title IS the anxiety — every one of those is a surface someone maintains separately. The subtitle reframes: they're all outputs of one expression. ~5 seconds.
-->

---
layout: fact
color: cream
---

# 1 source

macOS · Linux · WSL · OCI containers · KubeVirt VMs · AWS AMI · Azure VHD · OpenStack · bare metal
NixOS · CI runners · devcontainers · testcontainers · agentcontainers

<template #context> One Nix expression. Every surface inherits the same sealed configs, versions,
and PKI trust chain. </template>

<!--
ICONIC. "1 source" dominates. Below the fold: the dizzying list. The anxiety of that list is the point — every one of those is a surface someone maintains separately today. The simplicity of "1 source" above is the resolution. Let the contrast do the work. ~10 seconds.
-->

---
layout: default
color: slate
---

# Adding a surface is adding a line

<div class="surface-wrap">

```nix
# flake.nix — outputs
packages.x86_64-linux.devshell   = ...;  # nix develop
packages.x86_64-linux.container  = ...;  # OCI image
packages.x86_64-linux.vm         = ...;  # KubeVirt / QEMU
packages.x86_64-linux.iso        = ...;  # bare metal installer
packages.x86_64-linux.ami        = ...;  # AWS machine image
packages.x86_64-darwin.devshell  = ...;  # macOS — same expression
```

</div>

Every line inherits `versions.nix` and sealed wrappers.

<style>
h1 { text-align: center; }

p {
  text-align: center;
  font-size: var(--aurora-text-2xl);
  color: var(--scheme-heading);
  margin-top: var(--aurora-space-4);
}

.surface-wrap {
  display: flex;
  justify-content: center;
  margin: var(--aurora-space-6) auto;
}

.surface-wrap :deep(.shiki),
.surface-wrap :deep(.shiki code),
.surface-wrap :deep(.shiki span),
.surface-wrap :deep(.shiki .line),
.surface-wrap :deep(pre),
.surface-wrap :deep(code) {
  font-size: 1.6rem !important;
  line-height: 2 !important;
}
</style>

<!--
The receipt. Technical audience sees real Nix outputs — this is how it works. Business audience counts: six targets, one file, no parallel maintenance. Every output inherits everything. ~15 seconds.
-->

---
layout: default
color: slate
---

# Fork. Patch. Deploy.

<div class="fpd">
  <div class="fpd-spine">
    <span class="fpd-step fpd-s4">Fork</span>
    <span class="fpd-arrow">→</span>
    <span class="fpd-step fpd-s3">Patch</span>
    <span class="fpd-arrow">→</span>
    <span class="fpd-step fpd-s2">Deploy</span>
    <span class="fpd-arrow">→</span>
    <span class="fpd-step fpd-s1">Validate</span>
  </div>

  <div class="fpd-code">

```nix
forgejo-runner-src.url = "git+https://git.braincraft.io/BrainCraft/runner";
```

  </div>

  <div v-click class="fpd-fan">
    <div class="fpd-path fpd-mint">
      <span class="fpd-path-arrow">↗</span>
      <span>PR upstream with production evidence</span>
    </div>
    <div class="fpd-path fpd-sky">
      <span class="fpd-path-arrow">→</span>
      <span>Maintain independently under license or market shift</span>
    </div>
    <div class="fpd-path fpd-lavender">
      <span class="fpd-path-arrow">↘</span>
      <span>Adopt an alternate upstream</span>
    </div>
  </div>
</div>

<style>
h1 { text-align: center; }

.fpd {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-5);
  margin-top: var(--aurora-space-4);
}

.fpd-spine {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-3);
}

.fpd-step {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  background: color-mix(in oklch, var(--scheme-heading) 10%, transparent);
  border-radius: var(--aurora-radius-md);
}

/* Duration heat — matches thought-to-action palette */
.fpd-s4 { color: #cc5a3a; border: 2px solid #cc5a3a; background: color-mix(in oklch, #cc5a3a 12%, transparent); }
.fpd-s3 { color: #d98032; border: 2px solid #d98032; background: color-mix(in oklch, #d98032 12%, transparent); }
.fpd-s2 { color: #e2a832; border: 2px solid #e2a832; background: color-mix(in oklch, #e2a832 12%, transparent); }
.fpd-s1 { color: var(--aurora-mint-300); border: 2px solid var(--aurora-mint-400); background: color-mix(in oklch, var(--aurora-mint-400) 15%, transparent); }

.fpd-arrow {
  font-size: var(--aurora-text-2xl);
  color: var(--scheme-text-secondary);
}

.fpd-code {
  width: 100%;
  display: flex;
  justify-content: center;
}

.fpd-code :deep(.shiki),
.fpd-code :deep(.shiki code),
.fpd-code :deep(.shiki span),
.fpd-code :deep(.shiki .line),
.fpd-code :deep(pre),
.fpd-code :deep(code) {
  font-size: 1.5rem !important;
  line-height: 1.8 !important;
}

.fpd-fan {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-3);
  width: 100%;
  padding-inline-start: var(--aurora-space-8);
}

.fpd-path {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-3);
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-medium);
  padding: var(--aurora-space-2) var(--aurora-space-4);
  border-radius: var(--aurora-radius-md);
}

.fpd-path-arrow {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-bold);
  flex-shrink: 0;
}

.fpd-mint {
  color: var(--aurora-mint-300);
  background: color-mix(in oklch, var(--aurora-mint-400) 10%, transparent);
}

.fpd-sky {
  color: var(--aurora-sky-300);
  background: color-mix(in oklch, var(--aurora-sky-400) 10%, transparent);
}

.fpd-lavender {
  color: var(--aurora-lavender-300);
  background: color-mix(in oklch, var(--aurora-lavender-400) 10%, transparent);
}
</style>

<!--
The fork is the standard posture, not the emergency exit. Fork, patch, deploy, validate — every path starts the same. After validation, three outcomes: PR upstream with battle-tested evidence (healthy contributor), maintain independently (license change, vendor durress), or adopt alternate upstream entirely. The capability is the same. The decision is yours. ~20 seconds.
-->

---
layout: section
color: slate
transition: aurora-zoom
---

# The System That Proves Its Own Lineage

Does your supply chain do your audit for you?

<!--
Self-attested sovereign software supply chain. This section is about provenance that doesn't require a separate tool, a separate process, or a separate team. The system carries its own proof. ~5 seconds.
-->

---
layout: statement
color: lavender
---

# Intent. Guarantee. Outcome. — Three artifacts that prove your entire supply chain.

<!--
The triad. Each word becomes a slide. ~5 seconds.
-->

---
layout: full
color: cream
---

# Intent: `flake.nix` declares what you will build. `flake.lock` pins it.

<CodeComparison beforeLabel="flake.nix — the declaration" afterLabel="flake.lock — the pin">

```nix
# ${WORKSPACE_ROOT}/konductor/flake.nix
inputs = {
  nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";
  rust-overlay.url = "github:oxalica/rust-overlay";
  nixvim.url = "github:nix-community/nixvim";
  home-manager.url = "github:nix-community/home-manager";
  forgejo-runner-src.url =
    "git+https://git.braincraft.io/BrainCraft/runner";
  # ... 14 inputs total
};
```

<template #after>

```json
"nixpkgs": {
  "locked": {
    "lastModified": 1739020877,
    "narHash": "sha256-KG+Vsma...",
    "rev": "2b0b0e4bde8...",
    "type": "github"
  }
}
```

Every input → exact git commit. Not a version range. Not `latest`. An SBOM generated automatically,
always current.

</template>

</CodeComparison>

<!--
Side by side: declaration → pin. flake.nix says "I want nixpkgs from the 25.11 branch." flake.lock says "specifically commit 2b0b0e4, last modified Jan 2025, with this exact content hash." The lock file IS your software bill of materials. ~20 seconds.
-->

---
layout: full
color: cream
---

# Guarantee: `versions.nix` starts simple and grows with your ambition

````md magic-move {lines: true}
```nix
# ${WORKSPACE_ROOT}/konductor/src/lib/versions.nix — start with languages
{
  python = { version = "313"; };
  go = { version = "1_24"; };
  node = { version = "22"; };
  rust = { version = "1.92.0"; };
}
```

```nix
# Add platform targets
{
  python = { version = "313"; };
  go = { version = "1_24"; };
  node = { version = "22"; };
  rust = { version = "1.92.0"; };

  nixos.channel = "25.11";
  talos = { version = "v1.12.1"; };
  kubernetes = { version = "1.35.0"; };
}
```

```nix
# Add operational metadata — one file, total control
{
  python = { version = "313"; };
  go = { version = "1_24"; };
  node = { version = "22"; };
  rust = { version = "1.92.0"; };

  nixos.channel = "25.11";
  talos = { version = "v1.12.1"; };
  kubernetes = { version = "1.35.0"; };

  konductor = {
    strict = true;           # require runner-built images for merge
    channel = "stable";
  };
}
```
````

<style>
:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(.shiki-magic-move),
:deep(.shiki-magic-move pre),
:deep(.shiki-magic-move code),
:deep(.shiki-magic-move span) {
  font-size: 1.1rem !important;
  line-height: 1.7 !important;
}
</style>

<!--
One diff here propagates to every devshell, container, VM, and CI pipeline. No surface left behind. Magic Move: versions.nix grows. Languages first — reasonable. Platform targets — ambitious. Operational metadata with strict mode — surprising. Each click raises the stakes. The file starts as version pins and evolves into a policy declaration. ~25 seconds across 3 transitions.
-->

---
layout: default
color: slate
---

# Outcome: the system fingerprints itself on every build

<div class="outcome-wrap">

```bash
$ cat /.konductor
[konductor]
git_commit = "4f21dffddc834e59762512a0a9f2e2851a83eb84"
git_branch = "main"
git_remote = "https://git.braincraft.io/braincraft/k9.git"
git_dirty = 1
nix_hash = "sha256-IQ6D+z+7z37/0AWTtLmr2uPqP/+60Pa/suqx/7eFd80="
nix_drv = "hay6qbgyqvlbm17c3cjvfjw81imkar09"
flake_lock_sha256 = "553ce52ed33d38286cd0e1d16f5f458c..."
build_date = "2026-03-05T23:12:50-08:00"
build_host = "mithril"
build_user = "usrbinkat"
build_hw_vendor = "Dell Inc."
build_hw_product = "Precision 7750"
build_hw_serial = "9QV6573"
strict = false
oci_image = "registry.docker.arpa/containercraft/konductor"
oci_tags = ["latest-qcow2", "qcow2-dirty",
  "qcow2-hay6qbgyqvlbm17c3cjvfjw81imkar09",
  "qcow2-553ce52ed33d38286cd0e1d16f5f458c308267acd1c4492ab32209aeec6aa502"]
```

</div>

The moment your shell loads, you know the environment, the provenance, and the source. Certainty is
the default behavior.

<style>
h1 { text-align: center; }
p { text-align: center; }

.outcome-wrap {
  display: flex;
  justify-content: center;
}

.outcome-wrap :deep(.shiki),
.outcome-wrap :deep(.shiki code),
.outcome-wrap :deep(.shiki span),
.outcome-wrap :deep(.shiki .line),
.outcome-wrap :deep(pre),
.outcome-wrap :deep(code),
:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 1.0rem !important;
  line-height: 1.5 !important;
}
</style>

<!--
Real output from a live Konductor VM. SSH in and the MOTD shows the Nix derivation hash and git commit immediately. cat /.konductor gives you everything: commit, branch, remote, dirty state, nix hash, derivation path, flake lock hash, build metadata, strict mode. The system tells you what it is, who built it, and whether it's promotion-ready. SOC 2, DOD, HIPAA, ITAR — this is what assessors need. ~25 seconds.
-->

---
layout: default
color: slate
---

# The same provenance, inside the certificate

<div class="outcome-wrap">

```bash
VM wildcard cert: /etc/konductor/pki/vm/wildcard.crt
· Subject: CN=*.konductor.arpa,OU=Infrastructure,O=Konductor
· Key:     EC secp256r1 (256-bit)
· DNS:     *.konductor.arpa, *.docker.konductor.arpa
· URI:     https://git.braincraft.io/braincraft/k9.git
· URI:     nix:drv:hay6qbgyqvlbm17c3cjvfjw81imkar09
· URI:     nix:hash:sha256-IQ6D+z+7z37/0AWTtLmr2uPqP/+60Pa/suqx/7eFd80=
· gitCommit: 4f21dffddc834e59762512a0a9f2e2851a83eb84
· nixDrv:    hay6qbgyqvlbm17c3cjvfjw81imkar09
· buildDate: 2026-03-05T23:12:50-08:00
· buildUser: usrbinkat@mithril
· buildHw:   Dell Inc. Precision 7750
· trustTier: self-signed
```

</div>

Same provenance from `/.konductor`, enriched and embedded in the cryptographic material. Every
certificate carries its own proof of lineage.

<style>
h1 { text-align: center; }
p { text-align: center; }

.outcome-wrap {
  display: flex;
  justify-content: center;
}

.outcome-wrap :deep(.shiki),
.outcome-wrap :deep(.shiki code),
.outcome-wrap :deep(.shiki span),
.outcome-wrap :deep(.shiki .line),
.outcome-wrap :deep(pre),
.outcome-wrap :deep(code),
:deep(.shiki),
:deep(.shiki code),
:deep(.shiki span),
:deep(.shiki .line),
:deep(pre),
:deep(code) {
  font-size: 1.2rem !important;
  line-height: 1.6 !important;
}
</style>

<!--
Same provenance data from /.konductor now lives inside the wildcard TLS certificate as URI SANs and custom extensions. The git commit, nix derivation, build hardware — all embedded in the crypto. Every TLS handshake carries provenance. The audience sees the progression: fingerprint → certificate → same hashes, enriched. ~20 seconds.
-->

---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="./pki-trust-chain.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
The trust chain diagram is the teaching slide. Hypervisor → VM → service. Provenance at every level. If the chain breaks, the system screams. Then the practical payoff: six env vars, total TLS coverage, no manual cert management. ~25 seconds.
-->

---
layout: default
color: slate
---

# Build log attestation

```bash
$ runme run build:all
═══════════════════════════════════════════════════════════════
  build:all — Full QCOW2 + OCI Build Pipeline
═══════════════════════════════════════════════════════════════
  Target: registry.docker.arpa/containercraft/konductor:latest-qcow2

▶ build:preflight...
  Host: Precision 7750          CPU: i7-10875H (16) @ 5.10 GHz
  Memory: 25.31 GiB / 125.31 GiB    GPU: Quadro RTX 5000
  Disk: 762.39 GiB / 1.82 TiB       TPM: 2.0
  ✓ WORKSPACE_ROOT=/workspace/usrbinkat/git.braincraft.io/braincraft/k9

  nix:    nix (Lix, like Nix) 2.93.0
  qemu:   QEMU emulator version 10.1.2
  docker: Docker version 28.5.2
```

Intent (`flake.lock`) + Guarantee (`versions.nix`) + Outcome (`/.konductor` + PKI + `build-vm.log`).
17,000+ lines of serial console captured as `build-vm.log`, shipped inside the OCI `FROM scratch`
image. The build pipeline attests itself.

<!--
The third artifact completes the triad. build-vm.log records WHO built it, ON WHAT hardware, WHEN. Combined with flake.lock (what was declared) and /.konductor (what shipped), you have a complete provenance chain. The system does its own audit. ~20 seconds.
-->

---

src: ./durable-computing.md

---
layout: default
color: slate
---

# The browser is just one way in

<div class="browser-sandwich">
  <img src="/konductor-in-browser.jpg" class="browser-screenshot" />
  <hr class="browser-rule" />
  <div class="browser-access">Browser IDE · Browser terminal · SSH · SSH + remote IDE (vscode, zed)</div>
</div>

<style>
h1 { text-align: center; }

.browser-sandwich {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-4);
  margin-top: var(--aurora-space-4);
  flex: 1;
  min-height: 0;
}

.browser-screenshot {
  max-height: 75%;
  max-width: 90%;
  object-fit: contain;
  border-radius: var(--aurora-radius-md);
  border: 1px solid oklch(100% 0 0 / 0.15);
}

.browser-rule {
  border: none;
  border-top: 3px solid var(--scheme-accent, var(--aurora-lavender-400));
  width: 90%;
  margin: 0;
}

.browser-access {
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading, white);
  text-align: center;
  white-space: nowrap;
}
</style>

<!--
Screenshot sandwich. The browser screenshot proves it works. The rule line below separates. The access methods line shows four ways in — browser is just one. ~10 seconds.
-->

---
layout: statement
color: lavender
---

# Your development environment runs inside Kubernetes. `go build` deploys to the cluster you're sitting in.

<!--
The KubeVirt VM is a pod. Services built inside it are live on the cluster — Kubernetes detects them with standard primitives. Production-like development, multi-player, no simulation. ~8 seconds.
-->

---
layout: default
color: cream
---

<div class="hub-header">
  <div class="hub-title-stack">
    <div class="hub-above" :class="{ 'hub-hidden': $clicks >= 1 }">Human</div>
    <div class="hub-above" :class="{ 'hub-hidden': $clicks < 1 || $clicks >= 2 }">Human <span class="hub-sep">+</span> CI</div>
    <div class="hub-above" :class="{ 'hub-hidden': $clicks < 2 }">Human <span class="hub-sep">+</span> CI <span class="hub-sep">+</span> AI</div>
  </div>
  <hr class="hub-line" />
  <div class="hub-below">Hub</div>
</div>

<div class="hub-body">
<div class="hub-tree-stack">
  <div class="hub-tree" :class="{ 'hub-hidden': $clicks >= 1 }">

```
/workspace
├── usrbinkat
│   ├── github.com/tokio-rs/tokio
│   ├── github.com/pop-os/cosmic-comp
│   └── git.braincraft.io/braincraft/k9
└── jdoe
    └── git.braincraft.io/braincraft/k9
```

  </div>
  <div class="hub-tree" :class="{ 'hub-hidden': $clicks < 1 || $clicks >= 2 }">

```
/workspace
├── usrbinkat
│   ├── github.com/tokio-rs/tokio
│   ├── github.com/pop-os/cosmic-comp
│   └── git.braincraft.io/braincraft/k9
├── jdoe
│   └── git.braincraft.io/braincraft/k9
└── runner
    ├── a3f8b1/git.braincraft.io/braincraft/k9
    └── c7d2e4/github.com/containercraft/konductor
```

  </div>
  <div class="hub-tree" :class="{ 'hub-hidden': $clicks < 2 }">

```
/workspace
├── usrbinkat
│   ├── github.com/tokio-rs/tokio
│   ├── github.com/pop-os/cosmic-comp
│   └── git.braincraft.io/braincraft/k9
├── jdoe
│   └── git.braincraft.io/braincraft/k9
├── runner
│   ├── a3f8b1/git.braincraft.io/braincraft/k9
│   └── c7d2e4/github.com/containercraft/konductor
├── claude
│   ├── d4e5f6/git.braincraft.io/braincraft/k9
│   └── g7h8i9/github.com/containercraft/konductor
└── codex
    └── j1k2l3/git.braincraft.io/braincraft/infrastructure
```

  </div>
</div>
<div class="hub-cards">
  <div class="hub-card">
    <div class="hub-card-label">Collaboration</div>
    <div class="hub-card-body">Live, active, same VM</div>
    <div class="hub-card-detail">Isolated subtrees via <code>uid:gid</code></div>
  </div>
  <div class="hub-card" :class="{ 'hub-hidden': $clicks < 1 }">
    <div class="hub-card-label">Pre-prod CI</div>
    <div class="hub-card-body">Same box as the developer</div>
    <div class="hub-card-detail">Same flake · same VM · failures are rare</div>
  </div>
  <div class="hub-card" :class="{ 'hub-hidden': $clicks < 2 }">
    <div class="hub-card-label">Agentic</div>
    <div class="hub-card-body">Each session gets a job ID</div>
    <div class="hub-card-detail">Parallel work · zero collisions</div>
  </div>
</div>
</div>
<div v-click="2" class="hidden"></div>

<style>
.hub-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--aurora-space-1);
  padding-bottom: var(--aurora-space-2);
}

.hub-title-stack {
  display: grid;
}

.hub-title-stack > * {
  grid-column: 1;
  grid-row: 1;
}

.hub-above {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  text-align: center;
  white-space: nowrap;
  transition: opacity var(--aurora-duration-normal) var(--aurora-ease-out);
}

.hub-sep {
  color: var(--scheme-accent, var(--aurora-lavender-400));
  font-weight: var(--aurora-font-medium);
}

.hub-line {
  border: none;
  border-top: 3px solid var(--scheme-accent, var(--aurora-lavender-400));
  margin: 0;
  width: 100%;
}

.hub-below {
  font-size: var(--aurora-text-4xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  text-align: center;
}

.hub-body {
  display: flex;
  gap: var(--aurora-space-6);
  flex: 1;
  min-height: 0;
  align-items: flex-start;
}

.hub-tree-stack {
  display: grid;
  flex: 1;
  min-width: 0;
  align-self: center;
}

.hub-tree-stack > * {
  grid-column: 1;
  grid-row: 1;
}

.hub-tree {
  transition: opacity var(--aurora-duration-normal) var(--aurora-ease-out);
}

.hub-cards {
  flex: 0 0 38%;
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-3);
  align-self: center;
  min-width: 0;
}

.hub-card {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
  padding: var(--aurora-space-3) var(--aurora-space-4);
  background: color-mix(in oklch, var(--scheme-accent, var(--aurora-lavender-400)) 8%, transparent);
  border-inline-start: 3px solid var(--scheme-accent, var(--aurora-lavender-400));
  border-radius: var(--aurora-radius-md);
  transition: opacity var(--aurora-duration-normal) var(--aurora-ease-out);
}

.hub-card-label {
  font-size: var(--aurora-text-xs);
  font-weight: var(--aurora-font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--scheme-accent, var(--aurora-lavender-400));
}

.hub-card-body {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading);
  line-height: var(--aurora-leading-snug);
}

.hub-card-detail {
  font-size: var(--aurora-text-base);
  color: var(--scheme-text-secondary);
  line-height: var(--aurora-leading-relaxed);
}

.hub-card-detail code {
  font-family: var(--aurora-font-mono);
  font-size: var(--aurora-text-sm);
  color: var(--scheme-heading);
}

.hub-hidden {
  opacity: 0;
  visibility: hidden;
}
</style>

<!--
Human + CI + AI above the fold line, Hub below it — the title IS the math-problem pattern. Click 1: three bullets build the argument. Click 2: the tree with real repos proves it. Seeds the multi-player diagram on the next slide. ~20 seconds across 2 clicks.
-->

---
layout: full
color: cream
class: force-light
---

<Excalidraw drawFilePath="./multiplayer-platform.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
Active multi-player. Shared VM, isolated workspaces. The workspace convention provides the isolation. Pulumi manages the user lifecycle. OIDC handles auth. ~20 seconds.
-->

---
layout: two-cols-title
color: cream
columns: 1fr 1fr
leftColor: lavender
rightColor: sky
---

# Access and security

::left::

### Access surfaces

- **Local**: `nix develop` on a laptop
- **SSH**: direct to the KubeVirt VM
- **Browser**: ttyd / VS Code via Envoy Gateway

Each surface consumes the same Nix expression, PKI trust chain, and workspace convention.

::right::

### `/workspace/{user}/` encryption

```
macOS    — APFS FileVault
Linux    — dm-crypt / LUKS
Windows  — BitLocker
KubeVirt — Rook Ceph RBD
```

Login unlocks. Logout locks. The volume persists, the keys do not.

STIG, FedRAMP, HIPAA, ITAR, SOC 2.

<!--
Two-column: left is how you get in, right is how data stays safe. Ingress surfaces all consume the same sealed environment. Encryption is per-user, per-volume, across every platform. The compliance list speaks for itself. ~20 seconds.
-->

---
layout: two-cols-title
color: cream
columns: 1fr 1fr
leftColor: lavender
rightColor: sky
---

# Shared experience. Structural alignment.

::left::

### Shared experience

- `workspace.git` and individual repos can be independently public or private
- Internal and external contributors share the same workspace convention
- Sealed tooling means consistency by default

Public and private multi-root repos coexist. Common experience for everyone.

::right::

### Alignment

- Every role inherits the same sealed configs
- Coordination headcount redirects to building
- Drift between teams, CI, and contributors: gone as a category

Structural property. Zero maintenance.

<!--
Two concerns, one slide. Left: the experience is shared even when the code isn't — public workspace.git, private repos, sealed tooling carries over. Right: alignment is structural, not staffed — no coordination headcount, no drift between boundaries. ~20 seconds.
-->

---

src: ./scale-inflections.md

---
layout: section
color: slate
transition: aurora-zoom
---

# The Ouroboros

The platform that develops, tests, and deploys itself — using itself

<!--
~5 seconds.
-->

---
layout: statement
color: lavender
---

# We develop Konductor inside Konductor. We deploy Kubernetes inside Konductor. We test Konductor on that Kubernetes. All on bare metal Kubernetes deployed by Konductor.

<!--
Four sentences, each nesting deeper. The brain twist is intentional. Let the audience sit with it. ~10 seconds.
-->

---
layout: full
color: cream
class: force-light
---

# The recursive platform loop

<Excalidraw drawFilePath="./ouroboros.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />

<!--
The loop is closed. CI runner IS Konductor, tests Konductor on K8s-in-K8s inside Konductor on bare metal K8s. What CI tests and what production runs aren't two things kept in sync — they're one Nix expression on different surfaces. Developers in Loop 3 edit in Loop 1 — the ouroboros. ~25 seconds.
-->

---
layout: default
color: cream
---

# The source ships with the VM

```bash
ssh -p 2222 usrbinkat@konductor-vm
cd /opt/konductor/src
vim src/lib/versions.nix
sudo nixos-rebuild switch --flake .#konductor
# Running system reconfigures: new packages, new configs. No reboot.
```

`nixos-rebuild switch` — edit, switch, verify. The same expression that builds the golden image
manages the live system.

<!--
The live rebuild. One technical receipt. This is here because it proves the ouroboros: the same expression BUILDS and MANAGES every surface. The practical impact: the platform evolves without downtime, without reimaging, without redeployment. ~20 seconds.
-->

---
layout: section
color: slate
transition: aurora-zoom
---

# Before and After

<img src="/raptors.jpeg" class="raptors" />

<style>
.raptors {
  height: 400px;
  object-fit: contain;
  border-radius: var(--aurora-radius-md);
  margin: var(--aurora-space-4) auto 0;
  display: block;
}
</style>

<!--
Raptors. The audience laughs. Then we show them what they're living with. ~5 seconds.
-->

---
layout: two-cols-title
color: cream
columns: 1fr 1fr
leftColor: sky
rightColor: lavender
---

# Before and after

::left::

### Chaos

- "It works on my machine" (every CI failure)
- N teams × M surfaces × P tools to maintain
- Onboarding: days per hire, stale wikis
- PKI: manual, fragile, assembled after the fact
- "What version are you on?"

::right::

### Convention

- `nix develop` (same sealed environment everywhere)
- One expression, M outputs, add a line
- Onboarding: clone workspace.git, done
- PKI: generated at build, provenance embedded
- `cat /.konductor` (the system tells you)

<!--
Before/after callbacks. Left column: phrases every engineer has said or heard. Right column: the specific mechanism from the talk that eliminates it. Each pair maps to an arc they walked through. ~15 seconds.
-->

---

src: ../../shared/fragments/riddle.md

---
layout: statement
color: slate
---

<div class="closer">
  <div class="closer-left">
    <span>Waste</span>
    <hr class="closer-sep" />
    <span>Drift</span>
    <hr class="closer-sep" />
    <span>Uncertainty</span>
  </div>
  <div class="closer-right">
    <span>Convenient</span>
    <hr class="closer-sep" />
    <span>Consistent</span>
    <hr class="closer-sep" />
    <span>Confident</span>
  </div>
</div>

<style>
.closer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: var(--aurora-space-12);
}

.closer-left, .closer-right {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-12);
}

.closer-left span {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  color: oklch(100% 0 0 / 0.15);
  text-decoration: line-through;
  text-decoration-thickness: 3px;
  line-height: 1.1;
}

.closer-sep {
  border: none;
  border-top: 1px solid oklch(100% 0 0 / 0.08);
  width: 100%;
  margin: 0;
}

.closer-right span {
  font-size: var(--aurora-text-5xl);
  font-weight: var(--aurora-font-bold);
  color: var(--scheme-heading, white);
  line-height: 1.1;
}
</style>

<!--
The closer. Two columns: left is the ghost of what was (Waste, Drift, Uncertainty at 15% opacity, struck through), right is what replaced it (Convenient, Consistent, Confident at full weight). No title needed. The visual contrast IS the statement. ~8 seconds.
-->

---
layout: default
color: slate
---

# `nix develop`

### One command. Same tools on every surface.

<div class="cta-wrap">

```bash
gh repo clone braincraftio/konductor \
  /workspace/${USER}/github.com/braincraftio/konductor

cd /workspace/${USER}/github.com/braincraftio/konductor
nix develop
```

</div>

<style>
h1, h3 { text-align: center; }

.cta-wrap {
  display: flex;
  justify-content: center;
  margin: var(--aurora-space-6) auto;
}

.cta-wrap :deep(.shiki),
.cta-wrap :deep(.shiki code),
.cta-wrap :deep(.shiki span),
.cta-wrap :deep(.shiki .line),
.cta-wrap :deep(pre),
.cta-wrap :deep(code) {
  font-size: 1.6rem !important;
  line-height: 2 !important;
}
</style>

<!--
CTA. Open source. Fork it. Clone into your workspace path. nix develop. QR codes are on the closing slide. ~15 seconds.
-->

---

src: ../../shared/fragments/thanks.md
