<template>
  <div class="space-y-6">
    <PageHeader title="Messagerie" subtitle="Supervision de toutes les conversations Bailleur ↔ ONG" />

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4" style="height: 640px">
      <!-- Colonne 1 : Liste des ONGs -->
      <div class="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-border">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">ONGs</p>
        </div>
        <div v-if="loading" class="p-4 space-y-3 animate-pulse flex-1">
          <div v-for="i in 5" :key="i" class="h-8 bg-muted rounded" />
        </div>
        <div v-else-if="!ongs.length" class="flex-1 flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
          Aucune conversation
        </div>
        <div v-else class="flex-1 overflow-y-auto divide-y divide-border">
          <button
            v-for="ong in ongs"
            :key="ong.id"
            class="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
            :class="selectedOngId === ong.id ? 'bg-muted/60' : ''"
            @click="selectOng(ong.id)"
          >
            <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center shrink-0 text-xs font-bold text-emerald-700 dark:text-emerald-300">
              {{ ong.name[0]?.toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ ong.name }}</p>
              <p class="text-xs text-muted-foreground">{{ ong.partnerCount }} bailleur{{ ong.partnerCount > 1 ? 's' : '' }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Colonne 2 : Bailleurs de l'ONG sélectionnée -->
      <div class="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-border">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Bailleurs</p>
        </div>
        <div v-if="!selectedOngId" class="flex-1 flex items-center justify-center text-muted-foreground text-sm p-4 text-center">
          Sélectionnez une ONG
        </div>
        <div v-else class="flex-1 overflow-y-auto divide-y divide-border">
          <button
            v-for="partner in partnersForOng"
            :key="partner.id"
            class="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-muted/40 transition-colors text-left"
            :class="selectedPartnerId === partner.id ? 'bg-muted/60' : ''"
            @click="selectedPartnerId = partner.id"
          >
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shrink-0 text-xs font-bold text-blue-700 dark:text-blue-300">
              {{ initials(partner.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ partner.name }}</p>
              <p class="text-xs text-muted-foreground truncate">{{ partner.email }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Colonne 3-4 : Conversation (lecture seule) -->
      <div class="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div v-if="!selectedPartnerId" class="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Icon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 opacity-20 mb-3" />
          <p class="text-sm">Sélectionnez une conversation</p>
        </div>
        <template v-else>
          <div class="px-4 py-3 border-b border-border flex items-center gap-2 shrink-0">
            <Icon name="i-heroicons-eye" class="w-4 h-4 text-muted-foreground" />
            <p class="text-sm font-semibold">{{ selectedPartnerName }} ↔ {{ selectedOngName }}</p>
            <UBadge color="orange" variant="soft" size="xs" class="ml-auto">Lecture seule</UBadge>
          </div>
          <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 space-y-3">
            <div v-if="loadingMessages" class="animate-pulse space-y-3">
              <div v-for="i in 4" :key="i" class="h-12 bg-muted rounded-xl w-3/4" :class="i % 2 ? '' : 'ml-auto'" />
            </div>
            <template v-else-if="conversationMessages.length">
              <div
                v-for="msg in conversationMessages"
                :key="msg.id"
                class="flex gap-2.5"
                :class="msg.sender_role === 'partner' ? 'flex-row-reverse' : ''"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  :class="msg.sender_role === 'agent'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'"
                >
                  {{ msg.sender_role === 'agent' ? 'ONG' : 'BP' }}
                </div>
                <div class="flex flex-col gap-0.5 max-w-[75%]" :class="msg.sender_role === 'partner' ? 'items-end' : ''">
                  <span class="text-xs text-muted-foreground">
                    {{ msg.sender_role === 'agent' ? 'ONG' : 'Bailleur' }} · {{ formatTime(msg.created_at) }}
                  </span>
                  <div
                    class="px-3 py-2 rounded-2xl text-sm leading-relaxed break-words"
                    :class="msg.sender_role === 'partner'
                      ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'"
                  >
                    {{ msg.content }}
                  </div>
                </div>
              </div>
            </template>
            <div v-else class="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground py-8">
              <Icon name="i-heroicons-chat-bubble-left-right" class="w-8 h-8 opacity-30 mb-2" />
              <p class="text-sm">Aucun message</p>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getToken } from '~/features/auth/utils/getToken'

definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

interface RawMessage {
  id: string
  ong_id: string
  partner_id: string
  sender_role: 'agent' | 'partner'
  content: string
  read_at: string | null
  created_at: string
  ongs: { id: string; name: string } | null
  accounts: { id: string; first_name: string; last_name: string; email: string } | null
}

interface OngSummary  { id: string; name: string; partnerCount: number }
interface PartnerInfo { id: string; name: string; email: string }

const loading        = ref(true)
const loadingMessages = ref(false)
const allMessages    = ref<RawMessage[]>([])
const selectedOngId  = ref<string | null>(null)
const selectedPartnerId = ref<string | null>(null)
const scrollEl       = ref<HTMLElement | null>(null)

const ongs = computed<OngSummary[]>(() => {
  const map = new Map<string, OngSummary>()
  for (const m of allMessages.value) {
    if (!map.has(m.ong_id)) {
      map.set(m.ong_id, { id: m.ong_id, name: m.ongs?.name ?? m.ong_id.slice(0, 8), partnerCount: 0 })
    }
    const ong = map.get(m.ong_id)!
    // compter les partenaires distincts
    const partners = new Set(allMessages.value.filter(x => x.ong_id === m.ong_id).map(x => x.partner_id))
    ong.partnerCount = partners.size
  }
  return Array.from(map.values())
})

const partnersForOng = computed<PartnerInfo[]>(() => {
  if (!selectedOngId.value) return []
  const map = new Map<string, PartnerInfo>()
  for (const m of allMessages.value.filter(x => x.ong_id === selectedOngId.value)) {
    if (!map.has(m.partner_id)) {
      const acc = m.accounts
      map.set(m.partner_id, {
        id: m.partner_id,
        name: acc ? `${acc.first_name} ${acc.last_name}`.trim() || acc.email : m.partner_id.slice(0, 8),
        email: acc?.email ?? '',
      })
    }
  }
  return Array.from(map.values())
})

const conversationMessages = computed(() => {
  if (!selectedOngId.value || !selectedPartnerId.value) return []
  return allMessages.value
    .filter(m => m.ong_id === selectedOngId.value && m.partner_id === selectedPartnerId.value)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
})

const selectedOngName = computed(() => ongs.value.find(o => o.id === selectedOngId.value)?.name ?? '')
const selectedPartnerName = computed(() => partnersForOng.value.find(p => p.id === selectedPartnerId.value)?.name ?? '')

function selectOng(id: string) {
  selectedOngId.value = id
  selectedPartnerId.value = null
}

function initials(name: string) {
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '?'
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit',
  })
}

watch([selectedOngId, selectedPartnerId], () => {
  nextTick(() => {
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  })
})

onMounted(async () => {
  const token = await getToken()
  try {
    allMessages.value = await $fetch<RawMessage[]>('/api/admin/messages', {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch (e: any) {
    useToast().add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loading.value = false
  }
})
</script>
