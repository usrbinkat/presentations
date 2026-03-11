# Modern CSS visual engineering for Vue 3 + Vite + UnoCSS (March 2026)

**The modern CSS platform now delivers compositor-thread animations, display:none transitions,
scroll-driven timelines, anchor positioning, container queries, and perceptually uniform color — all
without JavaScript.** These APIs replace entire categories of npm dependencies (Popper.js, GSAP
scroll triggers, tinycolor) with declarative CSS that runs at 60fps on the GPU. This report covers
every technique at implementor depth: exact Vue 3 SFC code, browser version numbers, performance
tiers, Playwright export behavior, and decision trees.

---

## @property: typed custom properties unlock gradient and channel animation

The `@property` at-rule registers custom properties with a type system, enabling the browser to
interpolate values that were previously opaque strings. Without registration, `--hue: 180` is a
string — the browser cannot animate between `180` and `320`. With `syntax: "<number>"`, it becomes a
numeric value the engine can interpolate frame-by-frame.

**Full syntax type system** (CSS Properties and Values API Level 1): `<number>`, `<integer>`,
`<length>`, `<percentage>`, `<length-percentage>`, `<angle>`, `<color>`, `<image>`, `<url>`,
`<custom-ident>`, `<transform-function>`, `<transform-list>`, `<resolution>`, `<time>`, and `*`
(universal). Combinators: `|` (OR), `+` (space-separated list), `#` (comma-separated list). Both
`syntax` and `inherits` are required; `initial-value` is required unless `syntax: "*"`. The initial
value must be computationally independent — `3em` fails, `10px` works.

```css
/* Animate oklch channels independently */
@property --hue {
  syntax: '<number>';
  inherits: false;
  initial-value: 320;
}
@property --chroma {
  syntax: '<number>';
  inherits: false;
  initial-value: 0.2;
}
@property --lightness {
  syntax: '<number>';
  inherits: false;
  initial-value: 0.6;
}

.oklch-animate {
  background-color: oklch(var(--lightness) var(--chroma) var(--hue));
  animation:
    hue-shift 10s ease-in infinite alternate,
    pulse-chroma 3s ease-in-out infinite alternate;
}

@keyframes hue-shift {
  to {
    --hue: 145;
  }
}
@keyframes pulse-chroma {
  from {
    --chroma: 0.1;
  }
  to {
    --chroma: 0.3;
  }
}
```

**Gradient stop animation** works because gradients are `<image>` types that cannot interpolate
natively. Register each color stop as `<color>`, and the browser interpolates smoothly through oklch
space:

```css
@property --grad-start {
  syntax: '<color>';
  inherits: false;
  initial-value: oklch(0.7 0.15 240);
}
@property --grad-end {
  syntax: '<color>';
  inherits: false;
  initial-value: oklch(0.6 0.25 330);
}

.gradient-card {
  background: linear-gradient(135deg, var(--grad-start), var(--grad-end));
  animation: shift-gradient 4s ease-in-out infinite alternate;
}
@keyframes shift-gradient {
  to {
    --grad-start: oklch(0.8 0.2 150);
    --grad-end: oklch(0.5 0.3 30);
  }
}
```

**Conic-gradient rotation** requires `@property --spin { syntax: "<angle>"; ... }` because without
type registration, the browser treats `--spin` as a string and cannot interpolate `0deg` → `360deg`.

**JS equivalent**:
`CSS.registerProperty({ name: '--x', syntax: '<color>', inherits: false, initialValue: 'hotpink' })`.
If both CSS `@property` and JS `CSS.registerProperty()` define the same name, **JS wins**. Use CSS
`@property` for static declarations (works without JS, survives SSR); use JS for runtime-dynamic
registration.

**Performance**: B-tier main-thread paint. Registered property animations trigger style
recalculation + repaint per frame. Only `transform` and `opacity` are compositor-promoted. Use
`inherits: false` to prevent style recalc cascading to descendants.

