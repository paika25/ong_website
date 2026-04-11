import { ref, computed } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { useUserDonationsService, type UserDonation, type DonationStatus, type DonationType } from '../services/user.donations'
import { useUserOngsService, type UserOng } from '../services/user.ongs'
import { useUserProjectsService, type UserProject } from '../services/user.projects'

export interface DashboardStats {
  // Commun
  totalOngs: number
  totalProjects: number
  // Partenaire
  totalDonations: number
  totalDonated: number
  averageDonation: number
  donationsByStatus: Record<DonationStatus, number>
  donationsByType: Record<DonationType, number>
  uniqueOngsSupported: number
  lastDonationDate: string | null
}

export function useStats() {
  const authStore = useAuthStore()
  const { fetchUserDonations } = useUserDonationsService()
  const { fetchUserOngs } = useUserOngsService()
  const { fetchUserProjects } = useUserProjectsService()

  const donations = ref<UserDonation[]>([])
  const ongs = ref<UserOng[]>([])
  const projects = ref<UserProject[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const stats = computed<DashboardStats>(() => {
    const completedDonations = donations.value.filter(d => d.status === 'completed')
    const totalDonated = completedDonations.reduce((sum, d) => sum + d.amount, 0)

    const donationsByStatus = donations.value.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1
      return acc
    }, {} as Record<DonationStatus, number>)

    const donationsByType = donations.value.reduce((acc, d) => {
      acc[d.type] = (acc[d.type] || 0) + 1
      return acc
    }, {} as Record<DonationType, number>)

    const uniqueOngIds = new Set(donations.value.map(d => d.ongId))

    const sorted = [...donations.value].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return {
      totalOngs: ongs.value.length,
      totalProjects: projects.value.length,
      totalDonations: donations.value.length,
      totalDonated,
      averageDonation: completedDonations.length > 0 ? totalDonated / completedDonations.length : 0,
      donationsByStatus,
      donationsByType,
      uniqueOngsSupported: uniqueOngIds.size,
      lastDonationDate: sorted.length > 0 ? sorted[0].createdAt : null
    }
  })

  const load = async () => {
    const user = authStore.currentUser
    if (!user) return

    isLoading.value = true
    error.value = null

    try {
      const [donationsData, ongsData, projectsData] = await Promise.all([
        fetchUserDonations(user.id),
        fetchUserOngs(user.id),
        fetchUserProjects(user.id)
      ])

      donations.value = donationsData
      ongs.value = ongsData
      projects.value = projectsData
    } catch (err: any) {
      console.error('Erreur chargement stats:', err)
      error.value = err?.message || 'Erreur lors du chargement des statistiques'
    } finally {
      isLoading.value = false
    }
  }

  return {
    donations,
    ongs,
    projects,
    stats,
    isLoading,
    error,
    load
  }
}
