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
            'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
          ]"
        >
          <Icon :name="tab.icon" class="w-4 h-4" />
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
            <UInput v-model="form.name" placeholder="Nom de votre organisation" size="md" />
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium mb-2">Description <span class="text-destructive">*</span></label>
            <UTextarea
              v-model="form.description"
              :rows="4"
              placeholder="Décrivez la mission et les objectifs de votre ONG..."
            />
            <p
              class="text-xs mt-1"
              :class="(form.description?.length || 0) >= 10 ? 'text-muted-foreground' : 'text-yellow-600 dark:text-yellow-400'"
            >
              {{ form.description?.length || 0 }} / 2000 caractères
              <span v-if="(form.description?.length || 0) < 10"> — 10 caractères minimum</span>
            </p>
          </div>

          <!-- Catégorie -->
          <div>
            <label class="block text-sm font-medium mb-2">Catégorie <span class="text-destructive">*</span></label>
            <USelect v-model="form.category" :options="categoryOptions" placeholder="Choisir une catégorie" />
          </div>

          <!-- Localisation -->
          <div>
            <label class="block text-sm font-medium mb-2">Localisation</label>
            <UInput v-model="form.location" placeholder="Paris, France" />
          </div>

          <!-- Image de couverture -->
          <div>
            <label class="block text-sm font-medium mb-2">Image de couverture</label>

            <!-- Preview + actions si image existante -->
            <div v-if="form.image || imagePreviewUrl" class="mb-3">
              <div class="relative h-40 rounded-lg overflow-hidden border border-border group">
                <img
                  :src="imagePreviewUrl || form.image"
                  :alt="form.name"
                  class="w-full h-full object-cover"
                  @error="onImageError"
                />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                  <UButton size="sm" color="white" variant="solid" @click="triggerFileInput">
                    Changer
                  </UButton>
                  <UButton size="sm" color="red" variant="solid" @click="removeImage">
                    Supprimer
                  </UButton>
                </div>
              </div>
              <!-- Indicateur fichier sélectionné -->
              <p v-if="selectedImageFile" class="text-xs text-primary mt-1.5 flex items-center gap-1">
                <Icon name="i-heroicons-paper-clip" class="w-3.5 h-3.5" />
                {{ selectedImageFile.name }} ({{ (selectedImageFile.size / 1024 / 1024).toFixed(1) }} Mo)
                <span class="text-muted-foreground">— sera uploadé à la sauvegarde</span>
              </p>
            </div>

            <!-- Zone d'upload si pas d'image -->
            <div
              v-else
              @click="triggerFileInput"
              @dragover.prevent="isDragging = true"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="onDrop"
              :class="[
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              ]"
            >
              <Icon name="i-heroicons-photo" class="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
              <p class="text-sm font-medium text-foreground">Cliquez ou glissez une image ici</p>
              <p class="text-xs text-muted-foreground mt-1">JPG, PNG ou WebP — 5 Mo max</p>
            </div>

            <!-- Input file caché -->
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="hidden"
              @change="onFileSelected"
            />

            <!-- Erreur upload -->
            <p v-if="imageError" class="text-xs text-destructive mt-1.5">{{ imageError }}</p>
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
            <UInput v-model="form.email" type="email" placeholder="contact@mon-ong.org" />
          </div>

          <!-- Téléphone -->
          <div>
            <label class="block text-sm font-medium mb-2">Téléphone</label>
            <UInput v-model="form.phone" type="tel" placeholder="+33 1 23 45 67 89" />
          </div>

          <!-- Site web -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium mb-2">Site web</label>
            <UInput v-model="form.website" type="url" placeholder="https://www.mon-ong.org" />
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
            <Icon name="i-heroicons-plus" class="w-4 h-4 mr-1" />
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
              <Icon name="i-heroicons-trash" class="w-4 h-4" />
            </button>

            <div class="space-y-4 pr-8">
              <!-- Nom du projet -->
              <div>
                <label class="block text-sm font-medium mb-1">Nom du projet</label>
                <UInput v-model="project.name" placeholder="Nom du projet" />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium mb-1">Description</label>
                <UTextarea v-model="project.description" :rows="2" placeholder="Décrivez ce projet..." />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Statut -->
                <div>
                  <label class="block text-sm font-medium mb-1">Statut</label>
                  <USelect v-model="project.status" :options="projectStatusOptions" />
                </div>

                <!-- Date début -->
                <div>
                  <label class="block text-sm font-medium mb-1">Date début</label>
                  <UInput v-model="project.startDate" type="date" />
                </div>

                <!-- Budget -->
                <div>
                  <label class="block text-sm font-medium mb-1">Budget (€)</label>
                  <UInput v-model.number="project.budget" type="number" min="0" placeholder="0" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Vide -->
        <EmptyState
          v-else
          icon="i-heroicons-folder-open"
          title="Aucun projet pour le moment"
          description="Ajoutez votre premier projet pour montrer l'activité de votre ONG"
        />
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
            <UInput v-model.number="form.financials.totalBudget2023" type="number" min="0" placeholder="0" />
          </div>

          <!-- Répartition -->
          <div>
            <label class="block text-sm font-medium mb-4">Répartition du budget (%)</label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs text-muted-foreground mb-1">Programmes</label>
                <UInput v-model.number="form.financials.allocation.programs" type="number" min="0" max="100" placeholder="0" />
              </div>
              <div>
                <label class="block text-xs text-muted-foreground mb-1">Administration</label>
                <UInput v-model.number="form.financials.allocation.administration" type="number" min="0" max="100" placeholder="0" />
              </div>
              <div>
                <label class="block text-xs text-muted-foreground mb-1">Collecte de fonds</label>
                <UInput v-model.number="form.financials.allocation.fundraising" type="number" min="0" max="100" placeholder="0" />
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
                class="text-xs mt-2 flex items-center gap-1"
                :class="allocationTotal > 100 ? 'text-destructive' : 'text-yellow-600 dark:text-yellow-400'"
              >
                <Icon name="i-heroicons-exclamation-triangle" class="w-3.5 h-3.5" />
                Total actuel : {{ allocationTotal }}% (doit être 100%)
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
            <UInput v-model="form.legal.siret" placeholder="123 456 789 00010" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-2">Date d'enregistrement</label>
            <UInput v-model="form.legal.registrationDate" type="date" />
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
            <UInput v-model.number="form.impact.totalBeneficiaries" type="number" min="0" placeholder="0" />
          </div>

          <!-- KPIs -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="block text-sm font-medium">Indicateurs clés (KPIs)</label>
              <UButton variant="link" size="xs" :padded="false" @click="addKpi">
                <Icon name="i-heroicons-plus" class="w-3.5 h-3.5 mr-1" />
                Ajouter un KPI
              </UButton>
            </div>

            <div v-if="form.impact.kpis.length > 0" class="space-y-3">
              <div
                v-for="(kpi, index) in form.impact.kpis"
                :key="index"
                class="flex items-center gap-3"
              >
                <UInput v-model="kpi.metric" placeholder="Métrique (ex: Écoles construites)" class="flex-1" />
                <UInput v-model="kpi.value" placeholder="Valeur" class="w-32" />
                <button
                  @click="form.impact.kpis.splice(index, 1)"
                  class="p-2 text-muted-foreground hover:text-destructive transition"
                >
                  <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <p v-else class="text-sm text-muted-foreground italic">Aucun KPI défini</p>
          </div>

          <!-- Bénévoles -->
          <div>
            <label class="block text-sm font-medium mb-2">Nombre de bénévoles</label>
            <UInput v-model.number="form.volunteers" type="number" min="0" placeholder="0" />
          </div>
        </div>
      </div>
    </div>

    <!-- Tab : Documents -->
    <div v-show="activeTab === 'documents'" class="space-y-6">
      <div class="bg-card border border-border rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-6">Documents de l'ONG</h2>
        <p class="text-sm text-muted-foreground mb-6">
          Ajoutez vos documents officiels pour renforcer la crédibilité de votre ONG.
          Formats acceptés : PDF, DOC, DOCX, JPG, PNG — 10 Mo max par fichier.
        </p>

        <div class="space-y-8">
          <!-- Statuts (legal) -->
          <div>
            <h3 class="text-base font-semibold mb-1">* Statuts de l'association</h3>
            <p class="text-xs text-muted-foreground mb-3">Document légal officiel de votre organisation (statuts déposés en préfecture).</p>

            <!-- Document existant -->
            <div v-if="legalDoc" class="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border mb-2">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="i-heroicons-document-text" class="w-5 h-5 text-primary" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">{{ legalDoc.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ (legalDoc.fileSize / 1024).toFixed(0) }} Ko</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a :href="legalDoc.fileUrl" target="_blank" class="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                  <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
                </a>
                <button type="button" @click="handleDeleteDocument(legalDoc!)" class="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                  <Icon name="i-heroicons-trash" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Fichier en attente -->
            <div v-else-if="pendingLegalFile" class="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20 mb-2">
              <div class="flex items-center gap-3 min-w-0">
                <Icon name="i-heroicons-paper-clip" class="w-5 h-5 text-primary shrink-0" />
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">{{ pendingLegalFile.file.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ (pendingLegalFile.file.size / 1024).toFixed(0) }} Ko — <span class="text-primary">sera uploadé à la sauvegarde</span></p>
                </div>
              </div>
              <button type="button" @click="removePendingDocument('legal')" class="p-1.5 rounded-md text-muted-foreground hover:text-destructive transition">
                <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
              </button>
            </div>

            <!-- Upload zone -->
            <div v-else>
              <label
                @dragover.prevent="isDraggingDoc = 'legal'"
                @dragleave.prevent="isDraggingDoc = null"
                @drop.prevent="onDropDocument($event, 'legal')"
                :class="[
                  'flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer transition text-sm',
                  isDraggingDoc === 'legal'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                ]"
              >
                <Icon name="i-heroicons-arrow-up-tray" class="w-5 h-5 text-muted-foreground" />
                <span class="text-muted-foreground">Ajouter les statuts</span>
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden" @change="onDocumentSelected($event, 'legal', 'Statuts de l\'association')" />
              </label>
            </div>
          </div>

          <!-- Rapport d'activité (activity) -->
          <div>
            <h3 class="text-base font-semibold mb-1">* Rapport d'activité</h3>
            <p class="text-xs text-muted-foreground mb-3">Dernier rapport d'activité annuel de votre organisation.</p>

            <!-- Document existant -->
            <div v-if="activityDoc" class="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border mb-2">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name="i-heroicons-document-text" class="w-5 h-5 text-primary" />
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">{{ activityDoc.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ (activityDoc.fileSize / 1024).toFixed(0) }} Ko</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <a :href="activityDoc.fileUrl" target="_blank" class="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition">
                  <Icon name="i-heroicons-arrow-down-tray" class="w-4 h-4" />
                </a>
                <button type="button" @click="handleDeleteDocument(activityDoc!)" class="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
                  <Icon name="i-heroicons-trash" class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Fichier en attente -->
            <div v-else-if="pendingActivityFile" class="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20 mb-2">
              <div class="flex items-center gap-3 min-w-0">
                <Icon name="i-heroicons-paper-clip" class="w-5 h-5 text-primary shrink-0" />
                <div class="min-w-0">
                  <p class="text-sm font-medium truncate">{{ pendingActivityFile.file.name }}</p>
                  <p class="text-xs text-muted-foreground">{{ (pendingActivityFile.file.size / 1024).toFixed(0) }} Ko — <span class="text-primary">sera uploadé à la sauvegarde</span></p>
                </div>
              </div>
              <button type="button" @click="removePendingDocument('activity')" class="p-1.5 rounded-md text-muted-foreground hover:text-destructive transition">
                <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
              </button>
            </div>

            <!-- Upload zone -->
            <div v-else>
              <label
                @dragover.prevent="isDraggingDoc = 'activity'"
                @dragleave.prevent="isDraggingDoc = null"
                @drop.prevent="onDropDocument($event, 'activity')"
                :class="[
                  'flex items-center justify-center gap-2 border-2 border-dashed rounded-lg p-4 cursor-pointer transition text-sm',
                  isDraggingDoc === 'activity'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                ]"
              >
                <Icon name="i-heroicons-arrow-up-tray" class="w-5 h-5 text-muted-foreground" />
                <span class="text-muted-foreground">Ajouter le rapport d'activité</span>
                <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" class="hidden" @change="onDocumentSelected($event, 'activity', 'Rapport d\'activité')" />
              </label>
            </div>
          </div>
        </div>

        <!-- Erreur documents -->
        <p v-if="docError" class="text-xs text-destructive mt-4">{{ docError }}</p>
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
            <Icon v-if="saving" name="i-heroicons-arrow-path" class="w-4 h-4 mr-2 animate-spin" />
            <Icon v-else name="i-heroicons-check" class="w-4 h-4 mr-2" />
            {{ saving ? submitLoadingLabel : submitLabel }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG, Project, OngDocument, DocumentCategory } from '~/features/ong/type'
