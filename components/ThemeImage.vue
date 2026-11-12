<script setup lang="ts">
import { computed } from 'vue'
import { useDarkMode } from '@slidev/client'

const props = defineProps<{
  src: string
}>()

const { isDark } = useDarkMode()

// /images/figure1.png -> /images/figure1-dark.png while Slidev is in dark mode.
const resolved = computed(() => {
  if (!isDark.value || !props.src.startsWith('/images/'))
    return props.src

  return props.src.replace(/(\.[a-z0-9]+)$/i, '-dark$1')
})
</script>

<template>
  <img :src="resolved">
</template>
