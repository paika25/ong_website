---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
releaseMode: phased
inputDocuments:
  - 'docs-old/MMP.md'
  - 'docs-old/ROADMAP_FEATURES.md'
  - '_bmad-output/project-context.md'
workflowType: 'prd'
documentCounts:
  productBriefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 2
classification:
  projectType: 'saas_b2b + marketplace (two-sided, network effects)'
  domain: 'NGO tech + trust infrastructure (BCRM-regulated) + payment facilitation + data marketplace'
  complexity: 'high'
  complexitySources:
    - 'RLS matrix multi-role (user_agent / user_partner / back-office)'
    - 'Webhooks mobile money (MVola/Orange/Airtel) — état machine transactions requis'
    - 'Audit trail financier — table immutable RLS read-only'
    - 'Connectivité Madagascar — UX offline/timeout recovery'
  projectContext: 'brownfield'
  keyRisks:
    - 'Responsabilité fiduciaire tiers de confiance'
    - 'Compliance BCRM + loi 2011-012 ONG malgache'
    - 'Processus de validation ONG humain non encore défini'
    - 'Stakeholders bailleurs internationaux (AFD, UE, GIZ) non intégrés'
  stakeholders:
    - 'user_agent (gestionnaire ONG)'
    - 'user_partner (donateur/bailleur)'
    - 'Opérateurs mobile money (MVola, Orange, Airtel)'
    - 'Bailleurs institutionnels internationaux'
    - 'Bénéficiaires finaux des ONGs'
---

# Product Requirements Document - Paika ONG Platform

**Auteur:** Paika
**Date:** 2026-04-30

---

## Résumé Exécutif

**Paika** est une plateforme SaaS B2B et marketplace two-sided positionnée comme **infrastructure de confiance régulée** pour l'écosystème ONG malgache. Elle comble un vide institutionnel critique : l'absence d'un tiers neutre, technologique et financièrement régulé, entre les ONG locales et les bailleurs institutionnels internationaux (AFD, GIZ, UE, Banque Mondiale).

**Problème adressé :** Madagascar est classé 140e/180 à l'Indice de Perception de la Corruption 2024 (Transparency International). Les bailleurs institutionnels ne peuvent pas débloquer des fonds vers des ONG malgaches sans un audit trail conforme à leurs propres obligations fiduciaires. Aucun mécanisme neutre, indépendant et numériquement traçable n'existait. Le cadre légal ONG malgache (loi 2011-012) est obsolète et fragmenté. En parallèle, le gestionnaire ONG sur le terrain perd un temps critique à re-prouver sa légitimité à chaque nouveau bailleur — sans infrastructure commune, chaque relation repart de zéro.

**Utilisateurs cibles :**

| Rôle | Douleur réelle | Job-to-be-Done |
|---|---|---|
| **Bailleur institutionnel** (`user_partner`) | Justifier chaque allocation à son propre conseil d'administration sous risque d'audit | Déléguer la vérification terrain à un tiers certifié pour débloquer les fonds en confiance |
| **Gestionnaire ONG** (`user_agent`) | Temps perdu à re-prouver sa légitimité à chaque bailleur, méfiance envers les plateformes extérieures | Être reconnu comme crédible une fois, utiliser ce capital de confiance auprès de tous les bailleurs |
| **Opérateur back-office Paika** | Charge cognitive du processus de vérification documentaire humain sans outil structuré | Gérer le pipeline de certification ONG avec traçabilité et cohérence |

**Modèle économique :** Abonnement "Vérifié" (20 000 Ar/mois par ONG) + commission sur transactions (3–5%) + licence data agrégée pour bailleurs institutionnels. L'actif défendable à long terme est la base de données comportementale des ONG vérifiées — unique, non-reproductible, à valeur croissante pour les bailleurs et les études de marché.

**Fenêtre stratégique :** Régulation mobile money mature (Loi 2016-056, 2017), évaluation FATF active sur Madagascar (2024), vide juridique ONG non comblé par l'État. La fenêtre pour s'imposer comme standard national de confiance est ouverte — avant qu'un acteur étatique ou institutionnel international ne la referme.

---

### Ce qui rend Paika unique

Paika n'est pas un annuaire amélioré ni un outil de visibilité. C'est la première **infrastructure de responsabilité financière neutre** de Madagascar, combinant :

1. **Score de Transparence à gouvernance indépendante** — calculé sur critères objectifs, non modifiable par l'ONG elle-même. La gouvernance du score doit être séparée de l'opérateur commercial (organe indépendant ou algorithme certifié tiers) pour éviter tout conflit d'intérêt structurel. *C'est la condition sine qua non de la crédibilité.*

2. **Audit trail à immuabilité vérifiable** — table financière append-only avec triggers bloquant UPDATE/DELETE, backups vérifiables et logs signés cryptographiquement. RLS read-only seul ne suffit pas pour la conformité FATF 2024 — l'architecture doit être explicitement conçue pour l'immuabilité.

3. **Passerelle de paiement mobile money** — intégration native MVola, Orange Money, Airtel via webhooks avec machine d'états transactions. La licence d'exploitation (EME vs agrégateur de paiement) doit être résolue avec la BCRM avant le lancement — elle détermine qui porte la responsabilité réglementaire.

4. **Vérification humaine structurée** — processus back-office de certification documentaire avant attribution du badge "Vérifié", avec outil de gestion du pipeline de vérification pour les opérateurs Paika.

5. **Parcours de confiance progressif** — de l'inscription ONG au premier décaissement bailleur, chaque étape est tracée, vérifiable et reproductible. Ce tunnel d'onboarding *est* le produit différenciant.

