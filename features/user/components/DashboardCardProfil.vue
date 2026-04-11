<template>
  <div class="bg-card border border-border rounded-xl p-6">
    <div class="flex items-center gap-4 mb-4">
      <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
        <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      <div>
        <h3 class="font-semibold">Mon Profil</h3>
        <p class="text-sm text-muted-foreground">Gérer mes informations</p>
      </div>
    </div>
    <NuxtLink to="/profil">
      <UButton variant="outline" class="w-full">
        Voir mon profil
      </UButton>
    </NuxtLink>
  </div>
</template>
