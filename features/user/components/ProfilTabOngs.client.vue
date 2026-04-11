<template>
  <div class="space-y-4">
    <div v-if="ongs.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="ong in ongs"
        :key="ong.id"
        class="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow cursor-pointer"
        @click="emit('ong-click', ong.id)"
      >
        <div class="flex items-start gap-3">
          <UAvatar :src="ong.image" :alt="ong.name" size="sm" />
          <div class="flex-1 min-w-0">
            <h3 class="font-medium truncate">{{ ong.name }}</h3>
            <p class="text-sm text-muted-foreground">{{ ong.role }}</p>
            <div class="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <span>{{ ong.volunteers }} bénévoles</span>
              <span>•</span>
              <span>{{ Array.isArray(ong.projects) ? ong.projects.length : ong.projects }} projets</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8 text-muted-foreground">
      <Icon name="i-heroicons-building-office" class="w-12 h-12 mx-auto mb-3 opacity-50" />
      <p>{{ isOwnProfile ? "Vous n'êtes membre d'aucune ONG" : 'Aucune ONG associée' }}</p>
      <UButton v-if="isOwnProfile" variant="outline" size="sm" class="mt-4" @click="emit('navigate', '/')">
        Explorer les ONGs
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  ongs: any[]
  isOwnProfile: boolean
}>()

const emit = defineEmits<{
  'ong-click': [id: string]
  navigate: [path: string]
}>()
</script>
