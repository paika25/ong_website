<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="$emit('close')"
    >
      <div class="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl">
        <div class="p-6 text-center">
          <!-- Icône -->
          <div
            :class="[
              'w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4',
              type === 'success' ? 'bg-green-100 dark:bg-green-900/40' : 'bg-red-100 dark:bg-red-900/40'
            ]"
          >
            <Icon
              :name="type === 'success' ? 'i-heroicons-check-circle' : 'i-heroicons-exclamation-circle'"
              :class="['w-7 h-7', type === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400']"
            />
          </div>

          <!-- Titre -->
          <h3 class="text-lg font-bold mb-2">
            {{ type === 'success' ? 'Succès' : 'Erreur' }}
          </h3>

          <!-- Message -->
          <p class="text-sm text-muted-foreground mb-6">{{ message }}</p>

          <!-- Bouton -->
          <UButton
            :color="type === 'success' ? 'green' : 'red'"
            block
            @click="$emit('close')"
          >
            {{ type === 'success' ? 'Continuer' : 'Fermer' }}
          </UButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  type: 'success' | 'error'
  message: string
}>()

defineEmits<{ close: [] }>()
</script>
