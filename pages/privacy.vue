<template>
  <div class="min-h-screen bg-background">
    <Header />

    <main class="container mx-auto px-4 py-12 max-w-3xl">
      <NuxtLink to="/" class="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <svg class="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à l'accueil
      </NuxtLink>

      <h1 class="text-3xl font-bold mb-2">Politique de Confidentialité</h1>
      <p class="text-muted-foreground mb-10">Dernière mise à jour : 23 mars 2026</p>

      <div class="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <!-- Article 1 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">1. Introduction</h2>
          <p class="text-muted-foreground leading-relaxed">
            La présente Politique de Confidentialité décrit la manière dont <strong class="text-foreground">Paika Project</strong>
            (ci-après « nous ») collecte, utilise, stocke et protège les données personnelles des utilisateurs de la Plateforme.
            Nous nous engageons à respecter la réglementation applicable en matière de protection des données personnelles,
            notamment le Règlement Général sur la Protection des Données (RGPD — UE 2016/679).
          </p>
        </section>

        <!-- Article 2 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">2. Responsable du traitement</h2>
          <p class="text-muted-foreground leading-relaxed">
            Le responsable du traitement des données personnelles est Paika Project. Pour toute question relative
            à vos données, vous pouvez nous contacter à :
            <a href="mailto:privacy@paika-project.org" class="text-primary hover:underline">privacy@paika-project.org</a>.
          </p>
        </section>

        <!-- Article 3 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">3. Données collectées</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            Nous collectons les catégories de données suivantes :
          </p>

          <div class="space-y-4">
            <div class="bg-card border border-border rounded-lg p-4">
              <h3 class="font-medium text-foreground mb-1">Données d'identification</h3>
              <p class="text-sm text-muted-foreground">Nom, prénom, adresse email, mot de passe (hashé), rôle sur la plateforme (agent, partenaire).</p>
            </div>
            <div class="bg-card border border-border rounded-lg p-4">
              <h3 class="font-medium text-foreground mb-1">Données relatives aux ONG</h3>
              <p class="text-sm text-muted-foreground">Nom de l'organisation, description, catégorie, localisation, documents officiels (statuts, rapports d'activité), informations financières, coordonnées de contact.</p>
            </div>
            <div class="bg-card border border-border rounded-lg p-4">
              <h3 class="font-medium text-foreground mb-1">Données techniques</h3>
              <p class="text-sm text-muted-foreground">Adresse IP, type de navigateur, système d'exploitation, pages consultées, date et heure de connexion.</p>
            </div>
          </div>
        </section>

        <!-- Article 4 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">4. Finalités du traitement</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">Vos données sont traitées pour les finalités suivantes :</p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Création et gestion de votre compte utilisateur ;</li>
            <li>Publication et gestion des fiches ONG ;</li>
            <li>Mise en relation entre utilisateurs et ONG ;</li>
            <li>Stockage et affichage des documents officiels des ONG ;</li>
            <li>Amélioration de la Plateforme et de l'expérience utilisateur ;</li>
            <li>Sécurité et prévention des fraudes ;</li>
            <li>Respect de nos obligations légales.</li>
          </ul>
        </section>

        <!-- Article 5 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">5. Bases légales du traitement</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">Le traitement de vos données repose sur :</p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong class="text-foreground">Le consentement</strong> : pour la création de votre compte et l'utilisation de la Plateforme ;</li>
            <li><strong class="text-foreground">L'exécution contractuelle</strong> : pour fournir les services de la Plateforme ;</li>
            <li><strong class="text-foreground">L'intérêt légitime</strong> : pour l'amélioration de nos services et la sécurité de la Plateforme ;</li>
            <li><strong class="text-foreground">L'obligation légale</strong> : pour le respect des réglementations applicables.</li>
          </ul>
        </section>

        <!-- Article 6 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">6. Stockage et hébergement des données</h2>
          <p class="text-muted-foreground leading-relaxed">
            Les données sont hébergées par <strong class="text-foreground">Supabase</strong> (infrastructure cloud),
            qui assure un niveau de sécurité conforme aux standards de l'industrie. Les fichiers (images, documents)
            sont stockés dans des buckets Supabase Storage sécurisés. Les mots de passe sont hashés et ne sont jamais
            stockés en clair. Les connexions à la Plateforme sont chiffrées via HTTPS/TLS.
          </p>
        </section>

        <!-- Article 7 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">7. Durée de conservation</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">Les données sont conservées selon les durées suivantes :</p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong class="text-foreground">Données de compte</strong> : pendant toute la durée d'activité du compte, puis 3 ans après sa suppression ;</li>
            <li><strong class="text-foreground">Données des ONG</strong> : pendant toute la durée de publication de la fiche, puis 1 an après suppression ;</li>
            <li><strong class="text-foreground">Documents uploadés</strong> : pendant toute la durée de publication, supprimés à la demande du titulaire ;</li>
            <li><strong class="text-foreground">Données techniques</strong> : 12 mois maximum.</li>
          </ul>
        </section>

        <!-- Article 8 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">8. Partage des données</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            Nous ne vendons pas vos données personnelles. Vos données peuvent être partagées uniquement dans les cas suivants :
          </p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong class="text-foreground">Données publiques des ONG</strong> : les informations des fiches ONG (nom, description, projets, documents) sont visibles publiquement sur la Plateforme ;</li>
            <li><strong class="text-foreground">Prestataires techniques</strong> : nos sous-traitants (hébergement, email) accèdent aux données dans la mesure nécessaire à la fourniture de leurs services ;</li>
            <li><strong class="text-foreground">Obligations légales</strong> : en cas de demande des autorités compétentes.</li>
          </ul>
        </section>

        <!-- Article 9 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">9. Vos droits</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="bg-card border border-border rounded-lg p-3">
              <p class="font-medium text-foreground text-sm">Droit d'accès</p>
              <p class="text-xs text-muted-foreground">Obtenir une copie de vos données personnelles</p>
            </div>
            <div class="bg-card border border-border rounded-lg p-3">
              <p class="font-medium text-foreground text-sm">Droit de rectification</p>
              <p class="text-xs text-muted-foreground">Corriger des données inexactes ou incomplètes</p>
            </div>
            <div class="bg-card border border-border rounded-lg p-3">
              <p class="font-medium text-foreground text-sm">Droit à l'effacement</p>
              <p class="text-xs text-muted-foreground">Demander la suppression de vos données</p>
            </div>
            <div class="bg-card border border-border rounded-lg p-3">
              <p class="font-medium text-foreground text-sm">Droit à la portabilité</p>
              <p class="text-xs text-muted-foreground">Recevoir vos données dans un format structuré</p>
            </div>
            <div class="bg-card border border-border rounded-lg p-3">
              <p class="font-medium text-foreground text-sm">Droit d'opposition</p>
              <p class="text-xs text-muted-foreground">Vous opposer au traitement de vos données</p>
            </div>
            <div class="bg-card border border-border rounded-lg p-3">
              <p class="font-medium text-foreground text-sm">Droit de limitation</p>
              <p class="text-xs text-muted-foreground">Limiter le traitement dans certains cas</p>
            </div>
          </div>
          <p class="text-muted-foreground leading-relaxed mt-3">
            Pour exercer ces droits, contactez-nous à :
            <a href="mailto:privacy@paika-project.org" class="text-primary hover:underline">privacy@paika-project.org</a>.
            Nous répondrons dans un délai de 30 jours.
          </p>
        </section>

        <!-- Article 10 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">10. Cookies</h2>
          <p class="text-muted-foreground leading-relaxed">
            La Plateforme utilise des cookies strictement nécessaires au fonctionnement du service (authentification,
            préférences de thème). Aucun cookie publicitaire ou de suivi tiers n'est utilisé. Vous pouvez configurer
            votre navigateur pour refuser les cookies, mais certaines fonctionnalités pourraient ne plus être disponibles.
          </p>
        </section>

        <!-- Article 11 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">11. Sécurité</h2>
          <p class="text-muted-foreground leading-relaxed">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données
            contre tout accès non autorisé, perte, altération ou divulgation. Cela inclut le chiffrement des données
            en transit (HTTPS), le hashage des mots de passe, les politiques de contrôle d'accès (Row Level Security)
            et la surveillance régulière de nos systèmes.
          </p>
        </section>

        <!-- Article 12 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">12. Modifications</h2>
          <p class="text-muted-foreground leading-relaxed">
            Nous nous réservons le droit de modifier la présente Politique de Confidentialité à tout moment. Toute
            modification sera publiée sur cette page avec une date de mise à jour. Nous vous recommandons de consulter
            régulièrement cette page.
          </p>
        </section>

        <!-- Article 13 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">13. Contact</h2>
          <p class="text-muted-foreground leading-relaxed">
            Pour toute question ou réclamation relative à la protection de vos données, contactez-nous :
          </p>
          <div class="bg-card border border-border rounded-lg p-4 mt-3">
            <p class="text-sm text-foreground font-medium">Paika Project — Protection des données</p>
            <p class="text-sm text-muted-foreground mt-1">
              Email : <a href="mailto:privacy@paika-project.org" class="text-primary hover:underline">privacy@paika-project.org</a>
            </p>
          </div>
          <p class="text-muted-foreground leading-relaxed mt-3 text-sm">
            Vous avez également le droit d'introduire une réclamation auprès de la CNIL
            (<a href="https://www.cnil.fr" target="_blank" rel="noopener" class="text-primary hover:underline">www.cnil.fr</a>).
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>
