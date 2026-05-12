<template>
  <div class="min-h-screen bg-background">
    <Header />

    <main class="container mx-auto px-4 py-6">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold">Pipeline de vérification</h1>
          <p class="text-sm text-muted-foreground">Gérez les dossiers ONG soumis à validation</p>
        </div>
        <div class="flex items-center gap-6">
          <!-- Lien historique -->
          <NuxtLink to="/admin/historique" class="text-sm text-primary hover:underline flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Historique des actions
          </NuxtLink>
          <!-- Métriques topbar (UX-DR4) -->
          <div class="flex gap-4 text-sm">
          <div class="text-center">
            <div class="font-bold text-amber-600">{{ metrics.urgent }}</div>
            <div class="text-muted-foreground text-xs">Urgents</div>
          </div>
          <div class="text-center">
            <div class="font-bold">{{ metrics.queue }}</div>
            <div class="text-muted-foreground text-xs">File d'attente</div>
          </div>
          <div class="text-center">
            <div class="font-bold text-green-600">{{ metrics.todayDone }}</div>
            <div class="text-muted-foreground text-xs">Traités aujourd'hui</div>
          </div>
        </div>
        </div>
      </div>

      <!-- Skeleton loader (UX-DR15) -->
      <div v-if="loading" class="flex gap-4">
        <div v-for="i in 4" :key="i" class="flex-1 min-w-[260px] space-y-3 animate-pulse">
          <div class="h-8 bg-muted rounded" />
          <div v-for="j in 3" :key="j" class="h-20 bg-muted rounded-xl" />
        </div>
      </div>

      <!-- Kanban -->
      <PipelineKanban
        v-else
        :columns="KANBAN_COLUMNS"
        :cards="cards"
        @card-click="openDossier"
      >
        <template #actions="{ card, column }">
          <!-- Actions inline (UX-DR4, size=sm) -->
          <template v-if="column === 'a_verifier' || column === 'en_cours'">
            <UButton size="xs" variant="outline" color="green" :loading="actionLoading === card.id + '-validate'" @click="validate(card)">
              Valider
            </UButton>
            <UButton size="xs" variant="ghost" color="amber" @click="openComplement(card)">
              Complément
            </UButton>
            <UButton size="xs" variant="ghost" color="red" @click="openReject(card)">
              Rejeter
            </UButton>
          </template>
          <template v-else-if="column === 'valide'">
            <UButton size="xs" variant="ghost" color="amber" @click="openSuspend(card)">
              Suspendre
            </UButton>
          </template>
        </template>
      </PipelineKanban>

      <!-- Modal détail dossier -->
      <UModal v-model="showDetail" fullscreen>
        <div v-if="selectedDossier" class="p-6 space-y-6 max-w-3xl mx-auto">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold">{{ selectedDossier.ong?.name }}</h2>
            <UButton variant="ghost" icon="i-heroicons-x-mark" @click="showDetail = false" />
          </div>

          <!-- Infos ONG -->
          <dl class="grid grid-cols-2 gap-3 text-sm">
            <dt class="text-muted-foreground">Statut</dt>
            <dd><BadgeVerifie :status="ongToBadge(selectedDossier.ong?.status)" /></dd>
            <dt class="text-muted-foreground">Email</dt>
            <dd>{{ selectedDossier.ong?.email ?? '—' }}</dd>
            <dt class="text-muted-foreground">Localisation</dt>
            <dd>{{ selectedDossier.ong?.location ?? '—' }}</dd>
            <dt class="text-muted-foreground">Mission</dt>
            <dd class="col-span-1">{{ selectedDossier.ong?.description ?? '—' }}</dd>
          </dl>

          <!-- Documents -->
          <div v-if="selectedDossier.documents?.length">
            <h3 class="text-sm font-semibold mb-2">Documents ({{ selectedDossier.documents.length }})</h3>
            <div class="space-y-2">
              <a
                v-for="doc in selectedDossier.documents"
                :key="doc.name"
                :href="doc.url"
                target="_blank"
                rel="noopener"
                class="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {{ doc.name }}
              </a>
            </div>
          </div>
          <div v-else class="text-sm text-muted-foreground">Aucun document uploadé</div>

          <!-- Historique (placeholder → Story 3.4) -->
          <div>
            <h3 class="text-sm font-semibold mb-2">Historique des actions</h3>
            <AuditTrailSection :ong-id="selectedCard?.id ?? ''" />
          </div>
        </div>
      </UModal>

      <!-- Modal rejet -->
      <UModal v-model="showRejectModal">
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">Rejeter le dossier</h3>
          <p class="text-sm text-muted-foreground">
            Cette action est irréversible. Veuillez indiquer le motif du rejet.
          </p>
          <UFormGroup label="Motif du rejet" required>
            <UTextarea v-model="rejectComment" :rows="3" placeholder="Expliquez pourquoi le dossier est rejeté..." />
          </UFormGroup>
          <div class="flex gap-3">
            <UButton variant="outline" class="flex-1" @click="showRejectModal = false">Annuler</UButton>
            <UButton color="red" class="flex-1" :disabled="!rejectComment.trim()" :loading="actionLoading === 'reject'" @click="confirmReject">
              Confirmer le rejet
            </UButton>
          </div>
        </div>
      </UModal>

      <!-- Modal suspension -->
      <UModal v-model="showSuspendModal">
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">Suspendre le badge</h3>
          <UFormGroup label="Motif de suspension" required>
            <UTextarea v-model="suspendComment" :rows="3" placeholder="Motif obligatoire..." />
          </UFormGroup>
          <div class="flex gap-3">
            <UButton variant="outline" class="flex-1" @click="showSuspendModal = false">Annuler</UButton>
            <UButton color="amber" class="flex-1" :disabled="!suspendComment.trim()" :loading="actionLoading === 'suspend'" @click="confirmSuspend">
              Confirmer la suspension
            </UButton>
          </div>
        </div>
      </UModal>

      <!-- Inline complément -->
      <UModal v-model="showComplementModal">
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold">Demander un complément</h3>
          <UFormGroup label="Message à l'agent">
            <UTextarea v-model="complementMsg" :rows="3" placeholder="Indiquez les documents ou informations manquants..." />
          </UFormGroup>
          <div class="flex gap-3">
            <UButton variant="outline" class="flex-1" @click="showComplementModal = false">Annuler</UButton>
            <UButton class="flex-1" :disabled="!complementMsg.trim()" :loading="actionLoading === 'complement'" @click="confirmComplement">
              Envoyer
            </UButton>
          </div>
        </div>
      </UModal>
    </main>
  </div>
