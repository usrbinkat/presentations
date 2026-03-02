<script setup lang="ts">
import { resolveAssetUrl } from '../layoutHelper'

const props = defineProps<{
  color?: string
  class?: string
  figureUrl: string
  figureCaption?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
const imageUrl = resolveAssetUrl(props.figureUrl)
</script>

<template>
  <div class="slidev-layout figure" :class="[schemeClass, props.class]">
    <figure>
      <img :src="imageUrl" :alt="props.figureCaption || 'Figure'" />
      <figcaption v-if="props.figureCaption">{{ props.figureCaption }}</figcaption>
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
  padding: 2.5rem 3.5rem;
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
