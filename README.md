# Braincraft Presentations

Slidev presentation monorepo. Each deck is a standalone Slidev project under `decks/` sharing a common theme, addon library, and reusable fragments.

## Quick start

```bash
pnpm install          # install all workspace dependencies
make dev              # start the default deck (rekindle-transport-veilid) on port 3030
make dev DECK=hello-world PORT=3031   # start a different deck on a different port
```

## Make targets

| Target             | `DECK` | `PORT` | Description                                                                      |
| ------------------ | ------ | ------ | -------------------------------------------------------------------------------- |
| `make install`     | —      | —      | `pnpm install` for the workspace                                                 |
| `make dev`         | ✓      | ✓      | Start dev server in background. Waits for HTTP 200.                              |
| `make stop`        | —      | ✓      | Kill the running dev server                                                      |
| `make status`      | —      | —      | Check if a dev server is running                                                 |
| `make log`         | —      | —      | Tail the dev server log                                                          |
| `make build`       | ✓      | —      | Build static SPA to `dist/<deck>/`                                               |
| `make export`      | ✓      | —      | Export slides to PDF in `dist/<deck>.pdf`                                        |
| `make routes`      | ✓      | ✓      | List all `routeAlias` URLs for direct slide navigation                           |
| `make lint`        | —      | —      | Run eslint across all packages                                                   |
| `make lint-slides` | ✓      | ✓      | Run overflow, title wrapping, and font size checks (requires running dev server) |
| `make test`        | —      | —      | Run unit tests (vitest)                                                          |
| `make typecheck`   | —      | —      | Type check all packages (vue-tsc)                                                |
| `make clean`       | —      | —      | Remove `dist/`, pidfile, logfile                                                 |

Defaults: `DECK=rekindle-transport-veilid`, `PORT=3030`.

## Repository structure

```
presentations/
├── decks/                   # Each subdirectory is a standalone Slidev deck
│   ├── hello-world/         # Theme and addon showcase
│   ├── konductor-nix-flake/ # SCALE 23x talk: Nix flake architecture
│   ├── platform-factory-paas/  # Pulumi composable IaC platform factory
│   ├── rekindle-transport-veilid/  # Veilid P2P transport omnibus (120 min)
│   └── workspace-convention/ # Multi-root workspace filesystem convention
├── packages/
│   ├── slidev-theme-braincraft/   # Aurora design system theme (15 layouts)
│   └── slidev-addon-braincraft/   # Reusable components (11 components)
├── shared/
│   ├── assets/              # Shared static assets served at /shared/
│   │   └── speakers/        # Speaker photos (referenced as /shared/speakers/<name>.jpg)
│   └── fragments/           # Reusable slide files imported via src: ../../shared/fragments/
├── scripts/                 # Scaffolding scripts
├── docs/                    # Theme and addon reference documentation
├── Makefile                 # Dev, build, export automation
├── vite.config.ts           # Shared Vite config (git metadata plugin, shared assets plugin)
└── pnpm-workspace.yaml      # Workspace definition with pnpm catalog for version pinning
```

## Creating a new deck

```bash
pnpm new-deck my-talk-name
```

This creates `decks/my-talk-name/` with `package.json`, `slides.md` (cover + intro + thanks), and `public/.gitkeep`.

### Deck `package.json`

```json
{
  "name": "deck-my-talk-name",
  "private": true,
  "scripts": {
    "dev": "slidev",
    "build": "slidev build",
    "export": "slidev export"
  },
  "dependencies": {
    "@slidev/cli": "catalog:",
    "slidev-theme-braincraft": "workspace:*",
    "slidev-addon-braincraft": "workspace:*"
  }
}
```

### Deck `slides.md` frontmatter

```yaml
---
theme: slidev-theme-braincraft
addons:
  - slidev-addon-braincraft
  - slidev-addon-excalidraw # only if using Excalidraw diagrams
title: Talk Title
author: Speaker Name
colorSchema: auto
duration: 45min # enables built-in timer
wakeLock: true # prevents screen dimming during presentation
drawings:
  persist: true # persists whiteboard drawings to .slidev/drawings
transition: aurora-fade
fonts:
  sans: Inter
  mono: Space Mono
---
```

## Theme: slidev-theme-braincraft

### Color schemes

Every slide takes a `color` prop: **cream** (light default), **slate** (dark), **lavender**, **mint**, **peach**, **sky**.

```yaml
---
layout: default
color: cream
---
```

Content slides use cream or slate. Accent colors appear on section dividers or per-column overrides.

### Layouts (15)

| Layout           | Default scheme | Props                                                                            |
| ---------------- | -------------- | -------------------------------------------------------------------------------- |
| `cover`          | lavender       | `background`                                                                     |
| `default`        | cream          | —                                                                                |
| `section`        | mint           | `sectionNumber`, `align` (center/left/right), use with `transition: aurora-zoom` |
| `statement`      | lavender       | —                                                                                |
| `fact`           | mint           | `#context` slot                                                                  |
| `quote`          | lavender       | —                                                                                |
| `two-cols`       | cream          | `leftColor`, `rightColor`, `layoutClass`                                         |
| `two-cols-title` | cream          | `columns`, `leftColor`, `rightColor`                                             |
| `side-title`     | cream          | `titleWidth`                                                                     |
| `full`           | cream          | —                                                                                |
| `center`         | cream          | —                                                                                |
| `figure`         | cream          | `figureUrl`, `figureCaption`, `#media` slot                                      |
| `intro`          | cream          | —                                                                                |
| `presenter`      | cream          | `image`/`imageSrc`                                                               |
| `end`            | slate          | `#cta` slot                                                                      |

### Transitions

