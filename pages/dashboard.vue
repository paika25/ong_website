<template>
  <main class="container mx-auto px-4 py-8 max-w-4xl">

    <!-- En-tête -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold tracking-tight">
        Bonjour{{ firstName ? ', ' + firstName : '' }}
      </h1>
      <p class="text-sm text-muted-foreground mt-1">Suivez vos dons et découvrez des ONGs à soutenir.</p>
    </div>

    <!-- Bannière : partenaire non encore validé -->
    <div
      v-if="user && user.accountType === 'user_partner' && !user.verified"
      class="mb-6 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-xl px-5 py-4 flex items-start gap-3"
    >
      <Icon name="i-heroicons-clock" class="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      <div class="flex-1 min-w-0">
        <p class="font-semibold text-amber-800 dark:text-amber-300 text-sm">Compte en attente de validation</p>
        <p class="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
          Votre profil partenaire est en cours de vérification par notre équipe (sous 48 h ouvrées).
          En attendant, vous naviguez comme visiteur public : les données financières des ONGs ne sont pas encore accessibles.
        </p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <div
        v-for="card in statCards"
        :key="card.label"
        class="bg-card border border-border rounded-xl p-5 flex flex-col gap-1.5"
      >
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{{ card.label }}</span>
          <div :class="['w-7 h-7 rounded-lg flex items-center justify-center', card.iconBg]">
            <Icon :name="card.icon" class="w-3.5 h-3.5" :class="card.iconColor" />
          </div>
        </div>
        <div class="text-2xl font-bold">
          <span v-if="isLoading" class="inline-block h-7 w-16 bg-muted rounded animate-pulse" />
          <span v-else>{{ card.value }}</span>
        </div>
        <div class="text-xs text-muted-foreground">{{ card.sub }}</div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <NuxtLink
        v-for="action in QUICK_ACTIONS"
        :key="action.to"
        :to="action.to"
        class="flex items-center gap-3 p-4 bg-card border border-border rounded-xl hover:border-primary/40 hover:bg-muted/30 transition-all group"
      >
        <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shrink-0', action.iconBg]">
          <Icon :name="action.icon" class="w-4 h-4" :class="action.iconColor" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium group-hover:text-primary transition-colors">{{ action.label }}</p>
          <p class="text-xs text-muted-foreground truncate">{{ action.sub }}</p>
        </div>
      </NuxtLink>
    </div>

    <!-- Conversations avec les ONGs -->
    <div class="bg-card border border-border rounded-xl overflow-hidden mb-6">
      <div class="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 class="font-semibold">Mes conversations</h2>
          <p class="text-xs text-muted-foreground mt-0.5">Échanges avec les ONGs</p>
        </div>
      </div>
      <div v-if="loadingConvs" class="divide-y divide-border">
        <div v-for="i in 3" :key="i" class="flex items-center gap-4 px-5 py-4 animate-pulse">
          <div class="w-9 h-9 rounded-full bg-muted shrink-0" />
          <div class="flex-1 space-y-1.5">
            <div class="h-3 bg-muted rounded w-1/3" />
            <div class="h-2.5 bg-muted rounded w-2/3" />
          </div>
        </div>
      </div>
      <div v-else-if="!conversations.length" class="px-5 py-10 text-center text-muted-foreground">
        <Icon name="i-heroicons-chat-bubble-left-right" class="w-8 h-8 mx-auto mb-2 opacity-30" />
        <p class="text-sm">Aucune conversation</p>
        <p class="text-xs mt-1">Contactez une ONG depuis son profil public</p>
      </div>
      <div v-else class="divide-y divide-border">
        <button
          v-for="conv in conversations"
          :key="conv.ongId"
          class="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-muted/30 transition-colors text-left"
          @click="openConversation(conv)"
        >
          <div class="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-700 dark:text-emerald-300">
            {{ conv.ongName[0]?.toUpperCase() ?? '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <p class="text-sm font-medium truncate">{{ conv.ongName }}</p>
              <span v-if="conv.unreadCount > 0" class="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                {{ conv.unreadCount }}
              </span>
            </div>
            <p class="text-xs text-muted-foreground truncate">{{ conv.lastMessage }}</p>
          </div>
          <Icon name="i-heroicons-chevron-right" class="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </div>
    </div>

    <!-- Modal conversation ouverte -->
    <UModal v-model="showConvModal">
      <div class="flex flex-col" style="height: 480px">
        <div class="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div class="flex items-center gap-2">
            <Icon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4 text-primary" />
            <span class="text-sm font-semibold">{{ activeConv?.ongName }}</span>
          </div>
          <UButton variant="ghost" icon="i-heroicons-x-mark" size="xs" @click="showConvModal = false" />
        </div>
        <PartnerMessagerie
          v-if="activeConv"
          :key="activeConv.ongId"
          :ong-id="activeConv.ongId"
          viewer-role="partner"
          class="flex-1 min-h-0"
          @unread-count="onConvUnreadCount(activeConv.ongId, $event)"
        />
      </div>
    </UModal>

    <!-- Historique dons -->
    <div class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="px-5 py-4 border-b border-border">
        <h2 class="font-semibold">Mes dons</h2>
        <p class="text-xs text-muted-foreground mt-0.5">Historique de vos contributions</p>
      </div>

      <!-- Skeleton -->
      <div v-if="isLoading" class="divide-y divide-border">
        <div v-for="i in 4" :key="i" class="flex items-center gap-4 px-5 py-4 animate-pulse">
          <div class="h-4 bg-muted rounded flex-1" />
          <div class="h-4 bg-muted rounded w-24" />
          <div class="h-4 bg-muted rounded w-16" />
        </div>
      </div>

      <!-- Vide -->
      <div v-else-if="!donations.length" class="px-5 py-16 text-center text-muted-foreground">
        <Icon name="i-heroicons-heart" class="w-10 h-10 mx-auto mb-3 opacity-30" />
        <p class="font-medium mb-1">Aucun don pour le moment</p>
        <p class="text-xs mb-5">Soutenez une ONG en faisant votre premier don</p>
        <NuxtLink to="/">
          <UButton size="sm" color="primary">Découvrir les ONGs</UButton>
        </NuxtLink>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <th class="px-5 py-3 text-left">Date</th>
              <th class="px-5 py-3 text-left">ONG</th>
              <th class="px-5 py-3 text-right">Montant</th>
              <th class="px-5 py-3 text-center">Statut</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr
              v-for="d in donations"
              :key="d.id"
              class="hover:bg-muted/30 transition-colors"
            >
              <td class="px-5 py-3.5 whitespace-nowrap text-xs text-muted-foreground">
                {{ formatDate(d.createdAt) }}
              </td>
              <td class="px-5 py-3.5 font-medium">{{ d.ongName }}</td>
              <td class="px-5 py-3.5 text-right font-semibold">{{ d.amount }} €</td>
              <td class="px-5 py-3.5 text-center">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', statusClass(d.status)]">
                  {{ statusLabel(d.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </main>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { useStats } from '~/features/user/composables/useStats'
import PartnerMessagerie from '~/features/messaging/components/PartnerMessagerie.vue'

definePageMeta({ middleware: ['auth'] })

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.currentUser)
const firstName = computed(() => user.value?.firstName?.split(' ')[0] || user.value?.fullName?.split(' ')[0] || '')

const { donations, stats, isLoading, load } = useStats()

// ── Conversations partenaire ──────────────────────────────────────────────────
interface ConvSummary { ongId: string; ongName: string; lastMessage: string; unreadCount: number }
const conversations = ref<ConvSummary[]>([])
const loadingConvs  = ref(false)
const showConvModal = ref(false)
const activeConv    = ref<ConvSummary | null>(null)

function openConversation(conv: ConvSummary) {
  activeConv.value = conv
  showConvModal.value = true
}

function onConvUnreadCount(ongId: string, count: number) {
  const c = conversations.value.find(x => x.ongId === ongId)
  if (c) c.unreadCount = count
}

async function loadConversations() {
  const supabase = useSupabase()
  if (!supabase) return
  loadingConvs.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Récupère les messages distincts par ONG pour ce partenaire
    const { data } = await supabase
      .from('ong_partner_messages')
      .select('ong_id, sender_role, content, read_at, created_at, ongs(name)')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })

    if (!data) return

    const map = new Map<string, ConvSummary>()
    for (const row of data) {
      const ongId = row.ong_id
      const ongName = (row.ongs as any)?.name ?? ongId.slice(0, 8)
      if (!map.has(ongId)) {
        map.set(ongId, { ongId, ongName, lastMessage: row.content, unreadCount: 0 })
      }
      if (row.sender_role === 'agent' && !row.read_at) {
        map.get(ongId)!.unreadCount++
      }
    }
    conversations.value = Array.from(map.values())
  } finally {
    loadingConvs.value = false
  }
}

const QUICK_ACTIONS = [
  {
    label:    'Explorer les ONGs',
    sub:      'Découvrir et soutenir',
    to:       '/',
    icon:     'i-heroicons-magnifying-glass',
    iconBg:   'bg-blue-100 dark:bg-blue-900',
    iconColor:'text-blue-600 dark:text-blue-400',
  },
  {
    label:    'Messages',
    sub:      'Vos échanges avec les ONGs',
    to:       '/dashboard/messages',
    icon:     'i-heroicons-chat-bubble-left-right',
    iconBg:   'bg-emerald-100 dark:bg-emerald-900',
    iconColor:'text-emerald-600 dark:text-emerald-400',
  },
  {
    label:    'Mon profil',
    sub:      'Gérer mes informations',
    to:       '/profil',
    icon:     'i-heroicons-user-circle',
    iconBg:   'bg-violet-100 dark:bg-violet-900',
    iconColor:'text-violet-600 dark:text-violet-400',
  },
  {
    label:    'Paramètres',
    sub:      'Compte et sécurité',
    to:       '/account/settings',
    icon:     'i-heroicons-cog-6-tooth',
    iconBg:   'bg-gray-100 dark:bg-gray-800',
    iconColor:'text-gray-600 dark:text-gray-400',
  },
]

const statCards = computed(() => [
  {
    label:     'Dons effectués',
    value:     stats.value.totalDonations,
    sub:       'Contributions totales',
    icon:      'i-heroicons-heart',
    iconBg:    'bg-rose-100 dark:bg-rose-900',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  {
    label:     'Montant total',
    value:     stats.value.totalDonated + ' €',
    sub:       'Dons complétés',
    icon:      'i-heroicons-banknotes',
    iconBg:    'bg-emerald-100 dark:bg-emerald-900',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label:     'ONGs soutenues',
    value:     stats.value.uniqueOngsSupported,
    sub:       'Organisations aidées',
    icon:      'i-heroicons-building-office-2',
    iconBg:    'bg-amber-100 dark:bg-amber-900',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
])

function statusLabel(status: string): string {
  return ({
    completed: 'Complété',
    pending:   'En attente',
    failed:    'Échoué',
    refunded:  'Remboursé',
    cancelled: 'Annulé',
  } as Record<string, string>)[status] ?? status
}

function statusClass(status: string): string {
  return ({
    completed: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    failed:    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    refunded:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    cancelled: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  } as Record<string, string>)[status] ?? 'bg-gray-100 text-gray-600'
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  // Agents ONG ont leur propre espace dédié
  if (authStore.isAgent) {
    await navigateTo('/ong-dashboard')
    return
  }
  try {
    await Promise.all([load(), loadConversations()])
  } catch (e) {
    console.error('[dashboard]', e)
  }
})
</script>