import { uploadOngImage, deleteOngImage, getOngDocuments, uploadOngDocument, deleteOngDocument } from '~/features/ong/services'

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
  { id: 'general' as const, label: 'Général', icon: 'i-heroicons-identification' },
  { id: 'projects' as const, label: 'Projets', icon: 'i-heroicons-folder-open' },
  { id: 'financials' as const, label: 'Finances', icon: 'i-heroicons-banknotes' },
  { id: 'impact' as const, label: 'Impact', icon: 'i-heroicons-chart-bar' },
  { id: 'documents' as const, label: 'Documents', icon: 'i-heroicons-document-text' },
]

const activeTab = ref<'general' | 'projects' | 'financials' | 'impact' | 'documents'>('general')

const categoryOptions = [
  { label: 'Éducation', value: 'education' },
  { label: 'Santé', value: 'health' },
  { label: 'Environnement', value: 'environment' },
  { label: 'Social', value: 'social' },
  { label: 'Culture', value: 'culture' },
]

const projectStatusOptions = [
  { label: 'Planifié', value: 'planned' },
  { label: 'En cours', value: 'ongoing' },
  { label: 'Terminé', value: 'completed' },
  { label: 'Annulé', value: 'canceled' },
]

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
  return JSON.stringify(form) !== initialFormSnapshot || !!selectedImageFile.value || pendingDocuments.value.length > 0
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

