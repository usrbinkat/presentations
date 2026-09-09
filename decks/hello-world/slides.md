---
theme: slidev-theme-braincraft
addons:
  - slidev-addon-braincraft
title: 'Braincraft Theme Showcase'
info: |
  A comprehensive demonstration of every layout, component, color scheme,
  transition, and feature in the Braincraft Slidev factory. Living documentation
  for deck authors and AI agents.
author: usrbinkat
keywords: braincraft,slidev,theme,showcase,reference
colorSchema: auto
themeConfig:
  qrUrl: https://braincraft.io
transition: aurora-fade
fonts:
  sans: Inter
  mono: Space Mono
---

---
layout: cover
color: slate
---

# What if every slide earned its layout?

The Braincraft factory: 15 layouts, 9 components, 6 color schemes

<!--
HOOK. This deck is the living documentation of the Braincraft Slidev factory. Every slide demonstrates one layout, component, or feature. Use it as reference when building your own presentations. ~10 seconds.
-->

---
src: ../../shared/fragments/intro.md
---

layout: section
color: slate
transition: aurora-zoom
sectionNumber: 1

---

# Structural Layouts

cover, section, intro, end — the narrative skeleton

<!--
SECTION BREAK. Structural layouts mark beginnings, endings, and transitions. They carry narrative position, not domain content. Every deck uses most of these. ~5 seconds.
-->

---
layout: default
color: cream
class: reveal-build
---

# Default Layout — the workhorse

The "paragraph" of presentations. Clean, predictable spatial grammar.

<v-clicks>

- Title at top, content flows naturally below
- Supports `v-click` progressive disclosure
- Uses `cream` scheme by default (warm, low eye strain)

</v-clicks>

<v-click>

This paragraph appeared on click — spring-physics transition with stagger delay per `nth-child`.

</v-click>

<!--
Default is the layout presenters reach for first. It must never look wrong. Its simplicity makes specialized layouts impactful by contrast. Notice the spring-physics v-click: translateY + opacity with staggered delays up to 12 children. ~15 seconds.
-->

---
layout: intro
color: cream
---

# Intro Layout

Vertically centered for opening statements or section introductions.

More prominent than default, less dramatic than cover. Use for content that needs to breathe.

<!--
Intro layout centers content vertically with generous whitespace. Use for opening hooks, major claims, or moments where the content needs visual breathing room. Maps to ontology Tier 1 Structural. ~10 seconds.
-->

---
layout: statement
color: cream
---

# Every slide competes with the speaker's voice for the same cognitive budget.

<!--
Statement layout: your words, centered, maximum whitespace. One powerful sentence. The audience reads it as "this is important enough to stand alone." Whitespace IS information. Reserve for thesis statements and key claims. ~5 seconds.
-->

---
layout: quote
color: cream
---

> "The audience's working memory is the bottleneck. Every element on your slide competes for the
> same cognitive budget."

— Richard Mayer, Cognitive Load Theory

<!--
Quote layout: someone else's words. Decorative ::before quotation mark. The border-inline-start and italic styling create visual containment. The audience instantly knows these are attributed words, not yours. ~10 seconds.
-->

---
layout: fact
color: cream
---

# 94.6%

Browser support for CSS `@property`

<template #context> Up from 72% one year ago — Can I Use, March 2026 </template>

<!--
Fact layout: single metric at maximum visual impact. Enormous type, tabular-nums for aligned digits. The context slot adds trend information below. Von Restorff isolation effect — visually distinctive items are better remembered. ~10 seconds.
-->

---
layout: section
color: slate
transition: aurora-zoom
sectionNumber: 2
---

# Content Layouts

default, two-cols, two-cols-title, side-title, center, full

<!--
SECTION BREAK. Content layouts are the workhorses. Each exists to express one idea clearly. The right layout for the right communicative purpose. ~5 seconds.
-->

---
layout: two-cols
color: cream
---

# Two Columns — side by side

Content splits into left and right zones.

- Left column for narrative text
- Explanations, arguments, context
- Natural F-pattern reading flow

::right::

## Right Side

- Diagrams, code, or visuals
- Complementary information
- Each modality carries what it's best suited for

<Admonition type="tip" title="Dual encoding">
Put narrative left, visual right — the audience processes both channels simultaneously.
</Admonition>

<!--
Two-cols is the backbone of multimodal reinforcement. Narrative text on the left, visual evidence on the right. Dual-channel encoding without redundancy. Per Mayer's multimedia principle. ~15 seconds.
-->

---
layout: two-cols
leftColor: peach
rightColor: mint
---

