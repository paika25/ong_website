---
stepsCompleted: [1, 2, 3, 4, 5, 6]
documentsInventoried:
  prd: '_bmad-output/planning-artifacts/prd.md'
  architecture: '_bmad-output/planning-artifacts/architecture.md'
  epics: '_bmad-output/planning-artifacts/epics.md'
  ux: '_bmad-output/planning-artifacts/ux-design-specification.md'
---

# Implementation Readiness Assessment Report

**Date:** 2026-05-02
**Project:** ong_website (Paika ONG Platform)

---

## Analyse PRD

### Exigences Fonctionnelles (51 FRs)

**Auth & Compte (FR1–FR5)**
FR1 : Inscription visiteur avec rôle `user_agent` ou `user_partner`
FR2 : Authentification email/mot de passe
FR3 : Réinitialisation mot de passe par email
FR4 : Mise à jour profil compte (email, mot de passe)
FR5 : Déconnexion de toutes les sessions actives

**Profil ONG (FR6–FR12)**
FR6 : Création profil ONG via formulaire multi-étapes avec sauvegarde automatique
FR7 : Upload documents justificatifs (statuts, récépissé, rapports financiers)
FR8 : Modification profil ONG à tout moment
FR9 : Configuration visibilité publique par section
FR10 : Consultation état d'avancement dossier de vérification en temps réel
FR11 : Téléchargement récapitulatif dossier ONG
FR12 : Reprise formulaire multi-étapes interrompu depuis l'étape d'arrêt

**Certification & Vérification Back-office (FR13–FR19)**
FR13 : Liste dossiers ONG en attente dans pipeline kanban
FR14 : Détail complet dossier ONG (documents, informations, historique)
FR15 : Validation ou rejet dossier avec commentaire obligatoire
FR16 : Demande compléments documents via messagerie intégrée
FR17 : Attribution badge "✓ Vérifié" après validation
FR18 : Suspension/révocation certification avec motif tracé
FR19 : Historique complet des actions sur chaque dossier

**Score de Transparence (FR20–FR24)**
FR20 : Calcul automatique Score de Transparence selon critères publics
FR21 : Recalcul automatique sur événements déclencheurs (upload, validation, mise à jour profil)
FR22 : Détail Score et critères non atteints pour `user_agent`
FR23 : Consultation Score par `user_partner` et visiteurs
FR24 : Ajustement paramètres algorithme par `back_office` avec traçabilité complète

**Découverte & Recherche (FR25–FR31)**
FR25 : Recherche ONGs par nom, catégorie, zone géographique, niveau de Score
FR26 : Consultation profil public complet ONG certifiée
FR27 : Téléchargement rapport vérification PDF standardisé
FR28 : Consultation liste publique ONGs certifiées (visiteur non authentifié)
FR29 : Sauvegarde liste ONGs favorites
FR30 : Historique financements reçus ONG (montants agrégés, anonymisés)
FR31 : Vue d'intérêt : bailleurs ayant consulté le profil ONG

**Abonnement & Paiements (FR32–FR37)**
FR32 : Souscription abonnement "Vérifié" 20 000 Ar/mois via MVola
FR33 : Consultation état abonnement (actif, suspendu, date renouvellement)
FR34 : Suspension automatique badge après échec paiement (période grâce 3 jours)
FR35 : Réactivation automatique badge dès régularisation paiement
FR36 : Initiation virement `user_partner` → ONG via mobile money
FR37 : Historique complet transactions reçues pour `user_agent`

**Audit Trail & Conformité (FR38–FR42)**
FR38 : Table append-only immuable (pas de UPDATE/DELETE) sur transactions
FR39 : Journalisation actions back-office avec horodatage et identifiant opérateur
FR40 : Export rapport audit complet pour une période donnée
FR41 : Hash cryptographique quotidien de l'audit trail pour vérification d'intégrité
FR42 : Preuve d'immuabilité d'une transaction (hash + horodatage) consultable

**Communication & Notifications (FR43–FR46)**
FR43 : Notifications email transactionnelles (certification, paiement, complément requis, suspension badge)
FR44 : Messagerie back_office → ONG dans le cadre de la vérification
FR45 : Réponse `user_agent` aux messages back-office depuis son tableau de bord
FR46 : Notification expiration imminente abonnement 7 jours avant

