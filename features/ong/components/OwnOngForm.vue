<template>
  <div>
    <!-- Tabs -->
    <div class="border-b border-border mb-8">
      <nav class="flex gap-1 -mb-px">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Tab : Informations générales -->
    <div v-show="activeTab === 'general'" class="space-y-6">
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-6">Informations générales</h2>

        <div class="space-y-5">
          <!-- Nom -->
          <div>
            <label class="block text-sm font-medium mb-2">Nom de l'ONG <span class="text-destructive">*</span></label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Nom de votre organisation"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium mb-2">Description <span class="text-destructive">*</span></label>
            <textarea
              v-model="form.description"
              rows="4"
              placeholder="Décrivez la mission et les objectifs de votre ONG..."
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
            ></textarea>
            <p class="text-xs text-muted-foreground mt-1">{{ form.description?.length || 0 }} / 2000 caractères</p>
          </div>

          <!-- Catégorie -->
          <div>
            <label class="block text-sm font-medium mb-2">Catégorie <span class="text-destructive">*</span></label>
            <select
              v-model="form.category"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            >
              <option value="" disabled>Choisir une catégorie</option>
              <option value="education">📚 Éducation</option>
              <option value="health">🏥 Santé</option>
              <option value="environment">🌍 Environnement</option>
              <option value="social">🤝 Social</option>
              <option value="culture">🎭 Culture</option>
            </select>
          </div>

          <!-- Localisation -->
          <div>
            <label class="block text-sm font-medium mb-2">Localisation</label>
            <input
              v-model="form.location"
              type="text"
              placeholder="Paris, France"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <!-- Image de couverture -->
          <div>
            <label class="block text-sm font-medium mb-2">Image de couverture (URL)</label>
            <input
              v-model="form.image"
              type="url"
              placeholder="https://example.com/image.jpg"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
            <!-- Preview image -->
            <div v-if="form.image" class="mt-3 relative h-32 rounded-lg overflow-hidden border border-border">
              <img :src="form.image" :alt="form.name" class="w-full h-full object-cover" @error="form.image = ''" />
            </div>
          </div>
        </div>
      </div>

      <!-- Contact -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-6">Contact</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-2">Email de contact</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="contact@mon-ong.org"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <!-- Téléphone -->
          <div>
            <label class="block text-sm font-medium mb-2">Téléphone</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+33 1 23 45 67 89"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <!-- Site web -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-2">Site web</label>
            <input
              v-model="form.website"
              type="url"
              placeholder="https://www.mon-ong.org"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tab : Projets -->
    <div v-show="activeTab === 'projects'" class="space-y-6">
      <div class="bg-card border border-border rounded-xl p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold">Projets ({{ form.projects.length }})</h2>
          <UButton variant="outline" size="sm" @click="addProject">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Ajouter un projet
          </UButton>
        </div>

        <!-- Liste projets -->
        <div v-if="form.projects.length > 0" class="space-y-4">
          <div
            v-for="(project, index) in form.projects"
            :key="project.id"
            class="border border-border rounded-lg p-5 relative group"
          >
            <!-- Bouton supprimer -->
            <button
              @click="removeProject(index)"
              class="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition opacity-0 group-hover:opacity-100"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>

            <div class="space-y-4 pr-8">
              <!-- Nom du projet -->
              <div>
                <label class="block text-sm font-medium mb-1">Nom du projet</label>
                <input
                  v-model="project.name"
                  type="text"
                  placeholder="Nom du projet"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium mb-1">Description</label>
                <textarea
                  v-model="project.description"
                  rows="2"
                  placeholder="Décrivez ce projet..."
                  class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm resize-none"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Statut -->
                <div>
                  <label class="block text-sm font-medium mb-1">Statut</label>
                  <select
                    v-model="project.status"
                    class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                  >
                    <option value="planned">📋 Planifié</option>
                    <option value="ongoing">🔄 En cours</option>
                    <option value="completed">✅ Terminé</option>
                    <option value="canceled">❌ Annulé</option>
                  </select>
                </div>

                <!-- Date début -->
                <div>
                  <label class="block text-sm font-medium mb-1">Date début</label>
                  <input
                    v-model="project.startDate"
                    type="date"
                    class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                  />
                </div>

                <!-- Budget -->
                <div>
                  <label class="block text-sm font-medium mb-1">Budget (€)</label>
                  <input
                    v-model.number="project.budget"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vide -->
        <div v-else class="text-center py-12 text-muted-foreground">
          <svg class="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="font-medium">Aucun projet pour le moment</p>
          <p class="text-sm mt-1">Ajoutez votre premier projet pour montrer l'activité de votre ONG</p>
        </div>
      </div>
    </div>

    <!-- Tab : Finances -->
    <div v-show="activeTab === 'financials'" class="space-y-6">
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-6">Informations financières</h2>

        <div class="space-y-5">
          <!-- Budget total -->
          <div>
            <label class="block text-sm font-medium mb-2">Budget total 2023 (€)</label>
            <input
              v-model.number="form.financials.totalBudget2023"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <!-- Répartition -->
          <div>
            <label class="block text-sm font-medium mb-4">Répartition du budget (%)</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-muted-foreground mb-1">Programmes</label>
                <input
                  v-model.number="form.financials.allocation.programs"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label class="block text-xs text-muted-foreground mb-1">Administration</label>
                <input
                  v-model.number="form.financials.allocation.administration"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                />
              </div>
              <div>
                <label class="block text-xs text-muted-foreground mb-1">Collecte de fonds</label>
                <input
                  v-model.number="form.financials.allocation.fundraising"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  class="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                />
              </div>
            </div>
            <!-- Barre de pourcentage -->
            <div class="mt-3">
              <div class="flex h-3 rounded-full overflow-hidden bg-muted">
                <div class="bg-green-500 transition-all" :style="{ width: `${form.financials.allocation.programs || 0}%` }"></div>
                <div class="bg-blue-500 transition-all" :style="{ width: `${form.financials.allocation.administration || 0}%` }"></div>
                <div class="bg-orange-500 transition-all" :style="{ width: `${form.financials.allocation.fundraising || 0}%` }"></div>
              </div>
              <div class="flex justify-between mt-1.5 text-xs text-muted-foreground">
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500"></span> Programmes</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-blue-500"></span> Admin</span>
                <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-500"></span> Collecte</span>
              </div>
              <p
                v-if="allocationTotal !== 100"
                class="text-xs mt-2"
                :class="allocationTotal > 100 ? 'text-destructive' : 'text-yellow-600 dark:text-yellow-400'"
              >
                ⚠️ Total actuel : {{ allocationTotal }}% (doit être 100%)
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Informations légales -->
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-6">Informations légales</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label class="block text-sm font-medium mb-2">Numéro SIRET</label>
            <input
              v-model="form.legal.siret"
              type="text"
              placeholder="123 456 789 00010"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Date d'enregistrement</label>
            <input
              v-model="form.legal.registrationDate"
              type="date"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tab : Impact -->
    <div v-show="activeTab === 'impact'" class="space-y-6">
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-6">Impact et résultats</h2>

        <div class="space-y-5">
          <!-- Bénéficiaires -->
          <div>
            <label class="block text-sm font-medium mb-2">Nombre total de bénéficiaires</label>
            <input
              v-model.number="form.impact.totalBeneficiaries"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>

          <!-- KPIs -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium">Indicateurs clés (KPIs)</label>
              <button
                @click="addKpi"
                class="text-sm text-primary hover:text-primary/80 transition font-medium"
              >
                + Ajouter un KPI
              </button>
            </div>

            <div v-if="form.impact.kpis.length > 0" class="space-y-3">
              <div
                v-for="(kpi, index) in form.impact.kpis"
                :key="index"
                class="flex items-center gap-3"
              >
                <input
                  v-model="kpi.metric"
                  type="text"
                  placeholder="Métrique (ex: Écoles construites)"
                  class="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                />
                <input
                  v-model="kpi.value"
                  type="text"
                  placeholder="Valeur"
                  class="w-32 px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-sm"
                />
                <button
                  @click="form.impact.kpis.splice(index, 1)"
                  class="p-2 text-muted-foreground hover:text-destructive transition"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <p v-else class="text-sm text-muted-foreground italic">Aucun KPI défini</p>
          </div>

          <!-- Bénévoles -->
          <div>
            <label class="block text-sm font-medium mb-2">Nombre de bénévoles</label>
            <input
              v-model.number="form.volunteers"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Barre d'actions fixe en bas -->
    <div class="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border -mx-4 px-4 py-4 mt-8">
      <div class="flex items-center justify-between max-w-4xl mx-auto">
        <p v-if="hasChanges" class="text-sm text-muted-foreground flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
          {{ mode === 'create' ? 'Formulaire en cours de remplissage' : 'Modifications non sauvegardées' }}
        </p>
        <p v-else class="text-sm text-muted-foreground">
          {{ mode === 'create' ? 'Remplissez les informations de votre ONG' : 'Aucune modification' }}
        </p>

        <div class="flex gap-3">
          <UButton v-if="mode === 'edit'" variant="outline" @click="resetForm" :disabled="!hasChanges || saving">
            Annuler
          </UButton>
          <NuxtLink v-else to="/dashboard">
            <UButton variant="outline" :disabled="saving">
              Annuler
            </UButton>
          </NuxtLink>
          <UButton variant="default" @click="handleSubmit" :disabled="!canSubmit || saving">
            <svg v-if="saving" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ saving ? submitLoadingLabel : submitLabel }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG, Project } from '~/features/ong/type'