</template>

<script setup lang="ts">
import PipelineKanban from '~/features/verification/components/PipelineKanban.vue'
import BadgeVerifie   from '~/features/verification/components/BadgeVerifie.vue'
import AuditTrailSection from '~/features/verification/components/AuditTrailSection.vue'
import { KANBAN_COLUMNS } from '~/features/verification/types'
import type { DossierCard } from '~/features/verification/types'
import type { BadgeStatus } from '~/features/verification/types'

definePageMeta({ middleware: ['auth', 'back-office'] })

const toast = useToast()

// ── State ────────────────────────────────────────────────────
const loading      = ref(true)
const cards        = ref<DossierCard[]>([])
const actionLoading = ref<string | null>(null)

const showDetail        = ref(false)
const selectedCard      = ref<DossierCard | null>(null)
const selectedDossier   = ref<{ ong: any; documents: any[] } | null>(null)

const showRejectModal    = ref(false)
const showSuspendModal   = ref(false)
const showComplementModal = ref(false)
const rejectComment    = ref('')
const suspendComment   = ref('')
const complementMsg    = ref('')
const actionTarget     = ref<DossierCard | null>(null)

// ── Métriques ────────────────────────────────────────────────
const metrics = computed(() => {
  const now = Date.now()
  const todayStart = new Date(); todayStart.setHours(0,0,0,0)
  return {
    urgent:    cards.value.filter(c => (now - new Date(c.submittedAt).getTime()) > 48*3_600_000 && !['verified','active'].includes(c.status)).length,
    queue:     cards.value.filter(c => !['verified','active'].includes(c.status)).length,
    todayDone: cards.value.filter(c => ['verified','active'].includes(c.status) && new Date(c.submittedAt) >= todayStart).length,
  }
})

