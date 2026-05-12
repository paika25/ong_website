<template>
  <div class="space-y-5">
    <div>
      <h3 class="text-base font-semibold mb-1">Identité de l'organisation</h3>
      <p class="text-sm text-muted-foreground">Informations légales officielles de votre ONG</p>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <UFormGroup label="Nom de l'ONG" :error="errors.nomOng" required>
        <UInput
          v-model="identite.nomOng"
          placeholder="Nom officiel enregistré"
          :color="errors.nomOng ? 'red' : 'primary'"
          @blur="emit('blur', 'nomOng')"
        />
      </UFormGroup>

      <UFormGroup label="Forme juridique" :error="errors.formeJuridique" required>
        <USelect
          v-model="identite.formeJuridique"
          :options="formesJuridiques"
          placeholder="Choisir..."
          :color="errors.formeJuridique ? 'red' : 'primary'"
        />
      </UFormGroup>
    </div>

    <div class="grid md:grid-cols-2 gap-4">
      <UFormGroup label="Date de création" :error="errors.dateCreation">
        <UInput
          v-model="identite.dateCreation"
          type="date"
          :color="errors.dateCreation ? 'red' : 'primary'"
        />
      </UFormGroup>

      <UFormGroup label="Numéro de récépissé" :error="errors.numeroRecepisse" required>
        <UInput
          v-model="identite.numeroRecepisse"
          placeholder="ex: N°12345/MDAT"
          :color="errors.numeroRecepisse ? 'red' : 'primary'"
          @blur="emit('blur', 'numeroRecepisse')"
        />
      </UFormGroup>
    </div>

    <UFormGroup label="Adresse du siège social" :error="errors.adresseSiege" required>
      <UInput
        v-model="identite.adresseSiege"
        placeholder="Adresse complète (rue, ville, région)"
        :color="errors.adresseSiege ? 'red' : 'primary'"
        @blur="emit('blur', 'adresseSiege')"
      />
    </UFormGroup>

    <div class="grid md:grid-cols-2 gap-4">
      <UFormGroup label="Email de contact" :error="errors.email" required>
        <UInput
          v-model="identite.email"
          type="email"
          placeholder="contact@votre-ong.org"
          :color="errors.email ? 'red' : 'primary'"
          @blur="emit('blur', 'email')"
        />
      </UFormGroup>

      <UFormGroup label="Téléphone">
        <UInput v-model="identite.telephone" placeholder="+261 XX XX XXX XX" />
      </UFormGroup>
    </div>

    <UFormGroup label="Site web">
      <UInput v-model="identite.siteWeb" placeholder="https://www.votre-ong.org" />
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
import type { DossierIdentite } from '../composables/useOngDossierForm'

defineProps<{
  identite: DossierIdentite
  errors: Record<string, string>
}>()

const emit = defineEmits<{ blur: [field: string] }>()

const formesJuridiques = [
  { label: 'Association loi 1901', value: 'association_1901' },
  { label: 'Association reconnue d\'utilité publique', value: 'association_rup' },
  { label: 'Fondation', value: 'fondation' },
  { label: 'ONG nationale', value: 'ong_nationale' },
  { label: 'ONG internationale', value: 'ong_internationale' },
  { label: 'Coopérative', value: 'cooperative' },
]
</script>