// ============================================
// Props & Emits
// ============================================

export interface OngFormData {
  name: string
  description: string
  category: ONG['category'] | ''
  location: string
  image: string
  email: string
  phone: string
  website: string
  volunteers: number
  projects: Project[]
  financials: {
    totalBudget2023: number
    fundingSources: any[]
    financialReports: any[]
    allocation: {
      programs: number
      administration: number
      fundraising: number
    }
  }
  legal: {
    siret: string
    registrationDate: string
    compliance: {
      dataProtection: string
      financialTransparency: string
    }
  }
  impact: {
    totalBeneficiaries: number
    kpis: Array<{ metric: string; value: string | number }>
  }
}

const props = withDefaults(defineProps<{
  /** Mode du formulaire */
  mode: 'create' | 'edit'
  /** Données initiales (pour le mode edit) */
  initialData?: ONG | null
  /** État de sauvegarde (contrôlé par le parent) */
  saving?: boolean
}>(), {
  initialData: null,
  saving: false,
})

const emit = defineEmits<{
  (e: 'submit', data: OngFormData): void
}>()

// ============================================
// Tabs
// ============================================

const tabs = [
  { id: 'general' as const, label: 'Général' },
  { id: 'projects' as const, label: 'Projets' },
  { id: 'financials' as const, label: 'Finances' },
  { id: 'impact' as const, label: 'Impact' },
]