**Browser support**: Chrome 85+, Firefox 128+, Safari 16.4+, Edge 85+ — **94.57% global** (Baseline
Newly Available July 2024).

**Playwright**: `page.screenshot()` ✅ captures current animation frame. `page.pdf()` ✅ captures
computed state. Use `animation-play-state: paused` for deterministic captures.

---

## oklch + color-mix() generate runtime palettes from a single token

**color-mix()** creates derived colors at compute time with zero JavaScript. Combined with oklch
(perceptually uniform lightness), you get a full design-system palette from one custom property:

```css
:root {
  --brand: oklch(0.55 0.2 260);
  --brand-50: color-mix(in oklch, var(--brand) 5%, white);
  --brand-100: color-mix(in oklch, var(--brand) 10%, white);
  --brand-200: color-mix(in oklch, var(--brand) 22%, white);
  --brand-300: color-mix(in oklch, var(--brand) 42%, white);
  --brand-400: color-mix(in oklch, var(--brand) 68%, white);
  --brand-500: var(--brand);
  --brand-600: color-mix(in oklch, var(--brand) 72%, black);
  --brand-700: color-mix(in oklch, var(--brand) 50%, black);
  --brand-800: color-mix(in oklch, var(--brand) 32%, black);
  --brand-900: color-mix(in oklch, var(--brand) 16%, black);
  --brand-950: color-mix(in oklch, var(--brand) 8%, black);
}
```

**Relative color syntax** (CSS Color Level 5) offers channel-level control:
`oklch(from var(--brand) calc(l - 0.1) c h)` adjusts lightness without touching chroma or hue.

**Gamut mapping**: The CSS Color 4 spec mandates oklch-based gamut mapping (reduce chroma while
preserving hue/lightness). Chrome and Safari currently use fast RGB clipping, which can shift hue.
Firefox is closer to spec. For P3-extended colors, use `@media (color-gamut: p3)` wrappers.

**Gradient text** via `background-clip: text`:

```css
.gradient-text {
  background: linear-gradient(90deg in oklch, oklch(0.65 0.3 330), oklch(0.7 0.25 260));
  background-clip: text;
  -webkit-background-clip: text; /* still required Chrome/Safari */
  color: transparent;
  -webkit-text-fill-color: transparent;
}
```

**Browser support**: oklch() Chrome 111+, Firefox 113+, Safari 15.4+; color-mix() Chrome 111+,
Firefox 113+, Safari 16.2+; relative color syntax Chrome 111+, Firefox 128+, Safari 16.4+. All
**~92%+ global**.

**Performance**: Zero runtime cost — resolved during style computation, not animation.
`background-clip: text` triggers paint (not layout).

**Playwright**: `page.screenshot()` ✅ all techniques. `page.pdf()` ✅ but wide-gamut colors clamp
to sRGB. `background-clip: text` in PDF can occasionally render blank — test with actual content.

---

## @starting-style transitions elements from display:none without JavaScript

The `@starting-style` at-rule defines initial values for elements receiving their first style update
— enabling CSS-only entry animations from `display: none`. Combined with
`transition-behavior: allow-discrete`, discrete properties like `display` and `overlay` participate
in transitions.

**How allow-discrete works**: `display: none → block` flips at **0%** (visible throughout the
transition). `display: block → none` flips at **100%** (visible throughout). The `overlay` property
defers top-layer removal until the transition completes — without it, popovers/dialogs vanish
instantly on close.