**Administration & Reporting (FR47–FR51)**
FR47 : Tableau de bord global back_office (ONGs certifiées, en attente, volume transactions, Score moyen)
FR48 : Rapports agrégés anonymisés sur l'activité de la plateforme
FR49 : Gestion paramètres plateforme (critères Score, tarifs, messages types)
FR50 : Log d'accès consultations profil ONG par bailleur (date, ONG, identifiant bailleur pseudonymisé)
FR51 : Export liste ONGs certifiées avec métadonnées pour reporting externe

**Total FRs : 51**

---

### Exigences Non-Fonctionnelles (28 NFRs)

**Performance (NFR1–NFR5)**
NFR1 : Pages publiques < 3s sur 3G malgache (1Mbps)
NFR2 : Accusé de réception actions critiques < 500ms
NFR3 : Traitement webhook mobile money < 10s depuis réception
NFR4 : Moteur de recherche ONGs < 2s pour 1 000 ONGs
NFR5 : Génération rapport PDF < 30s

**Sécurité (NFR6–NFR13)**
NFR6 : Données en transit chiffrées TLS 1.2 minimum
NFR7 : Données sensibles au repos chiffrées AES-256
NFR8 : RLS Supabase — isolation multi-tenant stricte
NFR9 : Audit trail immuable — triggers PostgreSQL bloquant UPDATE/DELETE
NFR10 : Hash SHA-256 quotidien de l'audit trail stocké hors base principale
NFR11 : Tokens auth expirent après 1h d'inactivité — renouvellement silencieux si session active
NFR12 : Rate-limiting après 5 essais de connexion (blocage 15 min)
NFR13 : Clés API jamais exposées côté client

**Scalabilité (NFR14–NFR16)**
NFR14 : Architecture supporte 10x la charge initiale sans modification structurelle
NFR15 : RLS supporte 500 ONGs simultanées (< 20% dégradation)
NFR16 : Webhooks mobile money supportent 100 transactions simultanées sans perte ni doublon

**Fiabilité & Disponibilité (NFR17–NFR20)**
NFR17 : Uptime ≥ 99,5% (hors maintenance planifiée)
NFR18 : Maintenance planifiée sans impact sur webhooks entrants
NFR19 : Formulaires multi-étapes persistent localement (perte connexion = pas de perte de données)
NFR20 : 3 tentatives backoff exponentiel sur échec webhook avant alerte back-office

**Intégration (NFR21–NFR24)**
NFR21 : Intégrations mobile money conformes aux specs API opérateurs
NFR22 : Délivrabilité email > 95% sur domaines institutionnels
NFR23 : PDFs conformes ISO 32000
NFR24 : API publique (phase 2) versionnée avec rétrocompatibilité 12 mois

**Connectivité & Résilience Madagascar (NFR25–NFR28)**
NFR25 : Mode dégradé fonctionnel jusqu'à 60s d'interruption connexion
NFR26 : Lazy loading images/documents — page reste interactive
NFR27 : Timeouts → message explicite avec option réessai (jamais page blanche)
NFR28 : Chunked upload avec reprise pour fichiers > 1 Mo

**Total NFRs : 28**

---

### Exigences Additionnelles

**Conformité réglementaire :**
- BCRM : déterminer statut agrégateur de paiement vs EME avant lancement
- FATF : audit trail conservé minimum 5 ans, accessible sur demande
- KYC obligatoire au-dessus du seuil BFM
- RGPD de facto pour données partagées avec entités UE

**Contraintes techniques mobile money :**
- Machine d'états : `pending → processing → completed/failed/cancelled/timeout`
- Idempotence absolue par `transaction_id` unique
- Timeout 30 min sans confirmation webhook → état `timeout` + alerte ops
- Réconciliation quotidienne automatique base Paika / relevés opérateurs
- Taux de commission paramétrable dynamiquement (non hardcodé)

**Intégrations requises (MVP) :** MVola, Brevo/SendGrid, Supabase Storage, Générateur PDF serveur-side

### Évaluation complétude PRD

Le PRD est **complet et précis**. Les 51 FRs et 28 NFRs sont clairement énoncés, numérotés et catégorisés. Les parcours utilisateurs illustrent les cas limites. Les contraintes techniques et réglementaires sont documentées. Les hypothèses critiques sont identifiées et tracées.

---

## Validation de Couverture des Epics

### Matrice de Couverture FR

