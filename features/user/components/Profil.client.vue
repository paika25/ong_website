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
      <!-- Header du profil -->
      <div class="bg-card rounded-xl border border-border overflow-hidden">
        <!-- Cover image -->
        <div class="h-32 bg-gradient-to-r from-primary to-accent relative overflow-hidden">
          <img
            v-if="user.cover"
            :src="user.cover"
            :alt="`Couverture de ${user.fullName}`"
            class="w-full h-full object-cover"
          />
          <UButton
            v-if="isOwnProfile"
            variant="solid"
            color="white"
            size="xs"
            class="absolute top-4 right-4"
            @click="uploadCover"
          >
            <Icon name="i-heroicons-camera" class="w-4 h-4 mr-1" />
            Modifier la couverture
          </UButton>
        </div>

        <!-- Informations principales -->
        <div class="p-6 relative">
          <!-- Avatar -->
          <div class="absolute -top-16 left-6">
            <div class="relative">
              <UAvatar
                :src="user.avatar || ''"
                :alt="user.fullName"
                size="xl"
                class="ring-4 ring-background"
              />
              <UButton
                v-if="isOwnProfile"
                variant="solid"
                color="primary"
                size="2xs"
                class="absolute bottom-0 right-0 rounded-full"
                @click="uploadAvatar"
              >
                <Icon name="i-heroicons-camera" class="w-3 h-3" />
              </UButton>
            </div>
          </div>

          <!-- Actions profile -->
          <div class="flex justify-end mb-4" v-if="!isOwnProfile">
            <div class="flex gap-2">
              <UButton variant="outline" size="sm">
                <Icon name="i-heroicons-envelope" class="w-4 h-4 mr-1" />
                Message
              </UButton>
            <UButton color="primary" size="sm">
              <Icon name="i-heroicons-user-plus" class="w-4 h-4 mr-1" />
              Suivre
            </UButton>
          </div>
        </div>

        <div class="flex justify-end mb-4" v-else>
          <UButton variant="outline" size="sm" @click="editMode = !editMode">
            <Icon name="i-heroicons-pencil" class="w-4 h-4 mr-1" />
            {{ editMode ? 'Annuler' : 'Modifier' }}
          </UButton>
        </div>

        <!-- Informations utilisateur -->
        <div class="mt-8">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-2xl font-bold">{{ user.fullName }}</h1>
            <UBadge
              v-if="user.verified"
              color="blue"
              variant="solid"
              size="xs"
            >
              <Icon name="i-heroicons-check-badge" class="w-3 h-3 mr-1" />
              Vérifié
            </UBadge>
          </div>

          <p class="text-muted-foreground mb-3 whitespace-pre-line">{{ user.bio }}</p>

          <!-- Métadonnées -->
          <div class="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div v-if="user.location" class="flex items-center gap-1">
              <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
              <span>{{ user.location }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="i-heroicons-calendar" class="w-4 h-4" />
              <span>Rejoint en {{ formatDate(user.createdAt) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="i-heroicons-envelope" class="w-4 h-4" />
              <span>{{ user.email }}</span>
            </div>
            <div v-if="user.website" class="flex items-center gap-1">
              <Icon name="i-heroicons-globe-alt" class="w-4 h-4" />
              <a :href="user.website" target="_blank" class="hover:underline">{{ user.website }}</a>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="flex gap-6">
            <div class="text-center">
              <div class="font-semibold text-lg">{{ user.stats?.ongs || 0 }}</div>
              <div class="text-sm text-muted-foreground">ONGs</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-lg">{{ user.stats?.projects || 0 }}</div>
              <div class="text-sm text-muted-foreground">Projets</div>
            </div>
            <div v-if="user.accountType === 'user_partner'" class="text-center">
              <div class="font-semibold text-lg">{{ user.stats?.donations || 0 }}</div>
              <div class="text-sm text-muted-foreground">Dons</div>
            </div>
            <div v-if="user.accountType === 'user_partner'" class="text-center">
              <div class="font-semibold text-lg">{{ (user.stats?.totalDonated || 0).toLocaleString('fr-FR') }} Ar</div>
              <div class="text-sm text-muted-foreground">Total donné</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Formulaire d'édition -->
    <div v-if="editMode && isOwnProfile" class="bg-card rounded-xl border border-border p-6">
      <h2 class="text-xl font-semibold mb-6">Modifier le profil</h2>

      <form @submit.prevent="saveProfile" class="space-y-4">
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
            <UInput 
              v-model="form.location" 
              placeholder="Ville, Pays"
              icon="i-heroicons-map-pin"
            />
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
          <UButton
            type="submit"
            color="primary"
            :loading="isSaving"
          >
            Sauvegarder
          </UButton>
          <UButton
            type="button"
            variant="outline"
            @click="cancelEdit"
          >
            Annuler
          </UButton>
        </div>
      </form>
    </div>

    <!-- Onglets de contenu -->
    <UTabs :items="tabs" v-model="activeTab">
      <template #ongs>
        <div class="space-y-4">
          <div v-if="userOngs.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="ong in userOngs"
              :key="ong.id"
              class="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="handleOngClick(ong.id)"
            >
              <div class="flex items-start gap-3">
                <UAvatar :src="ong.logo" :alt="ong.name" size="sm" />
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium truncate">{{ ong.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ ong.role }}</p>
                  <div class="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{{ ong.volunteers }} bénévoles</span>
                    <span>•</span>
                    <span>{{ Array.isArray(ong.projects) ? ong.projects.length : ong.projects }} projets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Empty state pour ONGs -->
          <div v-else class="text-center py-8 text-muted-foreground">
            <Icon name="i-heroicons-building-office" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{{ isOwnProfile ? 'Vous n\'êtes membre d\'aucune ONG' : 'Aucune ONG associée' }}</p>
            <UButton v-if="isOwnProfile" variant="outline" size="sm" class="mt-4" @click="handleNavigate('/ongs')">
              Explorer les ONGs
            </UButton>
          </div>
        </div>
      </template>

      <template #projets>
        <div class="space-y-4">
          <div v-if="userProjects.length > 0" class="grid gap-4">
            <div
              v-for="project in userProjects"
              :key="project.id"
              class="bg-card rounded-lg border border-border p-6"
            >
              <div class="flex items-start justify-between mb-3">
                <div>
                  <h3 class="font-semibold">{{ project.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ project.ong }}</p>
                </div>
                <UBadge
                  :color="getProjectStatusColor(project.status)"
                  variant="soft"
                >
                  {{ project.status }}
                </UBadge>
              </div>
              <p class="text-sm text-muted-foreground mb-3">{{ project.description }}</p>
              <div class="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{{ formatDate(project.startDate) }}</span>
                <span>•</span>
                <span>{{ project.participants }} participants</span>
              </div>
            </div>
          </div>
          
          <!-- Empty state pour projets -->
          <div v-else class="text-center py-8 text-muted-foreground">
            <Icon name="i-heroicons-folder" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{{ isOwnProfile ? 'Vous n\'avez pas encore de projets' : 'Aucun projet' }}</p>
          </div>
        </div>
      </template>

      <template #activite>
        <div class="space-y-4">
          <div
            v-for="activity in userActivity"
            :key="activity.id"
            class="flex gap-3 p-4 bg-card rounded-lg border border-border"
          >
            <UAvatar :src="activity.avatar" size="sm" />
            <div class="flex-1">
              <p class="text-sm">
                <span class="font-medium">{{ activity.user }}</span>
                {{ activity.action }}
                <span class="font-medium">{{ activity.target }}</span>
              </p>
              <p class="text-xs text-muted-foreground mt-1">
                {{ formatDate(activity.createdAt) }}
              </p>
            </div>
          </div>
          
          <!-- Empty state pour activité -->
          <div v-if="userActivity.length === 0" class="text-center py-8 text-muted-foreground">
            <Icon name="i-heroicons-clock" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune activité récente</p>
          </div>
        </div>
      </template>
    </UTabs>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { useUserService } from '../services/userService'
import type { User } from '../services/userService'
import { ref, reactive, computed, onMounted } from 'vue'

const authStore = useAuthStore()
const { getCurrentUser, updateUser, updateAvatar, updateCover, getUserStats } = useUserService()
const supabase = useSupabase()

// États
const user = ref<User | null>(null)
const editMode = ref(false)
const activeTab = ref(0)
const isSaving = ref(false)
const newSkill = ref('')
const isLoading = ref(true)
const error = ref<string | null>(null)

// Formulaire d'édition
const form = reactive({
  firstName: '',
  lastName: '',
  bio: '',
  location: '',
  website: '',
  skills: [] as string[]
})

// C'est toujours le propre profil de l'utilisateur connecté
const isOwnProfile = computed(() => true)

// Données des onglets
const tabs = [
  { label: 'ONGs', slot: 'ongs' },
  { label: 'Projets', slot: 'projets' },
  { label: 'Activité', slot: 'activite' }
]

// Données dynamiques
const userOngs = ref<any[]>([])
const userProjects = ref<any[]>([])
const userActivity = ref<any[]>([])

// Charger les ONGs de l'utilisateur
async function loadUserOngs(userId: string) {
  if (!supabase) return

  try {
    // Pour les agents ONG
    const { data: agentOngs } = await supabase
      .from('agent_ong_managers')
      .select(`
        role,
        ong:ongs (
          id,
          name,
          logo,
          volunteers,
          projects
        )
      `)
      .eq('agent_account_id', userId)

    if (agentOngs && agentOngs.length > 0) {
      userOngs.value = agentOngs.map((item: any) => ({
        id: item.ong?.id,
        name: item.ong?.name || 'ONG',
        role: item.role || 'Membre',
        logo: item.ong?.logo || '',
        volunteers: item.ong?.volunteers || 0,
        projects: Array.isArray(item.ong?.projects) ? item.ong.projects.length : 0
      }))
    }
  } catch (err) {
    console.error('Erreur chargement ONGs:', err)
  }
}

// Charger les projets de l'utilisateur
async function loadUserProjects(userId: string) {
  if (!supabase) return

  try {
    // Récupérer les ONGs de l'utilisateur d'abord
    const { data: agentOngs } = await supabase
      .from('agent_ong_managers')
      .select('ong_id')
      .eq('agent_account_id', userId)

    if (agentOngs && agentOngs.length > 0) {
      const ongIds = agentOngs.map((o: any) => o.ong_id)

      const { data: ongs } = await supabase
        .from('ongs')
        .select('id, name, projects')
        .in('id', ongIds)

      if (ongs) {
        const allProjects: any[] = []
        ongs.forEach((ong: any) => {
          if (Array.isArray(ong.projects)) {
            ong.projects.forEach((project: any) => {
              allProjects.push({
                id: project.id || `${ong.id}-${allProjects.length}`,
                name: project.name || project.title || 'Projet sans nom',
                ong: ong.name,
                description: project.description || '',
                status: project.status || 'En cours',
                startDate: project.start_date || project.startDate || new Date().toISOString(),
                participants: project.participants || project.volunteers || 0
              })
            })
          }
        })
        userProjects.value = allProjects
      }
    }
  } catch (err) {
    console.error('Erreur chargement projets:', err)
  }
}

// Charger l'activité récente
async function loadUserActivity(userId: string) {
  if (!supabase) return

  try {
    // Activité basée sur les donations ou autres actions
    const { data: donations } = await supabase
      .from('donations')
      .select(`
        id,
        amount,
        created_at,
        ong:ongs (name)
      `)
      .eq('donor_account_id', userId)
      .order('created_at', { ascending: false })
      .limit(10)

    if (donations && donations.length > 0) {
      userActivity.value = donations.map((d: any) => ({
        id: d.id,
        user: user.value?.firstName || 'Utilisateur',
        action: `a fait un don de ${d.amount?.toLocaleString('fr-FR')} Ar à`,
        target: d.ong?.name || 'une ONG',
        avatar: user.value?.avatar || '',
        createdAt: d.created_at
      }))
    } else {
      // Activité par défaut si pas de donations
      userActivity.value = [{
        id: 'joined',
        user: user.value?.firstName || 'Utilisateur',
        action: 'a rejoint la plateforme',
        target: '',
        avatar: user.value?.avatar || '',
        createdAt: user.value?.createdAt || new Date().toISOString()
      }]
    }
  } catch (err) {
    console.error('Erreur chargement activité:', err)
  }
}

function formatDate(value?: string | Date) {
  if (!value) return ''
  const d = typeof value === 'string' ? new Date(value) : value
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long'
  }).format(d)
}

function addSkill() {
  const s = newSkill.value?.trim()
  if (!s) return
  if (!form.skills.includes(s)) {
    form.skills.push(s)
  }
  newSkill.value = ''
}

function removeSkill(index: number) {
  form.skills.splice(index, 1)
}

function cancelEdit() {
  if (!user.value) return
  initForm(user.value)
  newSkill.value = ''
  editMode.value = false
}

function uploadAvatar() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp'
  input.onchange = async () => {
    const file = input.files && input.files[0]
    if (!file || !user.value) return

    // Preview immédiat
    const previewUrl = URL.createObjectURL(file)
    const previousAvatar = user.value.avatar
    user.value.avatar = previewUrl

    try {
      const avatarUrl = await updateAvatar(file)
      URL.revokeObjectURL(previewUrl)
      user.value.avatar = avatarUrl

      // Mettre à jour le store auth
      if (authStore.currentUser) {
        authStore.updateUserData({ avatar: avatarUrl })
      }
      console.log('✅ Avatar uploadé et persisté')
    } catch (err: any) {
      console.error('❌ Erreur upload avatar:', err)
      URL.revokeObjectURL(previewUrl)
      user.value.avatar = previousAvatar
      error.value = err.message || 'Erreur lors de l\'upload de l\'avatar'
    }
  }
  input.click()
}

