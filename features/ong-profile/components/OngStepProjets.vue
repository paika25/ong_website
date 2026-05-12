<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-base font-semibold">Projets</h3>
        <p class="text-sm text-muted-foreground">Décrivez vos projets actifs ou passés</p>
      </div>
      <UButton size="sm" variant="outline" @click="addProjet">
        + Ajouter un projet
      </UButton>
    </div>

    <!-- Empty state (UX-DR16) -->
    <div v-if="projets.length === 0" class="text-center py-10 text-muted-foreground border-2 border-dashed border-border rounded-xl">
      <svg class="w-10 h-10 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-sm">Aucun projet ajouté</p>
      <p class="text-xs mt-1">Les projets renforcent votre score de transparence</p>
    </div>

    <!-- Liste projets -->
    <div v-else class="space-y-4">
      <div
        v-for="(projet, idx) in projets"
        :key="idx"
        class="p-4 bg-card border border-border rounded-xl space-y-4"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm font-medium text-muted-foreground">Projet {{ idx + 1 }}</span>
          <UButton size="xs" variant="ghost" color="red" icon="i-heroicons-trash" @click="removeProjet(idx)" />
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <UFormGroup label="Titre du projet" required>
            <UInput v-model="projet.titre" placeholder="ex: Construction d'école à Fianarantsoa" />
          </UFormGroup>

          <UFormGroup label="Statut">
            <USelect
              v-model="projet.statut"
              :options="[
                { label: 'En cours', value: 'en_cours' },
                { label: 'Terminé', value: 'termine' },
                { label: 'Planifié', value: 'planifie' },
              ]"
            />
          </UFormGroup>
        </div>

        <UFormGroup label="Description">
          <UTextarea v-model="projet.description" :rows="2" placeholder="Objectifs, résultats attendus, impact..." />
        </UFormGroup>

        <div class="grid md:grid-cols-3 gap-4">
          <UFormGroup label="Date de début">
            <UInput v-model="projet.dateDebut" type="date" />
          </UFormGroup>
          <UFormGroup label="Date de fin (optionnel)">
            <UInput v-model="projet.dateFin" type="date" />
          </UFormGroup>
          <UFormGroup label="Budget (Ar)">
            <UInput v-model.number="projet.budget" type="number" min="0" placeholder="0" />
          </UFormGroup>
        </div>

        <UFormGroup label="Zones cibles">
          <UInput v-model="projet.zones" placeholder="ex: Antananarivo, Toamasina" />
        </UFormGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Projet {
  titre: string
  description: string
  statut: 'en_cours' | 'termine' | 'planifie'
  dateDebut: string
  dateFin: string
  budget: number
  zones: string
}

const props = defineProps<{ projets: Projet[] }>()

function addProjet() {
  props.projets.push({
    titre: '', description: '', statut: 'en_cours',
    dateDebut: '', dateFin: '', budget: 0, zones: '',
  })
}

function removeProjet(idx: number) {
  props.projets.splice(idx, 1)
}
</script>
