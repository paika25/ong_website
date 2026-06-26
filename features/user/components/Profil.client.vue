<template>
  <div class="space-y-6">

    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <USkeleton class="h-52 w-full rounded-2xl" />
      <div class="grid grid-cols-4 gap-3">
        <USkeleton v-for="i in 4" :key="i" class="h-16 rounded-xl" />
      </div>
    </div>

    <!-- Erreur -->
    <UAlert
      v-else-if="error"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-circle"
      title="Impossible de charger le profil"
      :description="error"
    >
      <template #actions>
        <UButton color="red" variant="outline" size="xs" icon="i-heroicons-arrow-path" @click="loadProfile">
          Réessayer
        </UButton>
      </template>
    </UAlert>

    <!-- Contenu -->
    <template v-else-if="user">

      <!-- Header -->
      <ProfilHeader
        :user="user"
        :isOwnProfile="isOwnProfile"
        :editMode="editMode"
        @upload-avatar="uploadAvatar"
        @upload-cover="uploadCover"
        @toggle-edit="editMode = !editMode"
      />

      <!-- Formulaire d'édition -->
      <ProfilEditForm
        v-if="editMode && isOwnProfile"
        :initialData="formInitialData"
        :isSaving="isSaving"
        @save="saveProfile"
        @cancel="editMode = false"
      />

      <!-- Tabs -->
      <div class="bg-card rounded-2xl border border-border overflow-hidden">
        <!-- Tab nav -->
        <div class="flex border-b border-border px-2 pt-2 gap-1">
          <button
            v-for="(tab, i) in tabs"
            :key="tab.key"
            class="flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-sm font-medium transition-colors relative"
            :class="activeTab === i
              ? 'text-primary bg-primary/5 border-b-2 border-primary -mb-px'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'"
            @click="activeTab = i"
          >
            <Icon :name="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
            <span
              v-if="tab.count !== undefined"
              class="text-xs font-medium px-1.5 py-0.5 rounded-full"
              :class="activeTab === i ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'"
            >
              {{ tab.count }}
            </span>
          </button>
        </div>

        <!-- Tab content -->
        <div class="p-5">
          <ProfilTabOngs
            v-if="activeTab === 0"
            :ongs="userOngs"
            :isOwnProfile="isOwnProfile"
            @ong-click="handleOngClick"
            @navigate="handleNavigate"
          />
          <ProfilTabProjets
            v-else-if="activeTab === 1"
            :projects="userProjects"
            :isOwnProfile="isOwnProfile"
          />
          <ProfilTabActivite
            v-else-if="activeTab === 2"
            :activities="userActivity"
          />
        </div>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProfile } from '../composables/useProfile'
import ProfilHeader      from './ProfilHeader.client.vue'
import ProfilEditForm    from './ProfilEditForm.client.vue'
import ProfilTabOngs     from './ProfilTabOngs.client.vue'
import ProfilTabProjets  from './ProfilTabProjets.client.vue'
import ProfilTabActivite from './ProfilTabActivite.client.vue'

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
  changeCover,
} = useProfile()

const editMode  = ref(false)
const activeTab = ref(0)
const isSaving  = ref(false)

const tabs = computed(() => [
  { key: 'ongs',     label: 'ONGs',     icon: 'i-heroicons-building-office-2', count: userOngs.value.length },
  { key: 'projets',  label: 'Projets',  icon: 'i-heroicons-briefcase',         count: userProjects.value.length },
  { key: 'activite', label: 'Activité', icon: 'i-heroicons-clock',             count: undefined },
])

function uploadAvatar() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (file) await changeAvatar(file)
  }
  input.click()
}

function uploadCover() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (file) await changeCover(file)
  }
  input.click()
}

function handleOngClick(ongId: string) {
  if (ongId) navigateTo(`/ongs/${ongId}`)
}

function handleNavigate(path: string) {
  navigateTo(path)
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

onMounted(() => loadProfile())
</script>
