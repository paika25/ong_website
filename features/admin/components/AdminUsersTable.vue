<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden">
    <!-- Bannière file d'attente -->
    <div
      v-if="pendingCount > 0"
      class="px-5 py-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 flex items-center gap-3"
    >
      <Icon name="i-heroicons-clock" class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
      <p class="text-sm text-amber-800 dark:text-amber-300 flex-1">
        <strong>{{ pendingCount }}</strong> partenaire{{ pendingCount > 1 ? 's' : '' }} en attente de validation manuelle
      </p>
      <UButton
        size="xs"
        :color="pendingOnly ? 'amber' : 'white'"
        :variant="pendingOnly ? 'solid' : 'outline'"
        @click="togglePendingOnly"
      >
        {{ pendingOnly ? 'Voir tous' : 'Voir la file d\'attente' }}
      </UButton>
    </div>

    <!-- Filtres -->
    <div class="px-5 py-4 border-b border-border flex flex-wrap gap-3 items-center">
      <UInput
        v-model="search"
        placeholder="Rechercher par nom, email…"
        class="w-64"
        icon="i-heroicons-magnifying-glass"
        @update:model-value="onSearch"
      />
      <USelect
        v-model="typeFilter"
        :options="TYPE_OPTIONS"
        class="w-44"
        @update:model-value="applyFilters"
      />
      <div class="ml-auto text-sm text-muted-foreground">
        {{ filteredUsers.length }} utilisateur{{ filteredUsers.length > 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Tableau -->
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
          <tr>
            <th class="px-4 py-3 text-left">Utilisateur</th>
            <th class="px-4 py-3 text-left">Rôle</th>
            <th class="px-4 py-3 text-left">Email</th>
            <th class="px-4 py-3 text-left">Organisation</th>
            <th class="px-4 py-3 text-left">Vérifié</th>
            <th class="px-4 py-3 text-left">Inscrit le</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="i in 8" :key="i" class="border-t border-border animate-pulse">
              <td v-for="j in 6" :key="j" class="px-4 py-3">
                <div class="h-4 bg-muted rounded w-3/4" />
              </td>
            </tr>
          </template>

          <tr v-else-if="!filteredUsers.length">
            <td colspan="6" class="px-4 py-14 text-center text-muted-foreground">
              <Icon name="i-heroicons-users" class="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Aucun utilisateur trouvé</p>
            </td>
          </tr>

          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            :class="[
              'border-t border-border hover:bg-muted/30 transition-colors',
              !user.verified && user.accountType === 'user_partner'
                ? 'bg-amber-50/50 dark:bg-amber-950/20'
                : '',
            ]"
          >
            <td class="px-4 py-3">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {{ initials(user) }}
                </div>
                <div>
                  <p class="font-medium">{{ displayName(user) }}</p>
                  <p class="text-xs text-muted-foreground font-mono">{{ user.id.slice(0, 8) }}…</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3">
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', userRoleClass(user.accountType)]">
                {{ userRoleLabel(user.accountType) }}
              </span>
            </td>
            <td class="px-4 py-3 text-muted-foreground text-xs">{{ user.email }}</td>
            <td class="px-4 py-3">
              <template v-if="user.accountType === 'user_partner'">
                <p v-if="user.organizationName" class="text-xs font-medium truncate max-w-[140px]">{{ user.organizationName }}</p>
                <p v-if="user.jobTitle" class="text-xs text-muted-foreground truncate max-w-[140px]">{{ user.jobTitle }}</p>
                <UButton
                  v-if="user.mandateDocPath"
                  size="2xs"
                  color="blue"
                  variant="ghost"
                  icon="i-heroicons-paper-clip"
                  class="mt-0.5"
                  :loading="mandateLoading === user.id"
                  @click="viewMandate(user)"
                >
                  Mandat
                </UButton>
                <span v-else class="text-xs text-muted-foreground/50 italic">sans mandat</span>
              </template>
              <span v-else class="text-xs text-muted-foreground/40">—</span>
            </td>
            <td class="px-4 py-3">
              <div class="flex items-center gap-2">
                <Icon
                  :name="user.verified ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                  :class="user.verified ? 'text-green-500 w-4 h-4' : 'text-muted-foreground/40 w-4 h-4'"
                />
                <UButton
                  v-if="!user.verified"
                  size="2xs"
                  color="green"
                  variant="outline"
                  :loading="actionLoading === user.id"
                  @click="toggleVerify(user)"
                >
                  Valider
                </UButton>
                <UButton
                  v-else
                  size="2xs"
                  color="red"
                  variant="ghost"
                  :loading="actionLoading === user.id"
                  @click="toggleVerify(user)"
                >
                  Invalider
                </UButton>
              </div>
            </td>
            <td class="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
              {{ formatDate(user.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AdminUser, AdminUsersFilter } from '../services/admin.users.service'
import { userDisplayName, userRoleLabel, userRoleClass, verifyAdminUser } from '../services/admin.users.service'

const props = defineProps<{
  users:   AdminUser[]
  loading: boolean
}>()

const emit = defineEmits<{
  filter:  [f: AdminUsersFilter]
  verified:[id: string, verified: boolean]
}>()

const toast         = useToast()
const actionLoading = ref<string | null>(null)
const mandateLoading = ref<string | null>(null)

async function viewMandate(user: AdminUser) {
  mandateLoading.value = user.id
  try {
    const { url } = await $fetch<{ url: string }>(`/api/admin/users/${user.id}/mandate-url`)
    window.open(url, '_blank', 'noopener')
  } catch {
    toast.add({ title: 'Impossible d\'ouvrir le mandat', color: 'red', timeout: 3000 })
  } finally {
    mandateLoading.value = null
  }
}

async function toggleVerify(user: AdminUser) {
  actionLoading.value = user.id
  try {
    await verifyAdminUser(user.id, !user.verified)
    emit('verified', user.id, !user.verified)
    toast.add({
      title: !user.verified ? 'Compte validé' : 'Compte invalidé',
      color: !user.verified ? 'green' : 'amber',
      timeout: 3000,
    })
  } catch (e: any) {
    toast.add({ title: 'Erreur', description: e?.data?.statusMessage ?? e.message, color: 'red', timeout: 4000 })
  } finally {
    actionLoading.value = null
  }
}

const TYPE_OPTIONS = [
  { label: 'Tous les rôles',  value: '' },
  { label: 'Agents ONG',      value: 'user_agent' },
  { label: 'Partenaires',     value: 'user_partner' },
]

const search      = ref('')
const typeFilter  = ref<'' | 'user_agent' | 'user_partner'>('')
const pendingOnly = ref(false)

const pendingCount = computed(() =>
  props.users.filter(u => u.accountType === 'user_partner' && !u.verified).length
)

const filteredUsers = computed(() => {
  if (!pendingOnly.value) return props.users
  return props.users.filter(u => u.accountType === 'user_partner' && !u.verified)
})

function togglePendingOnly() {
  pendingOnly.value = !pendingOnly.value
  if (pendingOnly.value) {
    // Remettre les autres filtres à zéro pour que la file soit lisible
    search.value     = ''
    typeFilter.value = ''
  }
}

function applyFilters() {
  pendingOnly.value = false
  emit('filter', { search: search.value, type: typeFilter.value || undefined })
}

let debounceTimer: ReturnType<typeof setTimeout>
function onSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    pendingOnly.value = false
    emit('filter', { search: search.value, type: typeFilter.value || undefined })
  }, 300)
}

function displayName(u: AdminUser): string { return userDisplayName(u) }

function initials(u: AdminUser): string {
  const name = userDisplayName(u)
  return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
