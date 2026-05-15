<template>
  <div class="space-y-5">
    <div>
      <h3 class="text-base font-semibold mb-1">Mission & Périmètre d'action</h3>
      <p class="text-sm text-muted-foreground">Décrivez ce que fait votre organisation et où elle intervient</p>
    </div>

    <!-- Mission principale -->
    <UFormGroup
      label="Mission principale"
      :error="errors.missionPrincipale"
      :hint="`${mission.missionPrincipale.length} / 500 caractères (min. 20)`"
      required
    >
      <UTextarea
        v-model="mission.missionPrincipale"
        :rows="4"
        placeholder="Décrivez la raison d'être de votre ONG, ses objectifs principaux et sa valeur ajoutée pour les bénéficiaires..."
        :color="errors.missionPrincipale ? 'red' : 'primary'"
        @blur="emit('blur', 'missionPrincipale')"
      />
    </UFormGroup>

    <!-- Secteurs d'activité (multiselect pills) -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Secteurs d'activité <span class="text-destructive">*</span>
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="secteur in SECTEURS"
          :key="secteur"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
            mission.secteurs.includes(secteur)
              ? 'bg-primary text-white border-primary'
              : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground',
          ]"
          @click="toggleSecteur(secteur)"
        >
          {{ secteur }}
        </button>
      </div>
      <p v-if="errors.secteurs" class="text-xs text-red-500 mt-1">{{ errors.secteurs }}</p>
    </div>

    <!-- Zones géographiques (multiselect pills) -->
    <div>
      <label class="block text-sm font-medium mb-2">
        Zones d'intervention <span class="text-destructive">*</span>
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="zone in ZONES"
          :key="zone"
          type="button"
          :class="[
            'px-3 py-1.5 rounded-full text-sm font-medium transition-colors border',
            mission.zonesGeographiques.includes(zone)
              ? 'bg-primary/10 text-primary border-primary'
              : 'bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground',
          ]"
          @click="toggleZone(zone)"
        >
          {{ zone }}
        </button>
      </div>
      <p v-if="errors.zones" class="text-xs text-red-500 mt-1">{{ errors.zones }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SECTEURS, ZONES, type DossierMission } from '../composables/useOngDossierForm'

const props = defineProps<{
  mission: DossierMission
  errors: Record<string, string>
}>()

const emit = defineEmits<{ blur: [field: string] }>()

function toggleSecteur(s: string) {
  const idx = props.mission.secteurs.indexOf(s)
  if (idx >= 0) props.mission.secteurs.splice(idx, 1)
  else props.mission.secteurs.push(s)
}

function toggleZone(z: string) {
  const idx = props.mission.zonesGeographiques.indexOf(z)
  if (idx >= 0) props.mission.zonesGeographiques.splice(idx, 1)
  else props.mission.zonesGeographiques.push(z)
}
</script>