// ============================================
// Image upload
// ============================================

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedImageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const imageError = ref<string | null>(null)
const isDragging = ref(false)

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5 Mo

function triggerFileInput() {
  fileInputRef.value?.click()
}

function validateAndPreview(file: File): boolean {
  imageError.value = null

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    imageError.value = `Format non supporté (${file.type}). Formats acceptés : JPG, PNG, WebP.`
    return false
  }
  if (file.size > MAX_IMAGE_SIZE) {
    imageError.value = `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum : 5 Mo.`
    return false
  }

  selectedImageFile.value = file
  imagePreviewUrl.value = URL.createObjectURL(file)
  return true
}

function onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) {
    validateAndPreview(file)
  }
  // Reset input pour permettre de re-sélectionner le même fichier
  input.value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (file) {
    validateAndPreview(file)
  }
}

function removeImage() {
  selectedImageFile.value = null
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = null
  }
  form.image = ''
  imageError.value = null
}

function onImageError() {
  // Si l'image URL existante est cassée, on la vide
  if (!selectedImageFile.value) {
    form.image = ''
  }
}

/**
 * Upload l'image sélectionnée vers Supabase Storage.
 * Appelé par le parent après la création/update de l'ONG.
 *
 * @param ongId - UUID de l'ONG (nécessaire pour le chemin storage)
 * @returns L'URL publique ou null
 */