function uploadCover() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp'
  input.onchange = async () => {
    const file = input.files && input.files[0]
    if (!file || !user.value) return

    // Preview immédiat
    const previewUrl = URL.createObjectURL(file)
    const previousCover = user.value.cover
    ;(user.value as any).cover = previewUrl

    try {
      const coverUrl = await updateCover(file)
      URL.revokeObjectURL(previewUrl)
      ;(user.value as any).cover = coverUrl

      // Mettre à jour le store auth
      if (authStore.currentUser) {
        authStore.updateUserData({ cover: coverUrl } as any)
      }
      console.log('✅ Couverture uploadée et persistée')
    } catch (err: any) {
      console.error('❌ Erreur upload couverture:', err)
      URL.revokeObjectURL(previewUrl)
      ;(user.value as any).cover = previousCover
      error.value = err.message || 'Erreur lors de l\'upload de la couverture'
    }
  }
  input.click()
}

function getProjectStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'en cours':
      return 'yellow'
    case 'terminé':
      return 'green'
    case 'planifié':
      return 'blue'
    default:
      return 'gray'
  }
}

// ✅ Fonction helper pour la navigation
function handleOngClick(ongId: string) {
  if (typeof window !== 'undefined' && ongId) {
    navigateTo(`/ongs/${ongId}`)
  }
}

