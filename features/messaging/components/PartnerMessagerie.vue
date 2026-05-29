<template>
  <div class="flex flex-col h-full">
    <!-- Liste des messages -->
    <div ref="scrollEl" class="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
      <div v-if="!loading && messages.length === 0" class="flex flex-col items-center justify-center h-full text-center py-8">
        <Icon name="i-heroicons-chat-bubble-left-right" class="w-10 h-10 text-muted-foreground/30 mb-2" />
        <p class="text-sm text-muted-foreground">Aucun message pour l'instant</p>
        <p class="text-xs text-muted-foreground mt-1">Démarrez la conversation ci-dessous</p>
      </div>

      <template v-if="loading">
        <div v-for="i in 3" :key="i" class="animate-pulse flex gap-2" :class="i % 2 ? '' : 'flex-row-reverse'">
          <div class="w-7 h-7 rounded-full bg-muted shrink-0" />
          <div class="space-y-1 flex-1" :class="i % 2 ? '' : 'items-end flex flex-col'">
            <div class="h-3 bg-muted rounded w-1/4" />
            <div class="h-12 bg-muted rounded-xl w-3/4" />
          </div>
        </div>
      </template>

      <template v-else>
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex gap-2.5"
          :class="isMine(msg) ? 'flex-row-reverse' : ''"
        >
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
            :class="msg.sender_role === 'agent'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'"
          >
            {{ msg.sender_role === 'agent' ? 'ONG' : 'BP' }}
          </div>

          <div class="flex flex-col gap-0.5 max-w-[75%]" :class="isMine(msg) ? 'items-end' : ''">
            <span class="text-xs text-muted-foreground">
              {{ msg.sender_role === 'agent' ? 'ONG' : 'Bailleur' }}
              · {{ formatTime(msg.created_at) }}
            </span>
            <div
              class="px-3 py-2 rounded-2xl text-sm leading-relaxed break-words"
              :class="isMine(msg)
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-muted text-foreground rounded-tl-sm'"
            >
              {{ msg.content }}
            </div>
            <div v-if="isMine(msg) && msg.read_at" class="text-xs text-muted-foreground flex items-center gap-1">
              <Icon name="i-heroicons-check" class="w-3 h-3" />
              Lu
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Zone de saisie -->
    <div class="shrink-0 border-t border-border p-3">
      <div class="flex gap-2">
        <textarea
          v-model="draft"
          rows="2"
          placeholder="Votre message…"
          class="flex-1 resize-none px-3 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
          @keydown.enter.exact.prevent="send"
          @keydown.enter.shift.exact.prevent="draft += '\n'"
        />
        <UButton
          :loading="sending"
          :disabled="!draft.trim()"
          color="primary"
          size="sm"
          class="self-end"
          @click="send"
        >
          <Icon name="i-heroicons-paper-airplane" class="w-4 h-4" />
        </UButton>
      </div>
      <p class="text-xs text-muted-foreground mt-1">Entrée pour envoyer · Maj+Entrée pour sauter une ligne</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  fetchPartnerMessages,
  postPartnerMessage,
} from '~/features/messaging/services/partner-messagerie.service'
import type { PartnerMessage } from '~/features/messaging/services/partner-messagerie.service'

const props = defineProps<{
  ongId: string
  viewerRole: 'agent' | 'partner'
  partnerId?: string  // requis si viewerRole = 'agent'
}>()

const emit = defineEmits<{
  'unread-count': [count: number]
}>()

const toast = useToast()
const scrollEl = ref<HTMLElement | null>(null)
const messages = ref<PartnerMessage[]>([])
const draft = ref('')
const loading = ref(true)
const sending = ref(false)
let realtimeChannel: any = null

const unreadCount = computed(() =>
  messages.value.filter(m => m.sender_role !== props.viewerRole && !m.read_at).length
)

watch(unreadCount, count => emit('unread-count', count))

function isMine(msg: PartnerMessage) {
  return msg.sender_role === props.viewerRole
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  })
}

async function load() {
  loading.value = true
  try {
    messages.value = await fetchPartnerMessages(props.ongId, props.partnerId)
    scrollToBottom()
    await markRead()
  } catch {
    toast.add({ title: 'Erreur chargement messages', color: 'red' })
  } finally {
    loading.value = false
  }
}

async function markRead() {
  const supabase = useSupabase()
  if (!supabase) return
  const unread = messages.value.filter(m => m.sender_role !== props.viewerRole && !m.read_at)
  if (!unread.length) return
  await supabase
    .from('ong_partner_messages')
    .update({ read_at: new Date().toISOString() })
    .in('id', unread.map(m => m.id))
  messages.value = messages.value.map(m =>
    unread.some(u => u.id === m.id) ? { ...m, read_at: new Date().toISOString() } : m
  )
}

async function send() {
  const content = draft.value.trim()
  if (!content || sending.value) return
  sending.value = true
  try {
    const msg = await postPartnerMessage(props.ongId, content, props.partnerId)
    messages.value.push(msg)
    draft.value = ''
    scrollToBottom()
  } catch (e: any) {
    toast.add({ title: 'Erreur envoi', description: e.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    sending.value = false
  }
}

function subscribeRealtime() {
  const supabase = useSupabase()
  if (!supabase) return

  const pid = props.partnerId ?? ''
  const channelFilter = props.viewerRole === 'agent' && pid
    ? `ong_id=eq.${props.ongId},partner_id=eq.${pid}`
    : `ong_id=eq.${props.ongId}`

  realtimeChannel = supabase
    .channel(`opm-${props.ongId}-${pid}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'ong_partner_messages', filter: `ong_id=eq.${props.ongId}` },
      (payload: any) => {
        // Filtrer côté client selon le partner_id si nécessaire
        if (pid && payload.new.partner_id !== pid) return
        const exists = messages.value.some(m => m.id === payload.new.id)
        if (!exists) {
          messages.value.push(payload.new as PartnerMessage)
          scrollToBottom()
          if (payload.new.sender_role !== props.viewerRole) markRead()
        }
      }
    )
    .subscribe()
}

onMounted(async () => {
  await load()
  subscribeRealtime()
})

onUnmounted(() => {
  const supabase = useSupabase()
  if (realtimeChannel && supabase) supabase.removeChannel(realtimeChannel)
})
</script>
