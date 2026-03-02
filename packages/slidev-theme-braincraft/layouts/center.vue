<script setup lang="ts">
const props = defineProps<{
  color?: string
  class?: string
}>()

const schemeClass = `aurora-${props.color || 'cream'}-scheme`
</script>

<template>
  <div class="slidev-layout center" :class="[schemeClass, props.class]">
    <div class="center-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.center {
  display: grid;
  place-items: center;
  padding: 2.5rem 3.5rem;
  height: 100%;
}

.center-content {
  text-align: center;
}
</style>