# Per-Column Color Schemes

**Problem** (peach)

<v-clicks>

- Toolchain divergence across machines
- PKI fragmentation per team
- Configuration drift in dotfiles

</v-clicks>

::right::

**Solution** (mint)

<v-clicks>

- Deterministic Nix flake builds
- Automated PKI trust chain
- Hermetic linter config wrappers

</v-clicks>

<!--
Per-column schemes via leftColor/rightColor frontmatter props. The audience reads the color semantically: peach = problem, mint = solution. This chromatic storytelling operates at a preconscious level. ~15 seconds.
-->

---
layout: two-cols-title
color: cream
columns: 1fr 1fr
---

# Two Columns with Title — shared heading

::left::

### Before

```ts
// Old approach
function getData() {
  return fetch('/api').then(r => r.json())
}
```

::right::

### After

```ts
// Modern approach
async function getData() {
  const r = await fetch('/api')
  return r.json()
}
```

<!--
Two-cols-title adds a dedicated title zone spanning both columns. The columns prop controls the grid ratio (default: 1fr 1fr). Use for before/after, side-by-side code, or content sharing a common heading. ~10 seconds.
-->

---
layout: side-title
color: cream
---

# Side Title

::right::

The title occupies a dedicated left column, visually separated from the content zone.

- Strong visual hierarchy
- Title persists as reference while reading content
- Good for definition slides or concept introductions
- The `titleWidth` prop controls the split ratio

<!--
Side-title uses a vertical divider between title and content columns. The audience references the title while processing details on the right. Good for definitions, concept introductions, or content where the heading is the anchor. ~10 seconds.
-->

---
layout: center
color: cream
---

# Center Layout

Utility layout — centers content both horizontally and vertically.

Use for single diagrams, key visuals, or dramatic reveals.

<!--
Center is a structural utility, not in the ontology taxonomy. Use sparingly for emphasis moments. A single statement, a question to the audience, visual breathing room between dense sections. ~5 seconds.
-->

---
layout: full
color: cream
---

<div style="height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, oklch(95% 0.04 240), oklch(95% 0.04 200));">

# Full Layout

Zero padding. Full bleed. Every pixel is yours.

Use for full-bleed images, custom backgrounds, terminal embeds, or any content that breaks the
spatial grammar intentionally.

</div>

<!--
Full layout removes all padding and constraints. The break from the spatial grammar IS the signal: "this is different, pay attention differently." Use for large images, terminals, or custom-styled content. ~10 seconds.
-->

---
layout: figure
figureUrl: https://github.com/usrbinkat.png
figureCaption: 'Semantic figure layout — image with figure/figcaption HTML elements'
color: cream
---

The figure layout provides semantic HTML for images with captions. The `media` named slot allows
custom content instead of a URL-based image.

<!--
Figure layout uses <figure> and <figcaption> for accessibility. figureUrl for image source, figureCaption for description. The media named slot accepts diagrams, embeds, or any visual content. ~10 seconds.
-->

---
layout: presenter
image: https://github.com/usrbinkat.png
color: cream
---

<SpeakerBio name="Kat Morgan" title="Principal Platform Engineer"
avatarUrl="https://github.com/usrbinkat.png" :links="['@usrbinkat', 'github.com/usrbinkat']">

- Infrastructure, Nix, Kubernetes
- Open source maintainer

</SpeakerBio>

<!--
Presenter layout is for introducing someone ELSE (not yourself — use intro + shared fragment for that). Combines photo with SpeakerBio component. Maps to ontology Tier 10 "profile". The image prop triggers the two-column grid. ~10 seconds.
-->

---
layout: section
color: slate
transition: aurora-zoom
sectionNumber: 3
---

# Components

Admonition, MetricCard, QRCode, CodeComparison, Footnotes

<!--
SECTION BREAK. Addon components provide reusable, accessible UI elements. Nine components total: Admonition, MetricCard, QRCode, SpeakerBio, CodeComparison, TerminalEmbed, Pagination, Footnote, Footnotes. ~5 seconds.
-->

---
layout: default
color: cream
---

# Admonition — callout boxes with five types

<Admonition type="info" title="Information">
Use for supplementary context the audience should be aware of.
</Admonition>

<Admonition type="tip" title="Pro Tip">
Actionable advice the audience can apply immediately.
</Admonition>

<Admonition type="warning" title="Caution">
Important caveats, edge cases, or things that can go wrong.
</Admonition>

<!--
Admonitions use border-inline-start + icon + background for triple-modality signaling. Types: info, tip, warning, danger, note. UnoCSS i-carbon-* icons. role="note" and aria-labelledby for accessibility. light-dark() for dark mode. ~15 seconds.
-->

