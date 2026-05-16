<template>
  <div class="bg-card border border-border rounded-xl overflow-hidden">
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
        @update:model-value="emit('filter', { search, type: typeFilter })"
      />
      <div class="ml-auto text-sm text-muted-foreground">
        {{ users.length }} utilisateur{{ users.length > 1 ? 's' : '' }}
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
            <th class="px-4 py-3 text-left">Vérifié</th>
            <th class="px-4 py-3 text-left">Inscrit le</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="loading">
            <tr v-for="i in 8" :key="i" class="border-t border-border animate-pulse">
              <td v-for="j in 5" :key="j" class="px-4 py-3">
                <div class="h-4 bg-muted rounded w-3/4" />
              </td>
            </tr>
          </template>

          <tr v-else-if="!users.length">
            <td colspan="5" class="px-4 py-14 text-center text-muted-foreground">
              <Icon name="i-heroicons-users" class="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Aucun utilisateur trouvé</p>
            </td>
          </tr>

          <tr
            v-for="user in users"
            :key="user.id"
            class="border-t border-border hover:bg-muted/30 transition-colors"
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
              <Icon
                :name="user.verified ? 'i-heroicons-check-circle' : 'i-heroicons-x-circle'"
                :class="user.verified ? 'text-green-500 w-4 h-4' : 'text-muted-foreground/40 w-4 h-4'"
              />
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
import { userDisplayName, userRoleLabel, userRoleClass } from '../services/admin.users.service'

const props = defineProps<{
  users:   AdminUser[]
  loading: boolean
}>()

const emit = defineEmits<{
  filter: [f: AdminUsersFilter]
}>()

const TYPE_OPTIONS = [
  { label: 'Tous les rôles',  value: '' },
  { label: 'Agents ONG',      value: 'user_agent' },
  { label: 'Partenaires',     value: 'user_partner' },
]

const search     = ref('')
const typeFilter = ref<'' | 'user_agent' | 'user_partner'>('')

let debounceTimer: ReturnType<typeof setTimeout>
function onSearch() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
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