- `aurora-fade` — default, subtle scale + opacity
- `aurora-slide-up` — content rises
- `aurora-zoom` — for section dividers

### Slide utility classes

| Class                                                    | Use                                                                                                           |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `dense`                                                  | Reduced padding, tighter title margin, smaller paragraph text. For slides with 6+ row grids.                  |
| `reveal-build`                                           | v-click hides completely with slide-up entrance. For vertical flow chains, pipelines, construction sequences. |
| `compact-grid`                                           | Apply to a grid container: tight gap, xs font, 0.65rem code. For dense reference tables.                      |
| `abs-b`, `abs-t`, `abs-br`, `abs-bl`, `abs-tr`, `abs-tl` | Absolute positioning within slide padding. For supplementary content that shouldn't consume flow space.       |
| `cell-bg`                                                | Scheme-aware subtle cell background with padding and radius. Correct on cream and slate.                      |
| `cell-bg-subtle`                                         | Lighter cell background variant for dense grids.                                                              |
| `cell-bg-accent`                                         | Accent-tinted cell background.                                                                                |
| `cell-bg-ok` / `cell-bg-warn` / `cell-bg-err`            | Semantic status cell backgrounds (mint / yellow / red tint).                                                  |

Default v-click behavior is **fade** (dim to 40% opacity). Content stays visible and positioned. Layout doesn't shift. Grids show their skeleton before population. Use `reveal-build` class for slides where content should appear step-by-step.

### Per-slide options from Slidev

| Option                   | Use                                          |
| ------------------------ | -------------------------------------------- |
| `routeAlias: name`       | Direct-linkable URL at `/name`               |
| `hideInToc: true`        | Exclude from `<Toc>` component               |
| `clicks: N`              | Override auto-detected click count           |
| `clickAnimation: 'fade'` | Per-slide override for click animation style |

## Addon: slidev-addon-braincraft

### Components (11)

| Component                               | Usage                                          |
| --------------------------------------- | ---------------------------------------------- |
| `<HeroBlock>`                           | Large centered display block                   |
| `<PathSteps>`                           | Staircase progressive indentation              |
| `<CodeComparison>`                      | Side-by-side before/after code                 |
| `<Admonition type="warning">`           | Callout box (info, tip, warning, danger, note) |
| `<MetricCard value="99%" label="Rate">` | KPI card                                       |
| `<QRCode url="..." label="...">`        | Scannable QR code                              |
| `<SpeakerBio name="..." title="...">`   | Speaker card                                   |
| `<TerminalEmbed src="...">`             | Embedded terminal iframe                       |
| `<Footnote number="1">`                 | Inline footnote                                |
| `<Footnotes>`                           | Footnote container                             |
| `<Pagination>`                          | Slide progress (via global-top)                |

### Slidev built-in components also available

| Component           | Usage                               |
| ------------------- | ----------------------------------- |
| `<Toc columns="2">` | Table of contents from slide titles |
| `<AutoFitText>`     | Auto-sizing text to fit container   |
| `<CodeGroup>`       | Tabbed code blocks                  |

### Directives

| Directive                                         | Usage                                |
| ------------------------------------------------- | ------------------------------------ |
| `v-click`                                         | Progressive reveal                   |
| `v-mark.underline.orange="1"`                     | Rough hand-drawn annotation on click |
| `v-mark.box`, `v-mark.circle`, `v-mark.highlight` | Other annotation types               |

## Shared fragments

Reusable slides imported via `src:` in any deck:

```yaml
---
src: ../../shared/fragments/intro.md
---
```

| Fragment               | Content                                                                          |
| ---------------------- | -------------------------------------------------------------------------------- |
| `intro.md`             | Speaker introduction with photo (uses `/shared/speakers/speaker-kat-morgan.jpg`) |
| `thanks.md`            | Closing slide with QR codes                                                      |
| `riddle.md`            | Opening riddle poem                                                              |
| `github-population.md` | GitHub population bar chart                                                      |
| `healthcheck.md`       | Interactive red→green checklist                                                  |

## Shared assets

Static assets in `shared/assets/` are served at `/shared/` in every deck via the Vite plugin in `vite.config.ts`. Speaker photos live in `shared/assets/speakers/`.

To add a new speaker photo:

1. Place the image in `shared/assets/speakers/`
2. Reference it in fragments or slides as `/shared/speakers/<filename>`

## Sub-slide files

Long decks decompose into sub-slide files imported via `src:`:

```yaml
---
src: ./route-resolution.md
---
```

Each sub-slide file is a standalone `.md` file with its own frontmatter, content, styles, and speaker notes. The master `slides.md` imports them in order with section dividers between arcs.

## Speaker notes

Speaker notes are HTML comments in slide markdown:

```markdown
<!--
- Bullet points for glanceable reference
- What to emphasize that is not visible on the slide
- Source module or crate for verifiable claims
-->
```

Notes should be:

- Bulleted for quick scanning while speaking
- Content the speaker needs to know, not a description of what's on the slide
- Source references by crate and module name, not file paths that change

## Excalidraw diagrams

Place `.excalidraw.json` files in the deck's `public/` directory. Use on a `full` layout with `force-light`:

```yaml
---
layout: full
color: cream
class: force-light
---
<Excalidraw drawFilePath="./my-diagram.excalidraw.json" :darkMode="false" :background="false" class="w-full h-full" />
```

Export PNG versions alongside the JSON for non-interactive contexts.

## CI/CD

`.github/workflows/build-and-deploy.yml` builds all decks on every push to main, exports PDFs, and deploys to GitHub Pages as a single artifact. `.github/workflows/release-pdf.yml` exports PDFs on tag push.