---
layout: default
color: cream
---

# Admonition — danger and note types

<Admonition type="danger" title="Breaking Change">
This will destroy your data if applied without a backup. Read the migration guide first.
</Admonition>

<Admonition type="note" title="Note">
A neutral callout for context that doesn't fit any urgency level.
</Admonition>

<!--
Danger type uses red accents for critical warnings. Note type is neutral grey — context without urgency. All five types share the same component API: type and title props, default slot for content. ~10 seconds.
-->

---
layout: default
color: cream
---

# MetricCard — KPI display with semantic markup

<div class="flex gap-4 mt-6 justify-center">
  <MetricCard icon="i-carbon-time" value="< 200ms" label="Response Time" color="mint" />
  <MetricCard icon="i-carbon-checkmark-filled" value="99.9%" label="Uptime" color="sky" />
  <MetricCard icon="i-carbon-cloud" value="42" label="Edge Nodes" color="lavender" />
  <MetricCard icon="i-carbon-rocket" value="<5min" label="Deploy Time" color="peach" />
</div>

<!--
MetricCard uses <figure>/<figcaption> semantics. tabular-nums for aligned digits. Container queries stack below 200px width. border-top provides color category signaling. Props: value, label, icon, color. ~10 seconds.
-->

---
layout: default
color: cream
---

# CodeComparison — side-by-side code blocks

<CodeComparison beforeLabel="v1 API" afterLabel="v2 API">

```ts
function add(a, b) {
  return a + b
}
```

<template #after>

```ts
function add(a: number, b: number): number {
  return a + b // [!code highlight]
}
```

</template>

</CodeComparison>

<!--
CodeComparison places two code blocks side by side with scheme-aware borders. Container queries stack vertically below 500px. Default slot = "before" content, #after slot = "after" content. beforeLabel/afterLabel props customize headers. ~10 seconds.
-->

---
layout: default
color: cream
---

# QRCode — real scannable codes at 2x retina

<div class="flex gap-8 justify-center items-end mt-6">
  <QRCode url="https://github.com/usrbinkat" label="GitHub" :size="140" />
  <QRCode url="https://git.braincraft.io" label="Braincraft" :size="140" />
</div>

Generated via the `qrcode` package. Each wrapped in an accessible `<a>` tag with URL as fallback
text. Place on closing slides where scan motivation peaks.

<!--
QR codes serve the pass-along audience. Generated at 2x retina resolution. Props: url (required), size (default 200), label (optional text below). Most prominent on the end slide during Q&A. ~10 seconds.
-->

---
layout: default
color: cream
---

# Footnote and Footnotes — reference citations

Body content with a referenced claim. <Footnote number="1" />

Additional content with another source. <Footnote number="2" />

<Footnotes>
  <template #1>Mayer, R.E. (2009). Multimedia Learning. Cambridge University Press.</template>
  <template #2>Miller, G.A. (1956). The Magical Number Seven, Plus or Minus Two.</template>
</Footnotes>

<!--
Footnote renders an inline superscript marker. Footnotes renders the reference list at the bottom using absolute positioning. Template slots match by number. The Pagination component (active globally) defaults to top-right with tabular-nums. ~10 seconds.
-->

---
layout: section
color: slate
transition: aurora-zoom
sectionNumber: 4
---

# Color Schemes

cream, slate, lavender, mint, peach, sky — semantic encoding

<!--
SECTION BREAK. Six color schemes, each defining 8 CSS variables with light and dark mode variants. Use color as semantic encoding: the audience reads the color before the text. ~5 seconds.
-->

---
layout: default
color: cream
---

# Cream — the default neutral

Warm neutral background. Lavender accents. Optimized for WCAG AA contrast on warm backgrounds.

- `--scheme-bg`: oklch(97%) — cream-100
- `--scheme-accent`: oklch(70%) — lavender-500
- Reduces eye strain during extended viewing
- Default when no `color` prop is specified

<!--
Cream is the default because warm backgrounds reduce eye strain. The lavender accent at L=70% provides 4.5:1+ contrast on L=97% background, meeting WCAG AA for normal text. ~10 seconds.
-->

---
layout: default
color: slate
---

# Slate — dramatic dark emphasis

Inverted color hierarchy. Light text on dark background. `color-scheme: dark` applies automatically.

- Accent shifts to lavender-300 for contrast on dark backgrounds
- Use for dramatic reveals, demo slides, terminal content
- The shift from light to dark IS an attention reset