**L'insight fondamental :** La confiance entre bailleurs internationaux et ONG locales ne se décrète pas — elle se fabrique via de la transparence documentée, de la régulation financière, et un tiers indépendant qui en est garant. Paika est ce tiers. Mais *qui valide le validateur ?* est la question que chaque bailleur posera — la réponse doit être intégrée dans l'architecture de gouvernance dès le jour 1.

---

**Hypothèses critiques à valider avant architecture :**

| Hypothèse | Impact si non résolue |
|---|---|
| Direction go-to-market : bailleur-driven (bailleurs imposent Paika) ou ONG-driven (ONG choisissent Paika) | Change entièrement la stratégie d'acquisition et la structure tarifaire |
| Accord de principe avec ≥1 bailleur institutionnel dès le lancement | Condition d'existence du marché — sans ancrage externe, le deadlock bailleur↔ONG est irrésoluble |
| Positionnement BCRM : agrégateur de paiement ou EME | Détermine l'infrastructure réglementaire à construire et les délais de mise en conformité |
| Gouvernance Transparency Score : organe indépendant ou algorithme certifié tiers | Condition de crédibilité — si Paika contrôle le score ET perçoit les abonnements, conflit d'intérêt structurel |

---

## Classification du Projet

| Dimension | Valeur |
|---|---|
| **Type de projet** | SaaS B2B + Marketplace two-sided (network effects) |
| **Domaine** | NGO tech + infrastructure de confiance (BCRM-regulated) + facilitation de paiement + data marketplace |
| **Complexité** | Haute — RLS matrix multi-rôles, webhooks mobile money avec machine d'états, audit trail à immuabilité vérifiable, UX offline/timeout recovery Madagascar |
| **Contexte** | Brownfield — prototype fonctionnel existant (auth, rôles user_agent/user_partner, modèle ONG de base, pages statiques) |
| **Risques clés** | Responsabilité fiduciaire tiers de confiance · Compliance BCRM + loi 2011-012 · Processus validation ONG humain non défini · Bailleurs institutionnels non encore intégrés · Deadlock causal adoption two-sided market |

---

## Critères de Succès

### Succès utilisateur

**Bailleur institutionnel (`user_partner`)**
- Peut évaluer une ONG et décider d'un financement en **< 48h** grâce au dossier Paika (vs semaines de due diligence manuelle)
- Taux de satisfaction "l'audit trail Paika est conforme à nos obligations fiduciaires" ≥ 90% à 6 mois
- Au moins **1 bailleur institutionnel pilote** (AFD, GIZ ou équivalent) utilise Paika comme outil de vérification dès le lancement

**Gestionnaire ONG (`user_agent`)**
- Obtient son premier financement via ou grâce à Paika dans les **90 jours** suivant la certification
- Ne re-soumet pas les mêmes documents à deux bailleurs différents — dossier centralisé réutilisable
- Les ONGs certifiées Paika reçoivent **≥ 40% de fonds supplémentaires** dans les 12 mois (benchmark : +62% pour les ONGs certifiées GuideStar/Candid aux US)

**Opérateur back-office Paika**
- Traite un dossier de vérification ONG en **< 5 jours ouvrés**
- Pipeline de vérification gérable à 50 demandes simultanées sans outil supplémentaire au lancement

### Succès business

| Horizon | Indicateur cible |
|---|---|
| **M+3** (lancement) | 50 ONGs actives, 1 accord bailleur institutionnel signé, MRR ≥ 1M Ar |
| **M+6** | 200 ONGs certifiées, première transaction mobile money Paika réussie, CLV:CAC ≥ 3x |
| **M+12** | 500 ONGs payantes, MRR ≥ 10M Ar, churn mensuel < 5%, 3+ bailleurs institutionnels actifs |
| **Vision 3 ans** | Standard national de référence, licence data vendue à ≥ 1 bailleur institutionnel, expansion Afrique de l'Est |

Référence sectorielle : GuideStar (US) — 75 000+ ONGs certifiées, +62% de contributions en moyenne pour les ONGs avec Seal. MVola Madagascar — 10M clients, 1 milliard+ transactions/an (infrastructure de paiement disponible et mature).

### Succès technique

- **Audit trail** : zéro modification de données financières post-enregistrement prouvable — append-only, triggers bloquant UPDATE/DELETE, logs signés cryptographiquement
- **Disponibilité** : uptime ≥ 99,5% sur les heures ouvrées Madagascar (GMT+3, lun–ven 7h–18h)
- **Mobile money** : taux de succès webhooks MVola/Orange/Airtel ≥ 98%, réconciliation automatique des transactions en < 5 minutes
- **Performance** : temps de chargement pages critiques (dossier ONG, dashboard bailleur) < 3s sur connexion 3G Madagascar
- **Compliance BCRM** : agrément ou accord formel obtenu avant le premier décaissement réel

### Résultats mesurables

- **Score de Transparence** : méthodologie documentée, publiée et validée par une autorité indépendante avant lancement
- **Taux de complétion onboarding ONG** : ≥ 70% des ONGs inscrites atteignent le badge "Vérifié" en < 30 jours
- **Taux de rétention bailleurs** : ≥ 85% des bailleurs ayant consulté un dossier Paika reviennent dans les 90 jours
- **Idempotence paiements** : 0 doublon de transaction sur webhook rejoué (testé en staging avant chaque déploiement)

---

## Périmètre Produit

### MVP — Minimum Viable Product

Condition d'existence : prouve que Paika peut certifier une ONG et déclencher la confiance d'un bailleur.

- Inscription et profil ONG complet (informations légales, financières, documents)
- Processus de vérification humaine back-office → attribution badge "Vérifié"
- Score de Transparence calculé automatiquement et affiché publiquement
- Audit trail immuable sur les données financières (append-only, RLS read-only strict)
- Passerelle de paiement mobile money — MVola en priorité, machine d'états transactions
- Interface bailleur : consultation dossier ONG vérifié, Score de Transparence, historique
- Back-office Paika : pipeline de vérification, gestion des demandes, validation documentaire
- Abonnement "Vérifié" (20 000 Ar/mois) avec gestion des accès