async function uploadImage(ongId: string): Promise<string | null> {
  if (!selectedImageFile.value) return null

  imageError.value = null
  const result = await uploadOngImage(ongId, selectedImageFile.value)

  if (!result.success) {
    imageError.value = result.error
    return null
  }

  // Nettoyage
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
    imagePreviewUrl.value = null
  }
  selectedImageFile.value = null
  form.image = result.url || ''

  return result.url
}

/**
 * Retourne true si un fichier image est prêt à être uploadé.
 */
function hasPendingImage(): boolean {
  return !!selectedImageFile.value
}

// ============================================
// Documents upload
// ============================================

interface PendingDocument {
  file: File
  name: string
  category: DocumentCategory
}

const existingDocuments = ref<OngDocument[]>([])
const pendingDocuments = ref<PendingDocument[]>([])
const docError = ref<string | null>(null)
const isDraggingDoc = ref<DocumentCategory | null>(null)

const legalDoc = computed(() => existingDocuments.value.find(d => d.category === 'legal'))
const activityDoc = computed(() => existingDocuments.value.find(d => d.category === 'activity'))
const pendingLegalFile = computed(() => pendingDocuments.value.find(d => d.category === 'legal'))
const pendingActivityFile = computed(() => pendingDocuments.value.find(d => d.category === 'activity'))