```css
/* Popover entry/exit animation */
[popover]:popover-open {
  opacity: 1;
  transform: scale(1);
}
[popover] {
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity 0.4s,
    transform 0.4s,
    overlay 0.4s allow-discrete,
    display 0.4s allow-discrete;
}
@starting-style {
  [popover]:popover-open {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

**Vue `<Transition>` interaction**: These solve different problems. Vue's class-based system handles
v-if/v-show toggling. @starting-style handles browser-native APIs (popover, dialog `showModal()`).
**Do not combine them** — Vue's transition lifecycle will conflict with @starting-style
declarations. Use @starting-style for native popover/dialog; use Vue `<Transition>` for everything
else.

**Browser support**: Chrome 117+, Firefox 129+, Safari 17.5+ — **~87.58% global**. The `overlay`
property is Chromium-only for full exit animations as of March 2026.

**Performance**: A-tier when animating only `opacity` + `transform` (compositor-thread).
`@starting-style` itself has zero runtime cost — parsed once.

**Playwright**: `page.screenshot()` with `animations: "disabled"` fast-forwards to end state.
`page.pdf()` renders final computed state. Mid-transition captures require `animations: "allow"`
with precise timing.

---

## View Transitions API captures DOM snapshots for animated state changes

`document.startViewTransition()` snapshots the old DOM state, executes a callback to mutate the DOM,
then animates between old and new snapshots via pseudo-elements. The return object has three
promises: **`ready`** (pseudo-elements created, animation about to start — hook custom animations
here), **`updateCallbackDone`** (DOM mutation complete), **`finished`** (animation done).

**Pseudo-element tree**: `::view-transition` → `::view-transition-group(name)` →
`::view-transition-image-pair(name)` → `::view-transition-old(name)` +
`::view-transition-new(name)`.

**Critical constraint**: `view-transition-name` must be **unique across the document** during a
transition. Two elements with the same name cause `ViewTransition.ready` to **reject**, skipping the
transition entirely.

**Circular clip-path reveal** — the signature pattern:

```js
const transition = document.startViewTransition(() => updateDOM());
transition.ready.then(() => {
  const x = lastClick?.clientX ?? innerWidth / 2;
  const y = lastClick?.clientY ?? innerHeight / 2;
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.documentElement.animate(
    { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 500, easing: 'ease-in', pseudoElement: '::view-transition-new(root)' }
  );
});
```

Required CSS to disable default cross-fade:
`::view-transition-old(root), ::view-transition-new(root) { animation: none; mix-blend-mode: normal; }`

**Cross-document MPA transitions** (Chrome 126+, Safari 18.2+): opt in with
`@view-transition { navigation: auto; }` on both pages. Access via `pageswap` / `pagereveal` events.

**`view-transition-class`** groups multiple named elements under shared animation styles without
duplicating rules: `::view-transition-group(.fast-slide) { animation-duration: 0.3s; }`.

**Vue integration**: `vue-view-transitions` (Clarkkkk/GitHub) provides `v-view-transition-name`
directive and `startViewTransition()` composable. Also `@nag5000/vue-view-transitions` provides
`useViewTransition()` composable. Vue core feature request #7881 for native integration has not
shipped.

**Browser support**: SPA — Chrome 111+, Firefox 144+, Safari 18.0+ (~90.41%). MPA — Chrome 126+,
Safari 18.2+, Firefox not yet. `view-transition-class` — Chrome 125+, Safari 18.0+, Firefox 144+ (no
types).

**Performance**: Default cross-fade uses opacity (compositor-thread, A-tier). Custom clip-path
triggers paint (B-tier). During transition, page is **non-interactive** — keep durations under
500ms.

**Playwright**: `page.screenshot()` with `animations: "disabled"` captures final state.
Pseudo-elements are ephemeral and won't appear in PDF. End-state renders survive both formats.

---

## Scroll-driven animations run on the compositor at 60fps

`animation-timeline: scroll()` binds animation progress to scroll position.
`animation-timeline: view()` binds to element visibility in the scrollport. Both drive `@keyframes`
declaratively with zero JavaScript event listeners.

```css
/* Progress bar tied to page scroll */
.progress-bar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  transform-origin: left;
  animation: scale-progress linear;
  animation-timeline: scroll(root block);
}
@keyframes scale-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

