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

    <div class="mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Messages</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Vos échanges avec les ONGs</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="height: 600px">
      <!-- Liste des conversations -->
      <div class="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-border">
          <p class="text-sm font-semibold">ONGs contactées</p>
        </div>

        <div v-if="loading" class="p-4 space-y-3 animate-pulse flex-1">
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
          <p class="text-xs mt-1 leading-relaxed">Contactez une ONG depuis son profil public</p>
          <NuxtLink to="/" class="mt-4">
            <UButton size="sm" variant="outline">Découvrir les ONGs</UButton>
          </NuxtLink>
        </div>

        <div v-else class="flex-1 overflow-y-auto divide-y divide-border">
          <button
            v-for="conv in conversations"
            :key="conv.ongId"
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
            :class="selectedOngId === conv.ongId ? 'bg-muted/60' : ''"
            @click="selectedOngId = conv.ongId"
          >
            <div class="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {{ conv.ongName[0]?.toUpperCase() ?? '?' }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-1">
                <p class="text-sm font-medium truncate">{{ conv.ongName }}</p>
                <span
                  v-if="conv.unreadCount > 0"
                  class="shrink-0 inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
                >
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
        <div v-if="!selectedOngId" class="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Icon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 opacity-20 mb-3" />
          <p class="text-sm">Sélectionnez une conversation</p>
        </div>

        <template v-else>
          <div class="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {{ selectedConversation?.ongName[0]?.toUpperCase() ?? '?' }}
            </div>
            <p class="text-sm font-semibold">{{ selectedConversation?.ongName }}</p>
          </div>

          <PartnerMessagerie
            :key="selectedOngId"
            :ong-id="selectedOngId"
            viewer-role="partner"
            class="flex-1 min-h-0"
            @unread-count="onUnreadCount(selectedOngId, $event)"
          />
        </template>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import PartnerMessagerie from '~/features/messaging/components/PartnerMessagerie.vue'

definePageMeta({ middleware: ['auth'] })

interface ConvSummary { ongId: string; ongName: string; lastMessage: string; unreadCount: number }

const conversations = ref<ConvSummary[]>([])
const loading = ref(true)
const selectedOngId = ref<string | null>(null)

const selectedConversation = computed(() =>
  conversations.value.find(c => c.ongId === selectedOngId.value) ?? null
)

function onUnreadCount(ongId: string, count: number) {
  const c = conversations.value.find(x => x.ongId === ongId)
  if (c) c.unreadCount = count
}

onMounted(async () => {
  const supabase = useSupabase()
  if (!supabase) return
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

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
    loading.value = false
  }
})
</script>
