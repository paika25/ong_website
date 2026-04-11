<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p class="text-muted-foreground">Chargement du profil...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
      <Icon name="i-heroicons-exclamation-circle" class="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 class="text-lg font-semibold text-red-700 dark:text-red-400 mb-2">Erreur</h3>
      <p class="text-red-600 dark:text-red-300 mb-4">{{ error }}</p>
      <UButton color="red" variant="outline" @click="loadProfile">
        Réessayer
      </UButton>
    </div>

    <!-- Profile Content -->
    <template v-else-if="user">
      <ProfilHeader
        :user="user"
        :isOwnProfile="isOwnProfile"
        :editMode="editMode"
        @upload-avatar="uploadAvatar"
        @upload-cover="uploadCover"
        @toggle-edit="editMode = !editMode"
      />

      <ProfilEditForm
        v-if="editMode && isOwnProfile"
        :initialData="formInitialData"
        :isSaving="isSaving"
        @save="saveProfile"
        @cancel="editMode = false"
      />

      <UTabs :items="tabs" v-model="activeTab">
        <template #ongs>
          <ProfilTabOngs
            :ongs="userOngs"
            :isOwnProfile="isOwnProfile"
            @ong-click="handleOngClick"
            @navigate="handleNavigate"
          />
        </template>
        <template #projets>
          <ProfilTabProjets :projects="userProjects" :isOwnProfile="isOwnProfile" />
        </template>
        <template #activite>
          <ProfilTabActivite :activities="userActivity" />
        </template>
      </UTabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useProfile } from '../composables/useProfile'
import ProfilHeader from './ProfilHeader.client.vue'
import ProfilEditForm from './ProfilEditForm.client.vue'
import ProfilTabOngs from './ProfilTabOngs.client.vue'
import ProfilTabProjets from './ProfilTabProjets.client.vue'
import ProfilTabActivite from './ProfilTabActivite.client.vue'
import { ref, onMounted } from 'vue'

const {
  profile: user,
  ongs: userOngs,
  projects: userProjects,
  activities: userActivity,
  isLoading,
  error,
  isOwnProfile,
  formInitialData,
  load: loadProfile,
  save,
  changeAvatar,
  changeCover
} = useProfile()

const editMode = ref(false)
const activeTab = ref(0)
const isSaving = ref(false)

const tabs = [
  { label: 'ONGs', slot: 'ongs' },
  { label: 'Projets', slot: 'projets' },
  { label: 'Activité', slot: 'activite' }
]

function uploadAvatar() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp'
  input.onchange = async () => {
    const file = input.files && input.files[0]
    if (file) await changeAvatar(file)
  }
  input.click()
}

function uploadCover() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp'
  input.onchange = async () => {
    const file = input.files && input.files[0]
    if (file) await changeCover(file)
  }
  input.click()
}

function handleOngClick(ongId: string) {
  if (typeof window !== 'undefined' && ongId) navigateTo(`/ongs/${ongId}`)
}

function handleNavigate(path: string) {
  if (typeof window !== 'undefined') navigateTo(path)
}

async function saveProfile(payload: { firstName: string; lastName: string; bio: string; location: string; website: string }) {
  isSaving.value = true
  try {
    await save(payload)
    editMode.value = false
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>