### Growth — Post-MVP

Rend Paika compétitif et crée de la rétention.

- Messagerie interne bailleur ↔ ONG (garder les échanges dans la plateforme)
- Historique de dons, reçus fiscaux automatiques téléchargeables
- Algorithme de matching ONG ↔ bailleur avec notifications automatiques
- Intégration Orange Money et Airtel Money
- Rapports d'impact périodiques générés automatiquement pour les ONGs
- API publique pour intégration dans les outils des bailleurs institutionnels

### Vision — Futur (3 ans+)

Fait de Paika l'infrastructure de référence régionale.

- Licence data agrégée pour grands bailleurs et organisations de recherche
- Expansion régionale — Afrique de l'Est (Kenya, Tanzanie, Éthiopie)
- Application mobile pour gestionnaires ONG terrain (offline-first)
- Prédictions ML : détection de fraude, scoring comportemental, recommandations
- Certification inter-plateformes (dossier Paika reconnu par d'autres registres africains)

---

## Parcours Utilisateurs

### Parcours 1 — Haingo, Gestionnaire ONG *(chemin nominal)*

**Profil :** Haingo, 34 ans, dirige une ONG d'éducation rurale à Fianarantsoa. Elle gère tout : comptabilité, projets, relations bailleurs. Chaque année, elle passe 3 semaines à rassembler les mêmes documents pour des bailleurs différents — et la moitié du temps, elle n'a pas de réponse.

**Scène d'ouverture :** Un collègue lui parle de Paika. Elle est méfiante — "encore une plateforme qui ne sera jamais utilisée par les vrais bailleurs." Elle s'inscrit quand même, un soir, depuis son téléphone.

**Action montante :**
- Elle remplit le profil de son ONG en 3 étapes guidées : informations légales, données financières des 3 dernières années, upload des documents d'audit
- L'interface lui indique son Score de Transparence provisoire et ce qui manque pour monter d'un niveau
- Elle soumet sa demande de vérification. Un email lui confirme que son dossier sera traité en 5 jours ouvrés

**Moment clé :** J+4, notification : "Votre ONG est certifiée ✓ Vérifié — Score de Transparence : 78/100." Son profil est maintenant public et visible par les bailleurs institutionnels inscrits sur Paika.

**Résolution :** Trois semaines plus tard, elle reçoit un message via la messagerie interne Paika d'un chargé de programme GIZ qui a consulté son dossier. Elle n'a pas envoyé un seul document supplémentaire — tout était déjà là.

**Besoins révélés :** Formulaire multi-étapes ONG, upload documents sécurisé, calcul automatique Score de Transparence, notification de certification, profil public ONG, messagerie interne.

---

### Parcours 2 — Marc, Chargé de Programme GIZ *(chemin nominal bailleur)*

**Profil :** Marc, 41 ans, chargé de programme à la GIZ Antananarivo. Il gère un portefeuille de 2,3M€ à allouer à des ONGs locales. Son siège à Eschborn exige des preuves de due diligence avant chaque décaissement. Chaque appel à projets mobilise 3 semaines de vérification manuelle.

**Scène d'ouverture :** Son équipe passe 3 semaines à vérifier des dossiers ONG pour un appel à projets. La moitié des ONGs fournissent des documents incomplets ou non datés.

**Action montante :**
- Marc filtre les ONGs Paika par catégorie (éducation, Fianarantsoa) et Score de Transparence (> 70)
- Il consulte le profil d'une ONG certifiée : Score 78/100, documents financiers vérifiés, audit trail des 3 dernières années, badge "Vérifié" avec date de certification
- Il télécharge le rapport de vérification Paika — 2 pages, format standardisé, suffisant pour son dossier interne GIZ

**Moment clé :** Il shortliste 4 ONGs en 2 heures au lieu de 3 jours. Il envoie un message direct à Haingo via la messagerie Paika.

**Résolution :** Le décaissement est validé par son siège en 10 jours — un record. Il intègre Paika comme outil de pré-qualification obligatoire dans ses prochains appels. *Il devient prescripteur actif.*

**Besoins révélés :** Moteur de recherche/filtre ONGs (catégorie, zone géographique, score), affichage Score de Transparence, consultation dossier vérifié, export rapport PDF standardisé, messagerie interne bailleur↔ONG.

---

### Parcours 3 — Fanja, Opératrice Back-Office Paika *(parcours opérateur)*

**Profil :** Fanja, 28 ans, chargée de vérification chez Paika. Sans outil structuré, elle jongle entre emails, PDF et une feuille Excel pour suivre les demandes de certification.

**Scène d'ouverture :** Lundi matin, 12 demandes de vérification en attente dans sa boîte mail.

**Action montante :**
- Le pipeline back-office affiche les dossiers par ancienneté et statut : En attente → En cours → Validé / Refusé
- Elle ouvre le dossier d'Haingo : documents numérotés, checklist de vérification pré-remplie (statuts légaux, rapport financier, identité représentant)
- Elle valide point par point, ajoute une note interne sur un point ambigu
- Validation soumise → notification automatique à l'ONG + mise à jour Score de Transparence

**Moment clé :** Un dossier présente des chiffres incohérents entre deux documents. Elle le marque "En attente — complément requis" et déclenche un message automatique à l'ONG avec la liste précise des manques.

**Résolution :** Elle traite 8 dossiers dans la journée (vs 3 sans outil). *Le back-office est son levier de productivité.*

**Besoins révélés :** Pipeline de vérification (kanban), checklist de validation par dossier, notes internes, messagerie automatique vers ONG, déclenchement notifications et mise à jour Score.

---

### Parcours 4 — Rivo, Gestionnaire ONG *(cas limite — dossier incomplet + échec paiement)*

**Profil :** Rivo dirige une petite ONG de microfinance à Mahajanga. Premier contact avec Paika. Connexion internet instable, moins à l'aise avec les outils numériques.

**Scène d'ouverture :** Il remplit le formulaire depuis son téléphone. Sa connexion coupe à mi-chemin.

**Action montante :**
- À la reconnexion, le formulaire a conservé ses données (sauvegarde automatique par étapes)
- Il soumet le dossier sans le rapport d'audit — le système l'avertit avant soumission : "Document manquant : rapport financier. Votre Score de Transparence sera limité à 45/100 sans ce document."
- Il soumet quand même → statut "Incomplet — en attente de complément"

**Moment clé — échec paiement :** Il tente de payer l'abonnement mensuel via MVola. La transaction échoue (solde insuffisant). Le système ne suspend pas immédiatement : notification "Paiement échoué — 3 jours pour régulariser avant suspension."

**Résolution :** Il régularise à l'agence MVola le lendemain. Son dossier reprend son cours normal. Il uploade le rapport manquant depuis son téléphone en 2 minutes quand Fanja le demande.

**Besoins révélés :** Sauvegarde automatique formulaire multi-étapes, avertissement pré-soumission documents manquants, machine d'états transactions mobile money, période de grâce paiement échoué (3 jours), upload documents post-soumission, UX offline/timeout recovery.

---

### Résumé des capacités révélées

| Capacité | Parcours |
|---|---|
| Formulaire multi-étapes ONG avec sauvegarde automatique | P1, P4 |
| Calcul Score de Transparence temps réel + progression | P1, P4 |
| Pipeline back-office vérification (kanban + checklist) | P3 |
| Notifications automatiques (certification, paiement, complément) | P1, P3, P4 |
| Profil public ONG consultable par les bailleurs | P1, P2 |
| Moteur de recherche/filtre ONGs (catégorie, zone, score) | P2 |
| Export rapport de vérification PDF standardisé | P2 |
| Messagerie interne bailleur ↔ ONG | P1, P2, P3 |
| Machine d'états transactions mobile money + période de grâce | P4 |
| UX offline/timeout recovery | P4 |
| Audit trail financier immuable consultable | P2 |

---

## Exigences Domaine

### Conformité & Réglementaire

**BCRM / Banque Centrale (BFM) — Madagascar**

- Déterminer avant le lancement si Paika opère comme **agrégateur de paiement** (sous-traitant technique d'un EME agréé) ou comme **EME en propre** — les obligations réglementaires sont radicalement différentes
- Loi 2016-056 sur la Monnaie Électronique : toute plateforme facilitant des transactions doit être soit agréée, soit opérer sous l'égide d'un EME agréé (MVola, Orange, Airtel)
- Loi 2020-011 bancaire : les fonds collectés par des tiers doivent respecter les règles de ségrégation des fonds de la BFM

**FATF / LAB-LFT**

- Obligation de reporting sur les transactions suspectes (évaluation FATF Madagascar 2024 active)
- Audit trail des transactions conservé **minimum 5 ans**, accessible sur demande des autorités
- KYC obligatoire au-dessus du seuil défini par la BFM — vérification d'identité renforcée pour les ONGs et bailleurs

**Loi 2011-012 — ONG malgaches**

- Cadre légal obsolète et fragmenté : identifier les documents légaux officiellement requis pour une ONG enregistrée (statuts, récépissé de déclaration au Ministère de l'Intérieur)
- La certification Paika est un **label volontaire de bonne gouvernance**, non un agrément d'État — communication explicite sur cette distinction

**Protection des données**

- Pas de loi de protection des données équivalente au RGPD à Madagascar, mais conformité RGPD de facto pour toutes les données partagées avec des entités UE (bailleurs AFD, GIZ)
- Données financières ONG : sensibilité maximale — isolation stricte par RLS Supabase, accès journalisé

---

### Architecture de Sécurité

**Audit trail — immuabilité vérifiable**

- Contrainte `CHECK` PostgreSQL bloquant UPDATE + trigger `BEFORE UPDATE/DELETE` → `RAISE EXCEPTION` sur toutes les tables financières
- Backup quotidien chiffré avec hash SHA-256 publié — permet à un tiers de vérifier l'intégrité sans accès DB direct
- Logs d'accès aux données financières conservés séparément (qui a consulté quoi, quand)
- Accès admin Supabase limité par IP + MFA obligatoire

**Isolation des données (RLS)**

- Chaque ONG ne voit que ses propres données — matrice RLS testée avec vrais utilisateurs en staging avant tout déploiement prod
- Les bailleurs voient uniquement les données publiques d'une ONG
- Le back-office Paika opère sous rôle `service_role` distinct avec audit log sur toutes les actions

**Score de Transparence — gouvernance et intégrité**

- Algorithme de calcul versionné et immuable : le score à une date T est reproductible à tout moment
- Aucun opérateur Paika ne peut modifier manuellement un score — seul l'algorithme recalcule sur déclenchement documenté
- Critères de calcul publiés publiquement avant lancement (condition sine qua non de crédibilité)

---

### Contraintes techniques mobile money

- **Machine d'états transactions** : `pending` → `processing` → `completed` / `failed` / `cancelled` / `timeout`
- **Idempotence absolue** : vérification par `transaction_id` unique — un webhook rejoué ne crée jamais de doublon
- **Timeout** : absence de confirmation webhook après 30 minutes → état `timeout` → notification ops + intervention manuelle
- **Réconciliation quotidienne** automatique entre base Paika et relevés opérateurs
- **Taux de commission paramétrable dynamiquement** — pas hardcodé — pour absorber les changements réglementaires (dont projet de taxe 0,5% sur transactions MVola >150 000 Ar)

---

### Intégrations requises

| Système | Type | Priorité |
|---|---|---|
| MVola (Telma) | Webhook entrant + API initiation paiement | MVP |
| Orange Money Madagascar | Webhook entrant + API | Growth |
| Airtel Money Madagascar | Webhook entrant + API | Growth |
| Email transactionnel (SendGrid / Brevo) | Notifications, confirmations, alertes | MVP |
| Supabase Storage | Upload sécurisé documents PDF/images | MVP |
| Générateur PDF serveur-side | Rapports vérification, reçus fiscaux | MVP |

---

### Risques domaine et mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| BCRM exige agrément EME non anticipé | Bloquant légal au lancement | Clarifier le statut réglementaire avant tout décaissement réel — opérer en mode "sandbox" MVola en attendant l'agrément |
| Taxation mobile money adoptée (0,5%) | Réduction marges commissions | Taux de commission paramétrable dynamiquement, clause de révision dans les contrats API opérateurs |
| Faille RLS expose données ONG | Perte de confiance + risque légal | Tests RLS obligatoires en staging avec matrice multi-rôles avant chaque déploiement prod |
| Conflit d'intérêt Transparency Score | Perte de crédibilité bailleurs | Comité de gouvernance indépendant ou algorithme certifié tiers avant lancement public |
| Déconnexion webhook MVola prolongée | Transactions en attente indéterminée | File d'attente avec retry exponentiel + alerte ops après 30 min sans confirmation |

---

## Innovation & Patterns Inédits

### Zones d'innovation détectées

**1. Création de marché ex-nihilo**
Paika ne concurrence pas un acteur existant à Madagascar — le marché de la confiance institutionnelle entre ONG locales et bailleurs internationaux n'existe pas sous forme de plateforme. Paika crée l'infrastructure, il ne disrupe pas un marché existant.

**2. Combinaison inédite dans le contexte africain**
GuideStar (US) fait la certification. MVola fait le paiement. Aucune plateforme en Afrique sub-saharienne ne combine : certification légale + Score de Transparence auditable + passerelle mobile money régulée + interface institutionnelle bailleurs dans un seul produit. Cette combinaison est le différenciateur structurel.

**3. La donnée comportementale comme actif défendable**
Le vrai actif long terme n'est pas le badge "Vérifié" — c'est la base de données d'ONGs vérifiées avec leur historique de conformité, leurs transactions, leurs scores dans le temps. Cet historique est non-reproductible rétrospectivement. Plus Paika tourne, plus l'avantage concurrentiel croît de manière non-linéaire.

**4. Privatisation d'une infrastructure de confiance à externalités publiques**
L'État malgache ne remplit pas ce rôle. Les bailleurs internationaux ne peuvent pas se le déléguer entre eux. Paika occupe le vide institutionnel avec un modèle privé dont les externalités bénéficient à l'ensemble de l'écosystème NGO malgache.

---

### Contexte marché & paysage concurrentiel

**Concurrents directs (Madagascar) :** aucun — terrain vierge.

**Concurrents indirects globaux :**

| Acteur | Géographie | Ce qu'il fait | Ce qui manque |
|---|---|---|---|
| GuideStar / Candid | US | Certification ONG, 75 000+ certifiées, +62% dons | Non exporté en Afrique, pas de paiement intégré |
| M-Changa | Kenya | Crowdfunding ONGs | Pas de certification, pas d'audit trail institutionnel |
| Portails internes AFD/GIZ | Global | Due diligence propriétaire | Non-standardisé, non-interopérable, non-accessible aux ONGs |

**Fenêtre stratégique :** Segment vierge localement, modèle prouvé aux US, conditions réglementaires optimales (FATF 2024, Loi 2016-056 mature). Le premier acteur à signer avec un bailleur institutionnel devient le standard de facto.

---

### Approche de validation

| Innovation | Hypothèse | Méthode | Délai |
|---|---|---|---|
| ONGs acceptent de payer pour être vérifiées | La valeur "accès aux bailleurs" déclenche l'abonnement | Pilote 10 ONGs à tarif symbolique, mesurer conversion en payant | M+1 à M+3 |
| Bailleurs utilisent Paika comme pré-qualification | Le dossier Paika allège leur due diligence interne | Accord pilote 1 bailleur institutionnel, mesurer réduction temps de vérification | M+1 à M+6 |
| Score de Transparence perçu comme crédible | Le score influence réellement les décisions de financement | Interview post-financement 5 bailleurs : "Le score a-t-il joué un rôle ?" | M+6 |
| Données agrégées ont valeur marchande | Des bailleurs ou chercheurs paient pour la licence data | Lettre d'intention d'au moins 1 acteur avant de construire la feature | M+12 |

---

### Risques d'innovation et fallbacks

| Risque | Fallback |
|---|---|
| Aucun bailleur institutionnel ne s'engage en phase pilote | Commencer avec bailleurs privés/diaspora pour accumuler ONGs vérifiées et créer le signal social |
| Les ONGs refusent l'abonnement | Tier gratuit (profil basique sans badge) pour construire la base — monétiser uniquement les ONGs cherchant des financements institutionnels |
| BCRM refuse ou retarde l'agrément | Opérer en mode "vérification et information" sans toucher les flux financiers — démarrer par le Score et la certification, ajouter les paiements après agrément |
| Un acteur étatique ou international crée son propre registre | La taille critique (500+ ONGs, données historiques) rend la migration coûteuse — le moat data est la défense principale |

---

## Exigences SaaS B2B + Marketplace

### Vue d'ensemble

Paika est un SaaS B2B multi-tenant à deux faces (two-sided marketplace) avec des exigences supplémentaires liées à la certification et à la fiducie. Face ONG (`user_agent`) : producteurs de confiance. Face Bailleur (`user_partner`) : consommateurs de confiance. Opérateur Paika (back-office) : gestionnaire du marché.

### Modèle de multi-tenancy

Chaque ONG est un tenant isolé. Isolation garantie par RLS Supabase avec `ong_id` comme discriminant principal.

| Couche | Mécanisme | Portée |
|---|---|---|
| Données ONG | RLS `ong_id` = `auth.uid()` | Toutes tables liées à l'ONG |
| Documents uploadés | Supabase Storage bucket par ONG `/ongs/{ong_id}/` | Documents privés |
| Données publiques | Vue RLS autorisant lecture si `is_public = true` | Profil, Score, badge |
| Back-office | Rôle `service_role` avec audit log | Accès total journalisé |
| Bailleurs | Accès lecture seule sur données publiques ONG | Profil + Score + rapport |

### Matrice RBAC

| Permission | `user_agent` | `user_partner` | `back_office` |
|---|---|---|---|
| Créer/modifier profil ONG | ✅ sa propre ONG | ❌ | ✅ toutes |
| Voir données financières ONG | ✅ sa propre ONG | ✅ si publiques | ✅ toutes |
| Modifier Score de Transparence | ❌ | ❌ | ✅ algorithme seulement |
| Initier une transaction | ✅ reçoit | ✅ envoie | ❌ |
| Valider un dossier ONG | ❌ | ❌ | ✅ |
| Exporter rapport vérification PDF | ❌ | ✅ si ONG certifiée | ✅ |
| Envoyer message via messagerie | ✅ | ✅ | ✅ |
| Gérer abonnement | ✅ sa propre ONG | ❌ | ✅ toutes |

### Tiers d'abonnement

| Tier | Prix | Accès | Cible |
|---|---|---|---|
| **Gratuit** | 0 Ar | Profil basique, Score provisoire non certifié, pas de badge | ONGs débutantes |
| **Vérifié** | 20 000 Ar/mois | Badge "✓ Vérifié", Score certifié, dossier visible bailleurs, messagerie, rapport PDF | ONGs cherchant financements institutionnels |
| **Premium** *(post-MVP)* | Sur devis | API access, rapports d'impact automatiques, matching prioritaire | ONGs fort volume transactions |

Règles : période de grâce 3 jours sur paiement échoué — suspension badge uniquement, données internes préservées. Réactivation immédiate après régularisation.

### Dynamiques marketplace two-sided

**Cold start :** Recruter 10–20 ONGs pilotes gratuitement → activer 1 bailleur institutionnel pilote → signal social des premiers financements déclenche adoption organique.

**Effets de réseau :** Directs (plus d'ONGs vérifiées = plus de valeur par bailleur) + Indirects (plus de bailleurs = incitation ONG non-certifiée à s'abonner).

**Liquidité minimale :** 50 ONGs certifiées + 1 bailleur institutionnel actif = seuil de viabilité au lancement.

### Considérations d'implémentation

- Middleware routing : `auth` → `agent-only` ou `partner-only` (ordre obligatoire)
- Dashboards séparés : `/dashboard` pour `user_agent`, `/ongs` pour `user_partner`
- Listing ONGs : cache serveur 1h (données peu volatiles)
- Score de Transparence : recalcul déclenché sur événements uniquement (nouveau document, validation back-office) — pas de recalcul périodique
- Messagerie : temps réel via Supabase Realtime (WebSocket) — priorité MVP
- Back-office : accès direct pipeline vérification, middleware `back-office-only` dédié

---

## Scoping & Roadmap de Développement

### Stratégie MVP & Philosophie

**Approche MVP :** MVP "plateforme de confiance minimale" — prouver qu'un bailleur institutionnel peut évaluer une ONG certifiée Paika et déclencher un financement en confiance.

**Ressources requises MVP :** 1 lead dev fullstack (Nuxt/Supabase), 1 opérateur back-office (vérification manuelle), 1 accord bailleur pilote.

**Hypothèse centrale à valider :** Un dossier Paika allège suffisamment la due diligence d'un bailleur institutionnel pour qu'il l'utilise comme outil de pré-qualification.

### Phase 1 — MVP : Infrastructure de confiance minimale

**Parcours supportés :** P1 (ONG chemin nominal), P2 (Bailleur chemin nominal), P3 (Back-office), P4 (Cas limite paiement)

**Capacités MVP obligatoires :**

- Authentification + rôles (`user_agent`, `user_partner`, `back_office`)
- Formulaire multi-étapes création ONG avec sauvegarde automatique
- Upload sécurisé documents (Supabase Storage, bucket isolé par ONG)
- Calcul automatique Score de Transparence (algorithme v1, critères publiés publiquement)
- Pipeline de vérification back-office (kanban + checklist + messagerie vers ONG)
- Badge "✓ Vérifié" déclenché par validation back-office
- Profil public ONG consultable par les bailleurs
- Moteur de recherche/filtre ONGs (catégorie, zone géographique, Score)
- Audit trail immuable sur données financières (append-only + triggers PostgreSQL)
- Passerelle mobile money MVola (webhook entrant + machine d'états transactions)
- Abonnement "Vérifié" 20 000 Ar/mois avec gestion paiement
- Période de grâce 3 jours sur paiement échoué
- Export rapport de vérification PDF standardisé
- Notifications email transactionnelles (certification, paiement, complément requis)
- UX offline/timeout recovery (formulaires multi-étapes persistants)

**Délibérément hors MVP :** Messagerie temps réel bailleur↔ONG, Orange Money/Airtel, API publique.

### Phase 2 — Growth : Rétention et engagement

- Messagerie interne temps réel bailleur ↔ ONG (Supabase Realtime)
- Historique de dons et reçus fiscaux automatiques téléchargeables
- Intégration Orange Money + Airtel Money
- Algorithme de matching ONG ↔ bailleur avec notifications automatiques
- Rapports d'impact périodiques générés automatiquement pour les ONGs
- API publique v1 (accès lecture ONGs certifiées pour intégration outils bailleurs)

### Phase 3 — Vision : Moat data et expansion

- Licence data agrégée pour bailleurs institutionnels et organisations de recherche
- Application mobile offline-first pour gestionnaires ONG terrain
- Expansion régionale Afrique de l'Est (Kenya, Tanzanie)
- Prédictions ML : détection fraude, scoring comportemental, recommandations
- Certification inter-plateformes (interopérabilité avec autres registres africains)

### Stratégie de mitigation des risques

**Risque technique — audit trail :** Concevoir append-only dès le MVP avec triggers PostgreSQL + backup signé quotidien. Non-négociable pour la crédibilité bailleurs.

**Risque marché — deadlock two-sided :** Lancer avec 10–20 ONGs gratuites avant d'activer les bailleurs. Le signal social des premiers financements déclenche l'adoption organique.

**Risque ressources :** La vérification back-office est manuelle en MVP. 1 opérateur peut traiter 50 ONGs/mois — le seuil de viabilité est atteignable sans automatisation initiale.

---

## Exigences Fonctionnelles

### Gestion de compte & Authentification

- FR1 : Un visiteur peut créer un compte avec le rôle `user_agent` (gestionnaire ONG) ou `user_partner` (bailleur/donateur)
- FR2 : Un utilisateur peut s'authentifier via email/mot de passe
- FR3 : Un utilisateur peut réinitialiser son mot de passe via un lien envoyé par email
- FR4 : Un utilisateur peut mettre à jour ses informations de profil compte (email, mot de passe)
- FR5 : Un utilisateur peut se déconnecter de toutes ses sessions actives

### Gestion du profil ONG

- FR6 : Un `user_agent` peut créer un profil ONG via un formulaire multi-étapes avec sauvegarde automatique à chaque étape
- FR7 : Un `user_agent` peut uploader des documents justificatifs (statuts, récépissé, rapports financiers) dans le profil de son ONG
- FR8 : Un `user_agent` peut modifier les informations de son profil ONG à tout moment
- FR9 : Un `user_agent` peut configurer quelles informations de son profil sont visibles publiquement
- FR10 : Un `user_agent` peut consulter l'état d'avancement de son dossier de vérification en temps réel
- FR11 : Un `user_agent` peut télécharger un récapitulatif de son dossier ONG
- FR12 : Un `user_agent` peut reprendre un formulaire multi-étapes interrompu depuis l'étape où il s'est arrêté

### Certification & Vérification (Back-office)

- FR13 : Un `back_office` peut consulter la liste de tous les dossiers ONG en attente de vérification dans un pipeline kanban
- FR14 : Un `back_office` peut accéder au détail complet d'un dossier ONG (documents, informations, historique)
- FR15 : Un `back_office` peut valider ou rejeter un dossier ONG avec commentaire obligatoire
- FR16 : Un `back_office` peut demander des compléments de documents à une ONG via messagerie intégrée
- FR17 : Un `back_office` peut attribuer le badge "✓ Vérifié" à une ONG après validation complète
- FR18 : Un `back_office` peut suspendre ou révoquer la certification d'une ONG avec motif tracé
- FR19 : Un `back_office` peut consulter l'historique complet des actions sur chaque dossier ONG

### Score de Transparence

- FR20 : Le système calcule automatiquement un Score de Transparence pour chaque ONG selon des critères publiquement documentés
- FR21 : Le Score de Transparence est recalculé automatiquement lors d'événements déclencheurs (upload nouveau document, validation back-office, mise à jour profil)
- FR22 : Un `user_agent` peut consulter le détail du Score de son ONG et les critères non atteints
- FR23 : Un `user_partner` et tout visiteur peuvent consulter le Score de Transparence d'une ONG certifiée
- FR24 : Un `back_office` peut ajuster manuellement les paramètres de l'algorithme de calcul du Score avec traçabilité complète

### Découverte & Recherche

- FR25 : Un `user_partner` peut rechercher des ONGs par nom, catégorie d'activité, zone géographique et niveau de Score
- FR26 : Un `user_partner` peut consulter le profil public complet d'une ONG certifiée
- FR27 : Un `user_partner` peut télécharger un rapport de vérification PDF standardisé pour une ONG certifiée
- FR28 : Un visiteur non authentifié peut consulter la liste publique des ONGs certifiées
- FR29 : Un `user_partner` peut sauvegarder une liste d'ONGs favorites pour suivi
- FR30 : Un `user_partner` peut voir l'historique des financements reçus par une ONG (montants agrégés, anonymisés)
- FR31 : Un `user_agent` peut voir quels bailleurs ont consulté son profil (vue d'intérêt)

### Abonnement & Paiements

- FR32 : Un `user_agent` peut souscrire à l'abonnement "Vérifié" (20 000 Ar/mois) via mobile money (MVola en MVP)
- FR33 : Un `user_agent` peut consulter l'état de son abonnement (actif, suspendu, date de renouvellement)
- FR34 : Le système suspend automatiquement le badge "Vérifié" après échec de paiement, avec période de grâce de 3 jours
- FR35 : Le système réactive automatiquement le badge dès régularisation du paiement
- FR36 : Un `user_partner` peut initier un virement vers une ONG via mobile money avec sélection du montant et du projet
- FR37 : Un `user_agent` peut consulter l'historique complet des transactions reçues sur son ONG

### Audit Trail & Conformité

- FR38 : Le système enregistre chaque transaction financière dans une table append-only immuable (pas de UPDATE ni DELETE possible)
- FR39 : Le système journalise chaque action back-office (validation, rejet, modification Score) avec horodatage et identifiant opérateur
- FR40 : Un `back_office` peut exporter un rapport d'audit complet pour une période donnée
- FR41 : Le système génère automatiquement un hash cryptographique quotidien de l'audit trail pour vérification d'intégrité
- FR42 : Un `user_partner` peut consulter la preuve d'immuabilité d'une transaction (hash + horodatage)

### Communication & Notifications

- FR43 : Le système envoie des notifications email transactionnelles (certification accordée, paiement reçu, complément de documents requis, suspension badge)
- FR44 : Un `back_office` peut envoyer un message à une ONG dans le cadre du processus de vérification
- FR45 : Un `user_agent` peut répondre aux messages du back-office directement depuis son tableau de bord
- FR46 : Un `user_agent` reçoit une notification en cas d'expiration imminente de son abonnement (7 jours avant)

### Administration & Reporting

- FR47 : Un `back_office` peut consulter un tableau de bord global (ONGs certifiées, en attente, volume transactions, Score moyen)
- FR48 : Un `back_office` peut générer des rapports agrégés anonymisés sur l'activité de la plateforme
- FR49 : Un `back_office` peut gérer les paramètres de la plateforme (critères Score, tarifs abonnement, messages types)
- FR50 : Le système conserve un log d'accès pour chaque consultation de profil ONG par un bailleur (date, ONG consultée, identifiant bailleur pseudonymisé)
- FR51 : Un `back_office` peut exporter la liste complète des ONGs certifiées avec leurs métadonnées pour reporting externe

---

## Exigences Non-Fonctionnelles

### Performance

- NFR1 : Les pages publiques (liste ONGs, profil ONG) se chargent en moins de 3 secondes sur une connexion 3G malgache (simulation 1Mbps)
- NFR2 : Les actions utilisateur critiques (soumission formulaire, déclenchement paiement, recalcul Score) reçoivent un accusé de réception en moins de 500ms, même si le traitement continue en arrière-plan
- NFR3 : Le traitement d'un webhook mobile money (MVola/Orange/Airtel) se finalise en moins de 10 secondes depuis réception
- NFR4 : Le moteur de recherche d'ONGs retourne des résultats en moins de 2 secondes pour un catalogue de 1 000 ONGs
- NFR5 : La génération d'un rapport PDF de vérification se complète en moins de 30 secondes

### Sécurité

- NFR6 : Toutes les données en transit sont chiffrées via TLS 1.2 minimum
- NFR7 : Toutes les données sensibles au repos (documents ONG, données financières) sont chiffrées via AES-256
- NFR8 : L'accès aux données est contrôlé par RLS Supabase — aucune donnée ONG n'est accessible à un autre tenant par requête directe
- NFR9 : L'audit trail financier est immuable : les triggers PostgreSQL bloquent tout UPDATE et DELETE sur la table de transactions
- NFR10 : Un hash cryptographique (SHA-256) de l'audit trail est généré et stocké quotidiennement hors de la base principale pour détection de falsification
- NFR11 : Les tokens d'authentification expirent après 1 heure d'inactivité — renouvellement automatique silencieux si la session est active
- NFR12 : Les tentatives de connexion échouées déclenchent un rate-limiting après 5 essais (blocage temporaire 15 minutes)
- NFR13 : Les clés API et secrets d'intégration (mobile money, email) ne sont jamais exposés côté client

### Scalabilité

- NFR14 : L'architecture supporte 10x la charge initiale sans modification structurelle (de 100 à 1 000 ONGs actives)
- NFR15 : Le modèle multi-tenant RLS supporte 500 ONGs simultanées sans dégradation de performance mesurable (< 20% d'augmentation des temps de réponse)
- NFR16 : Le système de webhooks mobile money supporte 100 transactions simultanées sans perte ni duplication

### Fiabilité & Disponibilité

- NFR17 : La plateforme est disponible 99,5% du temps (hors maintenances planifiées annoncées 48h à l'avance) — soit moins de 44h de downtime par an
- NFR18 : Une maintenance planifiée n'affecte pas les webhooks entrants mobile money — les transactions en cours ne sont pas perdues
- NFR19 : Les formulaires multi-étapes persistent leur état localement — une perte de connexion ne fait pas perdre les données saisies
- NFR20 : En cas d'échec d'un webhook mobile money, le système effectue 3 tentatives automatiques avec backoff exponentiel avant d'alerter le back-office

### Intégration

- NFR21 : Les intégrations mobile money (MVola MVP, Orange/Airtel phase 2) respectent les spécifications API officielles des opérateurs sans modification de l'implémentation core
- NFR22 : L'intégration email transactionnel garantit une délivrabilité > 95% sur les adresses professionnelles (domaines institutionnels AFD, GIZ, UE)
- NFR23 : Les rapports PDF exportés sont conformes au standard ISO 32000 et s'ouvrent sans plugin dans les navigateurs modernes
- NFR24 : L'API publique (phase 2) expose des endpoints REST versionnés (v1, v2) avec rétrocompatibilité garantie sur 12 mois

### Connectivité & Résilience (contexte Madagascar)

- NFR25 : L'interface utilisateur reste fonctionnelle en mode dégradé (lecture des données cachées) lors d'une interruption de connexion jusqu'à 60 secondes
- NFR26 : Les images et documents lourds sont chargés en lazy loading — la page principale reste interactive même si les assets ne sont pas encore chargés
- NFR27 : Les timeouts de requête déclenchent un message d'erreur explicite avec option de réessai — jamais une page blanche ou une erreur technique brute
- NFR28 : Les uploads de documents supportent la reprise après interruption (chunked upload) pour les fichiers > 1 Mo