const activeTab = ref<'general' | 'projects' | 'financials' | 'impact'>('general')

// ============================================
// Formulaire réactif
// ============================================

const form = reactive<OngFormData>({
  name: '',
  description: '',
  category: '',
  location: '',
  image: '',
  email: '',
  phone: '',
  website: '',
  volunteers: 0,
  projects: [],
  financials: {
    totalBudget2023: 0,
    fundingSources: [],
    financialReports: [],
    allocation: {
      programs: 0,
      administration: 0,
      fundraising: 0,
    },
  },
  legal: {
    siret: '',
    registrationDate: '',
    compliance: {
      dataProtection: '',
      financialTransparency: '',
    },
  },
  impact: {
    totalBeneficiaries: 0,
    kpis: [],
  },
})

// Snapshot initial pour détecter les changements
let initialFormSnapshot = JSON.stringify(form)

// ============================================
// Computed
// ============================================

const allocationTotal = computed(() =>
  (form.financials.allocation.programs || 0) +
  (form.financials.allocation.administration || 0) +
  (form.financials.allocation.fundraising || 0)
)

const hasChanges = computed(() => {
  return JSON.stringify(form) !== initialFormSnapshot
})

const submitLabel = computed(() =>
  props.mode === 'create' ? 'Créer mon ONG' : 'Enregistrer'
)

