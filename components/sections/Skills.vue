<template>
  <section id="skills" class="py-20">
    <div class="container px-4 mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-center">Compétences</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
      
      <div class="max-w-4xl mx-auto">
        <div class="flex flex-wrap gap-3 justify-center">
          <span
            v-for="(skill, idx) in skills"
            :key="skill"
            class="px-3 py-1 rounded-full text-sm bg-muted/20 text-foreground border border-border"
          >
            {{ skill }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockData } from '~/data/mock'

const skills = mockData.skills || []
</script>