const ALLOWED_DOC_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
]
const MAX_DOC_SIZE = 10 * 1024 * 1024

function validateDocFile(file: File): string | null {
  if (!ALLOWED_DOC_TYPES.includes(file.type)) {
    return `Format non supporté (${file.type}). Formats acceptés : PDF, DOC, DOCX, JPG, PNG.`
  }
  if (file.size > MAX_DOC_SIZE) {
    return `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Maximum : 10 Mo.`
  }
  return null
}

function onDocumentSelected(event: Event, category: DocumentCategory, defaultName: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  docError.value = null
  const err = validateDocFile(file)
  if (err) {
    docError.value = err
    input.value = ''
    return
  }

  // Remplacer s'il y a déjà un pending de cette catégorie
  pendingDocuments.value = pendingDocuments.value.filter(d => d.category !== category)
  pendingDocuments.value.push({ file, name: defaultName, category })
  input.value = ''
}

function onDropDocument(event: DragEvent, category: DocumentCategory) {
  isDraggingDoc.value = null
  const file = event.dataTransfer?.files?.[0]
  if (!file) return

  docError.value = null
  const err = validateDocFile(file)
  if (err) {
    docError.value = err
    return
  }

  const defaultName = category === 'legal' ? "Statuts de l'association" : "Rapport d'activité"
  pendingDocuments.value = pendingDocuments.value.filter(d => d.category !== category)
  pendingDocuments.value.push({ file, name: defaultName, category })
}

function removePendingDocument(category: DocumentCategory) {
  pendingDocuments.value = pendingDocuments.value.filter(d => d.category !== category)
}

async function handleDeleteDocument(doc: OngDocument) {
  if (!confirm(`Supprimer le document "${doc.name}" ?`)) return

  const result = await deleteOngDocument(doc.id, doc.fileUrl)
  if (result.success) {
    existingDocuments.value = existingDocuments.value.filter(d => d.id !== doc.id)
  } else {
    docError.value = result.error
  }
}

async function loadDocuments(ongId: string) {
  existingDocuments.value = await getOngDocuments(ongId)
}

/**
 * Upload tous les documents en attente.
 * Appelé par le parent après la création/update de l'ONG.
 */
async function uploadDocuments(ongId: string) {
  docError.value = null

  for (const pending of pendingDocuments.value) {
    const result = await uploadOngDocument(ongId, pending.file, pending.name, pending.category)
    if (result.success && result.data) {
      // Remplacer l'éventuel document existant de la même catégorie
      existingDocuments.value = existingDocuments.value.filter(d => d.category !== pending.category)
      existingDocuments.value.push(result.data)
    } else {
      docError.value = result.error
    }
  }

  pendingDocuments.value = []
}

/**
 * Retourne true s'il y a des documents en attente d'upload.
 */
function hasPendingDocuments(): boolean {
  return pendingDocuments.value.length > 0
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
    // Charger les documents existants
    loadDocuments(data.id)
  }
}, { immediate: true })

// Expose pour le parent
defineExpose({
  resetForm,
  onSaved,
  uploadImage,
  hasPendingImage,
  uploadDocuments,
  hasPendingDocuments,
})
</script>
