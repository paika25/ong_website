<template>
  <UButton
    variant="ghost"
    size="sm"
    @click="toggleTheme"
    aria-label="Basculer le thème"
  >
    <Icon
      :name="isDark ? 'lucide:sun' : 'lucide:moon'"
      class="h-5 w-5"
    />
  </UButton>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const toggleTheme = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>