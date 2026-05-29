<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold">Utilisateurs</h1>
      <p class="text-sm text-muted-foreground mt-0.5">Comptes agents ONG et partenaires donateurs</p>
    </div>

    <AdminUsersTable
      :users="users"
      :loading="loading"
      @filter="onFilter"
      @verified="onVerified"
    />
  </div>
</template>

<script setup lang="ts">
import AdminUsersTable from '~/features/admin/components/AdminUsersTable.vue'
import { getAdminUsers } from '~/features/admin/services/admin.users.service'
import type { AdminUser, AdminUsersFilter } from '~/features/admin/services/admin.users.service'

definePageMeta({ layout: 'admin', middleware: ['auth', 'back-office'] })

const users   = ref<AdminUser[]>([])
const loading = ref(true)

async function load(filter: AdminUsersFilter = {}) {
  loading.value = true
  try {
    users.value = await getAdminUsers(filter)
  } catch (e: any) {
    useToast().add({ title: 'Erreur', description: e?.data?.statusMessage ?? e.message, color: 'red' })
  } finally {
    loading.value = false
  }
}

function onFilter(filter: AdminUsersFilter) {
  load(filter)
}

function onVerified(id: string, verified: boolean) {
  users.value = users.value.map(u => u.id === id ? { ...u, verified } : u)
}

onMounted(() => load())
</script>
