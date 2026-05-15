<template>
  <div class="bg-card rounded-xl border border-border p-6">
    <h2 class="text-lg font-semibold mb-6">Modifier le profil</h2>

    <form @submit.prevent="handleSave" class="space-y-4">
      <div class="grid md:grid-cols-2 gap-4">
        <UFormGroup label="Prénom" required>
          <UInput v-model="form.firstName" placeholder="John" />
        </UFormGroup>

        <UFormGroup label="Nom" required>
          <UInput v-model="form.lastName" placeholder="Doe" />
        </UFormGroup>
      </div>

      <UFormGroup label="Bio">
        <UTextarea
          v-model="form.bio"
          placeholder="Parlez-nous de vous..."
          :rows="3"
        />
      </UFormGroup>

      <div class="grid md:grid-cols-2 gap-4">
        <UFormGroup label="Localisation">
          <VilleAutoCompletion v-model="form.location" />
        </UFormGroup>

        <UFormGroup label="Site web">
          <UInput
            v-model="form.website"
            placeholder="https://monsite.com"
            icon="i-heroicons-globe-alt"
          />
        </UFormGroup>
      </div>

      <!-- Compétences -->
      <UFormGroup label="Compétences">
        <div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="(skill, index) in form.skills"
              :key="index"
              variant="soft"
              color="primary"
              class="cursor-pointer"
              @click="removeSkill(index)"
            >
              {{ skill }}
              <Icon name="i-heroicons-x-mark" class="w-3 h-3 ml-1" />
            </UBadge>
          </div>
          <div class="flex gap-2">
            <UInput
              v-model="newSkill"
              placeholder="Ajouter une compétence..."
              @keyup.enter="addSkill"
              class="flex-1"
            />
            <UButton
              type="button"
              variant="outline"
              @click="addSkill"
              :disabled="!newSkill.trim()"
            >
              Ajouter
            </UButton>
          </div>
        </div>
      </UFormGroup>

      <!-- Actions -->
      <div class="flex gap-3 pt-4">
        <UButton type="submit" color="primary" :loading="isSaving">
          Sauvegarder
        </UButton>
        <UButton type="button" variant="outline" @click="emit('cancel')">
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
  lastName: props.initialData.lastName,
  bio: props.initialData.bio,
  location: props.initialData.location,
  website: props.initialData.website,
  skills: [...props.initialData.skills]
})

const newSkill = ref('')

function addSkill() {
  const s = newSkill.value?.trim()
  if (!s) return
  if (!form.skills.includes(s)) form.skills.push(s)
  newSkill.value = ''
}

function removeSkill(index: number) {
  form.skills.splice(index, 1)
}

function handleSave() {
  emit('save', {
    firstName: form.firstName,
    lastName: form.lastName,
    bio: form.bio,
    location: form.location,
    website: form.website
  })
}
</script>
