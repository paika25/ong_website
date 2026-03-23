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

      <h1 class="text-3xl font-bold mb-2">Conditions Générales d'Utilisation</h1>
      <p class="text-muted-foreground mb-10">Dernière mise à jour : 23 mars 2026</p>

      <div class="prose prose-neutral dark:prose-invert max-w-none space-y-8">
        <!-- Article 1 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">1. Objet</h2>
          <p class="text-muted-foreground leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de définir les modalités
            et conditions d'accès et d'utilisation de la plateforme <strong class="text-foreground">Paika Project</strong>
            (ci-après « la Plateforme »), accessible à l'adresse correspondante. La Plateforme permet la mise en relation
            entre des Organisations Non Gouvernementales (ONG) et des utilisateurs souhaitant découvrir, soutenir ou
            rejoindre ces organisations.
          </p>
        </section>

        <!-- Article 2 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">2. Acceptation des CGU</h2>
          <p class="text-muted-foreground leading-relaxed">
            L'accès et l'utilisation de la Plateforme sont subordonnés à l'acceptation et au respect des présentes CGU.
            En créant un compte ou en utilisant la Plateforme, l'utilisateur reconnaît avoir lu, compris et accepté
            l'intégralité des présentes CGU sans réserve. Si vous n'acceptez pas ces conditions, vous ne devez pas
            utiliser la Plateforme.
          </p>
        </section>

        <!-- Article 3 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">3. Inscription et compte utilisateur</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            Pour accéder à certaines fonctionnalités de la Plateforme, l'utilisateur doit créer un compte en
            fournissant des informations exactes, complètes et à jour. L'utilisateur s'engage à :
          </p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Fournir des informations véridiques lors de son inscription ;</li>
            <li>Maintenir la confidentialité de ses identifiants de connexion ;</li>
            <li>Informer immédiatement Paika Project de toute utilisation non autorisée de son compte ;</li>
            <li>Ne pas créer de compte pour le compte d'un tiers sans son autorisation.</li>
          </ul>
          <p class="text-muted-foreground leading-relaxed mt-3">
            Paika Project se réserve le droit de suspendre ou supprimer tout compte en cas de non-respect des
            présentes CGU.
          </p>
        </section>

        <!-- Article 4 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">4. Services proposés</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">La Plateforme offre les services suivants :</p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li><strong class="text-foreground">Consultation</strong> : découverte et recherche d'ONG référencées sur la Plateforme ;</li>
            <li><strong class="text-foreground">Gestion d'ONG</strong> : création et administration d'une fiche ONG (informations, projets, documents, finances) ;</li>
            <li><strong class="text-foreground">Soutien</strong> : possibilité de faire des dons ou de devenir bénévole auprès d'une ONG ;</li>
            <li><strong class="text-foreground">Transparence</strong> : consultation des documents officiels, rapports d'activité et données financières des ONG.</li>
          </ul>
        </section>

        <!-- Article 5 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">5. Obligations des utilisateurs</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">L'utilisateur s'engage à :</p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Utiliser la Plateforme conformément à sa finalité et aux lois en vigueur ;</li>
            <li>Ne pas publier de contenu illicite, diffamatoire, injurieux ou portant atteinte aux droits de tiers ;</li>
            <li>Ne pas tenter d'accéder de manière non autorisée aux systèmes de la Plateforme ;</li>
            <li>Ne pas usurper l'identité d'un tiers ou d'une ONG ;</li>
            <li>Ne pas utiliser la Plateforme à des fins de spam, de fraude ou d'activités illégales.</li>
          </ul>
        </section>

        <!-- Article 6 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">6. Obligations des ONG</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            Les ONG inscrites sur la Plateforme s'engagent à :
          </p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li>Fournir des informations exactes, à jour et vérifiables sur leur organisation ;</li>
            <li>Publier des documents officiels authentiques (statuts, rapports d'activité) ;</li>
            <li>Faire preuve de transparence quant à l'utilisation des fonds collectés ;</li>
            <li>Respecter les engagements pris envers les donateurs et bénévoles.</li>
          </ul>
          <p class="text-muted-foreground leading-relaxed mt-3">
            Paika Project se réserve le droit de retirer ou suspendre toute fiche ONG contenant des informations
            fausses ou trompeuses.
          </p>
        </section>

        <!-- Article 7 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">7. Propriété intellectuelle</h2>
          <p class="text-muted-foreground leading-relaxed">
            L'ensemble des éléments de la Plateforme (design, textes, logos, code source, fonctionnalités) est protégé
            par le droit de la propriété intellectuelle. Toute reproduction, représentation, modification ou
            exploitation non autorisée de ces éléments est strictement interdite. Les contenus publiés par les
            utilisateurs et les ONG restent leur propriété respective.
          </p>
        </section>

        <!-- Article 8 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">8. Limitation de responsabilité</h2>
          <p class="text-muted-foreground leading-relaxed mb-3">
            Paika Project met tout en œuvre pour assurer la disponibilité et le bon fonctionnement de la Plateforme.
            Toutefois :
          </p>
          <ul class="list-disc pl-6 text-muted-foreground space-y-1">
            <li>La Plateforme est fournie « en l'état », sans garantie d'aucune sorte ;</li>
            <li>Paika Project n'est pas responsable des contenus publiés par les utilisateurs ou les ONG ;</li>
            <li>Paika Project ne garantit pas l'exactitude des informations fournies par les ONG ;</li>
            <li>Paika Project ne peut être tenu responsable des interruptions temporaires liées à la maintenance ou à des incidents techniques.</li>
          </ul>
        </section>

        <!-- Article 9 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">9. Modification des CGU</h2>
          <p class="text-muted-foreground leading-relaxed">
            Paika Project se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront
            informés de toute modification substantielle. La poursuite de l'utilisation de la Plateforme après
            modification vaut acceptation des nouvelles conditions.
          </p>
        </section>

        <!-- Article 10 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">10. Droit applicable et juridiction</h2>
          <p class="text-muted-foreground leading-relaxed">
            Les présentes CGU sont régies par le droit français. En cas de litige, les parties s'engagent à rechercher
            une solution amiable avant de saisir les tribunaux compétents.
          </p>
        </section>

        <!-- Article 11 -->
        <section>
          <h2 class="text-xl font-semibold mb-3">11. Contact</h2>
          <p class="text-muted-foreground leading-relaxed">
            Pour toute question relative aux présentes CGU, vous pouvez nous contacter à l'adresse :
            <a href="mailto:contact@paika-project.org" class="text-primary hover:underline">contact@paika-project.org</a>.
          </p>
        </section>
      </div>
    </main>

    <Footer />
  </div>
</template>
