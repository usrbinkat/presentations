<!--
  SpeakerBio.vue — Speaker introduction card.
  Horizontal layout with avatar, name, title, links, and optional bio text.

  Usage in slides.md:
    <SpeakerBio name="usrbinkat" title="Platform Engineer — Braincraft" />

    <SpeakerBio
      name="Kat Morgan"
      title="Principal Engineer"
      avatarUrl="https://github.com/usrbinkat.png"
      :links="['@usrbinkat', 'github.com/usrbinkat']"
    >
      Building reproducible infrastructure with Nix and Kubernetes.
    </SpeakerBio>
-->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  title?: string
  avatarUrl?: string
  links?: string[]
}>(), {
  title: '',
  avatarUrl: '',
  links: () => [],
})
</script>

<template>
  <div class="speaker-bio">
    <div class="speaker-avatar-wrap">
      <img
        v-if="props.avatarUrl"
        :src="props.avatarUrl"
        :alt="props.name"
        class="speaker-avatar"
      />
      <div v-else class="speaker-avatar speaker-avatar-placeholder">
        {{ props.name.charAt(0).toUpperCase() }}
      </div>
    </div>
    <div class="speaker-info">
      <div class="speaker-name">{{ props.name }}</div>
      <div v-if="props.title" class="speaker-title">{{ props.title }}</div>
      <div v-if="props.links.length" class="speaker-links">
        <span v-for="(link, i) in props.links" :key="i" class="speaker-link">{{ link }}</span>
      </div>
      <div v-if="$slots.default" class="speaker-bio-text">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.speaker-bio {
  display: flex;
  align-items: center;
  gap: var(--aurora-space-6);
  padding: var(--aurora-space-6);
  background: var(--aurora-cream-100);
  border-radius: var(--aurora-radius-xl);
  box-shadow: var(--aurora-shadow-sm);
}

.speaker-avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--aurora-radius-full);
  object-fit: cover;
  border: 3px solid var(--aurora-lavender-300);
}

.speaker-avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--aurora-lavender-300);
  color: var(--aurora-slate-700);
  font-size: var(--aurora-text-2xl);
  font-weight: var(--aurora-font-bold);
}

.speaker-info {
  display: flex;
  flex-direction: column;
  gap: var(--aurora-space-1);
}

.speaker-name {
  font-size: var(--aurora-text-xl);
  font-weight: var(--aurora-font-semibold);
  color: var(--aurora-slate-800);
}

.speaker-title {
  font-size: var(--aurora-text-sm);
  color: var(--aurora-slate-500);
  font-weight: var(--aurora-font-medium);
}

.speaker-links {
  display: flex;
  gap: var(--aurora-space-4);
  margin-top: var(--aurora-space-1);
}

.speaker-link {
  font-size: var(--aurora-text-xs);
  font-family: var(--aurora-font-mono);
  color: var(--aurora-lavender-500);
}

.speaker-bio-text {
  margin-top: var(--aurora-space-2);
  font-size: var(--aurora-text-sm);
  color: var(--aurora-slate-600);
  line-height: var(--aurora-leading-relaxed);
}

html.dark .speaker-bio {
  background: var(--aurora-slate-800);
}

html.dark .speaker-name {
  color: var(--aurora-cream-200);
}

html.dark .speaker-title {
  color: var(--aurora-slate-400);
}

html.dark .speaker-bio-text {
  color: var(--aurora-slate-400);
}
</style>
