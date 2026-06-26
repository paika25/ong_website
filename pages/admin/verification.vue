<template>
  <div>
      <PageHeader title="Pipeline de vérification" :subtitle="`${cards.length} dossier${cards.length > 1 ? 's' : ''} au total`" class="mb-6" />

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
          <!-- Actions sur les dossiers actionnables (pas les brouillons purs ni les clôturés) -->
          <template v-if="column === 'a_verifier' && ['submitted', 'under_review', 'complement_required'].includes(card.status)">
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
          <template v-else-if="column === 'badge_suspendu'">
            <UButton size="xs" variant="outline" color="green" :loading="actionLoading === card.id + '-reactivate'" @click="reactivate(card)">
              Réactiver
            </UButton>
            <UButton size="xs" variant="ghost" color="red" @click="openDeactivate(card)">
              Désactiver
            </UButton>
          </template>
          <template v-else-if="column === 'valide'">
            <UButton size="xs" variant="ghost" color="amber" @click="openSuspend(card)">
              Suspendre
            </UButton>
            <UButton size="xs" variant="ghost" color="red" @click="openDeactivate(card)">
              Désactiver
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
            <dd><OngStatus :status="selectedDossier.ong?.status ?? ''" size="md" /></dd>
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

          <!-- Onglets : Messagerie | Historique -->
          <UTabs :items="[{ label: 'Messages', key: 'messages', icon: 'i-heroicons-chat-bubble-left-right' }, { label: 'Historique', key: 'audit', icon: 'i-heroicons-clock' }]">
            <template #item="{ item }">
              <div v-if="item.key === 'messages'" class="border border-border rounded-xl overflow-hidden" style="height: 340px; display: flex; flex-direction: column;">
                <DossierMessagerie
                  v-if="selectedCard?.id"
                  :ong-id="selectedCard.id"
                  viewer-role="back_office"
                  api-base="/api/admin/dossiers"
                  class="flex-1 min-h-0"
                />
              </div>
              <div v-else-if="item.key === 'audit'">
                <AuditTrailSection :ong-id="selectedCard?.id ?? ''" />
              </div>
            </template>
          </UTabs>
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

      <!-- Modal désactivation définitive -->
      <UModal v-model="showDeactivateModal">
        <div class="p-6 space-y-4">
          <h3 class="text-lg font-semibold text-red-600">Désactiver l'ONG</h3>
          <p class="text-sm text-muted-foreground">
            Cette action rend l'ONG inactive et la retire de la marketplace. Elle ne peut être réactivée que manuellement.
          </p>
          <UFormGroup label="Motif de désactivation" required>
            <UTextarea v-model="deactivateComment" :rows="3" placeholder="Motif obligatoire..." />
          </UFormGroup>
          <div class="flex gap-3">
            <UButton variant="outline" class="flex-1" @click="showDeactivateModal = false">Annuler</UButton>
            <UButton color="red" class="flex-1" :disabled="!deactivateComment.trim()" :loading="actionLoading === 'deactivate'" @click="confirmDeactivate">
              Désactiver définitivement
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
  </div>
</template>

<script setup lang="ts">
import PipelineKanban from '~/features/verification/components/PipelineKanban.vue'

import AuditTrailSection from '~/features/verification/components/AuditTrailSection.vue'
import DossierMessagerie from '~/features/verification/components/DossierMessagerie.vue'
import { getDossiers, getDossier, callDossierAction } from '~/features/verification/services/dossier.service'
import { KANBAN_COLUMNS } from '~/features/verification/types'
import type { DossierCard } from '~/features/verification/types'


definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

const toast = useToast()

// ── State ────────────────────────────────────────────────────
const loading      = ref(true)
const cards        = ref<DossierCard[]>([])
const actionLoading = ref<string | null>(null)

const showDetail        = ref(false)
const selectedCard      = ref<DossierCard | null>(null)
const selectedDossier   = ref<{ ong: any; documents: any[] } | null>(null)

const showRejectModal     = ref(false)
const showSuspendModal    = ref(false)
const showComplementModal = ref(false)
const showDeactivateModal = ref(false)
const rejectComment    = ref('')
const suspendComment   = ref('')
const complementMsg    = ref('')
const deactivateComment = ref('')
const actionTarget     = ref<DossierCard | null>(null)




// ── Load ─────────────────────────────────────────────────────
async function loadDossiers() {
  loading.value = true
  try {
    cards.value = await getDossiers()
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
    if (card.status === 'pending' || card.status === 'submitted') {
      try {
        await callDossierAction(card.id, 'start-review')
        // Mise à jour locale uniquement si l'API confirme
        cards.value = cards.value.map(c => c.id === card.id ? { ...c, status: 'under_review' } : c)
      } catch (e: any) {
        const msg = e?.data?.statusMessage ?? e?.message ?? 'Erreur lors du passage en revue'
        toast.add({ title: 'Transition échouée', description: msg, color: 'red', timeout: 5000 })
      }
    }
    selectedDossier.value = await getDossier(card.id)
  } catch { selectedDossier.value = { ong: null, documents: [] } }
}

async function validate(card: DossierCard) {
  actionLoading.value = card.id + '-validate'
  try {
    await callDossierAction(card.id, 'validate')
    cards.value = cards.value.map(c => c.id === card.id ? { ...c, status: 'verified' } : c)
    toast.add({ title: `${card.ongName} validée`, color: 'green', timeout: 4000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally { actionLoading.value = null }
}

function openReject(card: DossierCard)     { actionTarget.value = card; rejectComment.value = '';    showRejectModal.value = true }
function openSuspend(card: DossierCard)    { actionTarget.value = card; suspendComment.value = '';  showSuspendModal.value = true }
function openComplement(card: DossierCard) { actionTarget.value = card; complementMsg.value = '';   showComplementModal.value = true }
function openDeactivate(card: DossierCard) { actionTarget.value = card; deactivateComment.value = ''; showDeactivateModal.value = true }

async function reactivate(card: DossierCard) {
  actionLoading.value = card.id + '-reactivate'
  try {
    await callDossierAction(card.id, 'reactivate')
    cards.value = cards.value.map(c => c.id === card.id ? { ...c, status: 'verified' } : c)
    toast.add({ title: `${card.ongName} réactivée`, color: 'green', timeout: 4000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally { actionLoading.value = null }
}

async function confirmReject() {
  if (!actionTarget.value) return
  actionLoading.value = 'reject'
  try {
    await callDossierAction(actionTarget.value.id, 'reject', { comment: rejectComment.value })
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
    await callDossierAction(actionTarget.value.id, 'suspend', { comment: suspendComment.value })
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
    await callDossierAction(actionTarget.value.id, 'complement', { message: complementMsg.value })
    cards.value = cards.value.map(c => c.id === actionTarget.value!.id ? { ...c, status: 'complement_required' } : c)
    showComplementModal.value = false
    toast.add({ title: 'Complément demandé', color: 'blue', timeout: 4000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally { actionLoading.value = null }
}

async function confirmDeactivate() {
  if (!actionTarget.value) return
  actionLoading.value = 'deactivate'
  try {
    await callDossierAction(actionTarget.value.id, 'deactivate', { comment: deactivateComment.value })
    cards.value = cards.value.filter(c => c.id !== actionTarget.value!.id)
    showDeactivateModal.value = false
    toast.add({ title: `${actionTarget.value.ongName} désactivée`, color: 'red', timeout: 4000 })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e.data?.statusMessage ?? e.message, color: 'red', timeout: 5000 })
  } finally { actionLoading.value = null }
}

onMounted(loadDossiers)
</script>
