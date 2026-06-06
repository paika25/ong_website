<template>
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
      <!-- Header -->
      <div class="relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-primary/20 to-accent/10 p-6 pb-4">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <button
          class="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          @click="$emit('close')"
        >
          <Icon name="i-heroicons-x-mark" class="w-5 h-5" />
        </button>

        <div class="relative flex items-center gap-3 mb-1">
          <div class="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
            <Icon name="i-heroicons-heart" class="w-5 h-5 text-primary" />
          </div>
          <div>
            <p class="text-xs text-muted-foreground font-medium uppercase tracking-wide">Faire un don</p>
            <h2 class="text-lg font-bold leading-tight">{{ ong.name }}</h2>
          </div>
        </div>
      </div>

      <!-- Body : formulaire Stripe -->
      <div class="p-6">
        <div class="space-y-5">
          <!-- Sélection du montant -->
          <div>
            <p class="text-sm font-medium text-muted-foreground mb-3">Choisissez votre montant</p>
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
              <button
                v-for="amount in PRESET_AMOUNTS"
                :key="amount"
                type="button"
                @click="selectAmount(amount)"
                :class="[
                  'py-2.5 rounded-lg border-2 font-semibold text-sm transition-all',
                  selectedAmount === amount
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/40 hover:bg-muted'
                ]"
              >
                {{ amount }}€
              </button>
              <button
                type="button"
                @click="selectAmount('custom')"
                :class="[
                  'py-2.5 rounded-lg border-2 font-medium text-sm transition-all',
                  selectedAmount === 'custom'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/40 hover:bg-muted'
                ]"
              >
                Autre
              </button>
            </div>
          </div>

          <!-- Montant personnalisé -->
          <div v-if="selectedAmount === 'custom'" class="relative">
            <input
              v-model.number="customAmount"
              type="number"
              min="1"
              max="10000"
              placeholder="Montant"
              class="w-full px-4 py-3 pr-10 rounded-lg border-2 border-primary bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">€</span>
          </div>

          <!-- Erreur -->
          <div
            v-if="error"
            class="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-sm text-destructive flex items-center gap-2"
          >
            <Icon name="i-heroicons-exclamation-circle" class="w-4 h-4 flex-shrink-0" />
            {{ error }}
          </div>

          <!-- Bouton de paiement -->
          <UButton
            color="primary"
            block
            size="lg"
            :loading="isLoading"
            :disabled="!finalAmount || finalAmount < 1"
            @click="checkout"
          >
            <Icon v-if="!isLoading" name="i-heroicons-lock-closed" class="w-4 h-4 mr-2" />
            {{ isLoading ? 'Redirection...' : `Payer ${finalAmount ? finalAmount + ' €' : ''}` }}
          </UButton>

          <!-- Badge Stripe -->
          <p class="text-xs text-muted-foreground text-center flex items-center justify-center gap-1.5">
            <Icon name="i-heroicons-shield-check" class="w-3.5 h-3.5" />
            Paiement 100 % sécurisé · Carte bancaire via Stripe
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'
import { createCheckout } from '~/features/donations/services/donation.service'

const PRESET_AMOUNTS = [5, 10, 25, 50, 100] as const

const props = defineProps<{
  ong: ONG
  amount?: number | 'custom' | null
  customAmount?: number | null
}>()

defineEmits<{ close: [] }>()

const selectedAmount = ref<number | 'custom'>(
  typeof props.amount === 'number' ? props.amount : 25
)
const customAmount = ref<number | null>(props.customAmount ?? null)
const isLoading = ref(false)
const error = ref<string | null>(null)

const finalAmount = computed<number | null>(() => {
  if (selectedAmount.value === 'custom') return customAmount.value ?? null
  return selectedAmount.value
})

function selectAmount(amount: number | 'custom') {
  selectedAmount.value = amount
  error.value = null
}

async function checkout() {
  const amount = finalAmount.value
  if (!amount || amount < 1) return
  isLoading.value = true
  error.value = null
  try {
    const { url } = await createCheckout(props.ong.id, props.ong.name, amount)
    window.location.href = url
  } catch (err: any) {
    error.value = err?.data?.statusMessage ?? 'Une erreur est survenue. Réessayez.'
    isLoading.value = false
  }
}
</script>
