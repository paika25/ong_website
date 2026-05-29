<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Messages partenaires</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Conversations avec vos bailleurs de fonds</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <!-- Liste des conversations -->
      <div class="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-border">
          <p class="text-sm font-semibold">Conversations</p>
        </div>

        <div v-if="loadingConvs" class="p-4 space-y-3 animate-pulse flex-1">
          <div v-for="i in 4" :key="i" class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-muted shrink-0" />
            <div class="flex-1 space-y-1.5">
              <div class="h-3 bg-muted rounded w-2/3" />
              <div class="h-2.5 bg-muted rounded w-full" />
            </div>
          </div>
        </div>

        <div v-else-if="!conversations.length" class="flex-1 flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
          <Icon name="i-heroicons-chat-bubble-left-right" class="w-10 h-10 opacity-30 mb-2" />
          <p class="text-sm">Aucune conversation</p>
          <p class="text-xs mt-1">Les bailleurs vous contacteront via votre profil public</p>
        </div>

        <div v-else class="flex-1 overflow-y-auto divide-y divide-border">
          <button
            v-for="conv in conversations"
            :key="conv.partnerId"
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
            :class="selectedPartnerId === conv.partnerId ? 'bg-muted/60' : ''"
            @click="selectConversation(conv)"
          >
            <div class="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 text-sm font-bold text-blue-700 dark:text-blue-300">
              {{ initials(conv.partnerName) }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1">
                <p class="text-sm font-medium truncate">{{ conv.partnerName }}</p>
                <span v-if="conv.unreadCount > 0" class="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {{ conv.unreadCount }}
                </span>
              </div>
              <p class="text-xs text-muted-foreground truncate">{{ conv.lastMessage }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Fenêtre de conversation -->
      <div class="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div v-if="!selectedPartnerId" class="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Icon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 opacity-20 mb-3" />
          <p class="text-sm">Sélectionnez une conversation</p>
        </div>

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
import { fetchPartnerConversations } from '~/features/messaging/services/partner-messagerie.service'
import type { PartnerConversation } from '~/features/messaging/services/partner-messagerie.service'

definePageMeta({ layout: 'ong', middleware: ['auth', 'agent-only'] })

const toast = useToast()

// Récupérer l'ONG de l'agent connecté
const supabase = useSupabase()
const ongId = ref('')

const conversations     = ref<PartnerConversation[]>([])
const loadingConvs      = ref(true)
const selectedPartnerId = ref<string | null>(null)

const selectedConversation = computed(() =>
  conversations.value.find(c => c.partnerId === selectedPartnerId.value) ?? null
)

function initials(name: string): string {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '?'
}

function selectConversation(conv: PartnerConversation) {
  selectedPartnerId.value = conv.partnerId
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