| FR | Texte (résumé) | Epic / Story | Statut |
|---|---|---|---|
| FR1 | Inscription visiteur (rôle user_agent / user_partner) | Epic 1 — Story 1.7 | ✓ Couvert |
| FR2 | Authentification email/mot de passe | Epic 1 — Story 1.8 | ✓ Couvert |
| FR3 | Réinitialisation mot de passe par email | Epic 1 — Story 1.9 | ✓ Couvert |
| FR4 | Mise à jour profil compte | Epic 1 — Story 1.10 | ✓ Couvert |
| FR5 | Déconnexion toutes sessions actives | Epic 1 — Story 1.10 | ✓ Couvert |
| FR6 | Création profil ONG multi-étapes + sauvegarde auto | Epic 2 — Stories 2.3, 2.4 | ✓ Couvert |
| FR7 | Upload documents justificatifs | Epic 2 — Stories 2.1, 2.3 | ✓ Couvert |
| FR8 | Modification profil ONG | Epic 2 — Story 2.5 | ✓ Couvert |
| FR9 | Configuration visibilité publique | Epic 2 — Story 2.5 | ✓ Couvert |
| FR10 | État avancement dossier de vérification en temps réel | Epic 2 — Story 2.6 | ✓ Couvert |
| FR11 | Téléchargement récapitulatif dossier ONG | Epic 2 — Story 2.6 | ✓ Couvert |
| FR12 | Reprise formulaire interrompu depuis étape d'arrêt | Epic 2 — Stories 2.2, 2.4 | ✓ Couvert |
| FR13 | Liste dossiers ONG dans pipeline kanban | Epic 3 — Story 3.2 | ✓ Couvert |
| FR14 | Détail complet dossier ONG (docs, info, historique) | Epic 3 — Story 3.2 | ✓ Couvert |
| FR15 | Validation/rejet dossier avec commentaire obligatoire | Epic 3 — Story 3.3 | ✓ Couvert |
| FR16 | Demande compléments documents via messagerie | Epic 3 — Story 3.3 | ✓ Couvert |
| FR17 | Attribution badge "✓ Vérifié" | Epic 3 — Story 3.3 | ✓ Couvert |
| FR18 | Suspension/révocation certification avec motif | Epic 3 — Story 3.3 | ✓ Couvert |
| FR19 | Historique complet actions sur dossier | Epic 3 — Story 3.4 | ✓ Couvert |
| FR20 | Calcul automatique Score de Transparence | Epic 4 — Story 4.1 | ✓ Couvert |
| FR21 | Recalcul sur événements déclencheurs | Epic 4 — Story 4.1 | ✓ Couvert |
| FR22 | Détail Score et critères non atteints (user_agent) | Epic 4 — Story 4.2 | ✓ Couvert |
| FR23 | Consultation Score par user_partner et visiteurs | Epic 4 — Story 4.2 | ✓ Couvert |
| FR24 | Ajustement paramètres algorithme (back_office) | Epic 4 — Story 4.3 | ✓ Couvert |
| FR25 | Recherche ONGs par nom/catégorie/zone/score | Epic 6 — Story 6.2 | ✓ Couvert |
| FR26 | Consultation profil public ONG certifiée | Epic 6 — Story 6.3 | ✓ Couvert |
| FR27 | Téléchargement rapport vérification PDF | Epic 6 — Story 6.3 | ✓ Couvert |
| FR28 | Liste publique ONGs certifiées (visiteur) | Epic 6 — Story 6.2 | ✓ Couvert |
| FR29 | Sauvegarde liste ONGs favorites | Epic 6 — Story 6.4 | ✓ Couvert |
| FR30 | Historique financements reçus (agrégés, anonymisés) | Epic 6 — Story 6.3 | ✓ Couvert |
| FR31 | Vue d'intérêt (bailleurs ayant consulté le profil) | Epic 6 — Story 6.4 | ✓ Couvert |
| FR32 | Souscription abonnement "Vérifié" via Vanilla Pay | Epic 5 — Story 5.2 | ✓ Couvert |
| FR33 | Consultation état abonnement (actif, suspendu, date) | Epic 5 — Story 5.2 | ✓ Couvert |
| FR34 | Suspension automatique badge (grâce 3 jours) | Epic 5 — Story 5.2 | ✓ Couvert |
| FR35 | Réactivation automatique badge dès régularisation | Epic 5 — Story 5.2 | ✓ Couvert |
| FR36 | Virement user_partner → ONG via Vanilla Pay | Epic 7 — Story 7.1 | ✓ Couvert |
| FR37 | Historique transactions reçues (user_agent) | Epic 7 — Story 7.1 | ✓ Couvert |
| FR38 | Table append-only immuable (no UPDATE/DELETE) | Epic 5 — Story 5.1 | ✓ Couvert |
| FR39 | Journalisation actions back-office avec horodatage | Epic 3 — Stories 3.3, 3.4 | ✓ Couvert |
| FR40 | Export rapport audit pour période donnée | Epic 7 — Story 7.4 | ✓ Couvert |
| FR41 | Hash SHA-256 quotidien de l'audit trail | Epic 7 — Story 7.2 | ✓ Couvert |
| FR42 | Preuve d'immuabilité transaction (hash + horodatage) | Epic 7 — Story 7.2 | ✓ Couvert |
| FR43 | Notifications email transactionnelles | Epic 3, 5, 6 — Stories 3.3, 5.2, 5.3, 6.4 | ✓ Couvert |
| FR44 | Messagerie back_office → ONG (vérification) | Epic 3 — Story 3.5 | ✓ Couvert |
| FR45 | Réponse user_agent aux messages back-office | Epic 3 — Story 3.5 | ✓ Couvert |
| FR46 | Notification expiration abonnement 7j avant | Epic 5 — Story 5.3 | ✓ Couvert |
| FR47 | Dashboard global back_office (métriques live) | Epic 7 — Story 7.3 | ✓ Couvert |
| FR48 | Rapports agrégés anonymisés activité plateforme | Epic 7 — Story 7.4 | ✓ Couvert |
| FR49 | Gestion paramètres plateforme (Score, tarifs, messages) | Epic 7 — Story 7.4 | ✓ Couvert |
| FR50 | Log d'accès consultations profil ONG par bailleur | Epic 6/7 — Stories 6.3, 7.4 | ✓ Couvert |
| FR51 | Export liste ONGs certifiées avec métadonnées | Epic 7 — Story 7.4 | ✓ Couvert |

