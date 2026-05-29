import { ref, computed, onMounted } from 'vue'
import type { ONG, OngDocument } from '../type'
import { getOngDocuments } from '../services'
import { useAuthStore } from '~/features/auth/stores/auth.client'

export function useOngDetail(ong: () => ONG) {
  const authStore = useAuthStore()
  // Finances visibles : partenaire validé, agent ONG, ou back-office
  const canSeeFinancials = computed(() =>
    (authStore.isPartner && authStore.isVerified) || authStore.isAgent
  )
  // État
  const activeTab = ref(0)
  const documents = ref<OngDocument[]>([])
  const showDonationModal = ref(false)
  const showVolunteerModal = ref(false)
  const shareCopied = ref(false)

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

    if (o.financials && canSeeFinancials.value) {
      baseTabs.push({ label: 'Finances', key: 'financials' })
    }
    if (o.impact) {
      baseTabs.push({ label: 'Impact', key: 'impact' })
    }
    if (o.status === 'verified' || o.status === 'active') {
      baseTabs.push({ label: 'Dons', key: 'donation' })
    }
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
    showVolunteerModal.value = true
  }

  const handleShare = async () => {
    const o = ong()
    if (navigator.share) {
      await navigator.share({ title: o.name, text: o.description, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      shareCopied.value = true
      setTimeout(() => { shareCopied.value = false }, 2000)
    }
  }

  const handleDonate = (_opportunity?: any) => {
    const o = ong()
    if (o.status !== 'verified' && o.status !== 'active') return
    showDonationModal.value = true
  }

  return {
    // État
    activeTab,
    documents,
    tabs,
    showDonationModal,
    showVolunteerModal,
    shareCopied,
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
