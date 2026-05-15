<template>
  <main class="container mx-auto px-4 py-8">
      <ClientOnly>
        <Profil /> 
      </ClientOnly>
    </main>
</template>

<script setup lang="ts">
import Profil from '@/features/user/components/Profil.client.vue'


definePageMeta({
  middleware: ['auth']
})

</script>