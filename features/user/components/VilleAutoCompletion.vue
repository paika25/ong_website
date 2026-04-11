<template>
  <div class="relative" ref="containerRef">
    <UInput
      :model-value="modelValue"
      @update:model-value="onInput"
      placeholder="Ville, Pays"
      icon="i-heroicons-map-pin"
      :loading="isLoading"
      autocomplete="off"
      @focus="open = true"
    />

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <ul
        v-if="open && suggestions.length > 0"
        class="absolute border-1 border-white z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto"
      >
        <li
          v-for="(suggestion, index) in suggestions"
          :key="`${suggestion.lat}-${suggestion.lon}`"
        >
          <button
            type="button"
            class="w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center gap-3"
            :class="index === activeIndex ? 'bg-primary/10 text-primary' : 'hover:bg-muted'"
            @mousedown.prevent="select(suggestion)"
            @mouseenter="activeIndex = index"
          >
            <Icon name="i-heroicons-map-pin" class="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span class="truncate">{{ suggestion.label }}</span>
          </button>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useLocationAutocomplete, type LocationSuggestion } from '../composables/useLocationAutocomplete'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { query, suggestions, isLoading, clear } = useLocationAutocomplete()
const open = ref(false)
const activeIndex = ref(-1)
const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  query.value = props.modelValue || ''
  document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

function onInput(value: string) {
  emit('update:modelValue', value)
  query.value = value
  open.value = true
  activeIndex.value = -1
}

function select(suggestion: LocationSuggestion) {
  emit('update:modelValue', suggestion.label)
  query.value = suggestion.label
  open.value = false
  activeIndex.value = -1
  clear()
}

watch(() => props.modelValue, (val) => {
  if (val !== query.value) {
    query.value = val
  }
})
</script>
