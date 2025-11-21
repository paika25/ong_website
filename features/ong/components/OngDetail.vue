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

        <!-- Onglet Finances -->
        <div v-else-if="item.key === 'financials'" class="space-y-6">
          <div v-if="ong.financials" class="space-y-6">
            <!-- Budget -->
            <div class="bg-card rounded-xl border border-border p-6">
              <h2 class="text-2xl font-semibold mb-4">Budget 2023</h2>
              <div class="text-4xl font-bold text-primary mb-6">
                {{ formatCurrency(ong.financials.totalBudget2023) }}
              </div>
              
              <!-- Sources de financement -->
              <h3 class="text-lg font-semibold mb-3">Sources de financement</h3>
              <div class="space-y-3">
                <div v-for="source in ong.financials.fundingSources" :key="source.source" class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>{{ source.source }}</span>
                    <span class="font-semibold">{{ source.percentage }}% ({{ formatCurrency(source.amount) }})</span>
                  </div>
                  <div class="w-full bg-muted rounded-full h-2">
                    <div 
                      class="bg-primary h-2 rounded-full transition-all" 
                      :style="{ width: `${source.percentage}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Allocation des ressources -->
            <div class="bg-card rounded-xl border border-border p-6">
              <h3 class="text-lg font-semibold mb-4">Allocation des ressources</h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="text-center p-4 bg-muted/50 rounded-lg">
                  <div class="text-3xl font-bold text-green-600">{{ ong.financials.allocation.programs }}%</div>
                  <div class="text-sm text-muted-foreground mt-1">Programmes</div>
                </div>
                <div class="text-center p-4 bg-muted/50 rounded-lg">
                  <div class="text-3xl font-bold text-blue-600">{{ ong.financials.allocation.administration }}%</div>
                  <div class="text-sm text-muted-foreground mt-1">Administration</div>
                </div>
                <div class="text-center p-4 bg-muted/50 rounded-lg">
                  <div class="text-3xl font-bold text-purple-600">{{ ong.financials.allocation.fundraising }}%</div>
                  <div class="text-sm text-muted-foreground mt-1">Collecte</div>
                </div>
              </div>
            </div>

            <!-- Rapports financiers -->
            <div v-if="ong.financials.financialReports && ong.financials.financialReports.length > 0" class="bg-card rounded-xl border border-border p-6">
              <h3 class="text-lg font-semibold mb-4">Rapports financiers</h3>
              <div class="space-y-2">
                <a 
                  v-for="report in ong.financials.financialReports" 
                  :key="report.year"
                  :href="report.url"
                  target="_blank"
                  class="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <Icon name="i-heroicons-document-text" class="w-5 h-5 text-primary" />
                    <span class="font-medium">Rapport {{ report.year }}</span>
                    <UBadge v-if="report.audited" color="green" variant="soft">Audité</UBadge>
                  </div>
                  <Icon name="i-heroicons-arrow-down-tray" class="w-5 h-5 text-muted-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Impact -->
        <div v-else-if="item.key === 'impact'" class="space-y-6">
          <div v-if="ong.impact">
            <!-- Statistiques d'impact -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div class="bg-card rounded-xl border border-border p-6 text-center">
                <div class="text-4xl font-bold text-primary mb-2">{{ formatNumber(ong.impact.totalBeneficiaries) }}</div>
                <div class="text-sm text-muted-foreground">Bénéficiaires</div>
              </div>
              <div v-if="ong.impact.schoolsBuilt" class="bg-card rounded-xl border border-border p-6 text-center">
                <div class="text-4xl font-bold text-green-600 mb-2">{{ ong.impact.schoolsBuilt }}</div>
                <div class="text-sm text-muted-foreground">Écoles construites</div>
              </div>
              <div v-if="ong.impact.teachersTrained" class="bg-card rounded-xl border border-border p-6 text-center">
                <div class="text-4xl font-bold text-blue-600 mb-2">{{ ong.impact.teachersTrained }}</div>
                <div class="text-sm text-muted-foreground">Enseignants formés</div>
              </div>
              <div v-if="ong.impact.healthcareProvided" class="bg-card rounded-xl border border-border p-6 text-center">
                <div class="text-4xl font-bold text-red-600 mb-2">{{ formatNumber(ong.impact.healthcareProvided) }}</div>
                <div class="text-sm text-muted-foreground">Soins fournis</div>
              </div>
              <div v-if="ong.impact.treesPlanted" class="bg-card rounded-xl border border-border p-6 text-center">
                <div class="text-4xl font-bold text-green-600 mb-2">{{ formatNumber(ong.impact.treesPlanted) }}</div>
                <div class="text-sm text-muted-foreground">Arbres plantés</div>
              </div>
              <div v-if="ong.impact.wasteCollected" class="bg-card rounded-xl border border-border p-6 text-center">
                <div class="text-4xl font-bold text-yellow-600 mb-2">{{ ong.impact.wasteCollected }} T</div>
                <div class="text-sm text-muted-foreground">Déchets collectés</div>
              </div>
            </div>

            <!-- KPIs -->
            <div v-if="ong.impact.kpis && ong.impact.kpis.length > 0" class="bg-card rounded-xl border border-border p-6">
              <h2 class="text-2xl font-semibold mb-4">Indicateurs de performance</h2>
              <div class="space-y-4">
                <div v-for="kpi in ong.impact.kpis" :key="kpi.metric" class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                  <Icon name="i-heroicons-chart-bar" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <div class="flex-1">
                    <div class="font-semibold mb-1">{{ kpi.metric }}</div>
                    <div class="text-muted-foreground">{{ kpi.value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Onglet Investissement -->
        <div v-else-if="item.key === 'investment'" class="space-y-4">
          <div v-if="ong.investmentOpportunities && ong.investmentOpportunities.length > 0">
            <div class="bg-primary/10 rounded-xl border border-primary/20 p-6 mb-6">
              <h2 class="text-2xl font-semibold mb-2">Opportunités d'investissement</h2>
              <p class="text-muted-foreground">Soutenez nos projets et contribuez à notre impact social.</p>
            </div>
            
            <div 
              v-for="opportunity in ong.investmentOpportunities" 
              :key="opportunity.type"
              class="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-xl font-semibold mb-2">{{ opportunity.type }}</h3>
                  <p class="text-muted-foreground mb-3">{{ opportunity.description }}</p>
                </div>
                <UBadge color="green" variant="soft" size="lg">
                  {{ formatCurrency(opportunity.minInvestment) }} min
                </UBadge>
              </div>
              
              <div class="bg-muted/50 rounded-lg p-4 mb-4">
                <div class="text-sm font-semibold text-muted-foreground mb-1">Conditions</div>
                <div class="text-sm">{{ opportunity.terms }}</div>
              </div>
              
              <UButton color="primary" block @click="handleInvest(opportunity)">
                <Icon name="i-heroicons-currency-euro" class="w-5 h-5 mr-2" />
                Investir maintenant
              </UButton>
            </div>
          </div>
        </div>

        <!-- Onglet Transparence -->
        <div v-else-if="item.key === 'transparency'" class="space-y-6">
          <!-- Informations légales -->
          <div v-if="ong.legal" class="bg-card rounded-xl border border-border p-6">
            <h2 class="text-2xl font-semibold mb-4">Informations légales</h2>
            <div class="space-y-3">
              <div v-if="ong.legal.siret" class="flex items-center gap-3">
                <Icon name="i-heroicons-identification" class="w-5 h-5 text-primary" />
                <div>
                  <div class="text-sm text-muted-foreground">SIRET</div>
                  <div class="font-medium">{{ ong.legal.siret }}</div>
                </div>
              </div>
              <div v-if="ong.legal.registrationDate" class="flex items-center gap-3">
                <Icon name="i-heroicons-calendar" class="w-5 h-5 text-primary" />
                <div>
                  <div class="text-sm text-muted-foreground">Date d'enregistrement</div>
                  <div class="font-medium">{{ formatDate(ong.legal.registrationDate) }}</div>
                </div>
              </div>
              <div v-if="ong.legal.compliance">
                <div class="text-sm text-muted-foreground mb-2">Conformité</div>
                <div v-if="ong.legal.compliance.dataProtection" class="flex items-start gap-2 mb-2">
                  <Icon name="i-heroicons-shield-check" class="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span class="text-sm">{{ ong.legal.compliance.dataProtection }}</span>
                </div>
                <div v-if="ong.legal.compliance.financialTransparency" class="flex items-start gap-2">
                  <Icon name="i-heroicons-shield-check" class="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span class="text-sm">{{ ong.legal.compliance.financialTransparency }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Monitoring et évaluation -->
          <div v-if="ong.monitoring" class="bg-card rounded-xl border border-border p-6">
            <h2 class="text-2xl font-semibold mb-4">Suivi et évaluation</h2>
            <div class="space-y-4">
              <div class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Icon name="i-heroicons-document-chart-bar" class="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <div class="font-semibold mb-1">Rapports</div>
                  <div class="text-sm text-muted-foreground">{{ ong.monitoring.reportsFrequency }}</div>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Icon name="i-heroicons-clipboard-document-check" class="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <div class="font-semibold mb-1">Évaluation</div>
                  <div class="text-sm text-muted-foreground">{{ ong.monitoring.evaluation }}</div>
                </div>
              </div>
              <div class="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                <Icon name="i-heroicons-shield-check" class="w-6 h-6 text-primary flex-shrink-0" />
                <div>
                  <div class="font-semibold mb-1">Audits</div>
                  <div class="text-sm text-muted-foreground">{{ ong.monitoring.audits }}</div>
                </div>
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
const tabs = computed(() => {
  const baseTabs = [
    { label: 'À propos', key: 'about' },
    { label: 'Projets', key: 'projects' }
  ]
  
  // Ajouter les onglets conditionnels selon les données disponibles
  if (props.ong.financials) {
    baseTabs.push({ label: 'Finances', key: 'financials' })
  }
  if (props.ong.impact) {
    baseTabs.push({ label: 'Impact', key: 'impact' })
  }
  if (props.ong.investmentOpportunities && props.ong.investmentOpportunities.length > 0) {
    baseTabs.push({ label: 'Investissement', key: 'investment' })
  }
  if (props.ong.legal || props.ong.monitoring) {
    baseTabs.push({ label: 'Transparence', key: 'transparency' })
  }
  
  baseTabs.push({ label: 'Bénévoles', key: 'volunteers' })
  
  return baseTabs
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

// Formatage
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

const handleInvest = (opportunity: any) => {
  console.log('Investir dans:', opportunity.type, props.ong.name)
  // TODO: Implémenter la logique d'investissement
  // Exemple: navigateTo(`/ongs/${props.ong.id}/invest/${opportunity.type}`)
}
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
