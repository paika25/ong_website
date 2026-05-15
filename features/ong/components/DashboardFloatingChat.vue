<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <!-- Panel messages -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out origin-bottom-right"
        enter-from-class="opacity-0 scale-90 translate-y-2"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in origin-bottom-right"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-90 translate-y-2"
      >
        <div
          v-if="isOpen"
          class="w-80 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col"
          style="height: 420px"
        >
          <!-- Header du panel -->
          <div class="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40 shrink-0">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4 text-primary" />
              <span class="text-sm font-semibold">Back-office</span>
              <span
                v-if="unreadCount > 0"
                class="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold"
              >
                {{ unreadCount }}
              </span>
            </div>
            <button
              class="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Fermer"
              @click="isOpen = false"
            >
              <Icon name="i-heroicons-x-mark" class="w-4 h-4" />
            </button>
          </div>

          <DossierMessagerie
            :ong-id="ongId"
            viewer-role="agent"
            api-base="/api/ongs"
            :hide-header="true"
            class="flex-1 min-h-0"
            @unread-count="unreadCount = $event"
          />
        </div>
      </Transition>

      <!-- Bouton toggle -->
      <button
        class="relative w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95"
        :aria-label="isOpen ? 'Fermer les messages' : 'Ouvrir les messages'"
        @click="isOpen = !isOpen"
      >
        <Icon
          :name="isOpen ? 'i-heroicons-x-mark' : 'i-heroicons-chat-bubble-left-right'"
          class="w-5 h-5"
        />
        <span
          v-if="unreadCount > 0 && !isOpen"
          class="absolute -top-1 -right-1 min-w-[1.2rem] h-[1.2rem] px-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-card"
        >
          {{ unreadCount }}
        </span>
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import DossierMessagerie from '~/features/verification/components/DossierMessagerie.vue'

defineProps<{ ongId: string }>()

const isOpen = ref(false)
const unreadCount = ref(0)

function openChat() { isOpen.value = true }

onMounted(() => window.addEventListener('open-floating-chat', openChat))
onUnmounted(() => window.removeEventListener('open-floating-chat', openChat))
</script>
