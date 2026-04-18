<template>
  <div v-if="opportunities && opportunities.length > 0" class="space-y-4">
    <div class="bg-primary/10 rounded-xl border border-primary/20 p-6 mb-6">
      <h2 class="text-2xl font-semibold mb-2">Opportunités de don</h2>
      <p class="text-muted-foreground">Soutenez nos projets et contribuez à notre impact social.</p>
    </div>

    <div
      v-for="opportunity in opportunities"
      :key="opportunity.type"
      class="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
    >
      <div class="relative mb-4">
        <UBadge color="green" variant="soft" size="lg" class="absolute top-0 right-0">
          {{ formatCurrency(opportunity.minAmount) }} min
        </UBadge>
        <h3 class="text-xl font-semibold text-center mb-2">{{ opportunity.type }}</h3>
        <p class="text-muted-foreground text-center mb-3">{{ opportunity.description }}</p>
      </div>

      <div class="bg-muted/50 rounded-lg p-4 mb-4">
        <div class="text-sm font-semibold text-muted-foreground mb-1">Avantages</div>
        <div class="text-sm">{{ opportunity.benefits }}</div>
      </div>

      <!-- Sélection du montant de don -->
      <div class="space-y-4">
        <div class="text-sm font-semibold text-muted-foreground">Choisissez votre montant</div>
        <div class="grid grid-cols-4 gap-3">
          <button
            v-for="amount in [opportunity.minAmount, opportunity.minAmount * 1.5, opportunity.minAmount * 2]"
            :key="amount"
            @click="$emit('update:selectedAmount', amount)"
            :class="[
              'px-4 py-3 rounded-lg border-2 font-semibold transition-all',
              selectedAmount === amount
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-muted'
            ]"
          >
            {{ amount }}€
          </button>
          <button
            @click="$emit('update:selectedAmount', 'custom')"
            :class="[
              'px-4 py-3 rounded-lg border-2 font-medium transition-all whitespace-nowrap',
              selectedAmount === 'custom'
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:border-primary/50 hover:bg-muted'
            ]"
          >
            Autre montant
          </button>
        </div>

        <!-- Option don personnalisé -->
        <div class="flex items-center gap-3">
          <input
            v-if="selectedAmount === 'custom'"
            :value="customAmount"
            @input="$emit('update:customAmount', Number(($event.target as HTMLInputElement).value) || null)"
            type="number"
            :min="opportunity.minAmount"
            placeholder="Montant en €"
            class="flex-1 px-4 py-3 rounded-lg border-2 border-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <UButton
          color="primary"
          block
          size="lg"
          @click="$emit('donate', opportunity)"
          :disabled="!selectedAmount || (selectedAmount === 'custom' && (!customAmount || customAmount < opportunity.minAmount))"
        >
          <Icon name="i-heroicons-heart" class="w-5 h-5 mr-2" />
          Faire un don de {{ selectedAmount === 'custom' ? customAmount : selectedAmount }}€
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'

defineProps<{
  opportunities: ONG['donationOpportunities']
  selectedAmount: number | 'custom'
  customAmount: number | null
  formatCurrency: (amount: number) => string
}>()

defineEmits<{
  'update:selectedAmount': [value: number | 'custom']
  'update:customAmount': [value: number | null]
  donate: [opportunity: any]
}>()
</script>
