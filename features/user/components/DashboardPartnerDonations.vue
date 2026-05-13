<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">Mes Dons</h2>
        <p class="text-sm text-muted-foreground">Historique de vos contributions</p>
      </div>
      <div class="flex gap-8">
        <div class="text-right">
          <p class="text-sm text-muted-foreground">Nombre de dons</p>
          <p class="text-2xl font-bold">{{ donations?.length || 0 }}</p>
        </div>
        <div class="text-right">
          <p class="text-sm text-muted-foreground">Total des dons</p>
          <p class="text-2xl font-bold text-primary">{{ total || 0 }} €</p>
        </div>
      </div>
    </div>

    <!-- Liste des dons -->
    <div v-if="donations.length > 0" class="bg-card border border-border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-muted">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                ONG
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Montant
              </th>
              <th class="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Statut
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border">
            <tr 
              v-for="donation in donations" 
              :key="donation.id"
              class="hover:bg-muted/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                {{ formatDate(donation.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="text-sm font-medium">{{ donation.ongName }}</div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-muted-foreground">
                {{ donation.type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold">
                {{ donation.amount }} €
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span 
                  :class="[
                    'px-2 py-1 rounded-full text-xs font-medium',
                    donation.status === 'completed' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  ]"
                >
                  {{ donation.status === 'completed' ? 'Complété' : 'En cours' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- État vide -->
    <div v-else class="bg-card border border-border rounded-xl p-12 text-center">
      <div class="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      <h3 class="text-base font-semibold mb-2">Aucun don pour le moment</h3>
      <p class="text-sm text-muted-foreground mb-6">Soutenez une ONG en faisant votre premier don</p>
      <NuxtLink to="/">
        <UButton variant="default">
          Découvrir les ONGs
        </UButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserDonation } from '~/features/user/services/user.donations'

defineProps<{
  donations: UserDonation[]
  total: number
}>()

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