/* Card reveal on scroll */
.scroll-card {
  animation: fade-slide-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
@keyframes fade-slide-in {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**scroll() syntax**: `scroll(<scroller> <axis>)` — scroller: `nearest` (default), `root`, `self`;
axis: `block` (default), `inline`, `x`, `y`. **view() syntax**: `view(<axis> <inset>?)`.

**Named ranges for view()**: `cover` (full visibility span, default), `contain` (fully visible to
start-exit), `entry` (first pixel → fully entered), `exit` (start leaving → last pixel gone),
`entry-crossing`, `exit-crossing`. Ranges can be used in keyframe selectors directly:
`entry 0% { opacity: 0; } entry 100% { opacity: 1; }`.

**Performance**: **A-tier compositor-thread for `transform` and `opacity` only** — direct link
between scroll position and animation state, no main-thread blocking. `background-color`,
`clip-path` = B-tier paint. `width`, `height`, `margin` = C-tier layout — avoid.

**Firefox does NOT support scroll-driven animations in stable** as of March 2026 (behind flag
`layout.css.scroll-driven-animations.enabled` in Nightly only). Feature detection is **mandatory**:

```css
@supports (animation-timeline: scroll()) {
  .animated {
    animation: fade linear both;
    animation-timeline: view();
  }
}
```

**Polyfill**: `flackr/scroll-timeline` (GitHub, 1.1k stars, Apache-2.0). Parses CSS
`animation-timeline` on same-origin stylesheets. Main-thread only — no compositor benefit. Not on
npm; self-host.

**Browser support**: Chrome 115+, Edge 115+, Safari 26.0+ (~2026), Firefox ❌ — **~78% global**.

**Playwright**: `page.screenshot()` captures at current scroll position. `fullPage: true` scrolls
the page during capture, triggering scroll-driven state changes. `page.pdf()` renders at 0% progress
(no scrolling in print) — elements show initial keyframe state unless
`animation-fill-mode: forwards` is set. **Scroll-driven effects do NOT survive PDF.**

---

## Anchor positioning eliminates JavaScript tooltip libraries

CSS anchor positioning replaces Popper.js/Floating UI with declarative rules. An anchor element
declares `anchor-name: --trigger`. A positioned element connects via `position-anchor: --trigger`
and places itself on a **3×3 implicit grid** around the anchor using `position-area`.

```css
.trigger {
  anchor-name: --trigger;
}
.tooltip {
  position: fixed;
  position-anchor: --trigger;
  position-area: top;
  margin-bottom: 8px;
  position-try-fallbacks: flip-block, right, left;
}
```

**The 3×3 grid model**: rows = `top`/`center`/`bottom` (or `block-start`/`center`/`block-end`);
columns = `left`/`center`/`right` (or `inline-start`/`center`/`inline-end`). The anchor occupies the
center cell. `position-area: top center` places the element above the anchor, centered horizontally.
Spanning: `span-all`, `span-left`, `span-right`.

**`anchor()` function** provides edge-precise positioning in inset properties:
`top: anchor(--name bottom)`, `left: calc(anchor(right) + 10px)`. Center alignment:
`justify-self: anchor-center`.

**`@position-try`** defines named fallback positions with their own sizing and margin descriptors.
**`position-try-fallbacks`** lists strategies tried in order: tactic keywords (`flip-block`,
`flip-inline`, `flip-block flip-inline`, `flip-start`), `position-area` values, or `@position-try`
references.

**Renaming history**: `inset-area` → `position-area` (Chrome 129), `position-try-options` →
`position-try-fallbacks` (Chrome 128).

**Polyfill**: `@oddbird/css-anchor-positioning` (npm, v0.7.0+). Known limitations:
`position-try-order` not polyfilled, wraps target in extra element (breaks sibling selectors),
dynamic add/remove not fully supported.

**Browser support**: Chrome 125+, Edge 125+, Firefox 147+, Safari 26.0+ — **76.65% global**
(Baseline January 2026).

**Performance**: Layout-triggering (main-thread). Anchor position depends on anchor's rendered
position, computed during layout. Browsers optimize for scroll-driven anchor movement, but this is
inherently more expensive than compositor-only properties.

**Playwright**: `page.screenshot()` ✅ fully renders. `page.pdf()` ✅ with caveats —
`position: fixed` may behave differently in print context. Use `position: absolute` for PDF-targeted
layouts.

---

## Container queries make components responsive to their own context

`container-type: inline-size` establishes containment — the container's inline dimension is not
influenced by its children. `@container` rules then apply styles based on the container's size
rather than the viewport.

```css
.card-container {
  container: card / inline-size;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.card__title {
  font-size: clamp(1rem, 0.75rem + 2cqi, 1.75rem);
}

@container card (min-width: 500px) {
  .card {
    flex-direction: row;
  }
  .card__image {
    flex: 0 0 40%;
  }
}
```

**Container query units**: `cqi` (1% container inline size), `cqb` (1% block size — requires
`container-type: size`), `cqw`/`cqh` (physical), `cqmin`/`cqmax`. If no container exists, CQ units
fall back to small viewport units.

**Style queries** (`@container style(--theme: dark)`) work in Chrome 111+/Edge 111+ for custom
properties only. Firefox and Safari: still in development. No `container-type` needed — all elements
are style containers by default.

**Critical constraint**: "You cannot style what you query." A container cannot change its own size
based on its own container query — this would create an infinite loop. The container's size must
come from its context (grid track, explicit width, flex sizing).

**Decision tree**: Page-level layout → `@media`. User preferences → `@media`. Component in multiple
contexts → `@container`. Smooth fluid scaling → `clamp()` with `cqi`. Both discrete and fluid →
`@container` + `clamp(cqi)`. Can flexbox wrap or grid auto-fill solve it? → no queries needed.

**Browser support**: Size queries — Chrome 106+, Firefox 110+, Safari 16.0+ — **93.47% global**.
Style queries — Chromium only (~70%).

**Performance**: Layout-assisting. Containment is a performance _optimization_ — the browser
isolates layout recalculations to the subtree. Container query evaluation happens during style
resolution, not as an extra layout pass. Always name containers when nesting to avoid ambiguity.

**Playwright**: `page.screenshot()` ✅ fully renders at current container size. `page.pdf()` ✅ —
components adopt layout matching their container width in print context.

---

## Visual effects performance tiers and compositor boundaries

**Only `transform` and `opacity` run on the compositor thread** — these are the only two properties
that bypass layout and paint entirely. Everything else pays a main-thread cost.

| Tier                       | Properties                                                                                    | Pipeline                             |
| -------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------ |
| **A: Compositor**          | `transform`, `opacity`                                                                        | Cheapest; bypasses layout + paint    |
| **B: Compositor w/ layer** | `filter` (with `will-change`), `clip-path` basic shapes                                       | GPU filter; layer promotion required |
| **C: Paint**               | `background-*`, `color`, `box-shadow`, `clip-path` (complex), `mask-image`, `backdrop-filter` | Main-thread repaint                  |
| **D: Layout**              | `width`, `height`, `margin`, `padding`, `top`/`left`                                          | Full pipeline reflow                 |

**backdrop-filter**: Creates a new stacking context. Each instance requires GPU texture read-back of
everything behind it — effectively **doubling draw work**. Nested backdrop-filters create
**exponential cost** (each nesting level doubles repaint cycles). Keep blur radius under **20px**.
Large elements + large blur = severe frame drops. Always include `-webkit-backdrop-filter` for
Safari.

**clip-path animation**: Polygons interpolate smoothly **only when both shapes have the same number
of coordinate pairs**. Mismatched point counts cause instant jumps. Trick: pad simpler shapes by
repeating vertices. Circle/ellipse/inset shapes interpolate freely between same-type values.
clip-path basic shapes now animate on compositor in modern Chromium/Firefox/Safari.

**mask-image gradient fades**: `mask-image: linear-gradient(to bottom, black 60%, transparent 100%)`
creates soft-edge fades. Unprefixed `mask-image` is Baseline since December 2023 (Chrome 120+,
Firefox 53+, Safari 15.4+). Always include `-webkit-mask-image` for older WebKit. Paint-tier —
gradient masks are computed once and cached.

**mix-blend-mode**: Any value other than `normal` creates a stacking context and forces main-thread
compositing. Use `isolation: isolate` on a parent to confine blend effects.

**Playwright export matrix**:

| Effect                    | screenshot       | pdf                        |
| ------------------------- | ---------------- | -------------------------- |
| `clip-path: polygon()`    | ✅               | ✅ (geometry operation)    |
| `mask-image: gradient`    | ✅               | ❌ may not render          |
| `backdrop-filter: blur()` | ⚠️ WebKit issues | ❌ unreliable              |
| `mix-blend-mode`          | ✅ (rasterized)  | ⚠️ PDF has own blend model |

---

## Layout: subgrid, text-wrap, CSS nesting, and logical properties

**CSS subgrid** (`grid-template-rows: subgrid`) inherits parent grid tracks in nested grid
containers. Child items align to parent grid lines — solving the "cards with uneven content heights"
problem. Grid row spanning (`grid-row: span 3`) with `subgrid` aligns header/body/footer rows across
all cards. Browser support: Chrome 117+, Firefox 71+ (first to ship in 2019), Safari 16+ — universal
in 2026.

**text-wrap: balance** equalizes line widths via binary search. Chromium limits to **≤6 wrapped
lines**, Firefox to **≤10**. Use for headings, captions, short text. **text-wrap: pretty** optimizes
the last ~4 lines to prevent orphans. Use for body text. Both are safe progressive enhancement —
unsupported browsers ignore them. `pretty` is **not supported in Firefox** as of March 2026.
`balance`: Chrome 114+, Firefox 121+, Safari 17.5+. `pretty`: Chrome 117+, Safari 26+.

**CSS nesting** uses `&` as the parent selector. Element selectors require `&` in older Chromium
(relaxed nesting in Chrome 120+ allows bare selectors). **Cannot concatenate strings** like Sass —
`&--modifier` does not work in native CSS. `@media`, `@container`, `@supports` nest directly.
Browser support: Chrome 112+, Firefox 117+, Safari 16.5+ — ~95% global.

**Vue 3 scoped styles + CSS nesting edge case**: Combining `:deep()` with the nesting `&` selector
causes bugs in Vue 3.5.x (vuejs/core #13159, labeled `p3-minor-bug`). The SFC compiler transpiles
`:deep()` by moving the scoped data attribute, but nesting syntax interferes with this
transformation. The child combinator `>` inside `:has()` can be lost during transpilation (#11613).
**Workaround**: keep `:deep()` selectors flat — `'.wrapper :deep(.third-party-class)'` works,
`'.wrapper { & :deep(.class) { } }'` is risky.

**Logical properties** (`margin-inline`, `padding-block`, `inset-inline-start`) automatically flip
for RTL layouts. Baseline since 2020–2021 (Chrome 87+, Firefox 66+, Safari 14.1+). Universal
in 2026.

All layout properties survive both `page.screenshot()` and `page.pdf()` — they're computed during
layout, which happens before any capture.

---

## Accessibility: three media queries form a complete safety layer

**prefers-reduced-motion — the opt-IN pattern**: Define animations only inside
`@media (prefers-reduced-motion: no-preference)`. The base state has no motion. This is safer than
the opt-out approach because older browsers that don't support the query show the no-animation
state.

```css
/* Base: no animation (safe default) */
.transition-fade-enter-from,
.transition-fade-leave-to {
  opacity: 0;
}

/* Opt-in: motion only when user has no preference */
@media (prefers-reduced-motion: no-preference) {
  .transition-fade-enter-active,
  .transition-fade-leave-active {
    transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .transition-fade-enter-from {
    transform: translateY(20px);
  }
}
```

W3C WAI WCAG 2.2 Technique C39 explicitly documents this inverse approach. Browser support: Chrome
74+, Firefox 63+, Safari 10.1+ (first implementor, March 2017).

**prefers-contrast: more** — adjust borders from subtle to solid, replace shadows with borders,
increase font weight, add underlines to links, boost secondary text contrast. Chrome 96+, Firefox
101+, Safari 14.1+.

**forced-colors: active** — Windows High Contrast Mode. The browser overrides `color`,
`background-color`, `border-color`, `outline-color`, `box-shadow` (forced to `none`). Use system
color keywords: **`Canvas`** (document bg), **`CanvasText`** (default text), **`LinkText`** (links),
**`ButtonFace`**/**`ButtonText`** (buttons), **`Highlight`**/**`HighlightText`** (selections),
**`GrayText`** (disabled). Use `forced-color-adjust: none` to opt out specific elements (brand color
swatches, chart legends). System colors are assigned by native element semantics, not ARIA roles.
Chrome 89+, Firefox 89+, Safari 16+.

**WCAG 2.2 SC 2.3.1** (Level A): No more than **3 flashes per second**, or flash area below **0.006
steradians** (~341×256 px at 1024×768). General flash threshold: ≥10% relative luminance change
where darker image is below 0.80 relative luminance. **SC 2.3.3** (Level AAA): Motion animation
triggered by interaction must be disableable unless essential to functionality. Sufficient
technique: `prefers-reduced-motion` query.

---

## Animation psychology: timing, easing, and color as cognitive tools

**200–500ms is the optimal duration range.** Nielsen Norman Group: 100ms = perceived instant, >500ms
= feels like a drag. Material Design M1 specifies **225ms enter**, **195ms exit**, **~300ms
standard** on mobile. Desktop: 150–200ms (faster). Val Head's research: small UI changes =
200–300ms, large movements = 400–500ms. Exit animations should be **shorter** than entry (less
attention needed).

**Easing curves as CSS custom properties:**

```css
:root {
  --ease-standard: cubic-bezier(0.4, 0, 0.2, 1); /* most common */
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1); /* elements entering */
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1); /* elements exiting */
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1); /* may-return elements */
  --ease-spring: cubic-bezier(0.3, 0, 0, 1.3); /* elastic overshoot */
  --duration-enter: 225ms;
  --duration-exit: 195ms;
  --duration-standard: 300ms;
}
```

**Stagger delay**: 50ms (subtle), 75ms (balanced, most common), 100ms (dramatic). Implementation:
`transition-delay: calc(var(--stagger-index) * 50ms)`.

**60-30-10 color rule**: 60% dominant surface color, 30% secondary/navigation, 10% accent/CTA. Based
on the Golden Section — provides balance that guides the eye between focal points.

**Cool palettes (blue/green) drive trust and retention.** Blue dominates banking, tech, and
professional tools (PayPal, LinkedIn). Green signals safety and success states. Reserve warm colors
for alerts and accents.

**Color vision deficiency affects 1 in 12 males (8%)** — red-green deficiency accounts for ~95% of
cases. Never convey information through color alone (WCAG 1.4.1). Use shape, pattern, text labels as
secondary indicators. Test with Chrome DevTools → Rendering → Emulate vision deficiencies.

**Morph transitions** maintain cognitive continuity — shape morphing helps users track state changes
by creating visual persistence. Apple HIG: "strive for realism and credibility" — motion that defies
physical laws disorients users.

---

## Consolidated browser support matrix

| Feature                   | Chrome | Firefox | Safari        | Global | Perf tier        |
| ------------------------- | ------ | ------- | ------------- | ------ | ---------------- |
| `@property`               | 85+    | 128+    | 16.4+         | 94.6%  | Paint (B)        |
| `oklch()` / `color-mix()` | 111+   | 113+    | 15.4+ / 16.2+ | ~92%   | Compute (free)   |
| `@starting-style`         | 117+   | 129+    | 17.5+         | 87.6%  | Compositor (A)\* |
| View Transitions (SPA)    | 111+   | 144+    | 18.0+         | 90.4%  | Compositor (A)†  |
| Scroll-driven animations  | 115+   | ❌ flag | 26.0+         | 78.2%  | Compositor (A)‡  |
| Anchor positioning        | 125+   | 147+    | 26.0+         | 76.7%  | Layout (D)       |
| Container queries (size)  | 106+   | 110+    | 16.0+         | 93.5%  | Layout-assisting |
| Container style queries   | 111+   | ❌ dev  | ❌ dev        | ~70%   | Compute (free)   |
| Subgrid                   | 117+   | 71+     | 16.0+         | ~95%   | Layout           |
| `text-wrap: balance`      | 114+   | 121+    | 17.5+         | ~90%   | Layout           |
| `text-wrap: pretty`       | 117+   | ❌      | 26+           | ~75%   | Layout           |
| CSS nesting               | 112+   | 117+    | 16.5+         | ~95%   | N/A (parse)      |
| `mask-image` (unprefixed) | 120+   | 53+     | 15.4+         | ~93%   | Paint (C)        |

\* When animating only `opacity` + `transform`. † Default cross-fade. ‡ For `transform`/`opacity`
only.

---

## Known gotchas that will burn implementation time

- **@property + Vue scoped styles**: `@property` declarations must be in an **unscoped** `<style>`
  block or a global stylesheet. Vue's scoped attribute hashing does not apply to at-rules, but some
  build tools may strip them from scoped blocks.
- **view-transition-name uniqueness**: If two rendered elements share a name during transition,
  `ViewTransition.ready` rejects silently. Debug by checking the promise rejection.
- **Scroll-driven + Firefox**: No stable support. The polyfill runs on main-thread and loses the
  compositor performance benefit entirely. Feature-detect and provide graceful degradation.
- **Anchor positioning renames**: Code written for Chrome 125–128 uses `inset-area` and
  `position-try-options`. Chrome 129+ uses `position-area` and `position-try-fallbacks`. Both old
  names still work temporarily.
- **Container queries + height**: `container-type: inline-size` does NOT enable `cqb`/`cqh` units or
  height queries. Use `container-type: size` — but then the container MUST have explicit height or
  it collapses.
- **backdrop-filter nesting**: Each nesting level doubles GPU draw work. Two nested glassmorphism
  panels = 4× cost. Three levels = 8×. Avoid nesting.
- **CSS nesting + Vue :deep()**: Bug in Vue 3.5.x (issue #13159). Keep `:deep()` selectors flat — do
  not nest with `&`.
- **text-wrap: balance + long text**: Chromium stops balancing after 6 wrapped lines and falls back
  to normal. Firefox allows 10. Design for the Chromium limit.
- **clip-path morph + mismatched points**: Instant jump, no interpolation. Pad simpler shapes by
  repeating vertices to match the complex shape's point count.
- **Playwright PDF limitations**: `backdrop-filter`, `mask-image`, `mix-blend-mode`, and
  scroll-driven animations do NOT reliably export to PDF. Use static fallbacks or `@media print`
  overrides for PDF-targeted content.
- **oklch gamut mapping inconsistency**: Chrome/Safari clip RGB; Firefox maps closer to spec. Visual
  differences across browsers for high-chroma colors. Provide sRGB-safe oklch values as defaults;
  use `@media (color-gamut: p3)` for extended gamut.

## Conclusion

The modern CSS platform has crossed a threshold where **declarative style rules replace JavaScript
for animation orchestration, dynamic color systems, viewport-aware positioning, and responsive
component design**. The compositor-thread boundary remains the critical performance dividing line —
`transform` and `opacity` are the only truly "free" animation properties; everything else pays
main-thread tax. Scroll-driven animations and anchor positioning are the newest arrivals with the
narrowest browser support (~76–78%), making feature detection and polyfills non-negotiable for
Firefox coverage. The oklch + color-mix() combination is the standout productivity gain: a single
custom property token generates an entire design-system palette at compute time with perceptually
uniform steps — no build step, no JavaScript, no runtime cost. For Playwright export, the rule is
simple: geometry operations (clip-path, layout, text-wrap) survive PDF; filter effects
(backdrop-filter, mask-image, blend modes) do not.
