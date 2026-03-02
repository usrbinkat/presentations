# The Multi-Root Workspace Convention — Outline

## 1. The Problem (4 slides)

1. **Cover**: Title slide — "The Multi-Root Workspace Convention: Collision-Free Multi-Project Development"
2. **Speaker intro**: Shared fragment import (`intro.md`)
3. **Path collisions waste engineering hours**: Every engineer invents their own directory structure. `~/projects/app` — whose projects? Pairing becomes impossible. Scripts break on different machines.
4. **Monorepo and polyrepo both leave gaps**: Monorepo forces coupling. Polyrepo loses discoverability. Neither handles multiple git servers. Neither handles multiple users on shared machines.

## 2. The Convention (5 slides)

5. **Section divider**: "The Workspace Convention"
6. **Four path segments eliminate four classes of collision**: `/workspace/<user>/<git-server>/<namespace>/` — each segment solves a distinct problem (multi-user, multi-server, multi-org).
7. **The real workspace tree proves the convention**: Show actual `tree` output from `/workspace/usrbinkat/git.braincraft.io/braincraft/` with k9, infrastructure, blog, presentations as siblings.
8. **Every segment earns its place**: Two-column breakdown — user (multi-player), git-server (GitHub vs Forgejo vs GitLab), namespace (org separation).
9. **This is not a monorepo**: Independent git clones. No submodules. No Bazel. No Nx. Each repo has its own lifecycle, CI, and release process.

## 3. In Practice (5 slides)

10. **Section divider**: "In Practice"
11. **direnv auto-loads environment per directory**: Show `.envrc` snippets — Nix devshell activation, env file layering, PKI trust, KUBECONFIG. `cd` into directory and environment activates.
12. **mise orchestrates tasks across sibling repos**: Show `.mise.toml` — cluster config, task includes, environment variables. One task runner for multi-repo operations.
13. **Mermaid diagram: environment activation flow**: direnv detects `.envrc` -> loads env files -> activates Nix devshell -> sets KUBECONFIG -> ready.
14. **Five projects coexist as siblings**: k9 (Nix flake), infrastructure (Pulumi IaC), blog (Hugo), presentations (Slidev), optiplex-lab (bare metal). Each has its own toolchain, none interfere.

## 4. The Portable Factory (4 slides)

15. **Section divider**: "The Portable Factory"
16. **presentations/ is a self-contained pnpm workspace**: Show the monorepo structure — packages/ (theme, addon), decks/, shared/. It drops into any workspace alongside any project.
17. **The factory is not married to any project**: It can be moved to another workspace. It references the parent workspace for subject matter but has zero build-time dependencies on siblings.
18. **Mermaid diagram: factory architecture**: pnpm workspace containing theme + addon + decks, sitting inside the multi-root workspace.

## 5. Developer Experience (4 slides)

19. **Section divider**: "Developer Experience"
20. **Navigation is instant with zoxide and direnv**: `z braincraft` jumps to workspace. `cd k9` activates Nix devshell. `cd infrastructure` activates Pulumi env. No manual switching.
21. **IDE multi-root workspaces match the convention**: VS Code `v.code-workspace` file maps directly to the directory structure. Each folder gets its own language server, its own settings, its own debug config.
22. **Environment isolation prevents cross-contamination**: direnv loads/unloads per-directory. Python venv in infrastructure/ doesn't leak into k9/. Node modules in presentations/ don't appear in blog/.

## 6. Scaling (3 slides)

23. **Multiple users share the same machine without conflict**: `/workspace/usrbinkat/` and `/workspace/alice/` coexist. Each user gets their own clone hierarchy. SSH into a shared VM, no path collisions.
24. **Multiple git servers coexist naturally**: GitHub repos under `github.com/`, Forgejo under `git.braincraft.io/`, GitLab under `gitlab.com/`. Same project name, different servers, different paths.
25. **CI adopts the same convention**: Forgejo runners clone into `/workspace/runner/git.braincraft.io/`. CI scripts use the same paths as developers. No CI-specific path workarounds.

## 7. Close (2 slides)

26. **Adopt the convention in five minutes**: Three bash commands to set up. No tooling required — just `mkdir -p` and `git clone` into the right path.
27. **Thanks**: Shared fragment import (`thanks.md`)
