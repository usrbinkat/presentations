# Addon Reference — slidev-addon-braincraft

## Admonition

Callout box with icon, title, and styled content.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'info' \| 'tip' \| 'warning' \| 'danger' \| 'note'` | `'info'` | Visual style and icon |
| `title` | `string` | Auto-capitalized type | Custom title text |

### Usage

```html
<Admonition type="tip" title="Pro Tip">
  Content supports **markdown** rendering.
</Admonition>

<Admonition type="warning">
  This will auto-title as "Warning".
</Admonition>

<Admonition type="danger" title="Breaking Change">
  API v1 is removed in this release.
</Admonition>
```

### Types

| Type | Icon | Border Color |
|------|------|-------------|
| `info` | 💡 | `--aurora-info` |
| `tip` | ✅ | `--aurora-mint-400` |
| `warning` | ⚠️ | `--aurora-warning` |
| `danger` | 🚨 | `--aurora-danger` |
| `note` | 📝 | `--aurora-lavender-400` |

Dark mode applies `oklch(25% 0.03 var(--hue))` background automatically.

---

## Pagination

Slide number display (`current / total`). Position anywhere on the slide.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `x` | `'l' \| 'r'` | `'r'` | Horizontal position (left/right) |
| `y` | `'t' \| 'b'` | `'b'` | Vertical position (top/bottom) |

### Usage

```html
<!-- Bottom-right (default) -->
<Pagination />

<!-- Top-left -->
<Pagination x="l" y="t" />
```

Can be placed in `global-bottom.vue` to appear on every slide.

---

## Footnote

Individual footnote with superscript number marker.

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `number` | `string \| number` | Yes | Superscript reference number |

### Usage

```html
<Footnote number="1">Source: IEEE 2024</Footnote>
```

---

## Footnotes

Container for `<Footnote>` items. Anchored to bottom of slide.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `separator` | `boolean` | `true` | Show horizontal rule above footnotes |
| `x` | `'l' \| 'r'` | `'l'` | Horizontal alignment |

### Usage

```html
<Footnotes separator>
  <Footnote number="1">First source</Footnote>
  <Footnote number="2">Second source</Footnote>
</Footnotes>

<!-- Right-aligned, no separator -->
<Footnotes :separator="false" x="r">
  <Footnote number="*">Additional note</Footnote>
</Footnotes>
```

---

## MetricCard

KPI/impact number display card with large value, label, and optional icon.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string \| number` | — (required) | The metric value to display |
| `label` | `string` | — (required) | Description below the value |
| `icon` | `string` | `''` | Optional emoji icon above the value |
| `color` | `'lavender' \| 'mint' \| 'peach' \| 'sky'` | `'lavender'` | Accent color for value text and top border |

### Usage

```html
<MetricCard value="99.9%" label="Reproducibility Rate" icon="🔬" />
<MetricCard value="42" label="Clusters Managed" color="mint" />
<MetricCard value="<5min" label="Deploy Time" icon="🚀" color="peach" />
```

Dark mode uses `--aurora-slate-800` card background.

---

## SpeakerBio

Speaker introduction card with horizontal layout.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — (required) | Speaker name |
| `title` | `string` | `''` | Role, company, or title |
| `avatarUrl` | `string` | `''` | URL to avatar image |
| `links` | `string[]` | `[]` | Social/contact links displayed below title |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Additional bio text below the name/title block |

### Usage

```html
<SpeakerBio name="usrbinkat" title="Platform Engineer — Braincraft" />

<SpeakerBio
  name="Kat Morgan"
  title="Principal Engineer"
  avatarUrl="https://github.com/usrbinkat.png"
  :links="['@usrbinkat', 'github.com/usrbinkat']"
>
  Building reproducible infrastructure with Nix and Kubernetes.
</SpeakerBio>
```

If no `avatarUrl` is provided, a placeholder circle with the first letter of the name is shown.

---

## QRCode

QR code placeholder for audience scanning. Renders a styled square with URL text and decorative corner markers (no external dependencies).

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `url` | `string` | — (required) | URL to display |
| `size` | `number` | `200` | Width and height in pixels |
| `label` | `string` | `''` | Optional text below the QR box |

### Usage

```html
<QRCode url="https://slides.braincraft.io" label="Follow along" />
<QRCode url="https://github.com/usrbinkat" :size="250" />
```

---

## CodeComparison

Side-by-side before/after code blocks with labeled headers.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `beforeLabel` | `string` | `'Before'` | Header label for left column |
| `afterLabel` | `string` | `'After'` | Header label for right column |

### Slots

| Slot | Description |
|------|-------------|
| `default` | Content for the "before" (left) column |
| `after` | Content for the "after" (right) column |

### Usage

```html
<CodeComparison>
  before code here
  <template #after>
    after code here
  </template>
</CodeComparison>

<CodeComparison beforeLabel="v1 API" afterLabel="v2 API">
  old code
  <template #after>
    new code
  </template>
</CodeComparison>
```

---

## TerminalEmbed

Embedded terminal iframe with PDF/export fallback.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | — (required) | Terminal URL (e.g. ttyd instance) |
| `fallbackImage` | `string` | `''` | Image shown when printing/exporting |
| `height` | `string` | `'400px'` | Container height |

### Usage

```html
<TerminalEmbed src="https://ttyd.example.com" fallbackImage="/screenshot.png" />
<TerminalEmbed src="https://ttyd.lab.local:7681" height="500px" />
```

In print/export mode: shows `fallbackImage` if provided, otherwise displays a styled placeholder with the URL.