const submitLoadingLabel = computed(() =>
  props.mode === 'create' ? 'Création...' : 'Enregistrement...'
)

const canSubmit = computed(() => {
  if (props.mode === 'create') {
    // En création, il faut au minimum un nom, une description et une catégorie
    return form.name.trim().length >= 3 && form.description.trim().length >= 10 && form.category !== ''
  }
  // En édition, il faut avoir modifié quelque chose
  return hasChanges.value
})

// ============================================
// Fonctions
// ============================================

function populateForm(ongData: ONG) {
  form.name = ongData.name || ''
  form.description = ongData.description || ''
  form.category = ongData.category || ''
  form.location = ongData.location || ''
  form.image = ongData.image || ''
  form.email = ongData.email || ''
  form.phone = ongData.phone || ''
  form.website = ongData.website || ''
  form.volunteers = ongData.volunteers || 0
  form.projects = JSON.parse(JSON.stringify(ongData.projects || []))

  form.financials = {
    totalBudget2023: ongData.financials?.totalBudget2023 || 0,
    fundingSources: JSON.parse(JSON.stringify(ongData.financials?.fundingSources || [])),
    financialReports: JSON.parse(JSON.stringify(ongData.financials?.financialReports || [])),
    allocation: {
      programs: ongData.financials?.allocation?.programs || 0,
      administration: ongData.financials?.allocation?.administration || 0,
      fundraising: ongData.financials?.allocation?.fundraising || 0,
    },
  }

  form.legal = {
    siret: ongData.legal?.siret || '',
    registrationDate: ongData.legal?.registrationDate || '',
    compliance: {
      dataProtection: ongData.legal?.compliance?.dataProtection || '',
      financialTransparency: ongData.legal?.compliance?.financialTransparency || '',
    },
  }

  form.impact = {
    totalBeneficiaries: ongData.impact?.totalBeneficiaries || 0,
    kpis: JSON.parse(JSON.stringify(ongData.impact?.kpis || [])),
  }

  // Snapshot pour détecter les changements
  initialFormSnapshot = JSON.stringify(form)
}

function resetForm() {
  if (props.initialData) {
    populateForm(props.initialData)
  }
}

function addProject() {
  form.projects.push({
    id: crypto.randomUUID(),
    name: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    status: 'planned',
    budget: 0,
  })
}

function removeProject(index: number) {
  form.projects.splice(index, 1)
}

function addKpi() {
  form.impact.kpis.push({ metric: '', value: '' })
}

function handleSubmit() {
  emit('submit', { ...form, projects: JSON.parse(JSON.stringify(form.projects)) })
}

/** Appelé par le parent après un save réussi en mode edit pour mettre à jour le snapshot */
function onSaved() {
  initialFormSnapshot = JSON.stringify(form)
}

// ============================================
// Initialisation
// ============================================

// Peupler le formulaire si on a des données initiales (mode edit)
watch(() => props.initialData, (data) => {
  if (data) {
    populateForm(data)
  }
}, { immediate: true })

// Expose pour le parent
defineExpose({
  resetForm,
  onSaved,
})
</script>
