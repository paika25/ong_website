import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { useUserService } from '../services/userService'
import { useUserOngsService } from '../services/user.ongs'
import { useUserProjectsService } from '../services/user.projects'
import { useUserActivityService } from '../services/user.activity'
import type { ProfileUser } from '../types/profile.types'
import type { UserOng } from '../services/user.ongs'
import type { UserProject } from '../services/user.projects'
import type { UserActivity } from '../services/user.activity'

export function useProfile() {
  const authStore = useAuthStore()
  const { updateUser, updateAvatar, updateCover, getUserStats } = useUserService()
  const { fetchUserOngs } = useUserOngsService()
  const { fetchUserProjects } = useUserProjectsService()
  const { fetchUserActivity } = useUserActivityService()

  const profile = ref<ProfileUser | null>(null)
  const ongs = ref<UserOng[]>([])
  const projects = ref<UserProject[]>([])
  const activities = ref<UserActivity[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  const isOwnProfile = computed(() => true)

  const formInitialData = computed(() => ({
    firstName: profile.value?.firstName || '',
    lastName: profile.value?.lastName || '',
    bio: profile.value?.bio || '',
    location: profile.value?.location || '',
    website: profile.value?.website || '',
    skills: [...(profile.value?.skills || [])]
  }))

  async function load() {
    isLoading.value = true
    error.value = null

    try {
      const current = authStore.currentUser
      if (!current) {
        error.value = 'Vous devez être connecté pour voir votre profil'
        isLoading.value = false
        return
      }

      const stats = await getUserStats(current.id, current.accountType)

      profile.value = {
        id: current.id,
        email: current.email,
        accountType: current.accountType as 'user_partner' | 'user_agent',
        firstName: current.firstName || '',
        lastName: current.lastName || '',
        fullName: current.fullName || current.email,
        companyName: current.companyName ?? undefined,
        avatar: current.avatar ?? undefined,
        cover: (current as any).cover ?? undefined,
        bio: current.bio ?? undefined,
        location: current.location ?? undefined,
        website: current.website ?? undefined,
        verified: current.verified || false,
        createdAt: current.createdAt || new Date().toISOString(),
        updatedAt: current.updatedAt || new Date().toISOString(),
        skills: [],
        stats: {
          ongs: stats.ongs || 0,
          projects: stats.projects || 0,
          donations: stats.donations || 0,
          totalDonated: stats.totalDonated || 0
        }
      }

      await Promise.all([
        fetchUserOngs(current.id).then(data => { ongs.value = data }),
        fetchUserProjects(current.id).then(data => { projects.value = data }),
        fetchUserActivity(
          current.id,
          profile.value.firstName,
          profile.value.avatar || '',
          profile.value.createdAt
        ).then(data => { activities.value = data })
      ])
    } catch (err: any) {
      console.error('Erreur chargement profil:', err)
      error.value = err.message || 'Erreur lors du chargement du profil'
    } finally {
      isLoading.value = false
    }
  }

  async function save(payload: { firstName: string; lastName: string; bio: string; location: string; website: string }) {
    if (!profile.value) return
    error.value = null

    try {
      const updated = await updateUser(payload)
      profile.value = {
        ...profile.value,
        firstName: updated.firstName,
        lastName: updated.lastName,
        fullName: updated.fullName,
        bio: updated.bio,
        location: updated.location,
        website: updated.website,
        updatedAt: updated.updatedAt
      }
      authStore.updateUserData({
        firstName: updated.firstName,
        lastName: updated.lastName,
        fullName: updated.fullName,
        bio: updated.bio,
        location: updated.location,
        website: updated.website
      })
    } catch (err: any) {
      console.error('Erreur sauvegarde:', err)
      error.value = err.message || 'Erreur lors de la sauvegarde'
      throw err
    }
  }

  async function changeAvatar(file: File) {
    if (!profile.value) return
    const previewUrl = URL.createObjectURL(file)
    const previous = profile.value.avatar
    profile.value.avatar = previewUrl

    try {
      const url = await updateAvatar(file)
      URL.revokeObjectURL(previewUrl)
      profile.value.avatar = url
      authStore.updateUserData({ avatar: url })
    } catch (err: any) {
      URL.revokeObjectURL(previewUrl)
      profile.value.avatar = previous
      error.value = err.message || "Erreur lors de l'upload de l'avatar"
    }
  }

  async function changeCover(file: File) {
    if (!profile.value) return
    const previewUrl = URL.createObjectURL(file)
    const previous = profile.value.cover
    profile.value.cover = previewUrl

    try {
      const url = await updateCover(file)
      URL.revokeObjectURL(previewUrl)
      profile.value.cover = url
      authStore.updateUserData({ cover: url } as any)
    } catch (err: any) {
      URL.revokeObjectURL(previewUrl)
      profile.value.cover = previous
      error.value = err.message || "Erreur lors de l'upload de la couverture"
    }
  }

  return {
    profile,
    ongs,
    projects,
    activities,
    isLoading,
    error,
    isOwnProfile,
    formInitialData,
    load,
    save,
    changeAvatar,
    changeCover
  }
}
