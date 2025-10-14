<template>
  <section id="about" class="py-20 bg-muted/30">
    <div class="container px-4 mx-auto">
      <h2 class="text-4xl font-bold mb-4 text-center">À propos</h2>
      <div class="w-20 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-12 rounded-full" />
      
      <div class="max-w-4xl mx-auto">
        <p class="text-lg text-muted-foreground mb-12 text-center leading-relaxed">
          {{ summary }}
        </p>
        
        <div class="grid md:grid-cols-3 gap-6">
          <UCard class="border-2 hover:border-primary/50 transition-colors">
            <template #header>
              <div class="pt-6 text-center">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="lucide:code-2" class="h-6 w-6 text-primary" />
                </div>
                <h3 class="font-semibold mb-2">3+ Ans</h3>
                <p class="text-sm text-muted-foreground">d'expérience en développement</p>
              </div>
            </template>
          </UCard>
          
          <UCard class="border-2 hover:border-primary/50 transition-colors">
            <template #header>
              <div class="pt-6 text-center">
                <div class="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="lucide:briefcase" class="h-6 w-6 text-accent" />
                </div>
                <h3 class="font-semibold mb-2">FullStack</h3>
                <p class="text-sm text-muted-foreground">Laravel, Vue.js, React</p>
              </div>
            </template>
          </UCard>
          
          <UCard class="border-2 hover:border-primary/50 transition-colors">
            <template #header>
              <div class="pt-6 text-center">
                <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon name="lucide:award" class="h-6 w-6 text-primary" />
                </div>
                <h3 class="font-semibold mb-2">Top 3</h3>
                <p class="text-sm text-muted-foreground">Hackathon Za@Geek</p>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { mockData } from '~/data/mock'

const summary = mockData.summary || ''
const personal = mockData.personalInfo || {}
</script>