# Konductor Nix Flake — Presentation Outline

Target: 35 slides across 8 sections

---

## Section 1: The Problem (4 slides)

### Slide 1 — Cover

- **Title:** Konductor: Reproducible Developer Environments with Nix Flakes
- **Layout:** cover
- **Content:** Speaker name, event, date
- **Notes:** Welcome, introduce yourself. This talk is about eliminating "works on my machine" forever.

### Slide 2 — "It works on my machine" costs real money

- **Layout:** default
- **Content:** 3 bullets on onboarding time, incident debugging, environment drift
- **Notes:** Ask the audience — how many hours did your last new hire spend setting up their dev environment? The answer is always too many.

### Slide 3 — Environment entropy has four root causes

- **Layout:** two-cols
- **Content:** Left: toolchain divergence, PKI fragmentation. Right: configuration drift, onboarding friction
- **Notes:** These four problems compound. Fix one and the others fill the gap. You need a systemic solution.

### Slide 4 — The answer is deterministic environments from a single source of truth

- **Layout:** center
- **Content:** One assertion statement — Nix flakes deliver this
- **Notes:** Transition slide. We are going to build this from first principles.

---

## Section 2: The Workspace Convention (4 slides)

### Slide 5 — Section: Workspace Convention

- **Layout:** section
- **Content:** "Organizing code before organizing tools"
- **Notes:** Before we talk about Nix, we need to solve the simpler problem: where do your repos live?

### Slide 6 — Path collisions are the first symptom of workspace entropy

- **Layout:** default
- **Content:** Show common problems: ~/projects/, ~/code/, ~/work/ — no convention, no discoverability
- **Notes:** Every engineer has their own path convention. When you pair, you can never find anything.

### Slide 7 — A filesystem convention eliminates collisions across users, servers, and namespaces

- **Layout:** full
- **Content:** Code block showing /workspace/<user>/<server>/<namespace>/ tree with real paths
- **Notes:** This is the Braincraft workspace convention. Borrowed from Go's GOPATH idea but generalized.

### Slide 8 — Independent repos organized by convention, not monorepo tooling

- **Layout:** two-cols
- **Content:** Left: the tree structure. Right: key properties — no submodules, multi-player, server-aware
- **Notes:** Each repo is independent. k9/, infrastructure/, blog/, presentations/ — all siblings, all independent git repos.

---

## Section 3: Konductor Architecture (6 slides)

### Slide 9 — Section: Konductor Architecture

- **Layout:** section
- **Content:** "A Nix flake as the universal developer environment"
- **Notes:** Now we get to the meat. Konductor is a single flake that produces devshells, containers, and VMs.

### Slide 10 — One flake.nix orchestrates all build targets from a single source of truth

- **Layout:** default
- **Content:** Mermaid flowchart: versions.nix → overlays → packages → devshells → flake outputs
- **Notes:** Walk through the data flow. versions.nix is the SSOT — language versions, NixOS channel, image metadata.

### Slide 11 — Flake inputs pin every dependency to an exact revision

- **Layout:** full
- **Content:** Code block showing flake inputs (nixpkgs, nixvim, home-manager, rust-overlay, nix2container)
- **Notes:** Unlike Dockerfiles that pull :latest, every input is locked to a specific commit. flake.lock is your SBOM.

### Slide 12 — Devshells compose like inheritance — base, then layers

- **Layout:** default
- **Content:** Mermaid diagram of shell hierarchy: base → python/go/node/rust/dev → full → konductor/ci
- **Notes:** base gives you coreutils, git, network tools. Each layer adds exactly what it needs via overrideAttrs.

### Slide 13 — base.nix is 80 lines that define the foundation for every environment

- **Layout:** full
- **Content:** Code block — simplified base.nix showing mkShell, packages, shellHook, env
- **Notes:** This is the actual code. mkShell with packages from the SSOT, a shellHook for aliases and completions, and env vars.

### Slide 14 — Every devshell works on Linux and macOS — konductor adds virtualization on Linux

- **Layout:** two-cols
- **Content:** Left: cross-platform shells (default, python, go, node, rust, dev, full). Right: Linux-only (konductor, ci, frontend)
- **Notes:** The conditional in flake.nix uses optionalAttrs to only expose konductor/ci on x86_64-linux.

---

## Section 4: Package Taxonomy (4 slides)

### Slide 15 — Section: Package Taxonomy

- **Layout:** section
- **Content:** "13 categories compose into purpose-built environments"
- **Notes:** Konductor does not dump 500 packages into one list. They are organized by purpose.

### Slide 16 — Package categories map to engineering concerns, not language ecosystems

- **Layout:** default
- **Content:** Mermaid mindmap: core, network, system, cli, linters, formatters, ai, ide, languages, konductor, tauri, pulumi
- **Notes:** Each category is a separate .nix file. This makes it trivial to audit what goes into each shell.

### Slide 17 — The default package set covers any workflow without language opinions

- **Layout:** full
- **Content:** Code showing: default = core ++ network ++ system ++ cli ++ linters ++ formatters ++ ai
- **Notes:** The base shell gets everything an engineer needs to navigate, edit, lint, and format — without any language runtime.

### Slide 18 — Language packages compose additively — no conflicts, no overrides

- **Layout:** two-cols
- **Content:** Left: Python 3.13 + uv + ruff + mypy. Right: Go 1.24 + gopls + delve. Bottom: full = all languages + dev
- **Notes:** Because Nix isolates packages by store path, Python and Node and Go coexist without conflicts.

