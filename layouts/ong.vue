<template>
  <div class="min-h-screen bg-muted/20 flex flex-col">

    <!-- Top bar -->
    <header class="bg-card border-b border-border h-14 flex items-center px-6 gap-4 sticky top-0 z-40 shrink-0">
      <!-- Logo Paika -->
      <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
        <div class="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
          <Icon name="i-heroicons-heart" class="w-4 h-4 text-white" />
        </div>
        <span class="font-bold text-foreground text-base tracking-tight">Paika</span>
      </NuxtLink>

      <!-- Séparateur + nom ONG -->
      <div v-if="ongName" class="flex items-center gap-2 text-sm">
        <span class="text-muted-foreground/40">/</span>
        <span class="font-medium text-muted-foreground truncate max-w-[200px]">{{ ongName }}</span>
      </div>

      <div class="flex-1" />

      <!-- Retour site + user -->
      <NuxtLink to="/">
        <UButton variant="ghost" size="sm" class="text-muted-foreground gap-1.5 hidden sm:flex">
          <Icon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Retour au site
        </UButton>
      </NuxtLink>
      <ClientOnly>
        <UserHeader />
      </ClientOnly>
    </header>

    <div class="flex flex-1 min-h-0">
      <!-- Sidebar -->
      <nav class="w-56 bg-card border-r border-border shrink-0 p-3 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto flex flex-col">

        <div class="space-y-0.5 flex-1">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2 mt-1">
            Mon ONG
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
        </div>

        <!-- Bas sidebar -->
        <div class="pt-3 mt-3 border-t border-border space-y-0.5">
          <NuxtLink
            to="/"
            class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Icon name="i-heroicons-globe-alt" class="w-4 h-4 shrink-0" />
            Explorer les ONGs
          </NuxtLink>
        </div>
      </nav>

      <!-- Contenu -->
      <main class="flex-1 p-6 overflow-auto min-w-0">
        <!-- Accès restreint -->
        <div
          v-if="restrictedStatus"
          class="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6 max-w-lg mx-auto"
        >
          <div :class="['w-16 h-16 rounded-full flex items-center justify-center', restrictedStatus === 'rejected' ? 'bg-red-100 dark:bg-red-900' : 'bg-amber-100 dark:bg-amber-900']">
            <Icon
              :name="restrictedStatus === 'rejected' ? 'i-heroicons-x-circle' : 'i-heroicons-pause-circle'"
              class="w-9 h-9"
              :class="restrictedStatus === 'rejected' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'"
            />
          </div>
          <div>
            <h2 class="text-xl font-bold mb-2">
              {{ restrictedStatus === 'rejected' ? 'Dossier rejeté' : 'Badge suspendu' }}
            </h2>
            <p class="text-muted-foreground text-sm leading-relaxed">
              <template v-if="restrictedStatus === 'rejected'">
                Votre dossier de certification a été rejeté. Vous pouvez le corriger et le soumettre à nouveau depuis la section <strong>Mon dossier</strong>.
              </template>
              <template v-else>
                Le badge de certification de votre ONG est actuellement suspendu. Contactez notre équipe pour plus d'informations.
              </template>
            </p>
          </div>
          <div class="flex gap-3">
            <NuxtLink v-if="restrictedStatus === 'rejected'" to="/ong-dashboard/dossier">
              <UButton color="primary">Voir mon dossier</UButton>
            </NuxtLink>
            <NuxtLink to="/"><UButton variant="outline">Retour au site</UButton></NuxtLink>
          </div>
        </div>
        <slot v-else />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import UserHeader from '~/features/auth/components/UserHeader.client.vue'
import { fetchOwnerOng } from '~/features/ong-dashboard/services/ong-dashboard.service'

const route = useRoute()

const BLOCKED_STATUSES = ['rejected', 'suspended'] as const
const restrictedStatus = ref<'rejected' | 'suspended' | null>(null)
const ongName = ref<string | null>(null)

onMounted(async () => {
  try {
    const ong = await fetchOwnerOng()
    if (ong) {
      ongName.value = ong.name
      if (BLOCKED_STATUSES.includes(ong.status as any)) {
        restrictedStatus.value = ong.status as 'rejected' | 'suspended'
      }
    }
  } catch { /* silencieux */ }
})

const NAV_ITEMS = [
  { label: 'Vue d\'ensemble', to: '/ong-dashboard',              icon: 'i-heroicons-squares-2x2' },
  { label: 'Portefeuille',    to: '/ong-dashboard/portefeuille', icon: 'i-heroicons-banknotes' },
  { label: 'Dons reçus',      to: '/ong-dashboard/donations',    icon: 'i-heroicons-heart' },
  { label: 'Messages',        to: '/ong-dashboard/messages',     icon: 'i-heroicons-chat-bubble-left-right' },
  { label: 'Documents',       to: '/ong-dashboard/documents',    icon: 'i-heroicons-document-text' },
  { label: 'Visibilité',      to: '/ong-dashboard/visibilite',   icon: 'i-heroicons-eye' },
  { label: 'Mon dossier',     to: '/ong-dashboard/dossier',      icon: 'i-heroicons-clipboard-document-check' },
]

function isActive(to: string): boolean {
  if (to === '/ong-dashboard') return route.path === to
  return route.path.startsWith(to)
}
</script>