### Exigences Manquantes

Aucun FR du PRD n'est absent des epics. Couverture : **51/51 (100%)**.

### Lacunes mineures identifiées

Trois contraintes techniques du PRD ne figurent pas explicitement dans les ACs de stories :

1. **État `timeout` machine d'états transactions** — Le PRD spécifie "absence de confirmation webhook après 30 min → état `timeout` + alerte ops + intervention manuelle". La Story 5.2 couvre les échecs webhook (3 tentatives + `ops_alerts`) mais ne nomme pas explicitement l'état `timeout` ni le délai de 30 min.

2. **Réconciliation quotidienne mobile money** — Le PRD exige "réconciliation automatique quotidienne entre base Paika et relevés opérateurs". Aucune story ne porte ce mécanisme explicitement.

3. **KYC obligatoire au seuil BFM** — Exigence de conformité FATF (non formalisée en FR) sans story dédiée. À traiter lors de la mise en conformité réglementaire avant lancement.

### Statistiques de couverture

- Total FRs PRD : 51
- FRs couverts dans les epics : 51
- Couverture : **100%**
- Lacunes bloquantes : 0
- Points de vigilance mineurs : 3

---

## Évaluation Alignement UX

### Statut du Document UX

**Trouvé** — `ux-design-specification.md` (60 Ko, 14 étapes complétées, 2026-05-01). Document complet, basé sur le PRD et `project-context.md`.

### UX ↔ PRD : Alignement

| Élément UX | Couverture PRD | Statut |
|---|---|---|
| Formulaire multi-étapes ONG (5 étapes) | FR6, FR12 | ✓ Aligné |
| Score de Transparence progressif + widget | FR20–FR23 | ✓ Aligné |
| Badge "✓ Vérifié" (4 états) | FR17, FR34, FR35 | ✓ Aligné |
| Pipeline Kanban back-office | FR13–FR19 | ✓ Aligné |
| Profil public ONG (hero section) | FR26, FR27 | ✓ Aligné |
| Filtres marketplace URL-persistent | FR25, FR28 | ✓ Aligné |
| États transaction mobile money | FR32–FR37 | ✓ Aligné |
| Messagerie BO↔ONG | FR44, FR45 | ✓ Aligné |
| Notifications toast + email | FR43, FR46 | ✓ Aligné |
| Période de grâce paiement (amber, non rouge) | FR34 | ✓ Aligné |
| Web desktop uniquement | Non explicite PRD | ⚠ Décision UX (non contradictoire) |

