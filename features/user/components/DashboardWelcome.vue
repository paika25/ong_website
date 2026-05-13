<template>
  <div class="mb-6">
    <h1 class="text-2xl font-bold tracking-tight">Bonjour, {{ displayName }} 👋</h1>
    <p class="text-sm text-muted-foreground mt-1">{{ roleLabel }}</p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  firstName: string
  accountType?: string
}>()

const displayName = computed(() => props.firstName?.split(' ')[0] || props.firstName || '')

const roleLabel = computed(() => {
  if (props.accountType === 'user_agent') return 'Gérez votre dossier ONG et vos échanges avec le back-office.'
  if (props.accountType === 'user_partner') return 'Suivez vos dons et découvrez nos ONGs partenaires.'
  return 'Votre tableau de bord personnel.'
})
</script>
