<template>
  <div class="pt-2">
    <div v-if="ongs.length > 0" class="grid sm:grid-cols-2 gap-4">
      <div
        v-for="ong in ongs"
        :key="ong.id"
        class="group bg-card rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
        @click="emit('ong-click', ong.id)"
      >
        <div class="flex items-start gap-4">
          <!-- Avatar ONG -->
          <div class="w-12 h-12 rounded-xl bg-primary/10 overflow-hidden flex items-center justify-center shrink-0">
            <img v-if="ong.image" :src="ong.image" :alt="ong.name" class="w-full h-full object-cover" />
            <Icon v-else name="i-heroicons-building-office-2" class="w-6 h-6 text-primary" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1">
              <h3 class="font-semibold text-sm group-hover:text-primary transition-colors leading-tight">
                {{ ong.name }}
              </h3>
              <Icon name="i-heroicons-arrow-top-right-on-square" class="w-3.5 h-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
            </div>

            <p v-if="ong.role" class="text-xs text-primary font-medium mb-2">{{ ong.role }}</p>

            <div class="flex items-center gap-3 text-xs text-muted-foreground">
              <span class="flex items-center gap-1">
                <Icon name="i-heroicons-users" class="w-3.5 h-3.5" />
                {{ ong.volunteers }} bénévoles
              </span>
              <span class="flex items-center gap-1">
                <Icon name="i-heroicons-briefcase" class="w-3.5 h-3.5" />
                {{ Array.isArray(ong.projects) ? ong.projects.length : ong.projects }} projets
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <EmptyState
      v-else
      icon="i-heroicons-building-office-2"
      :title="isOwnProfile ? 'Vous n\'êtes membre d\'aucune ONG' : 'Aucune ONG associée'"
      :description="isOwnProfile ? 'Rejoignez ou créez une ONG pour commencer.' : ''"
    >
      <template v-if="isOwnProfile" #action>
        <div class="flex gap-2">
          <UButton size="sm" variant="outline" @click="emit('navigate', '/')">
            Explorer les ONGs
          </UButton>
          <NuxtLink to="/ongs/new">
            <UButton size="sm" icon="i-heroicons-plus">Créer une ONG</UButton>
          </NuxtLink>
        </div>
      </template>
    </EmptyState>
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
