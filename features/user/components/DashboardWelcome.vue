<template>
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">
      Bienvenue, {{ firstName }} ! 👋
    </h1>
    <p class="text-muted-foreground">
      Voici votre tableau de bord personnel.
    </p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  firstName: string
}>()
</script>
