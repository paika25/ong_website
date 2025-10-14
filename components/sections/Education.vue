<template>
  <section id="education" class="py-20">
    <div class="container px-4 mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-center">Formation</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
      
      <div class="max-w-4xl mx-auto space-y-6">
        <div
          v-for="(ed, idx) in education"
          :key="ed.degree + idx"
          class="p-6 rounded-xl border border-border bg-card"
        >
          <h3 class="font-semibold">{{ ed.degree }}</h3>
          <div class="text-sm text-muted-foreground">{{ ed.institution }} — {{ ed.location }}</div>
          <div class="text-xs text-muted-foreground">{{ ed.startDate }} — {{ ed.endDate }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockData } from '~/data/mock'

const education = mockData.education || []
</script>