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

      <!-- Body -->
      <div class="p-6 space-y-4">
        <!-- Montant sélectionné -->
        <div v-if="displayAmount" class="bg-primary/10 border border-primary/20 rounded-xl p-4 text-center">
          <p class="text-sm text-muted-foreground mb-1">Montant souhaité</p>
          <p class="text-3xl font-bold text-primary">{{ displayAmount }}€</p>
        </div>

        <!-- Message bientôt disponible -->
        <div class="bg-muted/50 border border-border rounded-xl p-4">
          <div class="flex gap-3">
            <Icon name="i-heroicons-clock" class="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold mb-1">Paiement en ligne bientôt disponible</p>
              <p class="text-sm text-muted-foreground">
                Le système de don en ligne est en cours de développement.
                Pour soutenir cette ONG dès maintenant, contactez-la directement.
              </p>
            </div>
          </div>
        </div>

        <!-- Coordonnées de l'ONG -->
        <div v-if="hasContact" class="space-y-2">
          <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contacter l'ONG</p>
          <a
            v-if="ong.email"
            :href="`mailto:${ong.email}`"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
          >
            <Icon name="i-heroicons-envelope" class="w-4 h-4 text-primary" />
            <span class="text-sm group-hover:text-primary transition-colors">{{ ong.email }}</span>
          </a>
          <a
            v-if="ong.phone"
            :href="`tel:${ong.phone}`"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
          >
            <Icon name="i-heroicons-phone" class="w-4 h-4 text-primary" />
            <span class="text-sm group-hover:text-primary transition-colors">{{ ong.phone }}</span>
          </a>
          <a
            v-if="ong.website"
            :href="ong.website"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 transition-all group"
          >
            <Icon name="i-heroicons-globe-alt" class="w-4 h-4 text-primary" />
            <span class="text-sm group-hover:text-primary transition-colors truncate">{{ ong.website }}</span>
            <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3 h-3 text-muted-foreground ml-auto shrink-0" />
          </a>
        </div>

        <div v-else class="text-sm text-muted-foreground text-center py-2">
          Aucune coordonnée disponible pour cette ONG.
        </div>
      </div>

      <!-- Footer -->
      <div class="px-6 pb-6">
        <UButton block variant="outline" @click="$emit('close')">
          Fermer
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'

const props = defineProps<{
  ong: ONG
  amount?: number | 'custom' | null
  customAmount?: number | null
}>()

defineEmits<{ close: [] }>()

const displayAmount = computed(() => {
  if (props.amount === 'custom') return props.customAmount ?? null
  return props.amount ?? null
})

const hasContact = computed(() => !!(props.ong.email || props.ong.phone || props.ong.website))
</script>
