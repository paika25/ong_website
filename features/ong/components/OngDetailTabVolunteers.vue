<template>
  <div class="bg-card rounded-xl border border-border p-12 text-center">
    <Icon name="i-heroicons-users" class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
    <h3 class="text-lg font-semibold mb-2">{{ volunteers }} bénévoles</h3>
    <p class="text-muted-foreground mb-6">
      Rejoignez une communauté engagée de bénévoles passionnés.
    </p>
    <UButton
      color="primary"
      size="lg"
      :disabled="!isActive"
      @click="$emit('join')"
    >
      <Icon name="i-heroicons-user-plus" class="w-5 h-5 mr-2" />
      Devenir bénévole
    </UButton>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  volunteers: number
  isActive: boolean
}>()

defineEmits<{
  join: []
}>()
</script>
