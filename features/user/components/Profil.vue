<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Header du profil -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <!-- Cover image -->
      <div class="h-32 bg-gradient-to-r from-primary to-accent relative">
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
              :src="user.avatar"
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

          <p class="text-muted-foreground mb-3">{{ user.bio }}</p>

          <!-- Métadonnées -->
          <div class="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
            <div class="flex items-center gap-1">
              <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
              <span>{{ user.location }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="i-heroicons-calendar" class="w-4 h-4" />
              <span>Rejoint en {{ formatDate(user.joinedAt) }}</span>
            </div>
            <div class="flex items-center gap-1">
              <Icon name="i-heroicons-envelope" class="w-4 h-4" />
              <span>{{ user.email }}</span>
            </div>
          </div>

          <!-- Statistiques -->
          <div class="flex gap-6">
            <div class="text-center">
              <div class="font-semibold text-lg">{{ user.stats.ongs }}</div>
              <div class="text-sm text-muted-foreground">ONGs</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-lg">{{ user.stats.projects }}</div>
              <div class="text-sm text-muted-foreground">Projets</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-lg">{{ user.stats.followers }}</div>
              <div class="text-sm text-muted-foreground">Abonnés</div>
            </div>
            <div class="text-center">
              <div class="font-semibold text-lg">{{ user.stats.following }}</div>
              <div class="text-sm text-muted-foreground">Abonnements</div>
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
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="ong in userOngs"
              :key="ong.id"
              class="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
              @click="navigateTo(`/ongs/${ong.id}`)"
            >
              <div class="flex items-start gap-3">
                <UAvatar :src="ong.logo" :alt="ong.name" size="sm" />
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium truncate">{{ ong.name }}</h3>
                  <p class="text-sm text-muted-foreground">{{ ong.role }}</p>
                  <div class="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{{ ong.volunteers }} bénévoles</span>
                    <span>•</span>
                    <span>{{ ong.projects }} projets</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template #projets>
        <div class="space-y-4">
          <div class="grid gap-4">
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
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { useUserService } from '../services/userService'
import type { User } from '../services/userService'
import {ref , reactive,computed} from 'vue'

interface Props {
  userId?: string
}

const props = defineProps<Props>()

const { getCurrentUser, updateUser } = useUserService()

// États
const user = ref<User | null>(null)
const editMode = ref(false)
const activeTab = ref(0)
const isSaving = ref(false)
const newSkill = ref('')

// Formulaire d'édition
const form = reactive({
  firstName: '',
  lastName: '',
  bio: '',
  location: '',
  website: '',
  skills: [] as string[]
})

// Computed
const isOwnProfile = computed(() => {
  // Logique pour déterminer si c'est le profil de l'utilisateur connecté
  return !props.userId || props.userId === 'current'
})

// Données des onglets
const tabs = [
  { label: 'ONGs', key: 'ongs' },
  { label: 'Projets', key: 'projets' },
  { label: 'Activité', key: 'activite' }
]

// Mock data pour les onglets
const userOngs = ref([
  {
    id: '1',
    name: 'Éducation pour Tous',
    role: 'Coordinateur',
    logo: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=100',
    volunteers: 245,
    projects: 12
  },
  {
    id: '2',
    name: 'Santé Communautaire',
    role: 'Bénévole',
    logo: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100',
    volunteers: 156,
    projects: 8
  }
])
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userProjects = ref([
  {
    id: 'p1',
    name: 'Accès à l\'eau potable',
    ong: 'Solidarité Locale',
    description: 'Installation de puits et systèmes de collecte d’eau dans plusieurs villages.',
    status: 'En cours',
    startDate: '2024-03-15T00:00:00Z',
    participants: 32
  },
  {
    id: 'p2',
    name: 'Formation numérique',
    ong: 'Éducation Numérique',
    description: 'Ateliers pour former les jeunes aux compétences digitales.',
    status: 'Planifié',
    startDate: '2025-01-10T00:00:00Z',
    participants: 0
  }
])

const userActivity = ref([
  {
    id: 'a1',
    user: 'Marius',
    action: 'a rejoint',
    target: 'Éducation pour Tous',
    avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=48',
    createdAt: new Date().toISOString()
  },
  {
    id: 'a2',
    user: 'Marius',
    action: 'a publié',
    target: 'un nouveau projet',
    avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=48',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  }
])

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

async function saveProfile() {
  if (!user.value) return
  isSaving.value = true
  try {
    const payload = {
      ...user.value,
      firstName: form.firstName,
      lastName: form.lastName,
      bio: form.bio,
      location: form.location,
      website: form.website,
      skills: [...form.skills]
    }
    await updateUser(payload)
    user.value = { ...payload } as User
    editMode.value = false
  } catch (err) {
    // gérer l'erreur selon vos besoins
    console.error(err)
  } finally {
    isSaving.value = false
  }
}

function cancelEdit() {
  if (!user.value) return
  form.firstName = (user.value.firstName as string) || ''
  form.lastName = (user.value.lastName as string) || ''
  form.bio = user.value.bio || ''
  form.location = user.value.location || ''
  form.website = user.value.website || ''
  form.skills = Array.isArray(user.value.skills) ? [...user.value.skills] : []
  newSkill.value = ''
  editMode.value = false
}

function uploadAvatar() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files && input.files[0]
    if (!file || !user.value) return
    user.value.avatar = URL.createObjectURL(file)
    // Ici vous pourriez appeler une API pour uploader l'image réelle
  }
  input.click()
}

function uploadCover() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    const file = input.files && input.files[0]
    if (!file || !user.value) return
    ;(user.value as any).cover = URL.createObjectURL(file)
    // Uploader la couverture côté serveur si nécessaire
  }
  input.click()
}

function getProjectStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case 'en cours':
    case 'en cours':
      return 'yellow'
    case 'terminé':
    case 'terminés':
    case 'terminé':
      return 'green'
    case 'planifié':
    case 'planifié':
      return 'blue'
    default:
      return 'gray'
  }
}

function navigateTo(path: string) {
  router.push(path)
}

onMounted(async () => {
  try {
    const u = await getCurrentUser(props.userId)
    if (u) {
      user.value = u
      form.firstName = (u.firstName as string) || ''
      form.lastName = (u.lastName as string) || ''
      form.bio = u.bio || ''
      form.location = u.location || ''
      form.website = u.website || ''
      form.skills = Array.isArray(u.skills) ? [...u.skills] : []
    }
  } catch (e) {
    console.error('Erreur lors du chargement de l\'utilisateur', e)
  }
})
