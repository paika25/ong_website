<template>
  <div class="bg-card rounded-2xl border border-border overflow-hidden">
    <div class="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-muted/30">
      <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon name="i-heroicons-pencil" class="w-4 h-4 text-primary" />
      </div>
      <h2 class="font-semibold text-sm">Modifier le profil</h2>
    </div>

    <form @submit.prevent="handleSave" class="p-6 space-y-5">

      <!-- Identité -->
      <div class="grid md:grid-cols-2 gap-4">
        <UFormGroup label="Prénom" required>
          <UInput v-model="form.firstName" placeholder="Jean" />
        </UFormGroup>
        <UFormGroup label="Nom" required>
          <UInput v-model="form.lastName" placeholder="Dupont" />
        </UFormGroup>
      </div>

      <!-- Bio -->
      <UFormGroup label="Biographie">
        <UTextarea
          v-model="form.bio"
          placeholder="Décrivez votre rôle et vos motivations..."
          :rows="3"
        />
      </UFormGroup>

      <!-- Localisation + Site web -->
      <div class="grid md:grid-cols-2 gap-4">
        <UFormGroup label="Localisation">
          <VilleAutoCompletion v-model="form.location" />
        </UFormGroup>
        <UFormGroup label="Site web">
          <UInput v-model="form.website" placeholder="https://monsite.com" icon="i-heroicons-globe-alt" />
        </UFormGroup>
      </div>

      <!-- Compétences -->
      <UFormGroup label="Compétences">
        <div class="flex flex-wrap gap-2 mb-2" v-if="form.skills.length">
          <UBadge
            v-for="(skill, i) in form.skills"
            :key="i"
            variant="soft"
            color="primary"
            class="cursor-pointer group"
            @click="removeSkill(i)"
          >
            {{ skill }}
            <Icon name="i-heroicons-x-mark" class="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100" />
          </UBadge>
        </div>
        <div class="flex gap-2">
          <UInput
            v-model="newSkill"
            placeholder="Ajouter une compétence..."
            class="flex-1"
            @keyup.enter.prevent="addSkill"
          />
          <UButton type="button" variant="outline" size="sm" @click="addSkill" :disabled="!newSkill.trim()">
            Ajouter
          </UButton>
        </div>
      </UFormGroup>

      <!-- Actions -->
      <div class="flex gap-3 pt-2 border-t border-border">
        <UButton type="submit" :loading="isSaving" icon="i-heroicons-check">
          Sauvegarder
        </UButton>
        <UButton type="button" variant="ghost" @click="emit('cancel')">
          Annuler
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import VilleAutoCompletion from '~/components/VilleAutoCompletion.vue'

const props = defineProps<{
  initialData: {
    firstName: string
    lastName: string
    bio: string
    location: string
    website: string
    skills: string[]
  }
  isSaving: boolean
}>()

const emit = defineEmits<{
  save: [data: { firstName: string; lastName: string; bio: string; location: string; website: string }]
  cancel: []
}>()

const form = reactive({
  firstName: props.initialData.firstName,
  lastName:  props.initialData.lastName,
  bio:       props.initialData.bio,
  location:  props.initialData.location,
  website:   props.initialData.website,
  skills:    [...props.initialData.skills],
})

const newSkill = ref('')

function addSkill() {
  const s = newSkill.value?.trim()
  if (!s || form.skills.includes(s)) return
  form.skills.push(s)
  newSkill.value = ''
}

function removeSkill(i: number) {
  form.skills.splice(i, 1)
}

function handleSave() {
  emit('save', {
    firstName: form.firstName,
    lastName:  form.lastName,
    bio:       form.bio,
    location:  form.location,
    website:   form.website,
  })
}
</script>
