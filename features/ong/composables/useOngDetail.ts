import { ref, computed, onMounted } from 'vue'
import type { ONG, OngDocument } from '../type'
import { getOngDocuments } from '../services'

export function useOngDetail(ong: () => ONG) {
  // État
  const activeTab = ref(0)
  const documents = ref<OngDocument[]>([])

  // Charger les documents
  const loadDocuments = async () => {
    documents.value = await getOngDocuments(ong().id)
  }

  onMounted(loadDocuments)

  // Onglets dynamiques — filtrés selon sectionVisibility
  const tabs = computed(() => {
    const o = ong()
    const vis = o.sectionVisibility

    const baseTabs: Array<{ label: string; key: string }> = []

    // À propos = identite + mission
    if (!vis || vis.identite !== false || vis.mission !== false) {
      baseTabs.push({ label: 'À propos', key: 'about' })
    }

    if (!vis || vis.projets !== false) {
      baseTabs.push({ label: 'Projets', key: 'projects' })
    }

    if (o.financials) {
      baseTabs.push({ label: 'Finances', key: 'financials' })
    }
    if (o.impact) {
      baseTabs.push({ label: 'Impact', key: 'impact' })
    }
    baseTabs.push({ label: 'Dons', key: 'donation' })
    if (o.legal || o.monitoring) {
      baseTabs.push({ label: 'Administratif', key: 'transparency' })
    }
    if (documents.value.length > 0 && (!vis || vis.documents !== false)) {
      baseTabs.push({ label: 'Documents', key: 'documents' })
    }

    return baseTabs
  })

  // ── Labels ──

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Actif',
      pending: 'En attente',
      inactive: 'Inactif'
    }
    return labels[status] || status
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      education: 'Éducation',
      health: 'Santé',
      environment: 'Environnement',
      social: 'Social',
      culture: 'Culture'
    }
    return labels[category] || category
  }

  const getProjectStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: 'blue',
      ongoing: 'yellow',
      completed: 'green',
      canceled: 'red'
    }
    return colors[status] || 'gray'
  }

  const getProjectStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      planned: 'Planifié',
      ongoing: 'En cours',
      completed: 'Terminé',
      canceled: 'Annulé'
    }
    return labels[status] || status
  }

  const getCategoryDocLabel = (category: string) => {
    const labels: Record<string, string> = {
      legal: '📜 Statuts',
      activity: '📊 Rapport d\'activité'
    }
    return labels[category] || category
  }

  // ── Stats helpers ──

  const getProjectCount = (o: ONG) => {
    const p: any = (o as any).projects
    return Array.isArray(p) ? p.length : Number(p) || 0
  }

  const getProjectsArray = (o: ONG) => {
    const p: any = (o as any).projects
    return Array.isArray(p) ? p : []
  }

  const getActiveProjectsCount = (o: ONG) => {
    return getProjectsArray(o).filter((p: any) => p.status === 'ongoing').length
  }

  const getYearsSinceCreation = (o: ONG) => {
    const created = new Date(o.createdAt)
    const now = new Date()
    return now.getFullYear() - created.getFullYear()
  }

  // ── Formatage ──

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString))
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

  // ── Actions ──

  const handleJoin = () => {
    console.log('Rejoindre ONG:', ong().name)
    // TODO: Implémenter la logique d'adhésion
  }

  const handleShare = () => {
    const o = ong()
    if (navigator.share) {
      navigator.share({
        title: o.name,
        text: o.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const handleDonate = () => {
    const idx = tabs.value.findIndex(t => t.key === 'donation')
    if (idx !== -1) activeTab.value = idx
  }

  return {
    // État
    activeTab,
    documents,
    tabs,
    // Labels
    getStatusLabel,
    getCategoryLabel,
    getProjectStatusColor,
    getProjectStatusLabel,
    getCategoryDocLabel,
    // Stats
    getProjectCount,
    getProjectsArray,
    getActiveProjectsCount,
    getYearsSinceCreation,
    // Formatage
    formatDate,
    formatCurrency,
    formatNumber,
    // Actions
    handleJoin,
    handleShare,
    handleDonate,
  }
}