<!--
Slate inverts everything. The visual shift from light to dark is itself a "designed moment" — a cognitive circuit-breaker that resets the audience's attention clock. Reserve for emphasis. ~10 seconds.
-->

---
layout: default
color: lavender
---

# Lavender — primary brand accent

The signature Braincraft color. Use for primary content, brand-forward sections, and default
emphasis.

- Purple hue signals creativity and sophistication
- Strong visual identity without overwhelming
- Works across both light and dark modes

<!--
Lavender is the brand color. Use for primary content and sections where brand identity matters. The purple hue creates a distinctive visual signature without the aggression of red or urgency of orange. ~10 seconds.
-->

---
layout: two-cols
leftColor: peach
rightColor: mint
---

# Peach and Mint — semantic pair

**Peach** — problems, challenges, warnings

<v-clicks>

- Warm hue creates urgency
- Draws immediate attention
- Audience associates with "something needs fixing"

</v-clicks>

::right::

**Mint** — solutions, success, positive outcomes

<v-clicks>

- Cool green signals safety
- Resolves the tension from peach
- Audience associates with "this is the answer"

</v-clicks>

<!--
The peach/mint pair is semantic encoding in action. Use peach consistently for problems, mint for solutions. By slide 15, the audience reads the color before the text. Chromatic storytelling at a preconscious level. ~15 seconds.
-->

---
layout: default
color: sky
---

# Sky — technical trust

Cool blue for data-driven, technical, or trust-building content.

- Blue dominates tech, banking, and professional tools
- Signals competence and reliability
- Pairs naturally with code, architecture, and metrics

<div class="flex gap-4 mt-4 justify-center">
  <MetricCard value="15" label="Layouts" icon="i-carbon-grid" color="sky" />
  <MetricCard value="9" label="Components" icon="i-carbon-assembly-cluster" color="sky" />
  <MetricCard value="6" label="Schemes" icon="i-carbon-color-palette" color="sky" />
</div>

<!--
Sky is the enterprise choice. Cool palettes drive trust and retention. Use for architecture overviews, technical deep-dives, or presentations to skeptical stakeholders. ~10 seconds.
-->

---
layout: section
color: slate
transition: aurora-zoom
sectionNumber: 5
---

# Features

v-click, Magic Move, Shiki annotations, transitions

<!--
SECTION BREAK. Interactive features and code presentation capabilities. These are the tools that make presentations dynamic rather than static. ~5 seconds.
-->

---
layout: default
color: cream
class: reveal-build
---

# Progressive Disclosure — v-click and v-clicks

Build your argument step by step:

<v-clicks>

- First, establish the context
- Then, introduce the constraint
- Next, reveal the approach
- Finally, show the result

</v-clicks>

<v-click>

<Admonition type="tip" title="Chunking heuristic">
Reveal in groups matching cognitive chunks. If 6 items fall into 2 groups of 3, reveal each group as a unit. Click-per-bullet becomes annoying for simple lists.
</Admonition>

</v-click>

<!--
v-click uses spring-physics animations with 50ms stagger per nth-child (up to 12). v-clicks wraps multiple items for sequential reveal. The chunking heuristic: group by cognitive load, not by list position. ~15 seconds.
-->

---
layout: default
color: cream
---

# Shiki Annotations — guided code reading

```ts {1|3-5|7-9|all}
// Line highlighting with Shiki
interface Config {
  theme: string // Aurora scheme name
  transition: string // aurora-fade | aurora-slide-up | aurora-zoom
  fonts: FontConfig // Inter + Space Mono
}

function createPresentation(config: Config) {
  return new SlidevDeck(config)
}
```

The syntax `{1|3-5|7-9|all}` reveals lines progressively per click.

<!--
Shiki line highlighting guides the audience through code sequentially. Prevents the "wall of code" problem. First show the imports, then the interface, then the function. Each click narrows focus. ~15 seconds.
-->

---
layout: default
color: cream
---

# Shiki Inline Annotations

```ts
const config = {
  theme: 'braincraft', // [!code highlight]
  transition: 'aurora-fade', // [!code highlight]
  fonts: { sans: 'Inter' },
}

function deprecated() {
  // [!code --]
  return 'old way' // [!code --]
} // [!code --]

function modern() {
  // [!code ++]
  return 'new way' // [!code ++]
} // [!code ++]

const risky = eval(input) // eslint-disable-line no-eval -- [!code error]
const beta = experimental() // [!code warning]
```

<!--
Inline annotations: highlight for emphasis, ++/-- for diffs, error/warning for attention levels. These work with any language Shiki supports. Combine them for rich code storytelling. ~10 seconds.
-->