function ongToBadge(status?: string): BadgeStatus {
  if (status === 'verified' || status === 'active') return 'verified'
  if (status === 'submitted' || status === 'under_review') return 'pending'
  if (status === 'complement_required') return 'suspended'
  return 'unverified'
}

// ── Load ─────────────────────────────────────────────────────
async function loadDossiers() {
  loading.value = true
  try {
    const supabase = useSupabase()
    const { data: { session } } = await supabase!.auth.getSession()
    const data = await $fetch<DossierCard[]>('/api/admin/dossiers', {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })
    cards.value = data
  } catch (e: any) {
    toast.add({ title: 'Erreur chargement', description: e.message, color: 'red', timeout: 5000 })
  } finally {
    loading.value = false
  }
}

async function openDossier(card: DossierCard) {
  selectedCard.value = card
  showDetail.value = true
  selectedDossier.value = null
  try {
    const supabase = useSupabase()
    const { data: { session } } = await supabase!.auth.getSession()

    // Transition automatique submitted → under_review à l'ouverture
    if (card.status === 'submitted') {
      await callAction(card.id, 'start-review').catch(() => {})
      cards.value = cards.value.map(c => c.id === card.id ? { ...c, status: 'under_review' } : c)
    }

    selectedDossier.value = await $fetch(`/api/admin/dossiers/${card.id}`, {
      headers: { Authorization: `Bearer ${session?.access_token}` }
    })
  } catch { selectedDossier.value = { ong: null, documents: [] } }
}

// ── Actions ──────────────────────────────────────────────────
async function callAction(ongId: string, action: string, body: Record<string, any> = {}) {
  const supabase = useSupabase()
  const { data: { session } } = await supabase!.auth.getSession()
  return $fetch(`/api/admin/dossiers/${ongId}/${action}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${session?.access_token}` },
    body,
  })
}

async function validate(card: DossierCard) {
  actionLoading.value = card.id + '-validate'
  try {
    await callAction(card.id, 'validate')
    cards.value = cards.value.map(c => c.id === card.id ? { ...c, status: 'verified' } : c)
    toast.add({ title: `${card.ongName} validée`, color: 'green', timeout: 4000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally { actionLoading.value = null }
}

function openReject(card: DossierCard)     { actionTarget.value = card; rejectComment.value = '';   showRejectModal.value = true }
function openSuspend(card: DossierCard)    { actionTarget.value = card; suspendComment.value = ''; showSuspendModal.value = true }
function openComplement(card: DossierCard) { actionTarget.value = card; complementMsg.value = '';  showComplementModal.value = true }

async function confirmReject() {
  if (!actionTarget.value) return
  actionLoading.value = 'reject'
  try {
    await callAction(actionTarget.value.id, 'reject', { comment: rejectComment.value })
    cards.value = cards.value.map(c => c.id === actionTarget.value!.id ? { ...c, status: 'rejected' } : c)
    showRejectModal.value = false
    toast.add({ title: 'Dossier rejeté', color: 'amber', timeout: 4000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally { actionLoading.value = null }
}

async function confirmSuspend() {
  if (!actionTarget.value) return
  actionLoading.value = 'suspend'
  try {
    await callAction(actionTarget.value.id, 'suspend', { comment: suspendComment.value })
    cards.value = cards.value.map(c => c.id === actionTarget.value!.id ? { ...c, status: 'complement_required' } : c)
    showSuspendModal.value = false
    toast.add({ title: 'Badge suspendu', color: 'amber', timeout: 4000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally { actionLoading.value = null }
}

async function confirmComplement() {
  if (!actionTarget.value) return
  actionLoading.value = 'complement'
  try {
    await callAction(actionTarget.value.id, 'complement', { message: complementMsg.value })
    cards.value = cards.value.map(c => c.id === actionTarget.value!.id ? { ...c, status: 'complement_required' } : c)
    showComplementModal.value = false
    toast.add({ title: 'Complément demandé', color: 'blue', timeout: 4000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally { actionLoading.value = null }
}

onMounted(loadDossiers)
</script>
