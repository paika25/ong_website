<template>
  <div class="space-y-6">
    <!-- Confirmation de paiement réussi -->
    <div
      v-if="donationStatus === 'success'"
      class="bg-green-500/10 border border-green-500/30 rounded-xl p-5 flex items-start gap-3"
      role="alert"
    >
      <Icon name="i-heroicons-check-circle" class="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
      <div>
        <p class="font-semibold text-green-600 dark:text-green-400">Don reçu — merci !</p>
        <p class="text-sm text-muted-foreground mt-0.5">Votre générosité contribue directement aux projets de cette ONG.</p>
      </div>
    </div>

    <!-- Don annulé -->
    <div
      v-else-if="donationStatus === 'cancelled'"
      class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 flex items-start gap-3"
      role="alert"
    >
      <Icon name="i-heroicons-x-circle" class="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
      <div>
        <p class="font-semibold text-yellow-600 dark:text-yellow-400">Paiement annulé</p>
        <p class="text-sm text-muted-foreground mt-0.5">Votre don n'a pas été finalisé. Vous pouvez réessayer ci-dessous.</p>
      </div>
    </div>

    <!-- Formulaire de don -->
    <div class="bg-card rounded-xl border border-border p-6">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Icon name="i-heroicons-heart" class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-semibold">Faire un don</h2>
          <p class="text-sm text-muted-foreground">Paiement sécurisé par Stripe</p>
        </div>
      </div>

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
</template>

<script setup lang="ts">
import { createCheckout, confirmSession } from '~/features/donations/services/donation.service'

const PRESET_AMOUNTS = [5, 10, 25, 50, 100] as const

const props = defineProps<{
  ongId: string
  ongName: string
  donationStatus?: 'success' | 'cancelled' | null
}>()

const route = useRoute()
const selectedAmount = ref<number | 'custom'>(25)
const customAmount = ref<number | null>(null)
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
    const { url } = await createCheckout(props.ongId, props.ongName, amount)
    window.location.href = url
  } catch (err: any) {
    error.value = err?.data?.statusMessage ?? 'Une erreur est survenue. Réessayez.'
    isLoading.value = false
  }
}

onMounted(async () => {
  if (props.donationStatus !== 'success') return
  const sessionId = route.query.session_id as string | undefined
  if (!sessionId) return
  try {
    await confirmSession(sessionId)
  } catch (err) {
    console.error('[confirm-session]', err)
  }
})
</script>