---
layout: full
color: cream
---

# Magic Move — animated code evolution

````md magic-move
```ts
// Step 1: Simple function
function greet(name: string) {
  return `Hello, ${name}`
}
```

```ts
// Step 2: Add validation
function greet(name: string) {
  if (!name) throw new Error('Name required')
  return `Hello, ${name}`
}
```

```ts
// Step 3: Add formatting options
function greet(name: string, formal = false) {
  if (!name) throw new Error('Name required')
  const greeting = formal ? 'Good day' : 'Hello'
  return `${greeting}, ${name}`
}
```
````

<!--
Magic Move animates between code blocks with smooth morphing. Additions, deletions, and changes are visually tracked. Maintains cognitive continuity — the audience follows the evolution rather than comparing static blocks. ~15 seconds.
-->

---
layout: default
color: cream
---

# Named Transitions — communicative motion

| Transition        | When                     | Character                       |
| ----------------- | ------------------------ | ------------------------------- |
| `aurora-fade`     | Default, most slides     | Professional, calm — invisible  |
| `aurora-slide-up` | Content entrance, builds | Progressive, upward motion      |
| `aurora-zoom`     | Section dividers         | Dramatic, structural gear shift |

All transitions respect `prefers-reduced-motion` and use only compositor-thread properties
(`opacity` + `transform`).

<Admonition type="info" title="Transition as content">
The choice of transition IS content. aurora-zoom at section boundaries signals "we're changing topics." The audience's visual system detects the motion change preconsciously.
</Admonition>

<!--
Three transitions, three communicative purposes. aurora-fade is invisible. aurora-slide-up suggests building. aurora-zoom marks boundaries. Never use transitions decoratively — they serve narrative function. ~10 seconds.
-->

---
layout: section
color: slate
transition: aurora-slide-up
sectionNumber: 6
---

# Principles in Action

Mayer, primacy/recency, semantic encoding, whitespace

<!--
SECTION BREAK — using aurora-slide-up here to demonstrate that transition. This section shows how cognitive science principles map to factory features. ~5 seconds.
-->

---
layout: two-cols-title
color: cream
columns: 1fr 1fr
leftColor: peach
rightColor: mint
---

# Mayer's Redundancy Principle

::left::

### Wrong

- Bullet says "Revenue up 40%"
- Speaker says "Revenue up 40%"
- Visual channel processes both text AND speaker
- Cognitive overload

::right::

### Right

- Graph shows revenue curve rising
- Speaker says "Revenue up 40%"
- Visual processes the shape
- Auditory processes the claim
- Complementary encoding

<!--
The redundancy principle: don't duplicate information across visual and auditory channels. Show a GRAPH while saying the number. Each channel carries DIFFERENT aspects of the same concept. Dual encoding, not duplication. ~15 seconds.
-->

---
layout: two-cols
color: cream
---

# Primacy and Recency Effects

**First slide = the HOOK**

<v-clicks>

- Not your name and title
- The problem, the question, the surprising fact
- Earn curiosity before introducing yourself
- Slide 2 is where you say who you are

</v-clicks>

::right::

**Last slide = strongest takeaway**

<v-clicks>

- Not "Thank You" or "Questions?"
- Your most actionable statement
- QR codes at peak scan motivation
- Callback to the opening hook

</v-clicks>

<!--
Primacy: first impressions create the frame for everything. Your name can wait. The hook cannot. Recency: the last 2 minutes are disproportionately remembered. Close with substance, not pleasantries. ~15 seconds.
-->

---
layout: statement
color: cream
---

# Whitespace is information. Less content equals more significance.

<!--
This slide IS the demonstration. One sentence. Maximum whitespace. The emptiness around the text communicates "this is important enough to stand alone." A single number at 120pt hits harder than the same number in a table of 15. ~5 seconds.
-->

---
layout: end
color: lavender
---

# The best slide decks don't just inform — they transform how the audience thinks.

**usrbinkat** | Braincraft Presentation Factory

<template v-slot:cta>
<div class="flex gap-8 mt-4 justify-center items-end">
  <QRCode url="https://github.com/usrbinkat" label="GitHub" :size="120" />
  <QRCode url="https://git.braincraft.io" label="Braincraft" :size="120" />
</div>
</template>

<!--
End layout with substance. The cta named slot holds QR codes. This slide stays visible during Q&A — peak scan motivation. The heading IS the takeaway, not a throwaway "Thank You." ~visible for duration of Q&A.
-->

---


---

src: ../../shared/fragments/thanks.md