### UX ↔ Architecture : Alignement

| Décision UX | Décision Architecture | Statut |
|---|---|---|
| VueUse `useStorage` + `useOnline()` pour formulaires | Documenté Architecture (NFR19) | ✓ Aligné |
| SSR Nuxt sur pages publiques | Documenté Architecture (NFR1) | ✓ Aligné |
| Playwright + Edge Function pour PDF | Documenté Architecture (NFR5) | ✓ Aligné |
| Skeleton loaders (pas spinners) | Documenté Architecture — 4 états obligatoires | ✓ Aligné |
| Optimistic UI < 500ms | Documenté Architecture (NFR2) | ✓ Aligné |
| Feature flags `NUXT_PUBLIC_FEATURE_*` | Documenté Architecture | ✓ Aligné |
| `StepperForm`, `BadgeVerifie`, `PipelineKanban`, `ScoreTransparenceWidget` | Listés dans Architecture sous "Composants Custom" | ✓ Aligné |

### Avertissements

**Avertissement 1 — Incohérence interne UX : fréquence de sauvegarde automatique**
La spec UX indique "sauvegarde silencieuse à chaque champ (debounce 2s)" mais la Story 2.2 retient "toutes les 30 secondes et à chaque navigation entre étapes". Ces deux comportements sont différents. À clarifier avant l'implémentation de Story 2.2 pour éviter une surcharge de requêtes Supabase.

**Avertissement 2 — Mention mobile dans un doc "desktop uniquement"**
La spec UX déclare "web desktop uniquement — aucun responsive mobile" mais mentionne "sur mobile" à plusieurs reprises dans les patterns d'interaction. Ce n'est pas bloquant mais peut créer de la confusion pendant le développement.

**Avertissement 3 — État `cancelled` absent de l'UX**
L'architecture définit la machine d'états : `pending → processing → completed / failed / cancelled / timeout`. L'UX spec mentionne uniquement `pending → processing → completed/failed/timeout` (sans `cancelled`). Le composant `TransactionStatusBadge` (UX-DR7) ne prévoit que 4 états. À préciser si `cancelled` nécessite un 5e état visuel.

### Conclusion Alignement UX

L'alignement UX ↔ PRD et UX ↔ Architecture est **solide**. Aucun écart bloquant. Les 3 avertissements sont des points de précision à résoudre avant les stories impactées.

---

## Revue Qualité des Epics

### Checklist par Epic

| Epic | Valeur utilisateur | Indépendance | Stories dimensionnées | Pas de dépendance future | Critères testables |
|---|---|---|---|---|---|
| Epic 1 — Fondation & Auth | ⚠ Partiel (stories 1.1–1.6 sont techniques) | ✓ Autonome | ✓ | ✓ | ✓ |
| Epic 2 — Profil ONG | ✓ | ✓ (dépend E1) | ✓ | 🔴 Story 2.6 → pdf.service.ts d'Epic 6 | ✓ |
| Epic 3 — Vérification BO | ✓ | ✓ (dépend E1+E2) | ✓ | ✓ | ✓ |
| Epic 4 — Score | ✓ | ✓ (dépend E1+E2+E3) | ✓ | ✓ | ✓ |
| Epic 5 — Abonnement | ✓ | ✓ (dépend E1+E3) | ✓ | ✓ | ✓ |
| Epic 6 — Marketplace | ✓ | ✓ (dépend E4) | ✓ | ✓ | ✓ |
| Epic 7 — Virements & Analytics | ✓ | ✓ (dépend E5+E6) | ✓ | ✓ | ✓ |

---

### 🔴 Violation Critique

**Story 2.6 — Dépendance forward sur `pdf.service.ts` (Epic 6, Story 6.1)**

La Story 2.6 inclut : *"un CTA 'Télécharger le récapitulatif' génère un PDF du dossier via `pdf.service.ts`"*. Or `pdf.service.ts` n'est créé qu'en **Epic 6 Story 6.1**, qui est implémentée bien après Epic 2.

