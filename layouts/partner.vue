<template>
  <div class="min-h-screen bg-muted/20 flex flex-col">
    <!-- Topbar -->
    <header class="bg-card border-b border-border h-14 flex items-center px-6 gap-4 sticky top-0 z-40 shrink-0">
      <NuxtLink to="/" class="flex items-center gap-2.5">
        <div class="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <Icon name="i-heroicons-heart" class="w-4 h-4 text-white" />
        </div>
        <span class="font-bold text-base">Paika</span>
      </NuxtLink>

      <div class="flex-1" />

      <ClientOnly>
        <UserHeader />
      </ClientOnly>
    </header>

    <div class="flex flex-1 min-h-0">
      <!-- Sidebar -->
      <nav class="w-56 bg-card border-r border-border shrink-0 p-3 space-y-0.5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
        <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-1">
          Mon espace
        </p>

        <NuxtLink
          v-for="item in NAV_ITEMS"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive(item.to)
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
        >
          <Icon :name="item.icon" class="w-4 h-4 shrink-0" />
          {{ item.label }}
        </NuxtLink>

        <div class="pt-3 mt-3 border-t border-border">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
            Compte
          </p>
          <NuxtLink
            v-for="item in ACCOUNT_ITEMS"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="isActive(item.to)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'"
          >
            <Icon :name="item.icon" class="w-4 h-4 shrink-0" />
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="pt-3 mt-3 border-t border-border">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Icon name="i-heroicons-arrow-left" class="w-4 h-4 shrink-0" />
            Explorer les ONGs
          </NuxtLink>
        </div>
      </nav>

      <!-- Contenu principal -->
      <main class="flex-1 p-6 overflow-auto min-w-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserHeader from '~/features/auth/components/UserHeader.client.vue'

const route = useRoute()

const NAV_ITEMS = [
  { label: 'Vue d\'ensemble', to: '/dashboard',              icon: 'i-heroicons-squares-2x2' },
  { label: 'Portefeuille',    to: '/dashboard/portefeuille', icon: 'i-heroicons-banknotes' },
  { label: 'Messages',        to: '/dashboard/messages',     icon: 'i-heroicons-chat-bubble-left-right' },
]

const ACCOUNT_ITEMS = [
  { label: 'Mon profil',  to: '/profil',           icon: 'i-heroicons-user-circle' },
  { label: 'Paramètres',  to: '/account/settings', icon: 'i-heroicons-cog-6-tooth' },
]

function isActive(to: string): boolean {
  if (to === '/dashboard') return route.path === to
  return route.path.startsWith(to)
}
</script>
