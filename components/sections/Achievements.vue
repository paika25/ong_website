<template>
  <section id="achievements" class="py-20 bg-muted/30">
    <div class="container px-4 mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-center">Réalisations</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
      
      <div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
        <div
          v-for="(ach, idx) in achievements"
          :key="ach.title"
          class="p-6 rounded-xl border border-border bg-card"
        >
          <h3 class="font-semibold mb-2">{{ ach.title }}</h3>
          <p class="text-sm text-muted-foreground">{{ ach.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockData } from '~/data/mock'

const achievements = mockData.keyAchievements || []
</script>