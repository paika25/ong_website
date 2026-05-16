<template>
  <div class="min-h-screen bg-muted/20 flex flex-col">
    <!-- Top bar -->
    <header class="bg-card border-b border-border h-14 flex items-center px-6 gap-4 sticky top-0 z-40 shrink-0">
      <div class="flex items-center gap-2.5">
        <div class="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <Icon name="i-heroicons-shield-check" class="w-4 h-4 text-primary-foreground" />
        </div>
        <span class="font-bold text-base">ONG Admin</span>
        <!-- <UBadge color="orange" variant="soft" size="xs">Back-office</UBadge> -->
      </div>

      <div class="flex-1" />

      <NuxtLink to="/">
        <UButton variant="ghost" size="sm" class="text-muted-foreground gap-1.5">
          <Icon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Retour à l'application
        </UButton>
      </NuxtLink>
    </header>

    <div class="flex flex-1 min-h-0">
      <!-- Sidebar -->
      <nav class="w-56 bg-card border-r border-border shrink-0 p-3 space-y-0.5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-1">
          Navigation
        </p>
        <NuxtLink
          v-for="item in NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="route.path === item.to || route.path.startsWith(item.to + '/')
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          <Icon :name="item.icon" class="w-4 h-4 shrink-0" />
          {{ item.label }}
          <UBadge v-if="item.badge" color="red" variant="solid" size="xs" class="ml-auto">
            {{ item.badge }}
          </UBadge>
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
  { label: 'Vue d\'ensemble', to: '/admin',              icon: 'i-heroicons-squares-2x2' },
  { label: 'ONGs',            to: '/admin/ongs',         icon: 'i-heroicons-building-office-2' },
  { label: 'Vérification',    to: '/admin/verification', icon: 'i-heroicons-shield-check' },
  { label: 'Dons',            to: '/admin/donations',    icon: 'i-heroicons-heart' },
  { label: 'Utilisateurs',    to: '/admin/utilisateurs', icon: 'i-heroicons-users' },
  { label: 'Algorithme',      to: '/admin/algorithme',   icon: 'i-heroicons-cpu-chip' },
  { label: 'Historique',      to: '/admin/historique',   icon: 'i-heroicons-clock' },
]
</script>