function handleNavigate(path: string) {
  if (typeof window !== 'undefined') {
    navigateTo(path)
  }
}

// Initialiser le formulaire avec les données utilisateur
function initForm(userData: User) {
  form.firstName = userData.firstName || ''
  form.lastName = userData.lastName || ''
  form.bio = userData.bio || ''
  form.location = userData.location || ''
  form.website = userData.website || ''
  form.skills = Array.isArray((userData as any).skills) ? [...(userData as any).skills] : []
}

// Charger toutes les données du profil depuis le store auth
async function loadProfile() {
  isLoading.value = true
  error.value = null

  try {
    console.log('1- authstore', authStore)
    // Vérifier si l'utilisateur est connecté via le store
    if (!authStore.currentUser) {
      error.value = 'Vous devez être connecté pour voir votre profil'
      isLoading.value = false
      return
    }

    // Construire les données utilisateur depuis le store
    let userData: User = {
      id: authStore.currentUser.id,
      email: authStore.currentUser.email,
      accountType: authStore.currentUser.accountType as 'user_partner' | 'user_agent',
      firstName: authStore.currentUser.firstName || '',
      lastName: authStore.currentUser.lastName || '',
      fullName: authStore.currentUser.fullName || authStore.currentUser.email,
      companyName: authStore.currentUser.companyName,
      avatar: authStore.currentUser.avatar,
      cover: (authStore.currentUser as any).cover,
      bio: authStore.currentUser.bio,
      location: authStore.currentUser.location,
      website: authStore.currentUser.website,
      verified: authStore.currentUser.verified || false,
      createdAt: authStore.currentUser.createdAt || new Date().toISOString(),
      updatedAt: authStore.currentUser.updatedAt || new Date().toISOString()
    }

    console.log('2 - userdata',userData)

    // Récupérer les stats depuis Supabase
    const stats = await getUserStats(userData.id, userData.accountType)
    userData.stats = stats

    console.log('3 - stats',userData)

    user.value = userData
    initForm(userData)

    // Charger les données associées en parallèle
    await Promise.all([
      loadUserOngs(userData.id),
      loadUserProjects(userData.id),
      loadUserActivity(userData.id)
    ])

    console.log('✅ Profil chargé:', userData.email)
  } catch (err: any) {
    console.error('Erreur chargement profil:', err)
    error.value = err.message || 'Erreur lors du chargement du profil'
  } finally {
    isLoading.value = false
  }
}

// Mettre à jour le profil
async function saveProfile() {
  if (!user.value) return
  
  isSaving.value = true
  error.value = null

  try {
    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      location: form.location,
      website: form.website
    }

    const updatedUser = await updateUser(payload)
    
    // Mettre à jour les données locales
    user.value = updatedUser
    
    // Mettre à jour le store auth aussi
    if (isOwnProfile.value && authStore.currentUser) {
      authStore.updateUserData({
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        fullName: updatedUser.fullName,
        bio: updatedUser.bio,
        location: updatedUser.location,
        website: updatedUser.website
      })
    }

    editMode.value = false
    console.log('✅ Profil mis à jour')
  } catch (err: any) {
    console.error('Erreur sauvegarde:', err)
    error.value = err.message || 'Erreur lors de la sauvegarde'
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>
