<template>
  <section id="experience" class="py-20">
    <div class="container px-4 mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-center">Expérience</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
      
      <div class="max-w-4xl mx-auto space-y-6">
        <div
          v-for="(exp, idx) in experiences"
          :key="exp.title + idx"
          class="p-6 rounded-xl border border-border bg-card"
        >
          <div class="flex items-start justify-between">
            <div>
              <h3 class="font-semibold text-lg">{{ exp.title }}</h3>
              <div class="text-sm text-muted-foreground">{{ exp.company }} — {{ exp.location }}</div>
            </div>
            <div class="text-sm text-muted-foreground">{{ exp.startDate }} — {{ exp.endDate }}</div>
          </div>
          <ul class="mt-4 list-disc list-inside text-sm text-muted-foreground">
            <li v-for="(r, i) in exp.responsibilities" :key="i">{{ r }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockData } from '~/data/mock'

const experiences = mockData.experiences || []
</script>