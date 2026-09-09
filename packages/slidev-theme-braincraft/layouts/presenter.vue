<!--
  Layout: presenter
  Ontology tier: Tier 10 Supplementary (maps to `profile` in the ontology)
  Presents a person with photo and details — team members, customer personas,
  advisory board members. The `image` prop provides the speaker photo; the
  default slot holds name, role, and bio content. For self-introduction by the
  presenter, use `intro` instead. This layout activates the fusiform face area
  via the photo, increasing perceived trustworthiness and engagement.
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
  image,
  imageSrc,
} = defineProps<{
  /** Aurora color scheme applied to the slide. Accepts: cream, slate, lavender, mint, peach, sky. Consumed by useSchemeClass(). */
  color?: string
  /** Background image URL, CSS color, or CSS gradient string. Processed by handleBackground() to detect type and apply correctly. */
  background?: string
  /** Additional CSS classes applied to the layout root element. */
  class?: string
  /** URL of the person's photo. Rendered as a rounded avatar in the left column. When provided, the layout switches to a two-column grid. */
  image?: string
  /** @deprecated Use `image` instead. Kept for backwards compatibility with existing decks. */
  imageSrc?: string
}>()

const bgStyle = background ? handleBackground(background) : undefined
const schemeClass = useSchemeClass(color, 'cream')
const resolvedImage = image || imageSrc
const imageUrl = resolvedImage ? resolveAssetUrl(resolvedImage) : undefined
</script>

<template>
  <div
    class="slidev-layout presenter"
    :class="[schemeClass, className, { 'has-image': imageUrl }]"
    :style="bgStyle"
  >
    <div v-if="imageUrl" class="presenter-image">
      <img :src="imageUrl" alt="Speaker">
    </div>
    <div class="presenter-bio">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.presenter {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--aurora-space-8);
  padding: var(--aurora-slide-padding-y) var(--aurora-slide-padding-x);
  height: 100%;
  align-items: center;
}

.presenter.has-image {
  grid-template-columns: 1fr 2fr;
}

.presenter-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.presenter-image img {
  max-width: 100%;
  max-height: 70vh;
  border-radius: var(--aurora-radius-xl);
  object-fit: cover;
  box-shadow: var(--aurora-shadow-md);
}

.presenter :deep(h1) {
  font-size: var(--aurora-text-3xl);
  font-weight: var(--aurora-font-bold);
}

.presenter :deep(h2) {
  font-size: var(--aurora-text-xl);
  color: var(--scheme-accent, var(--aurora-lavender-400));
  font-weight: var(--aurora-font-medium);
}
</style>
