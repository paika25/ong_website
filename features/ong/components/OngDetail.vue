<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <!-- Header avec image de couverture -->
    <div class="bg-card rounded-xl border border-border overflow-hidden">
      <!-- Image de couverture -->
      <div class="relative h-64 md:h-80 bg-gradient-to-br from-primary/20 to-accent/20">
        <img
          v-if="ong.image"
          :src="ong.image"
          :alt="ong.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <Icon name="i-heroicons-building-office-2" class="w-24 h-24 text-muted-foreground" />
        </div>
        
        <!-- Badges de statut et catégorie -->
        <div class="absolute top-4 right-4 flex gap-2">
          <UBadge
            :color="ong.status === 'active' ? 'green' : ong.status === 'pending' ? 'yellow' : 'red'"
            variant="solid"
            size="lg"
          >
            {{ getStatusLabel(ong.status) }}
          </UBadge>
        </div>
        
        <div class="absolute top-4 left-4">
          <UBadge color="blue" variant="soft" size="lg">
            {{ getCategoryLabel(ong.category) }}
          </UBadge>
        </div>
      </div>

      <!-- Informations principales -->
      <div class="p-6 md:p-8">
        <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div class="flex-1">
            <h1 class="text-3xl md:text-4xl font-bold mb-3">{{ ong.name }}</h1>
            <div class="flex items-center text-muted-foreground mb-4">
              <Icon name="i-heroicons-map-pin" class="w-5 h-5 mr-2" />
              <span class="text-lg">{{ ong.location }}</span>
            </div>
          </div>
          
          <!-- Bouton d'action -->
          <div class="flex gap-3">
            <UButton
              color="primary"
              size="lg"
              :disabled="ong.status !== 'active'"
              @click="handleJoin"
            >
              <Icon name="i-heroicons-currency-euro" class="w-5 h-5 mr-2" />
              investisser
            </UButton>
            <UButton
              variant="outline"
              size="lg"
              @click="handleShare"
            >
              <Icon name="i-heroicons-share" class="w-5 h-5" />
            </UButton>
          </div>
        </div>

        <!-- Statistiques -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-muted/50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-primary mb-1">{{ ong.volunteers }}</div>
            <div class="text-sm text-muted-foreground">Bénévoles</div>
          </div>
          <div class="bg-muted/50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-purple-600 mb-1">{{ getProjectCount(ong) }}</div>
            <div class="text-sm text-muted-foreground">Projets</div>
          </div>
          <div class="bg-muted/50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-green-600 mb-1">{{ getActiveProjectsCount(ong) }}</div>
            <div class="text-sm text-muted-foreground">Projets actifs</div>
          </div>
          <div class="bg-muted/50 rounded-lg p-4 text-center">
            <div class="text-3xl font-bold text-blue-600 mb-1">{{ getYearsSinceCreation(ong) }}</div>
            <div class="text-sm text-muted-foreground">Années d'activité</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal avec onglets -->
    <UTabs :items="tabs" v-model="activeTab">
      <!-- Onglet À propos -->
      <template #item="{ item }">
        <div v-if="item.key === 'about'" class="space-y-6">
          <!-- Description -->
          <div class="bg-card rounded-xl border border-border p-6">
            <h2 class="text-2xl font-semibold mb-4">À propos</h2>
            <p class="text-muted-foreground leading-relaxed">
              {{ ong.description }}
            </p>
          </div>

          <!-- Informations de contact -->
          <div class="bg-card rounded-xl border border-border p-6">
            <h2 class="text-2xl font-semibold mb-4">Contact</h2>
            <div class="space-y-3">
              <div v-if="ong.email" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="i-heroicons-envelope" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div class="text-sm text-muted-foreground">Email</div>
                  <a :href="`mailto:${ong.email}`" class="text-primary hover:underline">
                    {{ ong.email }}
                  </a>
                </div>
              </div>
              
              <div v-if="ong.phone" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="i-heroicons-phone" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div class="text-sm text-muted-foreground">Téléphone</div>
                  <a :href="`tel:${ong.phone}`" class="text-primary hover:underline">
                    {{ ong.phone }}
                  </a>
                </div>
              </div>
              
              <div v-if="ong.website" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="i-heroicons-globe-alt" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div class="text-sm text-muted-foreground">Site web</div>
                  <a :href="ong.website" target="_blank" class="text-primary hover:underline">
                    {{ ong.website }}
                  </a>
                </div>
              </div>
              
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon name="i-heroicons-calendar" class="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div class="text-sm text-muted-foreground">Créée le</div>
                  <div class="font-medium">{{ formatDate(ong.createdAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Projets -->
        <div v-else-if="item.key === 'projects'" class="space-y-4">
          <div v-if="getProjectsArray(ong).length === 0" class="bg-card rounded-xl border border-border p-12 text-center">
            <Icon name="i-heroicons-folder-open" class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 class="text-lg font-semibold mb-2">Aucun projet</h3>
            <p class="text-muted-foreground">Cette ONG n'a pas encore de projets enregistrés.</p>
          </div>

          <div
            v-for="project in getProjectsArray(ong)"
            :key="project.id"
            class="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-xl font-semibold mb-2">{{ project.name }}</h3>
                <p class="text-muted-foreground mb-3">{{ project.description }}</p>
              </div>
              <UBadge
                :color="getProjectStatusColor(project.status)"
                variant="soft"
                size="lg"
              >
                {{ getProjectStatusLabel(project.status) }}
              </UBadge>
            </div>
            
            <div class="flex items-center gap-4 text-sm text-muted-foreground">
              <div class="flex items-center gap-1">
                <Icon name="i-heroicons-calendar" class="w-4 h-4" />
                <span>Début: {{ formatDate(project.startDate) }}</span>
              </div>
              <div v-if="project.endDate" class="flex items-center gap-1">
                <Icon name="i-heroicons-calendar" class="w-4 h-4" />
                <span>Fin: {{ formatDate(project.endDate) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Bénévoles -->
        <div v-else-if="item.key === 'volunteers'" class="bg-card rounded-xl border border-border p-12 text-center">
          <Icon name="i-heroicons-users" class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-lg font-semibold mb-2">{{ ong.volunteers }} bénévoles</h3>
          <p class="text-muted-foreground mb-6">
            Rejoignez une communauté engagée de bénévoles passionnés.
          </p>
          <UButton
            color="primary"
            size="lg"
            :disabled="ong.status !== 'active'"
            @click="handleJoin"
          >
            <Icon name="i-heroicons-user-plus" class="w-5 h-5 mr-2" />
            Devenir bénévole
          </UButton>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ONG } from '../type'

interface Props {
  ong: ONG
}

const props = defineProps<Props>()

// État
const activeTab = ref(0)

// Onglets
const tabs = [
  { label: 'À propos', key: 'about' },
  { label: 'Projets', key: 'projects' },
  { label: 'Bénévoles', key: 'volunteers' }
]

// Helpers
const getStatusLabel = (status: string) => {
  const labels = {
    active: 'Actif',
    pending: 'En attente',
    inactive: 'Inactif'
  }
  return labels[status as keyof typeof labels] || status
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

const getProjectCount = (ong: ONG) => {
  const p: any = (ong as any).projects
  return Array.isArray(p) ? p.length : Number(p) || 0
}

const getProjectsArray = (ong: ONG) => {
  const p: any = (ong as any).projects
  console.log('Projects:', p,ong,Array.isArray(p) ? p : [])
  return Array.isArray(p) ? p : []
}

const getActiveProjectsCount = (ong: ONG) => {
  const projects = getProjectsArray(ong)
  return projects.filter((p: any) => p.status === 'ongoing').length
}

const getYearsSinceCreation = (ong: ONG) => {
  const created = new Date(ong.createdAt)
  const now = new Date()
  const years = now.getFullYear() - created.getFullYear()
  return years
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
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

// Actions
const handleJoin = () => {
  console.log('Rejoindre ONG:', props.ong.name)
  // TODO: Implémenter la logique d'adhésion
  // Exemple: navigateTo(`/ongs/${props.ong.id}/join`)
}

const handleShare = () => {
  if (navigator.share) {
    navigator.share({
      title: props.ong.name,
      text: props.ong.description,
      url: window.location.href
    })
  } else {
    // Fallback: copier le lien
    navigator.clipboard.writeText(window.location.href)
    console.log('Lien copié dans le presse-papier')
  }
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
