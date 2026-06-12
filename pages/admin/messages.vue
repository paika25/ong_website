<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Messagerie</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Échangez avec les ONGs et supervisez leurs conversations avec les bailleurs</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4" style="height: 640px">
      <!-- Annuaire ONGs + bailleurs -->
      <div class="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div class="px-4 py-3 border-b border-border space-y-2.5">
          <p class="text-sm font-semibold">Conversations</p>
          <RechercheInput v-model="searchQuery" placeholder="Rechercher une ONG ou un bailleur…" />
        </div>

        <ConversationList
          :items="conversationItems"
          :selected-id="selectedKey"
          :loading="loading"
          empty-title="Aucun résultat"
          :empty-hint="searchQuery ? 'Aucune ONG ni bailleur ne correspond à cette recherche' : ''"
          @select="selectedKey = $event"
        />
      </div>

      <!-- Conversation sélectionnée -->
      <div class="md:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <div v-if="!selectedKey" class="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground">
          <Icon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 opacity-20 mb-3" />
          <p class="text-sm">Sélectionnez une ONG ou un bailleur</p>
        </div>

        <!-- Conversation directe back-office ↔ ONG (lecture/écriture) -->
        <template v-else-if="selectedKind === 'ong' && selectedOng">
          <div class="px-4 py-3 border-b border-border flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center text-sm font-bold text-emerald-700 dark:text-emerald-300">
              {{ selectedOng.name[0]?.toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-semibold">{{ selectedOng.name }}</p>
              <p class="text-xs text-muted-foreground">{{ selectedOng.agentEmail }}</p>
            </div>
          </div>

          <DossierMessagerie
            :key="selectedOng.id"
            :ong-id="selectedOng.id"
            viewer-role="back_office"
            api-base="/api/admin/dossiers"
            hide-header
            class="flex-1 min-h-0"
          />
        </template>

        <!-- Bailleur : message direct (back-office) ou supervision conversations ONG -->
        <template v-else-if="selectedKind === 'partner' && selectedPartner">
          <div class="px-4 py-3 border-b border-border shrink-0 space-y-2">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold">{{ selectedPartner.name }}</p>
              <p class="text-xs text-muted-foreground">{{ selectedPartner.email }}</p>
            </div>
            <div class="flex gap-1.5">
              <button
                class="px-2.5 py-1 text-xs rounded-full border transition-colors"
                :class="partnerView === 'direct'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted/40'"
                @click="partnerView = 'direct'"
              >
                Message direct
              </button>
              <button
                class="px-2.5 py-1 text-xs rounded-full border transition-colors"
                :class="partnerView === 'ongs'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted/40'"
                @click="partnerView = 'ongs'"
              >
                Conversations ONG
              </button>
            </div>
          </div>

          <!-- Message direct back-office ↔ bailleur (lecture/écriture) -->
          <PartnerAdminMessagerie
            v-if="partnerView === 'direct'"
            :key="selectedPartner.id"
            :partner-id="selectedPartner.id"
            viewer-role="back_office"
            hide-header
            class="flex-1 min-h-0"
          />

          <!-- Supervision bailleur ↔ ONG (lecture seule) -->
          <template v-else>
            <div v-if="selectedPartnerOngs.length > 1" class="px-4 py-2.5 border-b border-border shrink-0 flex flex-wrap items-center gap-1.5">
              <UBadge color="orange" variant="soft" size="xs">Lecture seule</UBadge>
              <button
                v-for="o in selectedPartnerOngs"
                :key="o.ongId"
                class="px-2.5 py-1 text-xs rounded-full border transition-colors"
                :class="selectedPartnerOngId === o.ongId
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted/40'"
                @click="selectedPartnerOngId = o.ongId"
              >
                {{ o.ongName }}
              </button>
            </div>
            <div v-else class="px-4 py-2.5 border-b border-border shrink-0 flex items-center gap-2">
              <UBadge color="orange" variant="soft" size="xs">Lecture seule</UBadge>
              <p v-if="selectedPartnerOngs.length === 1" class="text-xs text-muted-foreground">
                Conversation avec {{ selectedPartnerOngs[0].ongName }}
              </p>
            </div>

            <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 space-y-3">
              <template v-if="partnerConversationMessages.length">
                <div
                  v-for="msg in partnerConversationMessages"
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
                <p class="text-sm">{{ selectedPartnerOngs.length ? 'Aucun message' : "Ce bailleur n'a encore échangé avec aucune ONG" }}</p>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getToken } from '~/features/auth/utils/getToken'
import DossierMessagerie from '~/features/verification/components/DossierMessagerie.vue'
import ConversationList from '~/features/messaging/components/ConversationList.vue'
import RechercheInput from '~/features/messaging/components/RechercheInput.vue'
import PartnerAdminMessagerie from '~/features/messaging/components/PartnerAdminMessagerie.vue'
import type { ConversationListItem } from '~/features/messaging/components/ConversationList.vue'

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

interface DossierRow {
  id: string
  ongName: string
  status: string
  agentEmail: string
}

interface UserRow {
  id: string
  email: string
  accountType: string
  firstName: string | null
  lastName: string | null
  companyName: string | null
}

interface OngEntry     { id: string; name: string; agentEmail: string }
interface PartnerEntry { id: string; name: string; email: string }

const loading     = ref(true)
const allMessages = ref<RawMessage[]>([])
const allOngs     = ref<OngEntry[]>([])
const allPartners = ref<PartnerEntry[]>([])
const selectedKey = ref<string | null>(null)
const searchQuery = ref('')
const scrollEl    = ref<HTMLElement | null>(null)

const selectedPartnerOngId = ref<string | null>(null)
const partnerView = ref<'direct' | 'ongs'>('direct')

// Clé = "ong:<id>" ou "partner:<id>" — préfixe pour distinguer les deux annuaires fusionnés
const selectedKind = computed<'ong' | 'partner' | null>(() => {
  if (!selectedKey.value) return null
  return selectedKey.value.startsWith('ong:') ? 'ong' : 'partner'
})
const selectedId = computed(() => selectedKey.value ? selectedKey.value.slice(selectedKey.value.indexOf(':') + 1) : null)

const selectedOng     = computed(() => selectedKind.value === 'ong' ? allOngs.value.find(o => o.id === selectedId.value) ?? null : null)
const selectedPartner = computed(() => selectedKind.value === 'partner' ? allPartners.value.find(p => p.id === selectedId.value) ?? null : null)

// Toutes les ONGs avec lesquelles le bailleur sélectionné a échangé (issu des messages déjà chargés)
const selectedPartnerOngs = computed(() => {
  if (!selectedPartner.value) return []
  const map = new Map<string, { ongId: string; ongName: string }>()
  for (const m of allMessages.value) {
    if (m.partner_id !== selectedPartner.value.id) continue
    if (!map.has(m.ong_id)) map.set(m.ong_id, { ongId: m.ong_id, ongName: m.ongs?.name ?? m.ong_id.slice(0, 8) })
  }
  return Array.from(map.values())
})

const partnerConversationMessages = computed(() => {
  if (!selectedPartner.value || !selectedPartnerOngId.value) return []
  return allMessages.value
    .filter(m => m.partner_id === selectedPartner.value!.id && m.ong_id === selectedPartnerOngId.value)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
})

// Au changement de bailleur sélectionné, pointer sur sa conversation la plus récente
watch(selectedPartner, () => {
  selectedPartnerOngId.value = selectedPartnerOngs.value[0]?.ongId ?? null
  partnerView.value = 'direct'
})

const conversationItems = computed<ConversationListItem[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  const matches = (...vals: (string | null | undefined)[]) =>
    !q || vals.some(v => v?.toLowerCase().includes(q))

  const ongItems: ConversationListItem[] = allOngs.value
    .filter(o => matches(o.name, o.agentEmail))
    .map(o => ({
      id: `ong:${o.id}`,
      name: o.name,
      preview: o.agentEmail,
      badge: 'ONG',
      avatarColor: 'emerald',
    }))

  const partnerItems: ConversationListItem[] = allPartners.value
    .filter(p => matches(p.name, p.email))
    .map((p) => {
      const lastMsg = allMessages.value.find(m => m.partner_id === p.id)
      return {
        id: `partner:${p.id}`,
        name: p.name,
        preview: lastMsg?.content ?? p.email,
        badge: 'Bailleur',
        avatarColor: 'blue',
      }
    })

  return [...ongItems, ...partnerItems].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
})

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short',
    hour: '2-digit', minute: '2-digit',
  })
}

watch([selectedPartnerOngId, selectedKey], () => {
  nextTick(() => {
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  })
})

onMounted(async () => {
  const token = await getToken()
  const headers = { Authorization: `Bearer ${token}` }
  try {
    const [messages, dossiers, partners] = await Promise.all([
      $fetch<RawMessage[]>('/api/admin/messages', { headers }),
      $fetch<DossierRow[]>('/api/admin/dossiers', { headers }),
      $fetch<UserRow[]>('/api/admin/users', { headers, query: { type: 'user_partner' } }),
    ])

    allMessages.value = messages
    allOngs.value = dossiers.map(d => ({ id: d.id, name: d.ongName, agentEmail: d.agentEmail }))
    allPartners.value = partners.map(p => ({
      id: p.id,
      name: [p.firstName, p.lastName].filter(Boolean).join(' ').trim() || p.companyName || p.email,
      email: p.email,
    }))
  } catch (e: any) {
    useToast().add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loading.value = false
  }
})
</script>
