<template>
  <div class="min-h-screen bg-background flex flex-col">
    <Header />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue'
</script>
