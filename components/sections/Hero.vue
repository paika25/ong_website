<template>
  <section class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- Animated background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background -z-10" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))] -z-10" />
    
    <div class="container px-4 py-20 mx-auto text-center animate-fade-in-up">
      <div class="inline-block mb-6">
        <span class="text-sm font-medium px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20">
          Disponible pour de nouvelles opportunités
        </span>
      </div>
      
      <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-glow">
        Marius Razafitsalama
      </h1>
      
      <p class="text-2xl md:text-3xl text-muted-foreground mb-4">
        Développeur FullStack
      </p>
      
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Spécialisé en Laravel, Vue.js & React | 3+ ans d'expérience
      </p>
      
      <div class="flex flex-wrap gap-4 justify-center mb-12">
        <UButton size="lg" class="gap-2 shadow-lg hover:shadow-xl transition-shadow">
          <Icon name="lucide:mail" class="h-5 w-5" />
          Me contacter
        </UButton>
        <UButton size="lg" variant="outline" class="gap-2">
          <Icon name="lucide:external-link" class="h-5 w-5" />
          Voir mes projets
        </UButton>
      </div>
      
      <div class="flex gap-4 justify-center">
        <UButton variant="ghost" size="sm" class="rounded-full hover:bg-primary/10">
          <Icon name="lucide:github" class="h-5 w-5" />
        </UButton>
        <UButton variant="ghost" size="sm" class="rounded-full hover:bg-primary/10">
          <Icon name="lucide:linkedin" class="h-5 w-5" />
        </UButton>
        <UButton variant="ghost" size="sm" class="rounded-full hover:bg-primary/10">
          <Icon name="lucide:mail" class="h-5 w-5" />
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Ce composant est purement template, pas de logique nécessaire
</script>