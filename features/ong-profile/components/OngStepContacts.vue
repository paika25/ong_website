<template>
  <div class="space-y-6">
    <div>
      <h3 class="text-base font-semibold">Contacts</h3>
      <p class="text-sm text-muted-foreground">Personnes référentes de votre organisation</p>
    </div>

    <!-- Responsable légal -->
    <div class="p-4 bg-card border border-border rounded-xl space-y-4">
      <h4 class="text-sm font-semibold">Responsable légal <span class="text-destructive">*</span></h4>
      <div class="grid md:grid-cols-2 gap-4">
        <UFormGroup label="Nom complet" :error="errors.responsableNom" required>
          <UInput
            v-model="contacts.responsableNom"
            placeholder="Prénom Nom"
            :color="errors.responsableNom ? 'red' : 'primary'"
            @blur="emit('blur', 'responsableNom')"
          />
        </UFormGroup>
        <UFormGroup label="Fonction / Titre">
          <UInput v-model="contacts.responsableFonction" placeholder="ex: Président, Directeur exécutif" />
        </UFormGroup>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <UFormGroup label="Email" :error="errors.responsableEmail" required>
          <UInput
            v-model="contacts.responsableEmail"
            type="email"
            placeholder="responsable@ong.org"
            :color="errors.responsableEmail ? 'red' : 'primary'"
            @blur="emit('blur', 'responsableEmail')"
          />
        </UFormGroup>
        <UFormGroup label="Téléphone">
          <UInput v-model="contacts.responsableTel" placeholder="+261 XX XX XXX XX" />
        </UFormGroup>
      </div>
    </div>

    <!-- Contact communication -->
    <div class="p-4 bg-card border border-border rounded-xl space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-semibold">Contact communication</h4>
        <UButton size="xs" variant="ghost" @click="sameAsResponsable">
          Identique au responsable légal
        </UButton>
      </div>
      <div class="grid md:grid-cols-2 gap-4">
        <UFormGroup label="Nom complet">
          <UInput v-model="contacts.communicationNom" placeholder="Prénom Nom" />
        </UFormGroup>
        <UFormGroup label="Email">
          <UInput v-model="contacts.communicationEmail" type="email" placeholder="communication@ong.org" />
        </UFormGroup>
      </div>
    </div>

    <!-- Liens web / Réseaux sociaux -->
    <div class="p-4 bg-card border border-border rounded-xl space-y-4">
      <h4 class="text-sm font-semibold">Présence en ligne (optionnel)</h4>
      <div class="grid md:grid-cols-2 gap-4">
        <UFormGroup label="Site web">
          <UInput v-model="contacts.siteWeb" placeholder="https://www.votre-ong.org" />
        </UFormGroup>
        <UFormGroup label="Facebook">
          <UInput v-model="contacts.facebook" placeholder="https://facebook.com/votre-ong" />
        </UFormGroup>
        <UFormGroup label="LinkedIn">
          <UInput v-model="contacts.linkedin" placeholder="https://linkedin.com/company/..." />
        </UFormGroup>
        <UFormGroup label="Twitter / X">
          <UInput v-model="contacts.twitter" placeholder="@votre-ong" />
        </UFormGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Contacts {
  responsableNom: string
  responsableFonction: string
  responsableEmail: string
  responsableTel: string
  communicationNom: string
  communicationEmail: string
  siteWeb: string
  facebook: string
  linkedin: string
  twitter: string
}

const props = defineProps<{
  contacts: Contacts
  errors: Record<string, string>
}>()

const emit = defineEmits<{ blur: [field: string] }>()

function sameAsResponsable() {
  props.contacts.communicationNom = props.contacts.responsableNom
  props.contacts.communicationEmail = props.contacts.responsableEmail
}
</script>
