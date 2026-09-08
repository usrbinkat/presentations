# Theme Reference — slidev-theme-braincraft

## Layouts

All layouts accept `color` and `class` props. The `color` prop selects a color scheme (default
varies per layout).

### default

Standard content slide. Default color: `cream`.

```yaml
---
layout: default
color: cream
---
```

### cover

Title slide with large heading. Default color: `lavender`. Also accepts `background` prop for
background images.

```yaml
---
layout: cover
color: lavender
background: /images/hero.jpg
---
```

### intro

Speaker introduction. Default color: `cream`. Content vertically centered.

```yaml
---
layout: intro
---
```

### section

Section divider. Centered text. Default color: `mint`.

```yaml
---
layout: section
color: mint
---
# Section Title
```

### two-cols

Two-column grid. Default color: `cream`. Also accepts `layoutClass` prop applied to both columns.

```yaml
---
layout: two-cols
---

Left column content

::right::

Right column content
```

### center

Content centered both horizontally and vertically. Default color: `cream`.

```yaml
---
layout: center
---
```

### full

Edge-to-edge content with no padding. Default color: `cream`.

```yaml
---
layout: full
---
```

### two-cols-title

Title spanning full width above two columns. Default color: `cream`. Accepts `columns` prop for
custom `grid-template-columns` (default `1fr 1fr`). Uses default slot for title, `left` and `right`
named slots for columns.

```yaml
---
layout: two-cols-title
columns: '2fr 1fr'
---

# My Title

::left::

Left column content

::right::

Right column content
```

### side-title

Title on the left side, content on the right. Default color: `cream`. Accepts `titleWidth` prop
(default `1fr`, combined with `2fr` for content). Uses `title` named slot for left side, default
slot for right content.

```yaml
---
layout: side-title
titleWidth: '1fr'
---

::title::

# Side Title

::default::

Main content here
```

### quote

Styled blockquote layout. Default color: `lavender`. Vertically centered, large italic text with
accent left border. Best used with `> blockquote` markdown syntax.

```yaml
---
layout: quote
color: lavender
---

> The best way to predict the future is to invent it.

-- Alan Kay
```

### fact

Big impact number or statistic. Default color: `mint`. Centered content with oversized heading
(`text-5xl`) and smaller supporting text.

```yaml
---
layout: fact
color: mint
---
# 99.9%

Uptime across all production services in 2025
```

### statement

Bold assertion text. Default color: `lavender`. Centered both ways, `text-4xl`, bold, with
`text-wrap: balance`.

```yaml
---
layout: statement
color: lavender
---
Engineering is not about perfect solutions. It is about trade-offs.
```

### presenter

Speaker bio with optional image. Default color: `cream`. Accepts `imageSrc` prop for speaker photo
(resolved via `resolveAssetUrl`). 2-column grid when image is provided, single column otherwise.

```yaml
---
layout: presenter
imageSrc: /images/speaker.jpg
---
# Jane Doe

# # Principal Engineer at Braincraft

Building distributed systems and developer tools for 15 years.
```

### figure

Image with caption. Default color: `cream`. Requires `figureUrl` prop. Optional `figureCaption` prop
for caption text. Default slot available for additional content below.

```yaml
---
layout: figure
figureUrl: /images/architecture.png
figureCaption: "Figure 1: System architecture overview"
---
```

### end

Closing/thank-you slide. Default color: `slate`. Grid centered like `center` layout but with slate
scheme for a strong closing.

```yaml
---
layout: end
---
# Thank You

Questions?
```

## Color Schemes

Six schemes available via the `color` prop on any layout:

| Scheme     | Hue                 | Usage                     |
| ---------- | ------------------- | ------------------------- |
| `cream`    | 85 (warm neutral)   | Default for most layouts  |
| `slate`    | 295 (cool neutral)  | Dark-toned content        |
| `lavender` | 300 (purple accent) | Cover slides, emphasis    |
| `mint`     | 160 (green accent)  | Section dividers, success |
| `peach`    | 60 (orange accent)  | Warnings, energy          |
| `sky`      | 220 (blue accent)   | Info, technical content   |

Each scheme provides `--scheme-bg`, `--scheme-text`, `--scheme-heading`, `--scheme-accent`, and
`--scheme-muted` variables.

## Design Tokens

All tokens are CSS custom properties prefixed `--aurora-`. Defined in `styles/aurora-tokens.css`.

### Colors

- **Cream neutrals:** `--aurora-cream-{50,100,200,300,400}`
- **Slate neutrals:** `--aurora-slate-{50,100,200,300,400,500,600,700,800,900}`
- **Lavender:** `--aurora-lavender-{300,400,500}`
- **Mint:** `--aurora-mint-{300,400,500}`
- **Peach:** `--aurora-peach-{300,400,500}`
- **Sky:** `--aurora-sky-{300,400,500}`
- **Semantic:** `--aurora-{success,warning,danger,info}{,-light,-dark}`

### Typography

- **Fonts:** `--aurora-font-sans` (Inter), `--aurora-font-mono` (Space Mono)
- **Scale:** `--aurora-text-{xs,sm,base,lg,xl,2xl,3xl,4xl,5xl}` (fluid clamp values)
- **Weights:** `--aurora-font-{light,regular,medium,semibold,bold}` (300–700)
- **Leading:** `--aurora-leading-{tight,snug,normal,relaxed}`
- **Tracking:** `--aurora-tracking-{tight,normal,wide}`

### Spacing (8px grid)

`--aurora-space-{0,1,2,3,4,5,6,8,10,12,16,20,24}` → 0 to 96px

### Radius

`--aurora-radius-{sm,md,lg,xl,2xl,full}`

### Shadows

- **Elevation:** `--aurora-shadow-{sm,md,lg}`
- **Colored:** `--aurora-shadow-{lavender,mint,peach}`

### Motion

- **Durations:** `--aurora-duration-{instant,fast,normal,slow,slower}` (100–600ms)
- **Easings:** `--aurora-ease-{spring,spring-smooth,bounce,in,out,in-out}`

## Dark Mode

Activated via `html.dark` class (Slidev toggle). Each color scheme has dark variants defined in
`styles/dark-mode.css`.

## Slidev Integration

Aurora tokens map to Slidev variables:

- `--slidev-theme-primary` → `--aurora-lavender-400`
- `--slidev-theme-secondary` → `--aurora-mint-400`
- `--slidev-theme-accent` → `--aurora-peach-400`
- `--slidev-code-*` → Aurora mono font and spacing

## Accessibility

- `prefers-reduced-motion: reduce` disables all animations
- `prefers-contrast: high` increases contrast for neutral tones
