<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />

    <!-- ═══════════════════════════════════════════
         SECTION 1 — HERO
    ════════════════════════════════════════════ -->
    <section class="relative overflow-hidden border-b border-border">
      <!-- Fond dégradé -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-background to-background pointer-events-none" />
      <div class="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-primary/[0.05] pointer-events-none" />

      <div class="relative container mx-auto px-4 max-w-6xl py-20 md:py-28">
        <div class="grid md:grid-cols-2 gap-12 items-center">

          <!-- Texte gauche -->
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <span class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Plateforme certifiée de financement solidaire
            </div>

            <h1 class="text-5xl font-bold tracking-tight leading-[1.1] mb-5">
              Financez les projets<br>
              <span class="text-primary">qui changent le monde</span>
            </h1>

            <p class="text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
              Connectez-vous à des ONGs vérifiées, évaluez leur score de transparence et soutenez leurs missions en toute confiance.
            </p>

            <div class="flex justify-center md:justify-start">
              <a href="#ongs">
                <UButton size="lg" trailing-icon="i-heroicons-arrow-down">
                  Explorer les ONGs
                </UButton>
              </a>
            </div>

            <!-- Social proof -->
            <div class="flex items-center gap-2 mt-8 pt-6 border-t border-border">
              <div class="flex -space-x-2">
                <div v-for="i in 4" :key="i" :class="['w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-white', avatarColors[i-1]]">
                  {{ avatarLetters[i-1] }}
                </div>
              </div>
              <p class="text-sm text-muted-foreground">
                <span class="font-semibold text-foreground">+240 donateurs</span> ont déjà rejoint la plateforme
              </p>
            </div>
          </div>

          <!-- Visuel droit — carte flottante -->
          <div class="hidden md:flex justify-center">
            <div class="relative w-full max-w-sm">
              <!-- Carte principale -->
              <div class="bg-card rounded-2xl border border-border shadow-xl p-6 space-y-4">
                <div class="flex items-center gap-3 pb-4 border-b border-border">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon name="i-heroicons-building-office-2" class="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p class="font-semibold text-sm">ONG Éducation Madagascar</p>
                    <p class="text-xs text-muted-foreground">Antananarivo · Éducation</p>
                  </div>
                  <div class="ml-auto">
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      <span class="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Vérifié
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-3 text-center">
                  <div class="bg-muted/50 rounded-lg p-3">
                    <p class="text-lg font-bold">87</p>
                    <p class="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div class="bg-muted/50 rounded-lg p-3">
                    <p class="text-lg font-bold">142</p>
                    <p class="text-xs text-muted-foreground">Bénévoles</p>
                  </div>
                  <div class="bg-muted/50 rounded-lg p-3">
                    <p class="text-lg font-bold">8</p>
                    <p class="text-xs text-muted-foreground">Projets</p>
                  </div>
                </div>

                <!-- Barre de progression don -->
                <div>
                  <div class="flex justify-between text-xs mb-1.5">
                    <span class="text-muted-foreground">Collecte en cours</span>
                    <span class="font-semibold">12 400 € / 20 000 €</span>
                  </div>
                  <div class="h-2 rounded-full bg-muted overflow-hidden">
                    <div class="h-full w-[62%] bg-primary rounded-full" />
                  </div>
                </div>

                <UButton block size="sm" icon="i-heroicons-heart">Soutenir cette ONG</UButton>
              </div>

              <!-- Badge flottant -->
              <div class="absolute -top-4 -right-4 bg-green-500 text-white rounded-xl px-3 py-2 text-xs font-bold shadow-lg flex items-center gap-1.5">
                <Icon name="i-heroicons-shield-check" class="w-3.5 h-3.5" />
                Certifiée
              </div>

              <!-- Notification flottante -->
              <div class="absolute -bottom-5 -left-5 bg-card border border-border rounded-xl px-3 py-2 shadow-lg flex items-center gap-2.5">
                <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon name="i-heroicons-banknotes" class="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <p class="text-xs font-semibold">Don reçu</p>
                  <p class="text-xs text-muted-foreground">250 € · il y a 2 min</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 2 — BARRE DE CONFIANCE
    ════════════════════════════════════════════ -->
    <section class="border-b border-border bg-card/60">
      <div class="container mx-auto px-4 max-w-6xl py-5">
        <div class="flex flex-wrap items-center justify-between gap-6">
          <div v-for="stat in trustStats" :key="stat.label" class="flex items-center gap-3">
            <div :class="['w-9 h-9 rounded-lg flex items-center justify-center shrink-0', stat.bg]">
              <Icon :name="stat.icon" class="w-4 h-4" :class="stat.color" />
            </div>
            <div>
              <p class="text-lg font-bold leading-none">{{ stat.value }}</p>
              <p class="text-xs text-muted-foreground mt-0.5">{{ stat.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 3 — COMMENT ÇA MARCHE
    ════════════════════════════════════════════ -->
    <section class="py-16 border-b border-border">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="text-center mb-12">
          <p class="text-xs font-semibold text-primary uppercase tracking-widest mb-3">Processus simple</p>
          <h2 class="text-3xl font-bold mb-3">Comment ça marche ?</h2>
          <p class="text-muted-foreground max-w-md mx-auto text-sm leading-relaxed">
            En 3 étapes, soutenez une cause qui vous tient à cœur et suivez l'impact de vos dons.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 relative">
          <!-- Ligne de connexion (desktop only) -->
          <div class="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px bg-border" />

          <div v-for="step in howItWorks" :key="step.num" class="relative text-center">
            <div class="relative inline-flex">
              <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 border-2', step.bg, step.border]">
                <Icon :name="step.icon" class="w-7 h-7" :class="step.color" />
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                {{ step.num }}
              </div>
            </div>
            <h3 class="font-semibold text-base mb-2">{{ step.title }}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 4 — CTA GESTIONNAIRES
    ════════════════════════════════════════════ -->
    <section class="border-t border-border bg-primary relative overflow-hidden">
      <div class="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
      <div class="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />

      <div class="relative container mx-auto px-4 max-w-6xl py-16">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white/90 text-xs font-semibold mb-5">
              <Icon name="i-heroicons-building-office-2" class="w-3.5 h-3.5" />
              Pour les gestionnaires d'ONG
            </div>
            <h2 class="text-3xl font-bold text-white leading-tight mb-4">
              Vous gérez une ONG ?<br>Rejoignez Paika.
            </h2>
            <p class="text-white/65 text-sm leading-relaxed mb-8 max-w-md">
              Accédez à un réseau de bailleurs institutionnels, obtenez votre certification de transparence et pilotez votre financement depuis un seul espace.
            </p>
            <div class="flex items-center gap-3 flex-wrap">
              <NuxtLink to="/auth/signup">
                <UButton size="lg" color="white" variant="solid">Inscrire mon ONG</UButton>
              </NuxtLink>
              <NuxtLink to="/auth/login">
                <UButton size="lg" color="white" variant="ghost">Se connecter</UButton>
              </NuxtLink>
            </div>
          </div>

          <div class="hidden md:grid grid-cols-2 gap-4">
            <div v-for="benefit in ongBenefits" :key="benefit.title" class="bg-white/10 rounded-xl p-4 border border-white/10">
              <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center mb-3">
                <Icon :name="benefit.icon" class="w-4 h-4 text-white" />
              </div>
              <p class="text-white font-semibold text-sm mb-1">{{ benefit.title }}</p>
              <p class="text-white/55 text-xs leading-relaxed">{{ benefit.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         SECTION 5 — LISTE DES ONGs
    ════════════════════════════════════════════ -->
    <section id="ongs" class="py-12 flex-grow">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="flex items-end justify-between mb-8">
          <div>
            <p class="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Organisations certifiées</p>
            <h2 class="text-2xl font-bold">ONGs à soutenir</h2>
            <p class="text-sm text-muted-foreground mt-1">Un aperçu des organisations actives sur la plateforme</p>
          </div>
          <NuxtLink to="/ongs">
            <UButton variant="outline" size="sm" trailing-icon="i-heroicons-arrow-right">
              Voir toutes les ONGs
            </UButton>
          </NuxtLink>
        </div>

        <ClientOnly>
          <OngList :preview="true" />
          <template #fallback>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <USkeleton v-for="i in 3" :key="i" class="h-80 rounded-xl" />
            </div>
          </template>
        </ClientOnly>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import OngList from '~/features/ong/components/OngList.client.vue'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.client.vue'

definePageMeta({ layout: false })

useHead({
  title: 'Paika — Financement des ONGs',
  meta: [
    { name: 'description', content: 'Plateforme certifiée pour connecter bailleurs de fonds et organisations à impact réel.' },
  ],
})

const avatarColors = ['bg-primary', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500']
const avatarLetters = ['A', 'M', 'S', 'R']

const trustStats = [
  { value: '120+',   label: 'ONGs certifiées',      icon: 'i-heroicons-building-office-2', bg: 'bg-primary/10',                  color: 'text-primary' },
  { value: '3 200+', label: 'Donateurs actifs',      icon: 'i-heroicons-users',             bg: 'bg-blue-100 dark:bg-blue-900',   color: 'text-blue-600 dark:text-blue-400' },
  { value: '8 500+', label: 'Dons effectués',        icon: 'i-heroicons-heart',             bg: 'bg-green-100 dark:bg-green-900', color: 'text-green-600 dark:text-green-400' },
  { value: '€ 1.2M', label: 'Financements accordés', icon: 'i-heroicons-banknotes',         bg: 'bg-amber-100 dark:bg-amber-900', color: 'text-amber-600 dark:text-amber-400' },
]

const howItWorks = [
  {
    num: 1,
    title: 'Explorez les ONGs',
    desc: 'Parcourez le catalogue d\'organisations certifiées, filtrez par cause, localisation ou score de transparence.',
    icon: 'i-heroicons-magnifying-glass',
    bg: 'bg-primary/5',
    border: 'border-primary/20',
    color: 'text-primary',
  },
  {
    num: 2,
    title: 'Choisissez votre cause',
    desc: 'Consultez les projets en cours, les documents financiers et les rapports d\'impact de chaque ONG.',
    icon: 'i-heroicons-heart',
    bg: 'bg-rose-50 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-800',
    color: 'text-rose-500',
  },
  {
    num: 3,
    title: 'Donnez en confiance',
    desc: 'Effectuez votre don sécurisé, suivez son utilisation et recevez votre reçu fiscal automatiquement.',
    icon: 'i-heroicons-banknotes',
    bg: 'bg-green-50 dark:bg-green-950/30',
    border: 'border-green-200 dark:border-green-800',
    color: 'text-green-600 dark:text-green-400',
  },
]

const ongBenefits = [
  { icon: 'i-heroicons-shield-check',   title: 'Certification rapide',    desc: 'Obtenez votre badge de confiance en moins de 48 h.' },
  { icon: 'i-heroicons-chart-bar',      title: 'Tableau de bord complet', desc: 'Pilotez vos projets et votre financement depuis un seul espace.' },
  { icon: 'i-heroicons-users',          title: 'Réseau de bailleurs',     desc: 'Accédez à des donateurs institutionnels et privés.' },
  { icon: 'i-heroicons-document-check', title: 'Rapports automatiques',   desc: 'Générez vos rapports financiers en un clic.' },
]
</script>
