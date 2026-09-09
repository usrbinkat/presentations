<!--
  Layout: figure
  Ontology tier: Tier 6 Visual (maps to `image-caption` in the ontology)
  An image occupies the majority of the slide with a caption area below.
  The presenter provides `figureUrl` for the image source and optional
  `figureCaption` for the description text. Semantic HTML (<figure> and
  <figcaption>) ensures accessibility. The optional `media` slot allows
  the presenter to supply a diagram, embed, or any visual content instead
  of a static image URL. The default slot holds supplementary content
  below the figure.
-->
<script setup lang="ts">
import {
  handleBackground,
  resolveAssetUrl,
  useSchemeClass,
} from '../layoutHelper'

const {
  color,
  background,
  class: className,
  figureUrl,
  figureCaption,
} = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() to detect type and apply correctly. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
  /** URL of the primary figure image. When omitted, the media named slot is used instead. Resolved via resolveAssetUrl(). */
  figureUrl?: string
  /** Caption text rendered inside <figcaption>. Explains the figure's relevance to the audience. */
  figureCaption?: string
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'cream')
const imageUrl = figureUrl ? resolveAssetUrl(figureUrl) : undefined
</script>

<template>
  <div
    class="slidev-layout figure"
    :class="[schemeClass, className]"
    :style="bgStyle"
  >
    <figure>
      <slot name="media">
        <img v-if="imageUrl" :src="imageUrl" :alt="figureCaption || 'Figure'">
      </slot>
      <figcaption v-if="figureCaption">
        {{ figureCaption }}
      </figcaption>
    </figure>
    <div v-if="$slots.default" class="figure-extra">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
}

figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
}

figure img {
  max-width: 100%;
  max-height: 65vh;
  object-fit: contain;
  border-radius: var(--aurora-radius-lg);
  box-shadow: var(--aurora-shadow-sm);
}

figcaption {
  margin-top: var(--aurora-space-3);
  font-size: var(--aurora-text-sm);
  color: var(--scheme-text-secondary, var(--aurora-slate-600));
  font-style: italic;
  text-align: center;
}

.figure-extra {
  margin-top: var(--aurora-space-4);
  text-align: center;
}
</style>
