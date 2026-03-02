<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
</script>

<template>
  <div class="slidev-layout intro" :class="[schemeClass, props.class]">
    <div class="my-auto">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.intro {
  display: flex;
  flex-direction: column;
  padding: 2.5rem 3.5rem;
}
</style>