**Impact :** Story 2.6 ne peut pas être complétée sans Epic 6. Ceci brise l'indépendance d'Epic 2.

**Recommandation :** Deux options —
- Option A : Déplacer la création du stub de `pdf.service.ts` en Epic 2 Story 2.1 (infrastructure feature) — le PDF du récapitulatif ONG utilise le même service que les rapports bailleur.
- Option B : Remplacer le PDF de récapitulatif Story 2.6 par une page HTML imprimable en Epic 2, et réserver le PDF généré par Playwright pour Epic 6.

Option A est recommandée : cohérence technique, un seul service PDF dans le projet.

---

### 🟠 Problèmes Majeurs

**Problème 1 — Story 5.1 modifie rétroactivement `audit.service.ts` d'Epic 3**

Story 5.1 "remplace" l'implémentation simple d'Epic 3 (`insertAuditEntry()` INSERT simple) par la chaîne Merkle SHA-256. En théorie, les données déjà insérées en Epic 3 (actions back-office) n'auront pas de hachage Merkle — elles sont annotées `"pre-merkle": true`.

Ce comportement est documenté dans Epic 5 mais aucun test de régression des fonctionnalités d'Epic 3 n'est requis dans les ACs de Story 5.1.

**Recommandation :** Ajouter à Story 5.1 : *"Les tests E2E d'Epic 3 (vérification, validation, historique) passent sans modification après le déploiement de Story 5.1."*

**Problème 2 — Story 1.2 crée toutes les tables en amont**

La Story 1.2 crée `financial_transactions`, `algorithm_versions`, `score_disputes`, `ops_alerts`, vues matérialisées Score — toutes dès Epic 1, bien avant d'en avoir besoin (Epic 4 pour Score, Epic 5 pour transactions).

**Justification valide :** Pour les contraintes FATF (audit trail immuable avec triggers dès le premier jour), créer `financial_transactions` tôt est défendable. Acceptable comme décision architecturale documentée.

**Recommandation :** Documenter explicitement dans Story 1.2 pourquoi les tables financières et d'audit sont créées en Epic 1 (raison compliance FATF/immuabilité). Cela évite la confusion pendant l'implémentation.

**Problème 3 — Recalcul de masse de tous les scores en Story 4.3**

Story 4.3 : *"un ajustement des paramètres déclenche un recalcul asynchrone de tous les scores des ONGs actives."* Ce cas de recalcul de masse (potentiellement 500+ ONGs) n'a pas de NFR associé ni de limite de temps. Sur 500 ONGs, la charge peut être significative.

**Recommandation :** Ajouter un AC précisant le mécanisme (job pg_cron ou Supabase Edge Function batch) et un délai maximum acceptable pour le recalcul complet.

---

### 🟡 Points Mineurs

**Point 1 — Stories techniques en Epic 1**
Les Stories 1.1 (migration brownfield), 1.2 (migrations DB), 1.5 (stubs typés), 1.6 (spike) n'ont pas de valeur utilisateur directe. C'est **acceptable pour un projet brownfield** — l'Epic 1 est explicitement une epic de fondation. Documenté comme décision consciente.

**Point 2 — Story 1.6 est un Spike, pas une user story**
La story 1.6 produit un document de résultat (`docs/spikes/vanilla-pay-sandbox.md`), pas un incrément de valeur utilisateur. Format atypique mais justifié pour la réduction de risque technique. Acceptable.

**Point 3 — Fréquence sauvegarde Story 2.2 vs UX spec**
Story 2.2 spécifie "toutes les 30 secondes" mais la spec UX dit "debounce 2s par champ". Voir aussi Avertissement 1 de la section UX Alignment. À aligner avant implémentation.

---

### Conformité Best Practices

| Critère | Statut |
|---|---|
| Epics délivrent de la valeur utilisateur | ✓ (avec note sur Epic 1 brownfield) |
| Indépendance inter-epics | ⚠ 1 violation critique à corriger |
| Stories dimensionnées correctement | ✓ |
| Pas de dépendances forward dans les stories | ⚠ 1 violation (Story 2.6 → Epic 6) |
| Tables créées quand nécessaire | ⚠ Acceptable avec justification FATF |
| Critères d'acceptation testables | ✓ |
| Traçabilité FRs maintenue | ✓ 100% |

---

## Synthèse et Recommandations

### Statut Global de Préparation

