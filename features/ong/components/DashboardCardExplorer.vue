<template>
  <div class="bg-card border border-border rounded-xl p-6">
    <div class="flex items-center gap-4 mb-4">
      <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
        <svg class="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div>
        <h3 class="font-semibold">Explorer</h3>
        <p class="text-sm text-muted-foreground">Découvrir des ONGs</p>
      </div>
    </div>
    <NuxtLink to="/">
      <UButton variant="outline" class="w-full">
        Voir les ONGs
      </UButton>
    </NuxtLink>
  </div>
</template>
