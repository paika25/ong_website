<template>
  <section id="projects" class="py-20 bg-muted/30">
    <div class="container px-4 mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-center">Projets</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
      
      <div class="max-w-4xl mx-auto">
        <div class="grid sm:grid-cols-2 gap-6">
          <div
            v-for="(project, idx) in projects"
            :key="project.name"
            class="p-6 rounded-xl border border-border bg-card"
          >
            <h3 class="font-semibold text-lg mb-2">{{ project.name }}</h3>
            <p class="text-sm text-muted-foreground mb-3">{{ project.description }}</p>
            <div class="text-xs text-muted-foreground">{{ project.technologies?.join(', ') }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockData } from '~/data/mock'

const projects = mockData.projects || []
</script>