<template>
  <div class="min-h-screen">
    <Header />
    <main>
      <div id="home">
        <Hero />
      </div>
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Achievements />
      <Education />
      <Contact />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'
import Hero from '~/components/sections/Hero.vue'
import About from '~/components/sections/About.vue'
import Experience from '~/components/sections/Experience.vue'
import Projects from '~/components/sections/Projects.vue'
import Skills from '~/components/sections/Skills.vue'
import Achievements from '~/components/sections/Achievements.vue'
import Education from '~/components/sections/Education.vue'
import Contact from '~/components/sections/Contact.vue' 
// Meta tags pour SEO
// useHead est auto-importé par Nuxt
// Aucun import manuel nécessaire ici
// (corriger une faute qui brisait le parsing)
useHead({
  title: 'Portfolio - Marius',
  meta: [
    { name: 'description', content: 'Portfolio personnel de Marius - Développeur passionné' },
    { name: 'keywords', content: 'portfolio, développeur, web, Vue.js, Nuxt.js' }
  ]
})
</script>