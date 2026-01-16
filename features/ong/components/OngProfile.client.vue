<template>
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- En-tête du profil -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <!-- Image de couverture -->
      <div class="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
        <img
          v-if="ong.image"
          :src="ong.image"
          :alt="ong.name"
          class="w-full h-full object-cover"
        />
        <button
          @click="handleEditCover"
          class="absolute top-4 right-4 px-4 py-2 bg-background/80 backdrop-blur-sm rounded-lg border border-border hover:bg-background transition-colors"
        >
          <Icon name="i-heroicons-camera" class="w-5 h-5 mr-2 inline" />
          Modifier la couverture
        </button>
      </div>

      <!-- Info principale -->
      <div class="p-6">
        <div class="flex flex-col md:flex-row gap-6 items-start">
          <!-- Logo -->
          <div class="relative">
            <div class="w-24 h-24 rounded-xl border-4 border-background bg-muted flex items-center justify-center overflow-hidden">
              <img
                v-if="ong.image"
                :src="ong.image"
                :alt="ong.name"
                class="w-full h-full object-cover"
              />
              <Icon v-else name="i-heroicons-building-office-2" class="w-12 h-12 text-muted-foreground" />
            </div>
            <button
              @click="handleEditLogo"
              class="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Icon name="i-heroicons-pencil" class="w-4 h-4 text-white" />
            </button>
          </div>

          <!-- Détails -->
          <div class="flex-1">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h1 class="text-3xl font-bold mb-1">{{ ong.name }}</h1>
                <div class="flex items-center gap-3 text-muted-foreground">
                  <span class="flex items-center gap-1">
                    <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
                    {{ ong.location }}
                  </span>
                  <UBadge :color="getStatusColor(ong.status)" variant="soft">
                    {{ getStatusLabel(ong.status) }}
                  </UBadge>
                  <UBadge color="blue" variant="soft">
                    {{ getCategoryLabel(ong.category) }}
                  </UBadge>
                </div>
              </div>
              <UButton variant="outline" @click="handleEditProfile">
                <Icon name="i-heroicons-pencil-square" class="w-4 h-4 mr-2" />
                Modifier
              </UButton>
            </div>
            <p class="text-muted-foreground mb-4">{{ ong.description }}</p>
            
            <!-- Stats rapides -->
            <div class="flex gap-6">
              <div>
                <div class="text-2xl font-bold text-primary">{{ ong.volunteers }}</div>
                <div class="text-sm text-muted-foreground">Bénévoles</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-purple-600">{{ ong.projects.length }}</div>
                <div class="text-sm text-muted-foreground">Projets</div>
              </div>
              <div>
                <div class="text-2xl font-bold text-green-600">{{ getActiveProjectsCount() }}</div>
                <div class="text-sm text-muted-foreground">En cours</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tableau de bord -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Colonne principale (2/3) -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Statistiques clés -->
        <div class="bg-card rounded-xl border border-border p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Vue d'ensemble</h2>
            <select class="px-3 py-2 rounded-lg border border-border bg-background text-sm">
              <option>Ce mois</option>
              <option>3 derniers mois</option>
              <option>Cette année</option>
            </select>
          </div>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <Icon name="i-heroicons-users" class="w-8 h-8 text-blue-600" />
                <span class="text-xs text-green-600 font-semibold">+12%</span>
              </div>
              <div class="text-2xl font-bold">{{ stats.newVolunteers }}</div>
              <div class="text-sm text-muted-foreground">Nouveaux bénévoles</div>
            </div>
            
            <div class="bg-gradient-to-br from-green-500/10 to-green-500/5 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <Icon name="i-heroicons-currency-euro" class="w-8 h-8 text-green-600" />
                <span class="text-xs text-green-600 font-semibold">+28%</span>
              </div>
              <div class="text-2xl font-bold">{{ formatCurrency(stats.totalDonations) }}</div>
              <div class="text-sm text-muted-foreground">Dons reçus</div>
            </div>
            
            <div class="bg-gradient-to-br from-purple-500/10 to-purple-500/5 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <Icon name="i-heroicons-folder" class="w-8 h-8 text-purple-600" />
                <span class="text-xs text-blue-600 font-semibold">{{ stats.newProjects }}</span>
              </div>
              <div class="text-2xl font-bold">{{ stats.activeProjects }}</div>
              <div class="text-sm text-muted-foreground">Projets actifs</div>
            </div>
            
            <div class="bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg p-4">
              <div class="flex items-center justify-between mb-2">
                <Icon name="i-heroicons-heart" class="w-8 h-8 text-orange-600" />
                <span class="text-xs text-green-600 font-semibold">+15%</span>
              </div>
              <div class="text-2xl font-bold">{{ formatNumber(stats.impactedPeople) }}</div>
              <div class="text-sm text-muted-foreground">Bénéficiaires</div>
            </div>
          </div>
        </div>

        <!-- Projets récents -->
        <div class="bg-card rounded-xl border border-border p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Projets récents</h2>
            <UButton variant="ghost" size="sm" @click="navigateTo('/ongs/dashboard/projects')">
              Voir tous
              <Icon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </UButton>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="project in recentProjects"
              :key="project.id"
              class="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              @click="navigateTo(`/ongs/projects/${project.id}`)"
            >
              <div class="flex-1">
                <h3 class="font-semibold mb-1">{{ project.name }}</h3>
                <p class="text-sm text-muted-foreground line-clamp-1">{{ project.description }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <UBadge :color="getProjectStatusColor(project.status)" variant="soft" size="sm">
                    {{ getProjectStatusLabel(project.status) }}
                  </UBadge>
                  <span class="text-xs text-muted-foreground">{{ formatDate(project.startDate) }}</span>
                </div>
              </div>
              <Icon name="i-heroicons-chevron-right" class="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </div>

        <!-- Dons récents -->
        <div class="bg-card rounded-xl border border-border p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold">Dons récents</h2>
            <UButton variant="ghost" size="sm" @click="navigateTo('/ongs/dashboard/donations')">
              Voir tous
              <Icon name="i-heroicons-arrow-right" class="w-4 h-4 ml-1" />
            </UButton>
          </div>
          
          <div class="space-y-3">
            <div
              v-for="donation in recentDonations"
              :key="donation.id"
              class="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="i-heroicons-user" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div class="font-semibold">{{ donation.donorName }}</div>
                  <div class="text-sm text-muted-foreground">{{ donation.type }}</div>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-green-600">{{ formatCurrency(donation.amount) }}</div>
                <div class="text-xs text-muted-foreground">{{ formatRelativeDate(donation.date) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne latérale (1/3) -->
      <div class="space-y-6">
        <!-- Actions rapides -->
        <div class="bg-card rounded-xl border border-border p-6">
          <h2 class="text-lg font-semibold mb-4">Actions rapides</h2>
          <div class="space-y-2">
            <UButton color="primary" block @click="handleCreateProject">
              <Icon name="i-heroicons-plus-circle" class="w-5 h-5 mr-2" />
              Nouveau projet
            </UButton>
            <UButton variant="outline" block @click="handleCreateEvent">
              <Icon name="i-heroicons-calendar-days" class="w-5 h-5 mr-2" />
              Créer un événement
            </UButton>
            <UButton variant="outline" block @click="handleInviteVolunteers">
              <Icon name="i-heroicons-user-plus" class="w-5 h-5 mr-2" />
              Inviter bénévoles
            </UButton>
            <UButton variant="outline" block @click="handleGenerateReport">
              <Icon name="i-heroicons-document-chart-bar" class="w-5 h-5 mr-2" />
              Générer rapport
            </UButton>
          </div>
        </div>

        <!-- Informations de contact -->
        <div class="bg-card rounded-xl border border-border p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">Contact</h2>
            <button @click="handleEditContact" class="text-primary hover:underline text-sm">
              Modifier
            </button>
          </div>
          <div class="space-y-3">
            <div v-if="ong.email" class="flex items-start gap-3">
              <Icon name="i-heroicons-envelope" class="w-5 h-5 text-muted-foreground mt-0.5" />
              <div class="flex-1 min-w-0">
                <div class="text-xs text-muted-foreground">Email</div>
                <a :href="`mailto:${ong.email}`" class="text-sm text-primary hover:underline break-all">
                  {{ ong.email }}
                </a>
              </div>
            </div>
            <div v-if="ong.phone" class="flex items-start gap-3">
              <Icon name="i-heroicons-phone" class="w-5 h-5 text-muted-foreground mt-0.5" />
              <div class="flex-1">
                <div class="text-xs text-muted-foreground">Téléphone</div>
                <a :href="`tel:${ong.phone}`" class="text-sm text-primary hover:underline">
                  {{ ong.phone }}
                </a>
              </div>
            </div>
            <div v-if="ong.website" class="flex items-start gap-3">
              <Icon name="i-heroicons-globe-alt" class="w-5 h-5 text-muted-foreground mt-0.5" />
              <div class="flex-1 min-w-0">
                <div class="text-xs text-muted-foreground">Site web</div>
                <a :href="ong.website" target="_blank" class="text-sm text-primary hover:underline break-all">
                  {{ ong.website }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations légales -->
        <div v-if="ong.legal" class="bg-card rounded-xl border border-border p-6">
          <h2 class="text-lg font-semibold mb-4">Informations légales</h2>
          <div class="space-y-3">
            <div v-if="ong.legal.siret">
              <div class="text-xs text-muted-foreground">SIRET</div>
              <div class="text-sm font-mono">{{ ong.legal.siret }}</div>
            </div>
            <div v-if="ong.legal.registrationDate">
              <div class="text-xs text-muted-foreground">Enregistrement</div>
              <div class="text-sm">{{ formatDate(ong.legal.registrationDate) }}</div>
            </div>
            <div v-if="ong.legal.compliance">
              <div class="text-xs text-muted-foreground mb-1">Conformité</div>
              <div class="flex items-center gap-1 text-xs text-green-600 mb-1">
                <Icon name="i-heroicons-shield-check" class="w-4 h-4" />
                {{ ong.legal.compliance.dataProtection }}
              </div>
              <div class="flex items-center gap-1 text-xs text-green-600">
                <Icon name="i-heroicons-shield-check" class="w-4 h-4" />
                Transparence financière
              </div>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="bg-card rounded-xl border border-border p-6">
          <h2 class="text-lg font-semibold mb-4">Notifications</h2>
          <div class="space-y-3">
            <div class="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div class="flex items-start gap-2">
                <Icon name="i-heroicons-bell" class="w-4 h-4 text-blue-600 mt-0.5" />
                <div class="flex-1 text-sm">
                  <div class="font-semibold text-blue-600">5 nouveaux bénévoles</div>
                  <div class="text-xs text-muted-foreground">Il y a 2 heures</div>
                </div>
              </div>
            </div>
            <div class="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div class="flex items-start gap-2">
                <Icon name="i-heroicons-currency-euro" class="w-4 h-4 text-green-600 mt-0.5" />
                <div class="flex-1 text-sm">
                  <div class="font-semibold text-green-600">Don de 500€ reçu</div>
                  <div class="text-xs text-muted-foreground">Il y a 4 heures</div>
                </div>
              </div>
            </div>
            <button class="w-full text-sm text-primary hover:underline">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ONG, Project } from '../type'

interface Props {
  ong: ONG
}

const props = defineProps<Props>()

// État
const stats = ref({
  newVolunteers: 24,
  totalDonations: 12500,
  activeProjects: 8,
  newProjects: 2,
  impactedPeople: 3200
})

const recentDonations = ref([
  { id: '1', donorName: 'Marie Dupont', type: 'Don ponctuel', amount: 500, date: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { id: '2', donorName: 'Jean Martin', type: 'Don mensuel', amount: 20, date: new Date(Date.now() - 5 * 60 * 60 * 1000) },
  { id: '3', donorName: 'Sophie Bernard', type: 'Parrainage projet', amount: 1000, date: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  { id: '4', donorName: 'Pierre Leroy', type: 'Don ponctuel', amount: 100, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
])

// Projets récents (les 5 derniers)
const recentProjects = computed(() => {
  const projects = Array.isArray(props.ong.projects) ? props.ong.projects : []
  return projects
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 5)
})

// Helpers
const getStatusLabel = (status: string) => {
  const labels = {
    active: 'Actif',
    pending: 'En attente',
    inactive: 'Inactif'
  }
  return labels[status as keyof typeof labels] || status
}

const getStatusColor = (status: string) => {
  const colors = {
    active: 'green',
    pending: 'yellow',
    inactive: 'red'
  }
  return colors[status as keyof typeof colors] || 'gray'
}

const getCategoryLabel = (category: string) => {
  const labels = {
    education: 'Éducation',
    health: 'Santé',
    environment: 'Environnement',
    social: 'Social',
    culture: 'Culture'
  }
  return labels[category as keyof typeof labels] || category
}

const getActiveProjectsCount = () => {
  const projects = Array.isArray(props.ong.projects) ? props.ong.projects : []
  return projects.filter((p: Project) => p.status === 'ongoing').length
}

const getProjectStatusColor = (status: string) => {
  const colors = {
    planned: 'blue',
    ongoing: 'yellow',
    completed: 'green',
    canceled: 'red'
  }
  return colors[status as keyof typeof colors] || 'gray'
}

const getProjectStatusLabel = (status: string) => {
  const labels = {
    planned: 'Planifié',
    ongoing: 'En cours',
    completed: 'Terminé',
    canceled: 'Annulé'
  }
  return labels[status as keyof typeof labels] || status
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

const formatRelativeDate = (date: Date) => {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInHours < 1) return 'Il y a quelques minutes'
  if (diffInHours < 24) return `Il y a ${diffInHours}h`
  if (diffInDays < 7) return `Il y a ${diffInDays}j`
  return formatDate(date.toISOString())
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('fr-FR').format(num)
}

// Actions
const handleEditProfile = () => {
  console.log('Modifier le profil')
  navigateTo(`/ongs/${props.ong.id}/edit`)
}

const handleEditCover = () => {
  console.log('Modifier la couverture')
  // TODO: Ouvrir un modal de sélection d'image
}

const handleEditLogo = () => {
  console.log('Modifier le logo')
  // TODO: Ouvrir un modal de sélection d'image
}

const handleEditContact = () => {
  console.log('Modifier les contacts')
  navigateTo(`/ongs/${props.ong.id}/edit/contact`)
}

const handleCreateProject = () => {
  console.log('Créer un projet')
  navigateTo(`/ongs/${props.ong.id}/projects/new`)
}

const handleCreateEvent = () => {
  console.log('Créer un événement')
  navigateTo(`/ongs/${props.ong.id}/events/new`)
}

const handleInviteVolunteers = () => {
  console.log('Inviter des bénévoles')
  navigateTo(`/ongs/${props.ong.id}/volunteers/invite`)
}

const handleGenerateReport = () => {
  console.log('Générer un rapport')
  // TODO: Générer un rapport PDF/Excel
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
