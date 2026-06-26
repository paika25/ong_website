<template>
  <main class="container mx-auto px-4 py-8 max-w-5xl">
    <div class="mb-6">
      <NuxtLink to="/dashboard">
        <UButton variant="ghost" size="sm" class="text-muted-foreground gap-1.5 -ml-2">
          <Icon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Tableau de bord
        </UButton>
      </NuxtLink>
    </div>

    <PageHeader title="Messages" subtitle="Vos échanges avec les ONGs et l'administration Paika" class="mb-6" />

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="height: 600px">
      <!-- Liste des conversations -->
      <div class="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-border space-y-2.5">
          <p class="text-sm font-semibold">Conversations</p>
          <RechercheInput v-model="searchQuery" placeholder="Rechercher une ONG…" />
        </div>

        <ConversationList
          :items="conversationItems"
          :selected-id="selectedId"
          :loading="loading"
          empty-title="Aucune conversation"
          :empty-hint="searchQuery ? 'Aucun résultat pour cette recherche' : 'Contactez une ONG depuis son profil public'"
          @select="selectedId = $event"
        />
      </div>

      <!-- Fenêtre de conversation -->
      <div class="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div v-if="!selectedId" class="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Icon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 opacity-20 mb-3" />
          <p class="text-sm">Sélectionnez une conversation</p>
        </div>

        <template v-else-if="selectedId === ADMIN_ID">
          <div class="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Icon name="i-heroicons-shield-check" class="w-4 h-4" />
            </div>
            <div>
              <p class="text-sm font-semibold">Administration Paika</p>
              <p class="text-xs text-muted-foreground">Support et suivi de votre compte</p>
            </div>
          </div>

          <PartnerAdminMessagerie
            v-if="currentUserId"
            :key="ADMIN_ID"
            :partner-id="currentUserId"
            viewer-role="partner"
            hide-header
            class="flex-1 min-h-0"
            @unread-count="adminUnreadCount = $event"
          />
        </template>

        <template v-else>
          <div class="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-300 overflow-hidden">
              <img v-if="selectedConversation?.ongImage" :src="selectedConversation.ongImage" :alt="selectedConversation.ongName" class="w-full h-full object-cover" />
              <span v-else>{{ selectedConversation?.ongName[0]?.toUpperCase() ?? '?' }}</span>
            </div>
            <p class="text-sm font-semibold">{{ selectedConversation?.ongName }}</p>
          </div>

          <PartnerMessagerie
            :key="selectedId"
            :ong-id="selectedId"
            viewer-role="partner"
            class="flex-1 min-h-0"
            @unread-count="onUnreadCount(selectedId, $event)"
          />
        </template>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import PartnerMessagerie from '~/features/messaging/components/PartnerMessagerie.vue'
import PartnerAdminMessagerie from '~/features/messaging/components/PartnerAdminMessagerie.vue'
import ConversationList from '~/features/messaging/components/ConversationList.vue'
import RechercheInput from '~/features/messaging/components/RechercheInput.vue'
import type { ConversationListItem } from '~/features/messaging/components/ConversationList.vue'
import { getToken } from '~/features/auth/utils/getToken'

definePageMeta({ layout: 'partner', middleware: ['auth'] })

interface ConvSummary {
  ongId: string
  ongName: string
  ongImage: string | null
  lastMessage: string
  lastMessageAt: string
  unreadCount: number
}

const ADMIN_ID = 'admin'
const ADMIN_NAME = 'Administration Paika'

const conversations  = ref<ConvSummary[]>([])
const loading        = ref(true)
const selectedId     = ref<string | null>(null)
const searchQuery    = ref('')
const currentUserId  = ref<string | null>(null)
const adminUnreadCount = ref(0)

const filteredConversations = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return conversations.value
  return conversations.value.filter(c => c.ongName.toLowerCase().includes(q))
})

const conversationItems = computed<ConversationListItem[]>(() => {
  const ongItems: ConversationListItem[] = filteredConversations.value.map(c => ({
    id: c.ongId,
    name: c.ongName,
    preview: c.lastMessage,
    avatarUrl: c.ongImage,
    unreadCount: c.unreadCount,
    avatarColor: 'emerald',
  }))

  const q = searchQuery.value.trim().toLowerCase()
  if (q && !ADMIN_NAME.toLowerCase().includes(q)) return ongItems

  const adminItem: ConversationListItem = {
    id: ADMIN_ID,
    name: ADMIN_NAME,
    preview: 'Posez vos questions à l\'équipe Paika',
    unreadCount: adminUnreadCount.value,
    avatarColor: 'primary',
  }
  return [adminItem, ...ongItems]
})

const selectedConversation = computed(() =>
  conversations.value.find(c => c.ongId === selectedId.value) ?? null
)

function onUnreadCount(ongId: string | null, count: number) {
  if (!ongId) return
  const c = conversations.value.find(x => x.ongId === ongId)
  if (c) c.unreadCount = count
}

onMounted(async () => {
  const supabase = useSupabase()
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser()
    currentUserId.value = user?.id ?? null
  }

  try {
    const token = await getToken()
    conversations.value = await $fetch<ConvSummary[]>('/api/partner/conversations', {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (e: any) {
    useToast().add({ title: 'Erreur chargement messages', description: e?.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loading.value = false
  }
})
</script>
