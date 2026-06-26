<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden">
    <!-- Bannière file d'attente -->
    <UAlert
      v-if="pendingCount > 0"
      color="amber"
      variant="soft"
      icon="i-heroicons-clock"
      :title="`${pendingCount} partenaire${pendingCount > 1 ? 's' : ''} en attente de validation manuelle`"
      :ui="{ rounded: 'rounded-none' }"
      class="border-b border-border"
    >
      <template #actions>
        <UButton
          size="xs"
          :color="pendingOnly ? 'amber' : 'white'"
          :variant="pendingOnly ? 'solid' : 'outline'"
          @click="togglePendingOnly"
        >
          {{ pendingOnly ? 'Voir tous' : 'Voir la file d\'attente' }}
        </UButton>
      </template>
    </UAlert>

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
    <UTable :rows="tableRows" :columns="columns" :loading="loading">
      <template #empty-state>
        <EmptyState icon="i-heroicons-users" title="Aucun utilisateur trouvé" />
      </template>
      <template #user-data="{ row }">
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold shrink-0">
            {{ initials(row) }}
          </div>
          <div>
            <p class="font-medium">{{ displayName(row) }}</p>
            <p class="text-xs text-muted-foreground font-mono">{{ row.id.slice(0, 8) }}…</p>
          </div>
        </div>
      </template>
      <template #accountType-data="{ row }">
        <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', userRoleClass(row.accountType)]">
          {{ userRoleLabel(row.accountType) }}
        </span>
      </template>
      <template #email-data="{ row }">
        <span class="text-muted-foreground text-xs">{{ row.email }}</span>
      </template>
      <template #organization-data="{ row }">
        <template v-if="row.accountType === 'user_partner'">
          <p v-if="row.organizationName" class="text-xs font-medium truncate max-w-[140px]">{{ row.organizationName }}</p>
          <p v-if="row.jobTitle" class="text-xs text-muted-foreground truncate max-w-[140px]">{{ row.jobTitle }}</p>
          <UButton
            v-if="row.mandateDocPath"
            size="2xs"
            color="blue"
            variant="ghost"
            icon="i-heroicons-paper-clip"
            class="mt-0.5"
            :loading="mandateLoading === row.id"
            @click="viewMandate(row)"
          >
            Mandat
          </UButton>
          <span v-else class="text-xs text-muted-foreground/50 italic">sans mandat</span>
        </template>
        <span v-else class="text-xs text-muted-foreground/40">—</span>
      </template>
      <template #verified-data="{ row }">
        <div class="flex items-center gap-2">
          <Icon
            :name="row.verified ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
            :class="row.verified ? 'text-green-500 w-4 h-4' : 'text-muted-foreground/40 w-4 h-4'"
          />
          <UButton
            v-if="!row.verified"
            size="2xs"
            color="green"
            variant="outline"
            :loading="actionLoading === row.id"
            @click="toggleVerify(row)"
          >
            Valider
          </UButton>
          <UButton
            v-else
            size="2xs"
            color="red"
            variant="ghost"
            :loading="actionLoading === row.id"
            @click="toggleVerify(row)"
          >
            Invalider
          </UButton>
        </div>
      </template>
      <template #createdAt-data="{ row }">
        <span class="text-muted-foreground text-xs whitespace-nowrap">{{ formatDate(row.createdAt) }}</span>
      </template>
    </UTable>
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

const columns = [
  { key: 'user', label: 'Utilisateur' },
  { key: 'accountType', label: 'Rôle' },
  { key: 'email', label: 'Email' },
  { key: 'organization', label: 'Organisation' },
  { key: 'verified', label: 'Vérifié' },
  { key: 'createdAt', label: 'Inscrit le' },
]

const tableRows = computed(() => filteredUsers.value.map(u => ({
  ...u,
  class: !u.verified && u.accountType === 'user_partner' ? 'bg-amber-50/50 dark:bg-amber-950/20' : undefined,
})))

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
