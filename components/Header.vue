<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center justify-between px-4">
      <a href="#home" class="flex items-center space-x-2">
        <span class="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          MR
        </span>
      </a>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-6">
        <button
          v-for="item in navigation"
          :key="item.name"
          @click="scrollToSection(item.href)"
          class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {{ item.name }}
        </button>
      </nav>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        
        <!-- Mobile Menu -->
        <UButton variant="ghost" size="sm" class="md:hidden" @click="isOpen = !isOpen">
          <Icon name="lucide:menu" class="h-5 w-5" />
        </UButton>

        <!-- Mobile Menu Overlay -->
        <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/50 md:hidden" @click="isOpen = false">
          <div class="fixed right-0 top-0 h-full w-64 bg-background border-l p-6" @click.stop>
            <nav class="flex flex-col space-y-4 mt-8">
              <button
                v-for="item in navigation"
                :key="item.name"
                @click="scrollToSection(item.href)"
                class="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors text-left"
              >
                {{ item.name }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {ref} from 'vue'

const navigation = [
  { name: "Accueil", href: "#home" },
  { name: "À propos", href: "#about" },
  { name: "Expérience", href: "#experience" },
  { name: "Projets", href: "#projects" },
  { name: "Compétences", href: "#skills" },
  { name: "Contact", href: "#contact" },
]

const isOpen = ref(false)

const scrollToSection = (href: string) => {
  isOpen.value = false
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({ behavior: "smooth" })
  }
}
</script>