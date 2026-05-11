<template>
  <footer class="border-t py-12 bg-muted/30">
    <div class="container px-4 mx-auto">
      <div class="flex flex-col items-center justify-center space-y-6">
        <div class="flex gap-4">
          <UButton variant="ghost" size="sm" class="rounded-full hover:bg-primary/10">
            <Icon name="lucide:linkedin" class="h-5 w-5" />
          </UButton>
          <UButton variant="ghost" size="sm" class="rounded-full hover:bg-primary/10">
            <Icon name="lucide:mail" class="h-5 w-5" />
          </UButton>
        </div>
        
        <div class="text-center text-sm text-muted-foreground">
          <p class="mb-2">
            © {{ currentYear }} Paika project. Tous droits réservés.
          </p>
          <div class="flex items-center justify-center gap-3 mb-2">
            <NuxtLink to="/terms" class="hover:text-foreground transition-colors">Conditions d'utilisation</NuxtLink>
            <span>·</span>
            <NuxtLink to="/privacy" class="hover:text-foreground transition-colors">Politique de confidentialité</NuxtLink>
          </div>
          <p>
            Développé avec Vue.js, Nuxt.js & Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>