## ⚠ NÉCESSITE CORRECTIONS — 1 problème critique à résoudre avant de démarrer l'implémentation

Le plan est **structurellement solide** avec une couverture FR à 100%, une architecture bien alignée avec le PRD et l'UX, et des stories détaillées pour les 7 epics. Un seul problème critique bloque le démarrage serein de l'implémentation.

---

### Problèmes Critiques — Action Immédiate Requise

**Problème critique 1 — Story 2.6 dépend de `pdf.service.ts` qui n'est créé qu'en Epic 6**

Story 2.6 (Epic 2) utilise `pdf.service.ts` pour le récapitulatif du dossier. Ce service est implémenté en Story 6.1 (Epic 6). Story 2.6 ne peut pas être complétée sans Epic 6.

**Correction à appliquer dans `epics.md` :**

Modifier la Story 2.6 pour remplacer :
> *"un CTA 'Télécharger le récapitulatif' génère un PDF du dossier via `pdf.service.ts`"*

Par :
> *"un CTA 'Télécharger le récapitulatif' génère une page HTML imprimable du dossier (rendu Nuxt côté serveur). La génération PDF complète via `pdf.service.ts` sera disponible dès Epic 6."*

Et créer un stub de `pdf.service.ts` dans Story 2.1 : `generateDossierSummary(ongId): Promise<string>` → retourne `throw new ServiceError('NOT_IMPLEMENTED', 'pdf')`.

---

### Problèmes Majeurs — À Corriger Avant la Story Concernée

**Problème 2 — Story 5.1 : ajouter exigence de tests de régression Epic 3**

Ajouter à la Story 5.1 le critère : *"Les fonctionnalités d'Epic 3 (journalisation via `insertAuditEntry()`, historique dossier, messagerie) passent leurs tests existants sans modification après déploiement de Story 5.1."*

**Problème 3 — Story 4.3 : préciser le mécanisme de recalcul de masse**

Ajouter à Story 4.3 : *"Le recalcul de masse est exécuté via un job pg_cron ou Supabase Edge Function en batch de 50 ONGs maximum par exécution. L'avancement est visible dans le dashboard back-office et se complète en < 30 minutes pour 500 ONGs actives."*

---

### Points Mineurs — À Clarifier en Sprint Planning

1. **Fréquence sauvegarde StepperForm** — Choisir entre "debounce 2s" (UX spec) et "toutes les 30s" (Story 2.2) avant implémentation. Documenter la décision dans Story 2.2.

2. **État `timeout` machine d'états transactions** — Ajouter à Story 5.2 : *"Absence de confirmation webhook après 30 min → état `timeout` → insertion dans `ops_alerts`."*

3. **Réconciliation quotidienne mobile money** — Non couverte explicitement. Soit l'intégrer dans Story 7.1 ou Story 5.2, soit la considérer comme une opération back-office manuelle jusqu'au Growth.

4. **État `cancelled` dans `TransactionStatusBadge`** — L'architecture définit `cancelled` comme état valide de la machine d'états. Décider si le composant `TransactionStatusBadge` (UX-DR7) doit avoir un 5e état visuel.

5. **KYC obligatoire BFM/FATF** — Exigence réglementaire sans story dédiée. À traiter comme condition de lancement (hors développement produit pur) en coordination avec la conformité BCRM.

---

### Étapes Recommandées

1. **Immédiatement** — Corriger Story 2.6 dans `epics.md` (remplacer le PDF par HTML imprimable, ajouter stub `pdf.service.ts` en Story 2.1)
2. **Avant Story 5.1** — Ajouter le critère de non-régression Epic 3
3. **Avant Story 4.3** — Préciser le mécanisme de recalcul de masse
4. **En Sprint Planning Epic 2** — Trancher la fréquence de sauvegarde StepperForm
5. **Avant lancement** — Résoudre le statut réglementaire BCRM et KYC

---

### Note Finale

Cette évaluation a identifié **1 problème critique, 3 problèmes majeurs et 5 points mineurs** sur un plan de 7 epics, 43 stories et 51 FRs couverts à 100%. La structure est robuste. Le problème critique est précis, isolé et corrigeable en moins d'une heure.

**Une fois Story 2.6 corrigée, le plan est prêt pour le Sprint Planning.**

---

*Rapport généré le 2026-05-02 — Paika ONG Platform*
