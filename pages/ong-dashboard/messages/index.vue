<template>
  <div class="space-y-6 h-full">
    <div>
      <h1 class="text-2xl font-bold">Messages</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Échanges avec vos bailleurs de fonds et l'administration Paika</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[600px] h-full">
      <!-- Liste des conversations -->
      <div class="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-border space-y-2.5">
          <p class="text-sm font-semibold">Conversations</p>
          <RechercheInput v-model="searchQuery" placeholder="Rechercher un bailleur…" />
        </div>

        <ConversationList
          :items="conversationItems"
          :selected-id="selectedPartnerId"
          :loading="loadingConvs"
          empty-title="Aucune conversation"
          :empty-hint="searchQuery ? 'Aucun résultat pour cette recherche' : 'Les bailleurs vous contacteront via votre profil public'"
          @select="selectedPartnerId = $event"
        />
      </div>

      <!-- Fenêtre de conversation -->
      <div class="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div v-if="!selectedPartnerId" class="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Icon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 opacity-20 mb-3" />
          <p class="text-sm">Sélectionnez une conversation</p>
        </div>

        <template v-else-if="selectedPartnerId === ADMIN_ID">
          <div class="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary">
              <Icon name="i-heroicons-shield-check" class="w-4 h-4" />
            </div>
            <div>
              <p class="text-sm font-semibold">Administration Paika</p>
              <p class="text-xs text-muted-foreground">Support et suivi de votre dossier</p>
            </div>
          </div>

          <DossierMessagerie
            :key="ADMIN_ID"
            :ong-id="ongId"
            viewer-role="agent"
            api-base="/api/ongs"
            hide-header
            class="flex-1 min-h-0"
            @unread-count="adminUnreadCount = $event"
          />
        </template>

        <template v-else>
          <div class="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-sm font-bold text-blue-700 dark:text-blue-300">
              {{ initials(selectedConversation?.partnerName ?? '') }}
            </div>
            <div>
              <p class="text-sm font-semibold">{{ selectedConversation?.partnerName }}</p>
              <p class="text-xs text-muted-foreground">{{ selectedConversation?.partnerEmail }}</p>
            </div>
          </div>

          <PartnerMessagerie
            :key="selectedPartnerId"
            :ong-id="ongId"
            viewer-role="agent"
            :partner-id="selectedPartnerId"
            class="flex-1 min-h-0"
            @unread-count="onUnreadCount(selectedPartnerId, $event)"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PartnerMessagerie from '~/features/messaging/components/PartnerMessagerie.vue'
import DossierMessagerie from '~/features/verification/components/DossierMessagerie.vue'
import ConversationList from '~/features/messaging/components/ConversationList.vue'
import RechercheInput from '~/features/messaging/components/RechercheInput.vue'
import { fetchPartnerConversations } from '~/features/messaging/services/partner-messagerie.service'
import type { PartnerConversation } from '~/features/messaging/services/partner-messagerie.service'
import type { ConversationListItem } from '~/features/messaging/components/ConversationList.vue'

definePageMeta({ layout: 'ong', middleware: ['auth', 'agent-only'] })

const toast = useToast()

// Récupérer l'ONG de l'agent connecté
const supabase = useSupabase()
const ongId = ref('')

const conversations     = ref<PartnerConversation[]>([])
const loadingConvs      = ref(true)
const selectedPartnerId = ref<string | null>(null)
const searchQuery       = ref('')

// Conversation épinglée avec l'administration Paika (canal back-office ↔ ONG)
const ADMIN_ID = 'admin'
const ADMIN_NAME = 'Administration Paika'
const adminUnreadCount = ref(0)

const filteredConversations = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return conversations.value
  return conversations.value.filter(c =>
    c.partnerName.toLowerCase().includes(q) || c.partnerEmail.toLowerCase().includes(q)
  )
})

const conversationItems = computed<ConversationListItem[]>(() => {
  const partnerItems = filteredConversations.value.map(c => ({
    id: c.partnerId,
    name: c.partnerName,
    preview: c.lastMessage,
    avatarUrl: c.partnerAvatar,
    unreadCount: c.unreadCount,
  }))

  const q = searchQuery.value.trim().toLowerCase()
  if (q && !ADMIN_NAME.toLowerCase().includes(q)) return partnerItems

  const adminItem: ConversationListItem = {
    id: ADMIN_ID,
    name: ADMIN_NAME,
    preview: 'Posez vos questions à l\'équipe back-office',
    unreadCount: adminUnreadCount.value,
  }
  return [adminItem, ...partnerItems]
})

const selectedConversation = computed(() =>
  conversations.value.find(c => c.partnerId === selectedPartnerId.value) ?? null
)

function initials(name: string): string {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '?'
}

function onUnreadCount(partnerId: string, count: number) {
  const conv = conversations.value.find(c => c.partnerId === partnerId)
  if (conv) conv.unreadCount = count
}

async function loadOngId() {
  if (!supabase) return
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data } = await supabase
    .from('ongs')
    .select('id')
    .eq('account_id', user.id)
    .maybeSingle()
  if (data) ongId.value = data.id
}

async function loadConversations() {
  if (!ongId.value) return
  loadingConvs.value = true
  try {
    conversations.value = await fetchPartnerConversations(ongId.value)
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e?.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loadingConvs.value = false
  }
}

onMounted(async () => {
  await loadOngId()
  await loadConversations()
})
</script>
