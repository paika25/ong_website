<template>
  <div class="min-h-screen bg-muted/20 flex flex-col">
    <!-- Top bar -->
    <header class="bg-card border-b border-border h-14 flex items-center px-6 gap-4 sticky top-0 z-40 shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 bg-emerald-600 rounded-md flex items-center justify-center">
          <Icon name="i-heroicons-building-office-2" class="w-4 h-4 text-white" />
        </div>
        <span class="font-bold text-base">Espace ONG</span>
      </div>

      <div class="flex-1" />

      <NuxtLink to="/">
        <UButton variant="ghost" size="sm" class="text-muted-foreground gap-1.5">
          <Icon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Retour au site
        </UButton>
      </NuxtLink>
    </header>

    <div class="flex flex-1 min-h-0">
      <!-- Sidebar -->
      <nav class="w-56 bg-card border-r border-border shrink-0 p-3 space-y-0.5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-1">
          Mon ONG
        </p>
        <NuxtLink
          v-for="item in NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-emerald-600/10 text-emerald-600 dark:text-emerald-400'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          <Icon :name="item.icon" class="w-4 h-4 shrink-0" />
          {{ item.label }}
        </NuxtLink>
      </nav>

      <!-- Content -->
      <main class="flex-1 p-6 overflow-auto min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const NAV_ITEMS = [
  { label: 'Vue d\'ensemble', to: '/ong-dashboard',            icon: 'i-heroicons-squares-2x2' },
  { label: 'Dons reçus',      to: '/ong-dashboard/donations',  icon: 'i-heroicons-heart' },
  { label: 'Documents',       to: '/ong-dashboard/documents',  icon: 'i-heroicons-document-text' },
  { label: 'Visibilité',      to: '/ong-dashboard/visibilite', icon: 'i-heroicons-eye' },
  { label: 'Mon dossier',     to: '/ong-dashboard/dossier',    icon: 'i-heroicons-clipboard-document-check' },
]

function isActive(to: string): boolean {
  if (to === '/ong-dashboard') return route.path === to
  return route.path.startsWith(to)
}
</script>