---

## Section 5: Program Configurations (5 slides)

### Slide 19 — Section: Configured Programs

- **Layout:** section
- **Content:** "Configure once, get identical tools everywhere"
- **Notes:** Beyond packages, Konductor configures programs — Neovim, tmux, ttyd — with full reproducibility.

### Slide 20 — NixVim turns Neovim configuration into a Nix expression

- **Layout:** full
- **Content:** Code block showing Neovim plugin configuration from plugins.nix (telescope, treesitter, LSP)
- **Notes:** No more lua config files scattered in dotfiles. The entire Neovim setup is a Nix derivation.

### Slide 21 — tmux gets Catppuccin theming and which-key navigation declaratively

- **Layout:** default
- **Content:** Key tmux configuration points — catppuccin theme, which-key.yaml, prefix bindings
- **Notes:** The tmux config is a Nix expression with a YAML which-key overlay. Same keybindings in every shell, container, VM.

### Slide 22 — ttyd and ghostty-web expose terminal sessions over HTTP

- **Layout:** two-cols
- **Content:** Left: ttyd (C-based, battle-tested). Right: ghostty-web (Node.js, experimental). Both: browser-accessible terminal
- **Notes:** This is how we serve development environments to browsers. KubeVirt VMs run ttyd behind Envoy Gateway.

### Slide 23 — Hermetic linter and formatter configs travel with the shell

- **Layout:** full
- **Content:** Code block showing wrapped tool pattern — shellcheck with .shellcheckrc, eslint with config, etc.
- **Notes:** Each linter is wrapped with its config file injected via /nix/store path. No global dotfiles needed.

---

## Section 6: PKI Trust Chain (4 slides)

### Slide 24 — Section: PKI Trust Chain

- **Layout:** section
- **Content:** "Certificates generated, validated, and trusted automatically"
- **Notes:** PKI is the part of developer environments nobody wants to think about. Konductor automates it entirely.

### Slide 25 — A Python CLI generates CA and wildcard certificates with provenance tracking

- **Layout:** default
- **Content:** 3 bullets: P-384 CA key, P-256 leaf key, provenance baked into x509 extensions
- **Notes:** The PKI module uses the cryptography library. Every cert carries git commit, nix derivation, build host in custom OIDs.

### Slide 26 — Trust tiers determine certificate authority automatically

- **Layout:** default
- **Content:** Mermaid sequence diagram: hypervisor CA available? → cross-sign. Not available? → self-sign with warnings.
- **Notes:** If the VM boots with a hypervisor CA mounted at /mnt/pki, it cross-signs. Otherwise self-signs with loud warnings.

### Slide 27 — The trust bundle propagates to every tool that needs TLS

- **Layout:** full
- **Content:** Code showing env vars: SSL_CERT_FILE, CURL_CA_BUNDLE, GIT_SSL_CAINFO, NODE_EXTRA_CA_CERTS + Docker registry trust
- **Notes:** One bundle file, six environment variables, Docker registry symlinks. Every tool trusts the same CAs.

---

## Section 7: Deployment Targets (4 slides)

### Slide 28 — Section: Deployment Targets

- **Layout:** section
- **Content:** "One flake, four deployment targets"
- **Notes:** The same package definitions that build devshells also build containers and VMs.

### Slide 29 — OCI containers use nix2container for layer-optimized images

- **Layout:** default
- **Content:** Key points: nix2container (not dockerTools), layer deduplication, reproducible image hash
- **Notes:** nix2container produces OCI images without Docker. Layers are deduplicated by nix store path — updates only rebuild changed layers.

### Slide 30 — QCOW2 VM images become KubeVirt golden images

- **Layout:** two-cols
- **Content:** Left: build pipeline (nix build .#qcow2). Right: deploy pipeline (golden-image DataVolume → VirtualMachine)
- **Notes:** The qcow2 image is a full NixOS system with cloud-init, the Konductor devshell, and PKI. Upload to registry, deploy via Kustomize.

### Slide 31 — KubeVirt VMs get the same environment as local devshells

- **Layout:** full
- **Content:** Code showing deploy/kubevirt/base kustomization — namespace, VM spec, network, serviceaccount
- **Notes:** The Kustomize overlays in k9/deploy/kubevirt/ configure VM instances. Each dev gets their own VM with persistent workspace.

---

## Section 8: Demo + Closing (4 slides)

### Slide 32 — nix develop delivers a complete environment in seconds

- **Layout:** center
- **Content:** `nix develop .#full` — one command, every tool, every config, every language
- **Notes:** If we have time, live demo. If not, describe: type nix develop, get Python, Go, Node, Rust, Neovim, tmux, 20+ linters, all configured.

### Slide 33 — Reproducibility is the foundation of everything else

- **Layout:** default
- **Content:** 3 bullets: onboarding in minutes not days, incidents debugged in identical environments, CI/CD uses the same tools as developers
- **Notes:** The real payoff — when every environment is identical, entire categories of problems disappear.

### Slide 34 — Start here: fork k9/ and run nix develop

- **Layout:** center
- **Content:** Repository URL + QR code placeholder
- **Notes:** Call to action. The repo is open source. Fork it, run nix develop, and customize for your team.

### Slide 35 — Thank you

- **Layout:** intro
- **Content:** Speaker info, links, Q&A
- **Notes:** Thank the audience. Open for questions.
