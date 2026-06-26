<template>
  <div class="space-y-6 max-w-4xl">
    <!-- Retour + en-tête -->
    <div>
      <NuxtLink to="/admin/ongs" class="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 group">
        <Icon name="i-heroicons-arrow-left" class="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Retour à la liste
      </NuxtLink>

      <div v-if="loading" class="flex items-center gap-4 animate-pulse">
        <div class="h-7 bg-muted rounded w-48" />
        <div class="h-5 bg-muted rounded w-24" />
      </div>
      <div v-else-if="detail" class="flex items-center gap-3 flex-wrap">
        <h1 class="text-2xl font-bold">{{ detail.ong.name }}</h1>
        <OngStatus :status="detail.ong.status" size="md" />
        <a :href="`/ongs/${detail.ong.id}`" target="_blank" class="ml-auto">
          <UButton variant="ghost" size="xs">
            <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5 mr-1" />
            Page publique
          </UButton>
        </a>
      </div>
    </div>

    <!-- Erreur -->
    <UAlert v-if="error" color="red" variant="soft" icon="i-heroicons-exclamation-circle" :title="error" />

    <!-- Skeleton tabs -->
    <div v-if="loading" class="space-y-4">
      <div class="h-10 bg-muted rounded animate-pulse" />
      <div class="h-64 bg-card border border-border rounded-xl animate-pulse" />
    </div>

    <!-- Contenu en onglets -->
    <template v-else-if="detail">
      <UTabs :items="TABS" v-model="activeTab">
        <template #item="{ item }">

          <!-- Profil -->
          <div v-if="item.key === 'profil'" class="bg-card border border-border rounded-xl p-5 space-y-5">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div v-for="field in profileFields" :key="field.label">
                <div class="text-xs text-muted-foreground mb-0.5">{{ field.label }}</div>
                <div class="font-medium">{{ field.value || '—' }}</div>
              </div>
              <div class="col-span-2">
                <div class="text-xs text-muted-foreground mb-0.5">Description</div>
                <p class="text-sm">{{ detail.ong.description || '—' }}</p>
              </div>
            </div>

            <!-- Impact -->
            <template v-if="detail.ong.impact">
              <div class="border-t border-border pt-4">
                <h3 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Impact</h3>
                <div class="grid grid-cols-2 gap-3 text-sm">
                  <div v-if="detail.ong.impact.totalBeneficiaries">
                    <span class="text-xs text-muted-foreground">Bénéficiaires</span>
                    <div class="font-semibold text-lg">{{ detail.ong.impact.totalBeneficiaries.toLocaleString('fr-FR') }}</div>
                  </div>
                  <div v-for="kpi in (detail.ong.impact.kpis ?? [])" :key="kpi.metric">
                    <span class="text-xs text-muted-foreground">{{ kpi.metric }}</span>
                    <div class="font-semibold text-lg">{{ kpi.value }}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>

          <!-- Score -->
          <div v-else-if="item.key === 'score'" class="bg-card border border-border rounded-xl p-5">
            <AdminOngScore :score="detail.score" :criteria="detail.criteria" />
          </div>

          <!-- Visibilité -->
          <div v-else-if="item.key === 'visibilite'" class="bg-card border border-border rounded-xl p-5">
            <AdminOngVisibility :ong-id="detail.ong.id" :visibility="detail.ong.sectionVisibility" />
          </div>

          <!-- Documents -->
          <div v-else-if="item.key === 'documents'" class="bg-card border border-border rounded-xl p-5">
            <AdminOngDocuments :documents="detail.documents" />
          </div>

          <!-- Projets -->
          <div v-else-if="item.key === 'projets'" class="bg-card border border-border rounded-xl p-5">
            <AdminOngProjects :projects="detail.ong.projects ?? []" />
          </div>

          <!-- Financials -->
          <div v-else-if="item.key === 'financials'" class="bg-card border border-border rounded-xl p-5">
            <EmptyState v-if="!detail.ong.financials" icon="i-heroicons-banknotes" title="Aucune donnée financière déclarée" />
            <div v-else class="space-y-5 text-sm">
              <div>
                <div class="text-xs text-muted-foreground mb-1">Budget total 2023</div>
                <div class="text-xl font-bold">{{ formatEur(detail.ong.financials.totalBudget2023 ?? 0) }}</div>
              </div>
              <div v-if="detail.ong.financials.allocation">
                <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Allocation</h4>
                <div class="grid grid-cols-3 gap-3">
                  <div v-for="(val, key) in detail.ong.financials.allocation" :key="key" class="text-center p-3 bg-muted/40 rounded-lg">
                    <div class="text-lg font-bold">{{ val }}%</div>
                    <div class="text-xs text-muted-foreground capitalize">{{ key }}</div>
                  </div>
                </div>
              </div>
              <div v-if="detail.ong.financials.financialReports?.length">
                <h4 class="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Rapports</h4>
                <div class="space-y-2">
                  <a
                    v-for="r in detail.ong.financials.financialReports"
                    :key="r.year"
                    :href="r.url"
                    target="_blank"
                    class="flex items-center gap-2 text-primary hover:underline text-sm"
                  >
                    <Icon name="i-heroicons-document" class="w-4 h-4" />
                    Rapport {{ r.year }} {{ r.audited ? '(audité)' : '' }}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </template>
      </UTabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import AdminOngScore      from '~/features/admin/components/AdminOngScore.vue'
import AdminOngVisibility from '~/features/admin/components/AdminOngVisibility.vue'
import AdminOngDocuments  from '~/features/admin/components/AdminOngDocuments.vue'
import AdminOngProjects   from '~/features/admin/components/AdminOngProjects.vue'
import { getAdminOngDetail } from '~/features/admin/services/admin.ong.service'
import type { AdminOngDetail } from '~/features/admin/services/admin.ong.service'

definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

const route     = useRoute()
const ongId     = route.params.id as string
const detail    = ref<AdminOngDetail | null>(null)
const loading   = ref(true)
const error     = ref<string | null>(null)
const activeTab = ref(0)

const TABS = [
  { label: 'Profil',      key: 'profil',     icon: 'i-heroicons-identification' },
  { label: 'Score',       key: 'score',      icon: 'i-heroicons-chart-bar' },
  { label: 'Visibilité',  key: 'visibilite', icon: 'i-heroicons-eye' },
  { label: 'Documents',   key: 'documents',  icon: 'i-heroicons-document-text' },
  { label: 'Projets',     key: 'projets',    icon: 'i-heroicons-folder-open' },
  { label: 'Financials',  key: 'financials', icon: 'i-heroicons-banknotes' },
]

const profileFields = computed(() => {
  if (!detail.value) return []
  const o = detail.value.ong
  return [
    { label: 'Catégorie',    value: o.category },
    { label: 'Localisation', value: o.location },
    { label: 'Email',        value: o.email },
    { label: 'Téléphone',    value: o.phone },
    { label: 'Site web',     value: o.website },
    { label: 'Bénévoles',    value: String(o.volunteers ?? 0) },
    { label: 'Créé le',      value: formatDate(o.createdAt) },
    { label: 'Mis à jour',   value: formatDate(o.updatedAt) },
  ]
})

function formatEur(amount: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  try {
    detail.value = await getAdminOngDetail(ongId)
  } catch (e: any) {
    error.value = e?.data?.statusMessage ?? e.message ?? 'Erreur chargement'
  } finally {
    loading.value = false
  }
})
</script>
