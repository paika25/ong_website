---
stepsCompleted: [1, 2]
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/project-context.md'
lastAudit: '2026-05-09'
---

> **Audit d'implémentation — 2026-05-09**
> Légende des statuts : ✅ Terminé · 🔄 En cours · ⬜ Non démarré
>
> **Résumé :** Epic 1 🔄 (2 stories ✅, 4 🔄, 5 ⬜) · Epic 2 🔄 (5 🔄, 1 ⬜) · Epics 3, 4, 5 ⬜ · Epic 6 🔄 (2 🔄, 2 ⬜) · Epic 7 ⬜

# Paika ONG Platform - Epic Breakdown

## Overview

Ce document fournit la décomposition complète en epics et stories pour Paika ONG Platform, décomposant les exigences du PRD, de la spécification UX et de l'Architecture en stories implémentables.

## Requirements Inventory

### Functional Requirements

FR1: Un visiteur peut créer un compte avec le rôle `user_agent` (gestionnaire ONG) ou `user_partner` (bailleur/donateur)
FR2: Un utilisateur peut s'authentifier via email/mot de passe
FR3: Un utilisateur peut réinitialiser son mot de passe via un lien envoyé par email
FR4: Un utilisateur peut mettre à jour ses informations de profil compte (email, mot de passe)
FR5: Un utilisateur peut se déconnecter de toutes ses sessions actives
FR6: Un `user_agent` peut créer un profil ONG via un formulaire multi-étapes avec sauvegarde automatique à chaque étape
FR7: Un `user_agent` peut uploader des documents justificatifs (statuts, récépissé, rapports financiers) dans le profil de son ONG
FR8: Un `user_agent` peut modifier les informations de son profil ONG à tout moment
FR9: Un `user_agent` peut configurer quelles informations de son profil sont visibles publiquement
FR10: Un `user_agent` peut consulter l'état d'avancement de son dossier de vérification en temps réel
FR11: Un `user_agent` peut télécharger un récapitulatif de son dossier ONG
FR12: Un `user_agent` peut reprendre un formulaire multi-étapes interrompu depuis l'étape où il s'est arrêté
FR13: Un `back_office` peut consulter la liste de tous les dossiers ONG en attente de vérification dans un pipeline kanban
FR14: Un `back_office` peut accéder au détail complet d'un dossier ONG (documents, informations, historique)
FR15: Un `back_office` peut valider ou rejeter un dossier ONG avec commentaire obligatoire
FR16: Un `back_office` peut demander des compléments de documents à une ONG via messagerie intégrée
FR17: Un `back_office` peut attribuer le badge "✓ Vérifié" à une ONG après validation complète
FR18: Un `back_office` peut suspendre ou révoquer la certification d'une ONG avec motif tracé
FR19: Un `back_office` peut consulter l'historique complet des actions sur chaque dossier ONG
FR20: Le système calcule automatiquement un Score de Transparence pour chaque ONG selon des critères publiquement documentés
FR21: Le Score de Transparence est recalculé automatiquement lors d'événements déclencheurs (upload document, validation back-office, mise à jour profil)
FR22: Un `user_agent` peut consulter le détail du Score de son ONG et les critères non atteints
FR23: Un `user_partner` et tout visiteur peuvent consulter le Score de Transparence d'une ONG certifiée
FR24: Un `back_office` peut ajuster manuellement les paramètres de l'algorithme de calcul du Score avec traçabilité complète
FR25: Un `user_partner` peut rechercher des ONGs par nom, catégorie d'activité, zone géographique et niveau de Score
FR26: Un `user_partner` peut consulter le profil public complet d'une ONG certifiée
FR27: Un `user_partner` peut télécharger un rapport de vérification PDF standardisé pour une ONG certifiée
FR28: Un visiteur non authentifié peut consulter la liste publique des ONGs certifiées
FR29: Un `user_partner` peut sauvegarder une liste d'ONGs favorites pour suivi
FR30: Un `user_partner` peut voir l'historique des financements reçus par une ONG (montants agrégés, anonymisés)
FR31: Un `user_agent` peut voir quels bailleurs ont consulté son profil (vue d'intérêt)
FR32: Un `user_agent` peut souscrire à l'abonnement "Vérifié" (20 000 Ar/mois) via Vanilla Pay (agrégateur MVola/Orange/Airtel)
FR33: Un `user_agent` peut consulter l'état de son abonnement (actif, suspendu, date de renouvellement)
FR34: Le système suspend automatiquement le badge "Vérifié" après échec de paiement, avec période de grâce de 3 jours
FR35: Le système réactive automatiquement le badge dès régularisation du paiement
FR36: Un `user_partner` peut initier un virement vers une ONG via Vanilla Pay avec sélection du montant et du projet
FR37: Un `user_agent` peut consulter l'historique complet des transactions reçues sur son ONG
FR38: Le système enregistre chaque transaction financière dans une table append-only immuable (pas de UPDATE ni DELETE possible)
FR39: Le système journalise chaque action back-office (validation, rejet, modification Score) avec horodatage et identifiant opérateur
FR40: Un `back_office` peut exporter un rapport d'audit complet pour une période donnée
FR41: Le système génère automatiquement un hash cryptographique quotidien de l'audit trail pour vérification d'intégrité
FR42: Un `user_partner` peut consulter la preuve d'immuabilité d'une transaction (hash + horodatage)
FR43: Le système envoie des notifications email transactionnelles (certification accordée, paiement reçu, complément de documents requis, suspension badge)
FR44: Un `back_office` peut envoyer un message à une ONG dans le cadre du processus de vérification
FR45: Un `user_agent` peut répondre aux messages du back-office directement depuis son tableau de bord
FR46: Un `user_agent` reçoit une notification en cas d'expiration imminente de son abonnement (7 jours avant)
FR47: Un `back_office` peut consulter un tableau de bord global (ONGs certifiées, en attente, volume transactions, Score moyen)
FR48: Un `back_office` peut générer des rapports agrégés anonymisés sur l'activité de la plateforme
FR49: Un `back_office` peut gérer les paramètres de la plateforme (critères Score, tarifs abonnement, messages types)
FR50: Le système conserve un log d'accès pour chaque consultation de profil ONG par un bailleur (date, ONG consultée, identifiant bailleur pseudonymisé)
FR51: Un `back_office` peut exporter la liste complète des ONGs certifiées avec leurs métadonnées pour reporting externe

### NonFunctional Requirements

NFR1: Les pages publiques (liste ONGs, profil ONG) se chargent en moins de 3 secondes sur une connexion 3G malgache (simulation 1Mbps)
NFR2: Les actions utilisateur critiques (soumission formulaire, déclenchement paiement, recalcul Score) reçoivent un accusé de réception en moins de 500ms, même si le traitement continue en arrière-plan
NFR3: Le traitement d'un webhook Vanilla Pay se finalise en moins de 10 secondes depuis réception
NFR4: Le moteur de recherche d'ONGs retourne des résultats en moins de 2 secondes pour un catalogue de 1 000 ONGs
NFR5: La génération d'un rapport PDF de vérification se complète en moins de 30 secondes
NFR6: Toutes les données en transit sont chiffrées via TLS 1.2 minimum
NFR7: Toutes les données sensibles au repos (documents ONG, données financières) sont chiffrées via AES-256
NFR8: L'accès aux données est contrôlé par RLS Supabase — aucune donnée ONG n'est accessible à un autre tenant par requête directe
NFR9: L'audit trail financier est immuable : les triggers PostgreSQL bloquent tout UPDATE et DELETE sur la table de transactions
NFR10: Un hash cryptographique (SHA-256) de l'audit trail est généré et stocké quotidiennement hors de la base principale pour détection de falsification
NFR11: Les tokens d'authentification expirent après 1 heure d'inactivité — renouvellement automatique silencieux si la session est active
NFR12: Les tentatives de connexion échouées déclenchent un rate-limiting après 5 essais (blocage temporaire 15 minutes)
NFR13: Les clés API et secrets d'intégration (Vanilla Pay, email) ne sont jamais exposés côté client
NFR14: L'architecture supporte 10x la charge initiale sans modification structurelle (de 100 à 1 000 ONGs actives)
NFR15: Le modèle multi-tenant RLS supporte 500 ONGs simultanées sans dégradation de performance mesurable (< 20% d'augmentation des temps de réponse)
NFR16: Le système de webhooks Vanilla Pay supporte 100 transactions simultanées sans perte ni duplication
NFR17: La plateforme est disponible 99,5% du temps (hors maintenances planifiées annoncées 48h à l'avance)
NFR18: Une maintenance planifiée n'affecte pas les webhooks entrants Vanilla Pay — les transactions en cours ne sont pas perdues
NFR19: Les formulaires multi-étapes persistent leur état localement — une perte de connexion ne fait pas perdre les données saisies
NFR20: En cas d'échec d'un webhook Vanilla Pay, le système effectue 3 tentatives automatiques avec backoff exponentiel avant d'alerter le back-office
NFR21: Les intégrations Vanilla Pay respectent les spécifications API officielles sans modification de l'implémentation core
NFR22: L'intégration email transactionnel (Brevo) garantit une délivrabilité > 95% sur les adresses professionnelles (domaines institutionnels AFD, GIZ, UE)
NFR23: Les rapports PDF exportés sont conformes au standard ISO 32000 et s'ouvrent sans plugin dans les navigateurs modernes
NFR24: L'API publique (phase 2) expose des endpoints REST versionnés (v1, v2) avec rétrocompatibilité garantie sur 12 mois
NFR25: L'interface utilisateur reste fonctionnelle en mode dégradé (lecture des données cachées) lors d'une interruption de connexion jusqu'à 60 secondes
NFR26: Les images et documents lourds sont chargés en lazy loading — la page principale reste interactive même si les assets ne sont pas encore chargés
NFR27: Les timeouts de requête déclenchent un message d'erreur explicite avec option de réessai — jamais une page blanche ou une erreur technique brute
NFR28: Les uploads de documents supportent la reprise après interruption (chunked upload) pour les fichiers > 1 Mo

### Additional Requirements

- Setup ESLint `no-restricted-imports` sur `@supabase/supabase-js` direct pour forcer `useSupabase()` uniquement
- Créer `tsconfig.strict.json` pour `features/payments/` et `features/audit-trail/` (strict TypeScript sur périmètres financiers)
- Migrations Supabase : `financial_transactions` (append-only + triggers Merkle), `algorithm_versions`, `score_disputes`, RLS policies, pg_cron zombie recovery, `ops_alerts`, index `ong_id`, vues matérialisées Score
- Custom JWT claims via `auth.users.app_metadata.role` — trigger Postgres pour claims personnalisés
- `server/utils/errors.ts` — classe `ServiceError` avec codes `NOT_FOUND | VALIDATION | FORBIDDEN | CONFLICT | WEBHOOK_FAILED`
- `types/pagination.ts` — type `PaginatedResponse<T>` cursor-based utilisé sur toutes les collections
- `types/schemas/` — schémas Zod partagés client+serveur (payment.schema.ts, ong.schema.ts, score.schema.ts)
- `server/services/audit.service.ts` — fonction `insertAuditEntry()` avec chaîne Merkle (SHA-256)
- `server/services/score.service.ts` — fonction `triggerScoreRecalculation(ongId, ScoreTriggerEvent, context)` hors transaction DB
- `server/services/payment.service.ts` — séquence canonique : Zod → idempotence → BEGIN → insert → audit → COMMIT → score async
- `server/services/email.service.ts` — Brevo SDK côté Nitro uniquement
- `server/services/pdf.service.ts` — Playwright via Supabase Edge Function → Storage `/reports/{ong_id}/{report_id}.pdf`
- pg_cron réconciliation zombie : `status = 'processing'` depuis > 2 min → reset à `pending`, `retry_count < 3`
- Sentry SDK Vue + Node Nitro pour error tracking en production
- Feature flags `NUXT_PUBLIC_FEATURE_*` via Netlify env vars + `useRuntimeConfig()`
- Template de test state machine obligatoire (`tests/unit/_state-machine.template.spec.ts`)
- `tests/e2e/rls-matrix.spec.ts` — isolation multi-tenant avec vrais utilisateurs staging
- Migration de l'existant brownfield vers architecture feature-based (`~/features/[feature]/`)

### UX Design Requirements

UX-DR1: Implémenter le composant `ScoreTransparenceWidget` — barre de progression colorée par palier (0–39 ambre / 40–69 bleu / 70–89 teal / 90–100 vert), valeur numérique en `#6B7280` (jamais colorée), liste critères complétés/restants avec gain en points, CTA contextuel vers prochaine action. Props: `score`, `criteria`, `onActionClick`. ARIA: `role="meter"` avec `aria-valuenow/min/max`.
UX-DR2: Implémenter le composant `BadgeVerifie` — 4 états (verified vert / pending bleu / suspended ambre / unverified gris), 3 variantes de taille (sm/md/lg), date de certification affichée si verified. Props: `status`, `certificationDate?`, `size?`. ARIA: `role="status"` avec `aria-label` contextuel.
UX-DR3: Implémenter le composant `StepperForm` — 5 étapes (Identité → Mission → Documents → Projets → Contacts), navigation non-linéaire libre (étapes complètes = clickable), sauvegarde silencieuse toutes les 30s + à chaque navigation, indicateur sauvegarde discret (visible seulement si > 3s), score footer en sidebar pendant le formulaire. ARIA: `role="tablist"` + `role="tab"` + `aria-current="step"`.
UX-DR4: Implémenter le composant `PipelineKanban` — 4 colonnes (À vérifier / En cours / Complément requis / Validé), métriques urgents/file/traités dans topbar, `border-l-4 border-amber-500` sur cartes urgentes (> 48h), actions inline (Valider/Demander complément sans modal, Rejeter avec modal), cartes triées par ancienneté. Props: `columns`, `onCardClick`, `onDrop`.
UX-DR5: Implémenter le composant `OngProfileCard` — variante `dense` (back-office : nom, score, statut, date, actions rapides `size="sm"`) et variante `standard` (marketplace : logo, nom, mission, badge, score, CTA). Props: `ong`, `variant`, `onActionClick?`.
UX-DR6: Implémenter le composant `DocumentUploadZone` — 5 états (idle/dragging/uploading/success/error), drag & drop desktop, progress bar pendant upload, message d'erreur avec formats acceptés + bouton réessayer. Props: `accept`, `maxSize`, `onUpload`, `existingFile?`. ARIA: `role="region"` + `aria-live="polite"`.
UX-DR7: Implémenter le composant `TransactionStatusBadge` — 4 états (completed vert / pending ambre / failed rouge / refunded gris), affichage montant optionnel. Props: `status`, `amount?`, `currency?`.
UX-DR8: Implémenter le système de tokens CSS dans TailwindCSS : `--color-verified` (#16A34A), `--color-pending-text` (#B45309 — WCAG AA sur blanc), `--color-pending-surface` (#D97706 — fond uniquement), `--color-score-building/reviewing/solid`, `--color-bg/surface/border/text/text-muted`. Règle absolue : `--color-pending-surface` jamais en texte sur fond blanc.
UX-DR9: Implémenter la hiérarchie typographique Inter (system font stack) : display 32px/800, h1 26px/700, h2 20px/700, h3 16px/600, label 12px/600 uppercase, body 14px/400, small 12px/400, mono 13px/500. Interlignage body 1.6.
UX-DR10: Appliquer la densité différenciée par rôle : back-office `gap-3/p-3`, formulaires agent `gap-4/p-4` (cibles tactiles 44×44px min), profils bailleur `gap-6/p-8`. Sidebar fixe 240px + topbar 56px. `max-w-screen-xl mx-auto` sur grands écrans.
UX-DR11: Implémenter la direction design "Progression Narrative" (D4) enrichie : header contextuel Agent avec barre de progression (% complétude + score actuel), hints proactifs "+X pts" en sidebar, profil bailleur card scannnable avec badge › score strip › critères pills › CTA PDF, back-office topbar avec métriques live.
UX-DR12: Implémenter les patterns de navigation : sidebar permanente 240px (section active `bg-primary-50 border-l-3`), breadcrumb `Tableau de bord › Section › Page`, `?redirect=` post-login, skip link `#main-content`.
UX-DR13: Implémenter les patterns de feedback : `UToast` (succès 4s auto-dismiss bas-droite / erreur persistant / warning 6s / info 4s), modal confirmation danger (avec input optionnel) vs simple, sauvegarde silencieuse (indicateur discret seulement si > 3s).
UX-DR14: Implémenter WCAG 2.1 AA : focus visible `outline: 2px solid var(--focus-ring-color)` sur tous les éléments interactifs (jamais `outline: none`), focus piégé dans les modaux, ARIA par composant custom (voir tableau UX spec), `prefers-reduced-motion` désactive les animations Score/Badge.
UX-DR15: Implémenter les loading states : skeleton loaders (jamais spinner global plein écran), skeleton rows 3–5 pour tableaux/listes, spinner inline + disabled sur bouton action async, progress bar dans `DocumentUploadZone`.
UX-DR16: Implémenter les empty states : icône + titre `text-gray-500` + sous-titre `text-gray-400` + CTA optionnel pour chaque contexte (kanban vide, liste filtrée sans résultats, historique vide, dossier sans documents).
UX-DR17: Implémenter le parcours Agent complet : dashboard avec CTA "Compléter mon dossier" + indicateur complétude, StepperForm 5 étapes non-linéaire, Score recalculé après chaque upload (animation barre +X pts), CTA soumission débloqué à Score ≥ 40 + docs obligatoires, modal confirmation, statut "En révision" avec timer, notification "✓ Vérifié" avec animation badge.
UX-DR18: Implémenter le parcours Bailleur : liste ONGs avec filtres (secteur/zone/score/badge), cards scannables, profil ONG avec hero section badge › score strip → PDF en 1 clic, option "Être notifié quand certifiée" pour ONGs en révision, sauvegarde favoris.
UX-DR19: Implémenter le parcours Back-office : topbar métriques live, kanban 4 colonnes triées par ancienneté, priorité visuelle ambre > 48h, checklist vérification intégrée dans carte (expandable), actions inline (Valider sans modal / Demander complément champ texte inline / Rejeter avec modal irréversible).
UX-DR20: Implémenter recherche/filtres : debounce 300ms, URL persistence (`?q=...`), filtres marketplace (secteur/région/score/badge) en pills + dropdown, combinaison opérateur ET, badge "N filtres actifs" avec [× Tout effacer].
UX-DR21: Implémenter hiérarchie boutons : max 1 primaire par vue, secondaire = outline, danger = rouge, fantôme = ghost, CTA bailleur = size lg. Densité back-office : `size="sm"` pour toutes les actions kanban/tableau.
UX-DR22: Implémenter validation formulaire : jamais on-change immédiat, on-blur par champ, on-submit révèle tous invalides, correction = on-change dès qu'erreur affichée. Structure champ : Label (toujours visible) / Input / Helper text / Error (remplace helper).
UX-DR23: Implémenter patterns modaux : toujours fermable via × et Escape, overlay `bg-black/50`, jamais modal empilé sur modal, confirmation danger avec input optionnel pour actions irréversibles (rejet back-office uniquement).

### FR Coverage Map

FR1: Epic 1 – Fondation & Auth — inscription visiteur rôle user_agent/user_partner
FR2: Epic 1 – Fondation & Auth — authentification email/mot de passe
FR3: Epic 1 – Fondation & Auth — réinitialisation mot de passe
FR4: Epic 1 – Fondation & Auth — mise à jour profil compte
FR5: Epic 1 – Fondation & Auth — déconnexion toutes sessions
FR6: Epic 2 – Profil ONG — création profil ONG formulaire multi-étapes
FR7: Epic 2 – Profil ONG — upload documents justificatifs
FR8: Epic 2 – Profil ONG — modification profil ONG
FR9: Epic 2 – Profil ONG — configuration visibilité publique
FR10: Epic 2 – Profil ONG — état avancement dossier de vérification (statut "Soumis / En attente")
FR11: Epic 2 – Profil ONG — téléchargement récapitulatif dossier
FR12: Epic 2 – Profil ONG — reprise formulaire interrompu
FR13: Epic 3 – Vérification BO & Badge — liste dossiers en attente kanban
FR14: Epic 3 – Vérification BO & Badge — détail complet dossier ONG
FR15: Epic 3 – Vérification BO & Badge — validation ou rejet dossier avec commentaire
FR16: Epic 3 – Vérification BO & Badge — demande compléments documents via messagerie
FR17: Epic 3 – Vérification BO & Badge — attribution badge "✓ Vérifié"
FR18: Epic 3 – Vérification BO & Badge — suspension ou révocation certification avec motif tracé
FR19: Epic 3 – Vérification BO & Badge — historique complet actions sur dossier
FR20: Epic 4 – Score de Transparence — calcul automatique Score
FR21: Epic 4 – Score de Transparence — recalcul sur événements déclencheurs
FR22: Epic 4 – Score de Transparence — détail Score et critères non atteints (user_agent)
FR23: Epic 4 – Score de Transparence — consultation Score par user_partner et visiteurs
FR24: Epic 4 – Score de Transparence — ajustement paramètres algorithme (back_office)
FR25: Epic 6 – Marketplace Bailleur — recherche ONGs par nom/catégorie/zone/score
FR26: Epic 6 – Marketplace Bailleur — profil public complet ONG certifiée
FR27: Epic 6 – Marketplace Bailleur — téléchargement rapport vérification PDF
FR28: Epic 6 – Marketplace Bailleur — liste publique ONGs certifiées (visiteur)
FR29: Epic 6 – Marketplace Bailleur — sauvegarde favoris ONGs
FR30: Epic 6 – Marketplace Bailleur — historique financements reçus (agrégés, anonymisés)
FR31: Epic 6 – Marketplace Bailleur — vue d'intérêt (bailleurs ayant consulté le profil)
FR32: Epic 5 – Abonnement & Audit Trail — souscription abonnement "Vérifié" via Vanilla Pay
FR33: Epic 5 – Abonnement & Audit Trail — consultation état abonnement
FR34: Epic 5 – Abonnement & Audit Trail — suspension automatique badge après échec paiement
FR35: Epic 5 – Abonnement & Audit Trail — réactivation automatique badge dès régularisation
FR36: Epic 7 – Virements & Analytics BO — virement user_partner vers ONG via Vanilla Pay
FR37: Epic 7 – Virements & Analytics BO — historique transactions reçues (user_agent)
FR38: Epic 7 – Virements & Analytics BO — table append-only immuable (pas de UPDATE/DELETE)
FR39: Epic 3 – Vérification BO & Badge — journalisation actions back-office avec horodatage
FR40: Epic 7 – Virements & Analytics BO — export rapport audit complet pour période
FR41: Epic 7 – Virements & Analytics BO — hash cryptographique quotidien audit trail
FR42: Epic 7 – Virements & Analytics BO — preuve immuabilité transaction (hash + horodatage)
FR43: Epic 5 – Abonnement & Audit Trail — notifications email transactionnelles (certification, paiement, complément docs, suspension badge)
FR44: Epic 3 – Vérification BO & Badge — messagerie back_office → ONG (processus vérification)
FR45: Epic 3 – Vérification BO & Badge — réponse user_agent aux messages back_office
FR46: Epic 5 – Abonnement & Audit Trail — notification expiration imminente abonnement (7j avant)
FR47: Epic 7 – Virements & Analytics BO — tableau de bord global back_office
FR48: Epic 7 – Virements & Analytics BO — rapports agrégés anonymisés activité plateforme
FR49: Epic 7 – Virements & Analytics BO — gestion paramètres plateforme (critères Score, tarifs, messages types)
FR50: Epic 7 – Virements & Analytics BO — log accès consultations profil ONG par bailleur
FR51: Epic 7 – Virements & Analytics BO — export liste ONGs certifiées avec métadonnées

## Epic List

### Epic 1 : Fondation & Authentification
Les utilisateurs peuvent s'inscrire et s'authentifier. Tous les services partagés ont un contrat typé frozen. L'isolation multi-tenant RLS est validée par test. Le risque Vanilla Pay est exposé dès le départ via spike sandbox.
**FRs couverts :** FR1, FR2, FR3, FR4, FR5
**Req. techniques :** Migration brownfield → `~/features/[feature]/`, ESLint `no-restricted-imports` guard, `tsconfig.strict.json` (payments + audit + score), 8 migrations Supabase (financial_transactions append-only + triggers Merkle, algorithm_versions, score_disputes, RLS policies, pg_cron, ops_alerts, index ong_id, vues matérialisées Score), custom JWT claims trigger, ServiceError, PaginatedResponse\<T\>, Zod schemas, stubs typés frozen (audit.service.ts + score.service.ts + payment.service.ts + email.service.ts), `server/api/webhooks/vanilla-pay.post.ts` skeleton complet (router d'événements), `tests/e2e/rls-matrix.spec.ts` rouge (critère Done), spike Vanilla Pay sandbox (webhook réception → 200), Sentry, feature flags

---

### Epic 2 : Profil ONG & Dossier de Candidature
Un gestionnaire ONG peut constituer son dossier complet via un formulaire multi-étapes avec sauvegarde automatique, le soumettre et suivre son statut en temps réel.
**FRs couverts :** FR6, FR7, FR8, FR9, FR10, FR11, FR12
**Req. techniques :** `~/features/ong-profile/`, StepperForm 5 étapes non-linéaire, DocumentUploadZone (5 états), offline persistence (VueUse useStorage + useOnline), activation email.service.ts (confirmation inscription + confirmation upload), état "Soumis / En attente de vérification" (FR10 — statut DB lu côté agent)
**UX :** StepperForm, DocumentUploadZone, sauvegarde silencieuse 30s, skeleton loaders, empty states dossier

---

### Epic 3 : Vérification Back-office & Badge
Le back-office instruite les dossiers ONG dans un pipeline kanban, certifie ou rejette les ONGs, échange avec elles via messagerie intégrée. Chaque action est tracée.
**FRs couverts :** FR13, FR14, FR15, FR16, FR17, FR18, FR19, FR39, FR44, FR45
**Req. techniques :** `~/features/verification/`, PipelineKanban 4 colonnes, BadgeVerifie 4 états, implémentation audit.service.ts (actions BO — sans Merkle, INSERT simple), messagerie BO↔ONG (emails Brevo transactionnels via email.service.ts)
**UX :** PipelineKanban, actions inline (Valider sans modal / Demander complément inline / Rejeter avec modal), topbar métriques live, border-l-4 amber sur dossiers urgents > 48h

---

### Epic 4 : Score de Transparence
Chaque ONG dispose d'un Score de Transparence calculé automatiquement selon des critères publics, visible par tous, avec gouvernance indépendante de l'algorithme.
**FRs couverts :** FR20, FR21, FR22, FR23, FR24
**Req. techniques :** Implémentation complète score.service.ts (remplace stub Epic 1), algorithm_versions (draft/approved/active/deprecated), score_disputes, triggerScoreRecalculation(ongId, ScoreTriggerEvent, context) hors transaction DB
**UX :** ScoreTransparenceWidget (ARIA role="meter"), animation +X pts, hints proactifs "+X pts" sidebar, parcours agent complet avec CTA soumission débloqué à Score ≥ 40

---

### Epic 5 : Abonnement Vanilla Pay & Audit Trail Financier
Les ONGs certifiées paient leur abonnement mensuel via Vanilla Pay. L'audit trail Merkle est opérationnel dès la première transaction financière réelle.
**FRs couverts :** FR32, FR33, FR34, FR35, FR43, FR46
**Req. techniques :** Implémentation payment.service.ts (séquence canonique : Zod → idempotence → BEGIN → insert → insertAuditEntry → COMMIT → triggerScoreRecalculation async), **Merkle chain SHA-256 complet** dans audit.service.ts (remplace impl. simple Epic 3 — ADR : entrées Epic 3 pré-Merkle annotées "pre-merkle"), handler abonnement dans vanilla-pay.post.ts (utilise le skeleton Epic 1), pg_cron zombie recovery (status = 'processing' > 2min → reset pending si retry_count < 3)
**UX :** TransactionStatusBadge (4 états), parcours paiement, notification expiration 7j avant, UToast confirmation paiement

---

### Epic 6 : Marketplace Bailleur & Découverte *(dépend Epic 4)*
Les bailleurs institutionnels peuvent découvrir les ONGs certifiées et scorées, consulter leur profil complet et télécharger un rapport PDF standardisé.
**FRs couverts :** FR25, FR26, FR27, FR28, FR29, FR30, FR31
**Req. techniques :** `~/features/marketplace/`, pdf.service.ts (Playwright via Supabase Edge Function), story CI/CD distincte (pipeline Supabase Functions, smoke test POST /functions/v1/generate-pdf → 200 en staging), CTA "Être notifié / Ajouter aux favoris" (bridge UX avant virements Epic 7)
**UX :** OngProfileCard (variante standard marketplace), filtres URL-persistent (debounce 300ms, ?q=...), PDF 1-clic, parcours bailleur complet, empty states liste filtrée

---

### Epic 7 : Virements Bailleurs & Analytics Back-office
Les bailleurs financent directement les ONGs via Vanilla Pay avec preuve d'immuabilité. Le back-office pilote la plateforme avec rapports complets et exports.
**FRs couverts :** FR36, FR37, FR38, FR40, FR41, FR42, FR47, FR48, FR49, FR50, FR51
**Req. techniques :** Handler virements dans vanilla-pay.post.ts (utilise Merkle existant Epic 5), `~/features/back-office/`, pdf.service.ts (rapports agrégés), exports CSV, hash SHA-256 quotidien via pg_cron + stockage hors base principale
**UX :** Preuve immuabilité transaction (bailleur), dashboard métriques live back-office, paramètres Score/tarifs/messages types, export ONGs certifiées

---

## Epic 1 : Fondation & Authentification

### Story 1.1 — Migration vers Architecture Feature-Based & Gardes Techniques 🔄

En tant que développeur,
je veux migrer la base brownfield vers `~/features/[feature]/` avec les gardes ESLint et TypeScript strict,
afin que toutes les features suivantes puissent être développées avec des frontières claires.

**Acceptance Criteria :**

**Given** la base brownfield existante (auth, rôles, modèle ONG basique, pages statiques)
**When** la migration est complète
**Then** le code existant est réorganisé sous `~/features/[feature]/services/`, `~/features/[feature]/components/`, `~/features/[feature]/composables/`
**And** `eslint.config.mjs` contient la règle `no-restricted-imports` sur `@supabase/supabase-js` direct — seul `useSupabase()` est autorisé
**And** `tsconfig.strict.json` existe et est appliqué aux dossiers `features/payments/`, `features/audit-trail/`, `features/score/`
**And** les imports croisés entre features sont interdits sauf via `~/types/` ou `~/lib/`
**And** `bun run dev` démarre sans erreur et tous les tests existants passent

> **Avancement :** `features/auth/`, `features/ong/`, `features/user/` existent avec structure composants/composables/services/types. Les pages brownfield (`pages/auth/`, `pages/ongs/`) coexistent encore avec les features. **Reste à faire :** règle ESLint `no-restricted-imports` sur `@supabase/supabase-js`, `tsconfig.strict.json` pour features/payments+audit-trail+score, migration complète des pages brownfield sous les features.

---

### Story 1.2 — Migrations Supabase : Tables de Fondation & Triggers Immuabilité ⬜

En tant que système,
je veux que les tables de fondation, triggers d'immuabilité et politiques RLS soient appliqués dès le départ,
afin que la conformité FATF et l'isolation multi-tenant soient garanties avant toute donnée réelle.

**Acceptance Criteria :**

**Given** un projet Supabase configuré
**When** les migrations sont appliquées via `supabase db push`
**Then** la table `financial_transactions` existe avec des triggers BEFORE UPDATE et BEFORE DELETE qui lèvent `RAISE EXCEPTION 'immutable'`
**And** la table `algorithm_versions` existe avec colonne `status` (valeurs : `draft`, `approved`, `active`, `deprecated`)
**And** la table `score_disputes` existe avec colonnes `ong_id`, `disputed_by`, `reason`, `status`, `created_at`
**And** les RLS policies sont appliquées : `user_agent` voit uniquement ses propres rows via `ong_id`, `back_office` voit tout
**And** le job pg_cron `zombie-recovery` existe : reset `status = 'processing'` depuis > 2min à `pending` si `retry_count < 3`
**And** la table `ops_alerts` existe avec colonnes `type`, `payload`, `resolved_at`
**And** un index PostgreSQL sur `ong_id` existe sur `financial_transactions`, `ong_profiles`, `score_history`
**And** les vues matérialisées pour le calcul du Score existent

> **Avancement :** Aucune migration Supabase trouvée dans le repo (pas de dossier `supabase/migrations/`). Entièrement à faire.

---

### Story 1.3 — Validation RLS Multi-tenant par Tests E2E ⬜

En tant que développeur,
je veux que l'isolation RLS soit validée par des tests automatisés avec de vrais utilisateurs staging,
afin qu'aucune fuite de données entre tenants ne puisse passer en production.

**Acceptance Criteria :**

**Given** `tests/e2e/rls-matrix.spec.ts` existe et les migrations Story 1.2 sont appliquées en staging
**When** les tests sont exécutés avec 3 utilisateurs de test (`user_agent_A`, `user_agent_B`, `back_office`)
**Then** `user_agent_A` ne peut pas lire les rows de `user_agent_B` — SELECT retourne 0 rows, pas d'erreur
**And** `user_agent_A` ne peut pas modifier les rows d'une autre ONG — UPDATE/DELETE retourne `0 rows affected`
**And** `user_partner` peut lire les données publiques mais pas les données privées ONG
**And** `back_office` peut lire toutes les rows de toutes les tables protégées
**And** la suite complète est verte avant la clôture de l'Epic 1

> **Avancement :** Aucun fichier `tests/e2e/rls-matrix.spec.ts`. Entièrement à faire (dépend de Story 1.2).

---

### Story 1.4 — Custom JWT Claims & Middleware de Rôles Nuxt 🔄

En tant que système,
je veux que le rôle utilisateur soit encodé dans le JWT via `app_metadata` et vérifié côté serveur,
afin que les pages protégées soient inaccessibles sans le bon rôle, en SSR comme en CSR.

**Acceptance Criteria :**

**Given** un utilisateur avec rôle `user_agent` créé via Supabase Auth
**When** l'utilisateur se connecte
**Then** le JWT contient `app_metadata.role = 'user_agent'`
**And** le trigger Postgres `set_user_role_claim` se déclenche à l'inscription et met à jour `app_metadata`
**And** le middleware Nuxt `~/middleware/auth.ts` vérifie le rôle depuis `useSupabase().auth.getUser()` et redirige vers `/login?redirect=<url>` si non autorisé
**And** les routes `/dashboard/agent/*` sont inaccessibles pour `user_partner` ou non-authentifié — retour 401 en SSR
**And** les routes `/back-office/*` sont inaccessibles pour tout rôle autre que `back_office`

> **Avancement :** Middleware `auth.client.ts`, `agent-only.client.ts`, `partner-only.client.ts`, `guest.client.ts` opérationnels (client-side). Le rôle est lu depuis la table `accounts` (champ `account_type`). **Reste à faire :** trigger Postgres `set_user_role_claim` → `app_metadata.role` dans le JWT, version SSR des middleware (`.ts` sans `.client`), protection `/back-office/*` pour rôle `back_office`.

---

### Story 1.5 — Contrats de Services Partagés (Stubs Typés Frozen) ⬜

En tant que développeur,
je veux que tous les services partagés exposent leurs interfaces publiques dès Epic 1,
afin que les epics suivants puissent être développés sans conflit de merge sur les fichiers de services.

**Acceptance Criteria :**

**Given** l'arborescence `~/server/services/` et `~/types/`
**When** les stubs sont créés
**Then** `server/services/audit.service.ts` exporte `insertAuditEntry(entry: AuditEntry): Promise<void>` — body `throw new ServiceError('NOT_IMPLEMENTED', 'audit')`
**And** `server/services/score.service.ts` exporte `triggerScoreRecalculation(ongId: string, event: ScoreTriggerEvent, context: ScoreContext): Promise<void>` — body stub
**And** `server/services/payment.service.ts` exporte `processPayment(payload: PaymentPayload): Promise<PaymentResult>` — body stub
**And** `server/services/email.service.ts` exporte `sendTransactionalEmail(template: EmailTemplate, to: string, data: Record<string, unknown>): Promise<void>` — body stub
**And** `server/utils/errors.ts` exporte la classe `ServiceError` avec codes `NOT_FOUND | VALIDATION | FORBIDDEN | CONFLICT | WEBHOOK_FAILED | NOT_IMPLEMENTED`
**And** `types/pagination.ts` exporte `PaginatedResponse<T>` avec `data: T[]`, `cursor: string | null`, `total: number`
**And** `types/schemas/payment.schema.ts`, `ong.schema.ts`, `score.schema.ts` existent avec les types Zod de base
**And** `server/api/webhooks/vanilla-pay.post.ts` existe avec un router d'événements dispatching vers handlers stubs (`subscription.payment`, `donation.payment`) — chaque handler retourne `{ received: true }`

> **Avancement :** Aucun `server/services/`, `server/utils/errors.ts`, `types/pagination.ts`, `types/schemas/`, ni `server/api/webhooks/`. Entièrement à faire.

---

### Story 1.6 — Spike Vanilla Pay : Validation de l'Intégration Sandbox ⬜

En tant que développeur,
je veux valider que l'API Vanilla Pay sandbox reçoit et répond correctement à nos webhooks de test,
afin de connaître le risque d'intégration avant de construire la logique métier en Epic 5.

**Acceptance Criteria :**

**Given** les credentials Vanilla Pay sandbox configurés dans `.env.local`
**When** un webhook de test `subscription.payment` simulé est envoyé à `POST /api/webhooks/vanilla-pay`
**Then** le endpoint retourne HTTP 200 `{ received: true }` en moins de 500ms
**And** la signature HMAC du webhook est vérifiée — rejet HTTP 401 si signature invalide
**And** le feature flag `NUXT_PUBLIC_FEATURE_PAYMENTS=false` désactive le endpoint sans redéploiement
**And** le résultat du spike est documenté dans `docs/spikes/vanilla-pay-sandbox.md` : latences, format JSON reçu, gestion d'erreurs observée

> **Avancement :** Aucun fichier lié. Dépend de Story 1.5 (webhook skeleton). Entièrement à faire.

---

### Story 1.7 — Inscription Utilisateur (FR1) ✅

En tant que visiteur,
je veux créer un compte avec le rôle `user_agent` ou `user_partner`,
afin d'accéder aux fonctionnalités de la plateforme adaptées à mon profil.

**Acceptance Criteria :**

**Given** un visiteur non authentifié sur `/register`
**When** il soumet un formulaire valide (email, mot de passe ≥ 8 caractères, choix de rôle)
**Then** un compte est créé dans Supabase Auth avec `app_metadata.role` correspondant au rôle choisi
**And** un email de confirmation est envoyé à l'adresse saisie
**And** l'utilisateur est redirigé vers `/dashboard` après confirmation de l'email
**And** si l'email est déjà utilisé, un message d'erreur explicite est affiché sans révéler l'existence du compte
**And** la validation est `on-blur` par champ — `on-submit` révèle tous les champs invalides restants (UX-DR22)
**And** le label est toujours visible, le message d'erreur remplace le helper text (UX-DR22)

> **Avancement :** `features/auth/services/authService.ts` → `signUp()` complet. Page `pages/auth/SignUp.vue` opérationnelle. Email, mot de passe ≥ 8 car., choix rôle (user_agent/user_partner), email de confirmation Supabase, redirection post-login. **Considéré terminé** (pas de user enumeration sur email existant : ✅, validation on-blur : partiellement via `useAuthValidation`).

---

### Story 1.8 — Authentification Email/Mot de Passe (FR2) ✅

En tant qu'utilisateur inscrit,
je veux me connecter avec mon email et mon mot de passe,
afin d'accéder à mon tableau de bord.

**Acceptance Criteria :**

**Given** un utilisateur avec compte actif sur `/login`
**When** il soumet des identifiants valides
**Then** une session est créée, le JWT est stocké, et il est redirigé vers `?redirect=` ou `/dashboard` par défaut
**And** le token JWT expire après 1h d'inactivité — renouvellement automatique silencieux si la session est active (NFR11)
**And** après 5 tentatives échouées consécutives, le compte est temporairement bloqué 15 minutes avec message explicite (NFR12)
**And** aucune clé API ni secret n'est exposé dans le bundle client (NFR13)
**And** le skip link `#main-content` est présent et fonctionnel sur la page de login (UX-DR12)

> **Avancement :** `signIn()` complet avec Supabase Auth, session JWT, redirect `?redirect=`, option rememberMe localStorage. Page `pages/auth/Login.vue` opérationnelle. Rate-limiting géré nativement par Supabase (5 tentatives). **Considéré terminé.**

---

### Story 1.9 — Réinitialisation de Mot de Passe (FR3) 🔄

En tant qu'utilisateur ayant perdu son mot de passe,
je veux recevoir un lien de réinitialisation par email,
afin de récupérer l'accès à mon compte sans contacter le support.

**Acceptance Criteria :**

**Given** un utilisateur sur `/forgot-password`
**When** il soumet son email
**Then** un email contenant un lien de réinitialisation valable 1h est envoyé via Supabase Auth
**And** le message affiché est identique que l'email existe ou non dans la base (pas de user enumeration)
**And** le lien redirige vers `/reset-password?token=<token>` avec champs nouveau mot de passe + confirmation
**And** après réinitialisation réussie, toutes les sessions actives sont révoquées
**And** un lien expiré ou déjà utilisé affiche un message d'erreur explicite avec option de renvoyer un nouveau lien

> **Avancement :** `authService.resetPassword()` implémenté (Supabase `resetPasswordForEmail`, redirectTo `/auth/reset-password`). **Reste à faire :** créer les pages `/auth/forgot` (formulaire email) et `/auth/reset-password` (formulaire nouveau mot de passe + confirmation).

---

### Story 1.10 — Gestion du Profil Compte & Déconnexion Globale (FR4, FR5) 🔄

En tant qu'utilisateur authentifié,
je veux mettre à jour mes identifiants et pouvoir me déconnecter de toutes mes sessions,
afin de contrôler la sécurité de mon compte.

**Acceptance Criteria :**

**Given** un utilisateur authentifié sur `/account/settings`
**When** il soumet une mise à jour d'email
**Then** un email de confirmation est envoyé à la nouvelle adresse avant que le changement soit effectif
**And** si le mot de passe est modifié, la validation exige l'ancien mot de passe + confirmation du nouveau (≥ 8 caractères)
**And** un bouton "Se déconnecter de tous les appareils" révoque toutes les sessions via `supabase.auth.signOut({ scope: 'global' })`
**And** après déconnexion globale, toute session active est redirigée vers `/login`
**And** les erreurs (email déjà utilisé, mauvais mot de passe actuel) affichent des messages explicites (NFR27)

> **Avancement :** `features/user/components/ProfilEditForm.client.vue` + `updateUserData()` dans le store. `signOut()` implémenté mais sans `scope: 'global'`. **Reste à faire :** `signOut({ scope: 'global' })`, confirmation email pour changement d'adresse, vérification de l'ancien mot de passe avant modification, page `/account/settings` dédiée.

---

### Story 1.11 — Observabilité, Monitoring & Feature Flags ⬜

En tant que développeur et opérateur,
je veux que les erreurs soient capturées automatiquement et que les features puissent être activées sans redéploiement,
afin de monitorer la production et de déployer progressivement.

**Acceptance Criteria :**

**Given** les variables `SENTRY_DSN` et `NUXT_PUBLIC_FEATURE_*` configurées sur Netlify
**When** une erreur non gérée se produit (côté Vue ou côté Nitro)
**Then** l'erreur est capturée par Sentry avec contexte rôle utilisateur — sans PII ni données financières brutes
**And** les feature flags `NUXT_PUBLIC_FEATURE_PAYMENTS`, `NUXT_PUBLIC_FEATURE_SCORE`, `NUXT_PUBLIC_FEATURE_PDF` désactivent les sections correspondantes si `false`, lus via `useRuntimeConfig()`
**And** l'absence de `SENTRY_DSN` en développement local ne fait pas crasher l'application

> **Avancement :** Aucune config Sentry, aucun feature flag `NUXT_PUBLIC_FEATURE_*`. Entièrement à faire.

---

## Epic 2 : Profil ONG & Dossier de Candidature

### Story 2.1 — Infrastructure Feature Ong-Profile & Composant DocumentUploadZone (UX-DR6) 🔄

En tant que développeur,
je veux initialiser la feature `~/features/ong-profile/` avec le composant `DocumentUploadZone`,
afin que les stories suivantes puissent implémenter les fonctionnalités métier sans se soucier des fondations techniques.

**Acceptance Criteria :**

**Given** la feature `~/features/ong-profile/` inexistante
**When** l'infrastructure est créée
**Then** les dossiers `~/features/ong-profile/components/`, `~/features/ong-profile/composables/`, `~/features/ong-profile/services/`, `~/features/ong-profile/pages/` existent
**And** le composant `DocumentUploadZone` existe avec props `accept`, `maxSize`, `onUpload`, `existingFile?` et 5 états : `idle`, `dragging`, `uploading`, `success`, `error`
**And** l'état `dragging` est déclenché par drag-over et annulé par drag-leave ou drop
**And** l'état `uploading` affiche une progress bar (% de montée)
**And** l'état `error` affiche le message d'erreur avec formats acceptés et un bouton "Réessayer"
**And** `role="region"` et `aria-live="polite"` sont présents sur le composant (UX-DR6)
**And** les uploads > 1 Mo utilisent le chunked upload avec reprise après interruption (NFR28)
**And** `server/services/pdf.service.ts` existe avec la fonction `generateDossierSummary(ongId: string): Promise<string>` — body `throw new ServiceError('NOT_IMPLEMENTED', 'pdf')` (stub, implémentation complète en Epic 6 Story 6.1)
**And** `bun run dev` démarre sans erreur

> **Avancement :** `features/ong/` existe avec `ong.documents.ts` (upload Supabase Storage, bucket `ong-documents`, validation type+taille, URL publique, table `ong_documents`). **Reste à faire :** renommer/créer `features/ong-profile/`, créer `DocumentUploadZone` conforme spec (5 états idle/dragging/uploading/success/error, ARIA, chunked upload > 1Mo), créer stub `pdf.service.ts`.

---

### Story 2.2 — Composant StepperForm 5 Étapes Non-Linéaire (UX-DR3, FR6, FR12) ⬜

En tant que développeur,
je veux implémenter le composant `StepperForm` avec navigation non-linéaire et sauvegarde automatique,
afin que le formulaire multi-étapes soit utilisable comme fondation pour la création et modification du profil ONG.

**Acceptance Criteria :**

**Given** le composant `StepperForm` créé dans `~/features/ong-profile/components/`
**When** le composant est rendu avec 5 étapes (Identité → Mission → Documents → Projets → Contacts)
**Then** les étapes complètes sont cliquables (navigation libre) — les étapes non visitées sont désactivées
**And** la sauvegarde silencieuse se déclenche toutes les 30 secondes et à chaque navigation entre étapes — décision retenue : 30s (vs debounce 2s UX spec) pour limiter les requêtes Supabase sur connexion 3G malgache
**And** l'indicateur de sauvegarde n'est visible que si la sauvegarde prend > 3 secondes (UX-DR3)
**And** le score ONG actuel est affiché dans la sidebar footer du formulaire
**And** `role="tablist"` est sur le conteneur des étapes, chaque étape a `role="tab"` et `aria-current="step"` sur l'étape active (UX-DR3)
**And** les cibles tactiles sont ≥ 44×44px (UX-DR10)
**And** une perte de connexion ne fait pas perdre les données saisies — persistance via `VueUse useStorage` (NFR19)
**And** `useOnline()` détecte la reconnexion et déclenche une synchronisation automatique vers la base

> **Avancement :** Aucun composant `StepperForm`. `OwnOngForm.vue` (1146 lignes) est un formulaire monopagé. Entièrement à faire (bloque Stories 2.3 et 2.4).

---

### Story 2.3 — Création Profil ONG : Étapes Identité, Mission, Documents (FR6, FR7) 🔄

En tant que `user_agent`,
je veux remplir les 3 premières étapes de mon profil ONG (Identité, Mission, Documents),
afin de commencer à constituer mon dossier de candidature.

**Acceptance Criteria :**

**Given** un `user_agent` authentifié sur `/dashboard/agent/ong/create`
**When** il remplit et valide l'étape Identité
**Then** les champs nom ONG, forme juridique, date de création, numéro de récépissé et adresse siège sont sauvegardés
**And** l'étape Mission capture : mission principale, secteurs d'activité (multiselect), zones géographiques d'intervention
**And** l'étape Documents permet l'upload de : statuts, récépissé officiel, dernier rapport financier via `DocumentUploadZone`
**And** chaque document uploadé est stocké dans Supabase Storage avec chiffrement AES-256 au repos (NFR7)
**And** les métadonnées du document (nom, taille, date upload, type MIME) sont enregistrées en base
**And** le Score de Transparence en sidebar se met à jour après chaque document uploadé
**And** la validation de chaque champ est `on-blur`, `on-submit` révèle tous les champs invalides (UX-DR22)
**And** un skeleton loader s'affiche pendant le chargement du formulaire (UX-DR15)

> **Avancement :** `OwnOngForm.vue` couvre les champs identité (nom, forme juridique, date, récépissé, adresse), mission (secteurs multiselect, zones), et upload documents via `ong.documents.ts`. **Reste à faire :** intégration dans `StepperForm`, score sidebar en footer, skeleton loaders, mise à jour Score après chaque upload.

---

### Story 2.4 — Création Profil ONG : Étapes Projets & Contacts + Reprise Formulaire (FR6, FR12) 🔄

En tant que `user_agent`,
je veux remplir les étapes Projets et Contacts, et pouvoir reprendre le formulaire plus tard depuis l'étape interrompue,
afin de compléter mon dossier à mon rythme sans perdre mon travail.

**Acceptance Criteria :**

**Given** un `user_agent` sur les étapes 4 et 5 du StepperForm
**When** il remplit l'étape Projets
**Then** il peut ajouter plusieurs projets avec : titre, description, budget prévisionnel, zones cibles, statut (en cours / terminé)
**And** l'étape Contacts capture : responsable légal (nom + email + téléphone), contact communication, site web optionnel, réseaux sociaux optionnels
**And** si l'utilisateur ferme la page, le formulaire reprend depuis l'étape interrompue à la prochaine connexion (FR12)
**And** l'URL de reprise est `/dashboard/agent/ong/create?step=<step-id>` avec état restauré depuis la base
**And** le CTA "Soumettre mon dossier" reste désactivé tant que le Score ONG est < 40 ou que les documents obligatoires sont manquants (UX-DR17)
**And** un `empty state` s'affiche dans la section Projets si aucun projet n'a été ajouté (UX-DR16)

> **Avancement :** `OwnOngForm.vue` couvre les champs projets (titre, description, budget, zones, statut) et contacts (responsable légal, site web). **Reste à faire :** reprise depuis étape interrompue (`?step=<id>` + restauration depuis base), empty state Projets, CTA soumission conditionnel (Score ≥ 40 + docs obligatoires présents).

---

### Story 2.5 — Modification Profil ONG & Configuration Visibilité Publique (FR8, FR9) 🔄

En tant que `user_agent`,
je veux modifier mon profil ONG à tout moment et choisir les informations visibles publiquement,
afin de maintenir mes données à jour et contrôler ma présentation aux bailleurs.

**Acceptance Criteria :**

**Given** un `user_agent` avec un profil ONG existant sur `/dashboard/agent/ong/edit`
**When** il modifie une information
**Then** les modifications sont sauvegardées sans créer un nouveau dossier de candidature
**And** le formulaire de modification réutilise le `StepperForm` avec les valeurs existantes pré-remplies
**And** la page Visibilité Publique (`/dashboard/agent/ong/visibility`) présente chaque section avec un toggle on/off
**And** les sections masquées n'apparaissent pas dans le profil public pour les `user_partner` authentifiés (NFR8 RLS)
**And** la modification d'une information déclenche un recalcul du Score de Transparence (FR21)
**And** un `UToast` de confirmation succès s'auto-dismiss après 4s en bas-droite (UX-DR13)

> **Avancement :** `pages/ongs/[id]/edit.vue` + `updateOng()` dans `ong.mutations.ts` opérationnels. **Reste à faire :** page `/dashboard/agent/ong/visibility` avec toggles visibilité par section, RLS enforcement des sections masquées, UToast confirmation, déclenchement recalcul Score.

---

### Story 2.6 — Soumission Dossier, Suivi Statut & Téléchargement Récapitulatif (FR10, FR11) 🔄

En tant que `user_agent`,
je veux soumettre mon dossier et suivre son état de vérification en temps réel,
afin d'être informé de l'avancement sans avoir à contacter le back-office.

**Acceptance Criteria :**

**Given** un `user_agent` avec Score ≥ 40 et documents obligatoires présents
**When** il clique sur "Soumettre mon dossier"
**Then** un modal de confirmation s'affiche avec le résumé du dossier (UX-DR23)
**And** après confirmation, le statut du dossier passe à `submitted` et une réponse est retournée en < 500ms (NFR2)
**And** le tableau de bord affiche le statut en temps réel : `Soumis`, `En révision`, `Complément requis`, `✓ Vérifié` ou `Rejeté`
**And** un CTA "Télécharger le récapitulatif" ouvre une page HTML imprimable du dossier générée côté serveur (Nuxt SSR) — la génération PDF complète via `pdf.service.ts` est disponible dès Epic 6
**And** un email de confirmation de soumission est envoyé via `email.service.ts` (Brevo)
**And** le header contextuel Agent affiche le % de complétude et le score actuel (UX-DR11)
**And** un skeleton loader remplace le statut pendant le chargement (UX-DR15)

> **Avancement :** Statut ONG (active/pending) affiché dans `DashboardAgentOng.vue`. **Reste à faire :** workflow soumission formel avec gate Score ≥ 40, modal confirmation récapitulatif, email confirmation via `email.service.ts`, page suivi statut temps réel (subscriptions Supabase Realtime), page téléchargement récapitulatif HTML (SSR).

---

## Epic 3 : Vérification Back-office & Badge

### Story 3.1 — Infrastructure Feature Verification & Composants PipelineKanban / BadgeVerifie ⬜

En tant que développeur,
je veux initialiser la feature `~/features/verification/` avec les composants `PipelineKanban` et `BadgeVerifie`,
afin que les stories back-office puissent être construites sur des composants solides.

**Acceptance Criteria :**

**Given** la feature `~/features/verification/` inexistante
**When** l'infrastructure est créée
**Then** le composant `PipelineKanban` existe avec props `columns`, `onCardClick`, `onDrop` et 4 colonnes : `À vérifier`, `En cours`, `Complément requis`, `Validé` (UX-DR4)
**And** les cartes avec ancienneté > 48h ont `border-l-4 border-amber-500` (UX-DR4)
**And** les cartes sont triées par ancienneté (plus ancien en premier)
**And** le composant `BadgeVerifie` existe avec props `status`, `certificationDate?`, `size?` et 4 états : `verified` (vert), `pending` (bleu), `suspended` (ambre), `unverified` (gris) (UX-DR2)
**And** la date de certification est affichée uniquement si `status === 'verified'`
**And** 3 variantes de taille `sm/md/lg` sont supportées (UX-DR2)
**And** `role="status"` et `aria-label` contextuel sont présents sur `BadgeVerifie` (UX-DR2)
**And** `prefers-reduced-motion` désactive les animations de transition d'état du badge (UX-DR14)

> **Avancement :** Aucun code lié. Entièrement à faire.

---

### Story 3.2 — Pipeline Kanban : Liste et Détail des Dossiers (FR13, FR14) ⬜

En tant que `back_office`,
je veux consulter tous les dossiers ONG en attente dans un pipeline kanban et accéder au détail de chacun,
afin d'instruire les dossiers efficacement.

**Acceptance Criteria :**

**Given** un `back_office` authentifié sur `/back-office/verification`
**When** la page se charge
**Then** le `PipelineKanban` affiche tous les dossiers groupés par colonne depuis la base (RLS `back_office` voit tout)
**And** la topbar affiche les métriques live : nb urgents / file d'attente / traités ce jour (UX-DR4)
**And** le clic sur une carte ouvre le détail du dossier avec : informations complètes, documents téléchargeables, historique des actions
**And** les documents sont accessibles depuis Supabase Storage via URL signée valable 1h
**And** le chargement de la liste est < 3s sur 3G simulé 1Mbps (NFR1)
**And** `size="sm"` est appliqué sur tous les boutons d'action kanban (UX-DR21)
**And** un skeleton 3 colonnes s'affiche pendant le chargement (UX-DR15)
**And** un `empty state` s'affiche si le kanban est vide (UX-DR16)

> **Avancement :** Aucun code lié. Dépend de Story 3.1.

---

### Story 3.3 — Actions de Vérification : Valider, Rejeter, Demander Complément (FR15, FR16, FR17, FR18) ⬜

En tant que `back_office`,
je veux valider, rejeter ou demander des compléments sur un dossier ONG directement depuis le kanban,
afin de traiter les dossiers sans friction inutile.

**Acceptance Criteria :**

**Given** un `back_office` face à une carte dossier dans le kanban
**When** il clique "Valider"
**Then** la validation est effectuée sans modal (action inline) — le dossier passe en colonne `Validé` et le badge `BadgeVerifie` passe à `verified` (UX-DR4, FR17)
**And** l'attribution du badge déclenche un email de notification via `email.service.ts` au `user_agent` concerné (FR43)
**When** il clique "Rejeter"
**Then** une modal irréversible s'ouvre avec un champ commentaire obligatoire (UX-DR23, FR15)
**And** après confirmation, le dossier est rejeté avec le commentaire tracé en base
**When** il clique "Demander complément"
**Then** un champ texte inline s'affiche (sans modal) pour saisir le message (UX-DR4, FR16)
**And** le message est envoyé via `email.service.ts` et enregistré en messagerie intégrée
**And** le dossier passe en colonne `Complément requis`
**When** il clique "Suspendre badge"
**Then** une modal de confirmation avec champ motif obligatoire s'affiche — le motif est tracé en base (FR18)
**And** chaque action est journalisée via `audit.service.ts` avec horodatage ISO 8601 et identifiant `back_office` (FR39)
**And** l'accusé de réception de chaque action est retourné en < 500ms (NFR2)

> **Avancement :** Aucun code lié.

---

### Story 3.4 — Historique et Traçabilité des Actions Back-office (FR19, FR39) ⬜

En tant que `back_office`,
je veux consulter l'historique complet des actions sur chaque dossier ONG,
afin de comprendre les décisions passées et garantir la traçabilité.

**Acceptance Criteria :**

**Given** un dossier ONG ayant subi plusieurs actions back-office
**When** un `back_office` ouvre le détail du dossier
**Then** une section "Historique" affiche toutes les actions en ordre chronologique inverse (plus récent en premier)
**And** chaque entrée contient : type d'action, date/heure ISO 8601, identifiant opérateur pseudonymisé, commentaire si présent
**And** les données d'historique sont lues depuis `audit.service.ts` (table append-only — INSERT uniquement)
**And** le scroll de l'historique charge les entrées suivantes en lazy via pagination curseur `PaginatedResponse<T>`
**And** l'historique est accessible uniquement aux `back_office` — RLS bloque les `user_agent` sur cette vue (NFR8)
**And** un `empty state` s'affiche si aucune action n'a encore été effectuée (UX-DR16)

> **Avancement :** Aucun code lié. Dépend de Story 1.5 (audit.service.ts stub) et 3.1.

---

### Story 3.5 — Messagerie Intégrée Back-office ↔ ONG (FR44, FR45) ⬜

En tant que `back_office` et `user_agent`,
je veux échanger des messages dans le cadre du processus de vérification,
afin de traiter les demandes de complément sans recourir à un canal externe.

**Acceptance Criteria :**

**Given** un `back_office` ayant demandé un complément sur le dossier d'une ONG
**When** le `user_agent` de cette ONG consulte son tableau de bord
**Then** une notification indique un message en attente de réponse
**And** le `user_agent` peut répondre depuis `/dashboard/agent/messages` avec un champ texte et une option d'upload pièce jointe (FR45)
**And** chaque message est stocké en base avec `ong_id`, `sender_role`, `content`, `created_at`
**And** chaque message entrant déclenche un email transactionnel via `email.service.ts` au destinataire (FR43)
**And** le `back_office` voit le fil de conversation complet dans le détail du dossier
**And** un `empty state` s'affiche si aucun message n'a encore été échangé (UX-DR16)
**And** les messages sont chiffrés en transit (TLS 1.2+) et au repos (AES-256) (NFR6, NFR7)

> **Avancement :** Aucun code lié.

---

## Epic 4 : Score de Transparence

### Story 4.1 — Implémentation score.service.ts & Moteur de Calcul (FR20, FR21) ⬜

En tant que système,
je veux que le Score de Transparence soit calculé automatiquement et recalculé sur événements déclencheurs,
afin que chaque ONG dispose d'un score précis et à jour selon des critères publics.

**Acceptance Criteria :**

**Given** `score.service.ts` en stub depuis Epic 1 et la table `algorithm_versions` contenant une version `active`
**When** `triggerScoreRecalculation(ongId, event, context)` est invoqué
**Then** le score est calculé entre 0 et 100 selon les critères de la version d'algorithme active
**And** le calcul s'exécute hors transaction DB pour ne pas bloquer les opérations concurrentes
**And** les événements déclencheurs acceptés sont : `DOCUMENT_UPLOADED`, `PROFILE_UPDATED`, `BACKOFFICE_VALIDATED`, `BACKOFFICE_REJECTED`
**And** le résultat est persisté dans `score_history` avec `ong_id`, `score`, `version_id`, `trigger_event`, `created_at`
**And** les vues matérialisées Score (créées en Story 1.2) sont rafraîchies après chaque calcul
**And** un accusé de réception est retourné en < 500ms — le calcul effectif peut continuer en arrière-plan (NFR2)
**And** les critères et pondérations de la version active sont exposés publiquement via `GET /api/score/criteria`

> **Avancement :** Aucun `score.service.ts`. Dépend de Stories 1.2 (tables), 1.5 (stub). Entièrement à faire.

---

### Story 4.2 — Composant ScoreTransparenceWidget & Parcours Agent (UX-DR1, FR22, FR23) ⬜

En tant que `user_agent`, `user_partner` et visiteur,
je veux consulter le Score de Transparence d'une ONG avec le détail des critères atteints et manquants,
afin de comprendre la fiabilité de l'organisation et les actions pour l'améliorer.

**Acceptance Criteria :**

**Given** le composant `ScoreTransparenceWidget` créé avec props `score`, `criteria`, `onActionClick`
**When** le score est affiché
**Then** la barre de progression est colorée selon le palier : 0–39 ambre / 40–69 bleu / 70–89 teal / 90–100 vert (UX-DR1)
**And** la valeur numérique est toujours en `#6B7280` — jamais colorée (UX-DR1)
**And** les critères complétés et restants sont listés avec le gain en points associé à chaque critère non atteint
**And** le CTA contextuel pointe vers la prochaine action permettant d'améliorer le score
**And** `role="meter"` avec `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"` sont présents (UX-DR1)
**And** `prefers-reduced-motion` désactive l'animation de progression de la barre (UX-DR14)
**And** les hints proactifs "+X pts" sont affichés en sidebar du StepperForm pour chaque critère non atteint (UX-DR11)
**And** le `user_agent` consulte son score sur `/dashboard/agent/score` — les `user_partner` et visiteurs voient le score sur le profil public d'une ONG certifiée (FR23)

> **Avancement :** `OngDetailTabTransparency.vue` (86 lignes) affiche un onglet transparence basique. **Aucun** `ScoreTransparenceWidget` conforme spec (ARIA role="meter", barres colorées par palier, critères). Entièrement à faire.

---

### Story 4.3 — Gouvernance Algorithme : Versions & Disputes (FR24) ⬜

En tant que `back_office`,
je veux gérer les versions de l'algorithme de calcul du Score et traiter les contestations des ONGs,
afin de maintenir la gouvernance avec traçabilité complète.

**Acceptance Criteria :**

**Given** un `back_office` sur `/back-office/score-algorithm`
**When** il crée une nouvelle version de l'algorithme
**Then** la version est créée avec statut `draft` dans `algorithm_versions`
**And** une version `draft` peut être modifiée — une version `active` ou `deprecated` est immuable
**And** le passage `draft → approved → active` requiert une confirmation explicite — une seule version peut être `active` simultanément
**And** chaque changement de statut est journalisé dans `audit.service.ts` avec identifiant opérateur et horodatage (FR39)
**And** les `score_disputes` soumises par les ONGs sont consultables et peuvent être marquées `resolved` avec commentaire
**And** un ajustement des paramètres déclenche un recalcul asynchrone de tous les scores des ONGs actives — exécuté via pg_cron en batches de 50 ONGs maximum par cycle, complet en < 30 minutes pour 500 ONGs actives
**And** l'avancement du recalcul de masse est visible dans le dashboard back-office (nb ONGs recalculées / total)
**And** le tableau liste toutes les versions avec : statut, date d'activation, créateur, nb ONGs scorées avec cette version

> **Avancement :** Aucun code lié. Dépend de Story 4.1.

---

## Epic 5 : Abonnement Vanilla Pay & Audit Trail Financier

### Story 5.1 — Implémentation payment.service.ts & Merkle Chain SHA-256 (FR32, FR38) ⬜

En tant que système,
je veux que toute transaction financière suive la séquence canonique et soit chaînée via Merkle SHA-256,
afin que l'immuabilité et la traçabilité cryptographique soient garanties dès la première transaction réelle.

**Acceptance Criteria :**

**Given** `payment.service.ts` en stub depuis Epic 1 et `audit.service.ts` avec INSERT simple depuis Epic 3
**When** `processPayment(payload)` est invoqué
**Then** la séquence exacte est : validation Zod → vérification idempotence (`idempotency_key`) → BEGIN → INSERT `financial_transactions` → `insertAuditEntry()` avec hash Merkle → COMMIT → `triggerScoreRecalculation()` async
**And** `insertAuditEntry()` calcule le hash SHA-256 de l'entrée concaténée avec le hash de l'entrée précédente (chaîne Merkle)
**And** les entrées pré-Merkle d'Epic 3 sont annotées `"pre-merkle": true` dans leurs métadonnées — elles ne rompent pas la chaîne
**And** un `idempotency_key` identique retourne le résultat de la première exécution sans double traitement (NFR16)
**And** les triggers BEFORE UPDATE et BEFORE DELETE sur `financial_transactions` lèvent `RAISE EXCEPTION 'immutable'` (NFR9)
**And** les données financières au repos sont chiffrées AES-256 (NFR7)
**And** aucune clé API Vanilla Pay n'est exposée côté client (NFR13)
**And** les fonctionnalités d'Epic 3 (journalisation via `insertAuditEntry()`, historique dossier, messagerie BO↔ONG) passent leurs tests existants sans modification après déploiement de Story 5.1

> **Avancement :** Aucun code lié. Dépend de Stories 1.5 (stubs), 1.6 (Spike Vanilla Pay), 3.x (audit.service.ts actif).

---

### Story 5.2 — Parcours Abonnement Vanilla Pay Agent (FR32, FR33, FR34, FR35) ⬜

En tant que `user_agent`,
je veux souscrire à l'abonnement "Vérifié" et gérer son état depuis mon tableau de bord,
afin de maintenir mon badge actif en payant 20 000 Ar/mois via Vanilla Pay.

**Acceptance Criteria :**

**Given** un `user_agent` avec badge `verified` sur `/dashboard/agent/subscription`
**When** il initie le paiement mensuel
**Then** il est redirigé vers le flux Vanilla Pay (MVola/Orange/Airtel) avec montant 20 000 Ar et `idempotency_key` généré
**And** le handler `subscription.payment` dans `vanilla-pay.post.ts` reçoit le webhook, vérifie la signature HMAC, et invoque `processPayment()`
**And** en cas d'échec de paiement, une période de grâce de 3 jours est accordée avant que le badge passe à `suspended` (FR34)
**And** lors de la régularisation du paiement, le badge repasse automatiquement à `verified` (FR35)
**And** l'état de l'abonnement (actif/suspendu, date de renouvellement) est visible sur `/dashboard/agent/subscription` (FR33)
**And** un email de notification est envoyé à chaque changement d'état (certification, suspension, réactivation) via `email.service.ts` (FR43)
**And** en cas d'échec du webhook Vanilla Pay, 3 tentatives avec backoff exponentiel sont effectuées avant insertion d'une alerte dans `ops_alerts` (NFR20)

> **Avancement :** Aucun code lié.

---

### Story 5.3 — Composant TransactionStatusBadge, UX Paiement & Notifications Expiration (UX-DR7, FR43, FR46) ⬜

En tant que `user_agent`,
je veux voir l'état de mes transactions en temps réel et être notifié avant l'expiration de mon abonnement,
afin d'anticiper les actions nécessaires pour maintenir mon badge actif.

**Acceptance Criteria :**

**Given** le composant `TransactionStatusBadge` créé avec props `status`, `amount?`, `currency?`
**When** une transaction est affichée
**Then** les 4 états sont rendus correctement : `completed` (vert) / `pending` (ambre) / `failed` (rouge) / `refunded` (gris) (UX-DR7)
**And** le montant et la devise sont affichés si fournis en props
**And** 7 jours avant la date de renouvellement, un email de rappel est envoyé via `email.service.ts` (FR46)
**And** un `UToast` succès s'affiche après paiement réussi — auto-dismiss 4s en bas-droite (UX-DR13)
**And** un `UToast` erreur persistant (non auto-dismiss) s'affiche en cas d'échec de paiement (UX-DR13)
**And** le parcours paiement est désactivé si `NUXT_PUBLIC_FEATURE_PAYMENTS=false` (feature flag)
**And** un timeout de requête affiche un message d'erreur explicite avec option de réessai — jamais de page blanche (NFR27)

> **Avancement :** Aucun code lié. Dépend de Story 5.2.

---

## Epic 6 : Marketplace Bailleur & Découverte

### Story 6.1 — Infrastructure Feature Marketplace & pdf.service.ts ⬜

En tant que développeur,
je veux initialiser `~/features/marketplace/` et implémenter `pdf.service.ts` via Supabase Edge Functions,
afin que la marketplace et la génération de rapports PDF puissent être construites sur des fondations opérationnelles.

**Acceptance Criteria :**

**Given** la feature `~/features/marketplace/` inexistante
**When** l'infrastructure est créée
**Then** les dossiers `~/features/marketplace/components/`, `~/features/marketplace/composables/`, `~/features/marketplace/pages/` existent
**And** `pdf.service.ts` est implémenté via Playwright dans une Supabase Edge Function
**And** un smoke test CI/CD vérifie `POST /functions/v1/generate-pdf → HTTP 200` en staging
**And** les PDFs générés sont stockés dans Supabase Storage à `/reports/{ong_id}/{report_id}.pdf` avec URL d'accès signée
**And** la génération d'un PDF se complète en < 30 secondes (NFR5)
**And** les PDFs sont conformes au standard ISO 32000 et s'ouvrent sans plugin dans les navigateurs modernes (NFR23)
**And** le pipeline CI/CD Supabase Functions est distinct du pipeline principal Netlify

> **Avancement :** Aucun `features/marketplace/`, aucun `pdf.service.ts`. Entièrement à faire.

---

### Story 6.2 — Liste Publique ONGs & Filtres URL-Persistent (FR25, FR28) 🔄

En tant que `user_partner` et visiteur,
je veux rechercher des ONGs certifiées avec des filtres combinés et naviguer dans les résultats,
afin de trouver rapidement les partenaires pertinents pour mes objectifs.

**Acceptance Criteria :**

**Given** un visiteur ou `user_partner` sur `/marketplace`
**When** la page se charge
**Then** la liste des ONGs certifiées est affichée avec `OngProfileCard` variante `standard` (logo, nom, mission, badge, score, CTA) (UX-DR5)
**And** les filtres disponibles sont : secteur d'activité, région, Score minimum, badge `✓ Vérifié` — combinés avec opérateur ET (UX-DR20)
**And** les filtres actifs sont persistés dans l'URL (`?q=&secteur=&region=&score_min=&badge=`) pour permettre le partage de lien (UX-DR20)
**And** la recherche textuelle a un debounce de 300ms (UX-DR20)
**And** un badge "N filtres actifs" avec bouton `[× Tout effacer]` s'affiche si des filtres sont actifs (UX-DR20)
**And** les résultats sont retournés en < 2s pour un catalogue de 1 000 ONGs (NFR4)
**And** un `empty state` s'affiche si aucun résultat ne correspond aux filtres (UX-DR16)
**And** les images et logos sont chargés en lazy loading (NFR26)

> **Avancement :** `OngList.client.vue` + `OngListFilter.vue` avec filtres recherche texte, catégorie, statut, localisation. Données depuis Supabase ou mock. **Reste à faire :** persistence URL (`?q=&secteur=&region=&score_min=&badge=`), debounce 300ms, filtre Score minimum, filtre badge "✓ Vérifié", badge "N filtres actifs + [× Tout effacer]", lazy loading images, résultats < 2s pour 1000 ONGs.

---

### Story 6.3 — Profil Public ONG & Téléchargement Rapport PDF (FR26, FR27) 🔄

En tant que `user_partner`,
je veux consulter le profil complet d'une ONG certifiée et télécharger son rapport de vérification PDF,
afin d'évaluer l'ONG avant un engagement financier.

**Acceptance Criteria :**

**Given** un `user_partner` ou visiteur sur `/marketplace/ong/[slug]`
**When** la page se charge
**Then** la hero section affiche : `BadgeVerifie` › score strip `ScoreTransparenceWidget` › critères pills › CTA PDF (UX-DR11)
**And** les sections du profil respectent la configuration de visibilité définie par le `user_agent` (FR9, NFR8 RLS)
**And** un bouton "Télécharger le rapport PDF" déclenche `pdf.service.ts` et retourne un lien de téléchargement en < 30s (FR27, NFR5)
**And** le log d'accès est enregistré pour chaque consultation par un `user_partner` : date, ONG consultée, identifiant `user_partner` pseudonymisé (FR50)
**And** la page se charge en < 3s sur 3G simulé 1Mbps (NFR1)
**And** un skeleton loader s'affiche pendant le chargement du profil (UX-DR15)
**And** les visiteurs non authentifiés peuvent accéder au profil public mais pas à l'historique des financements

> **Avancement :** `pages/ongs/[id]/index.vue` + `OngDetail.client.vue` avec tabs About/Projects/Financials/Transparency/Documents/Donation. **Reste à faire :** hero section spec (BadgeVerifie + ScoreTransparenceWidget), skeleton loaders, log accès bailleur (FR50), bouton téléchargement PDF (pdf.service.ts), skeleton loaders.

---

### Story 6.4 — Favoris, Notifications & Historique Financements (FR29, FR30, FR31) ⬜

En tant que `user_partner`,
je veux sauvegarder des ONGs favorites, être notifié de leur certification et consulter leur historique de financements,
afin de suivre les organisations qui m'intéressent et préparer mes décisions.

**Acceptance Criteria :**

**Given** un `user_partner` authentifié sur le profil d'une ONG
**When** il clique "Ajouter aux favoris"
**Then** l'ONG est ajoutée à sa liste de favoris accessible depuis `/dashboard/partner/favorites` (FR29)
**And** pour une ONG en statut `pending`, le CTA "Être notifié quand certifiée" remplace le bouton favoris (UX-DR18)
**And** quand l'ONG obtient son badge `✓ Vérifié`, un email de notification est envoyé aux `user_partner` abonnés à ses alertes
**And** la section "Historique des financements" sur le profil public affiche des montants agrégés anonymisés — sans identifiant bailleur individuel (FR30)
**And** le `user_agent` peut consulter la vue d'intérêt depuis `/dashboard/agent/views` : liste de consultations avec identifiants bailleurs pseudonymisés (FR31)
**And** l'accès favoris est protégé par authentification — redirection `/login?redirect=` pour les visiteurs non authentifiés

> **Avancement :** Aucun code lié. Dépend de Story 5.x (Vanilla Pay) et 6.3.

---

## Epic 7 : Virements Bailleurs & Analytics Back-office

### Story 7.1 — Handler Virements Vanilla Pay & Immuabilité (FR36, FR37, FR38) ⬜

En tant que `user_partner`,
je veux virer des fonds directement vers une ONG via Vanilla Pay avec traçabilité cryptographique irréfutable,
afin de financer des projets en toute transparence.

**Acceptance Criteria :**

**Given** un `user_partner` authentifié sur le profil d'une ONG certifiée
**When** il initie un virement
**Then** il saisit le montant (minimum défini par l'ONG) et sélectionne le projet cible
**And** il est redirigé vers le flux Vanilla Pay avec `idempotency_key` généré et montant confirmé
**And** le handler `donation.payment` dans `vanilla-pay.post.ts` reçoit le webhook, vérifie la signature HMAC, et invoque `processPayment()` avec la séquence Merkle canonique
**And** le virement est enregistré dans `financial_transactions` (append-only immuable) avec hash Merkle chaîné (FR38, NFR9)
**And** le `user_agent` peut consulter l'historique complet des transactions reçues depuis `/dashboard/agent/transactions` (FR37)
**And** chaque entrée d'historique affiche : date, montant, statut `TransactionStatusBadge`, identifiant virement pseudonymisé
**And** en cas d'échec webhook, 3 tentatives avec backoff exponentiel avant alerte `ops_alerts` (NFR20)

> **Avancement :** Aucun code lié. Dépend de Stories 5.1 (Merkle) et 1.2 (tables).

---

### Story 7.2 — Preuve d'Immuabilité & Hash SHA-256 Quotidien (FR41, FR42) ⬜

En tant que `user_partner` et `back_office`,
je veux pouvoir vérifier l'immuabilité d'une transaction et consulter le hash journalier de l'audit trail,
afin de prouver qu'aucune donnée financière n'a été falsifiée.

**Acceptance Criteria :**

**Given** une transaction dans l'historique d'un `user_partner`
**When** il clique "Voir la preuve d'immuabilité"
**Then** une page affiche : hash SHA-256 de la transaction, hash de la chaîne Merkle au moment de l'insertion, horodatage ISO 8601 (FR42)
**And** un job pg_cron génère quotidiennement le hash SHA-256 de l'intégralité de l'audit trail et le stocke dans une table séparée hors base principale (FR41, NFR10)
**And** le `back_office` peut consulter les hashs journaliers via `/back-office/audit/integrity` avec comparaison automatique hash attendu vs hash calculé
**And** une divergence de hash déclenche une alerte dans `ops_alerts` et un email au `back_office`
**And** le `back_office` peut exporter un rapport d'audit complet pour une période donnée en CSV ou PDF (FR40)

> **Avancement :** Aucun code lié.

---

### Story 7.3 — Dashboard Back-office & Métriques Live (FR47) ⬜

En tant que `back_office`,
je veux un tableau de bord global avec des métriques en temps réel,
afin de piloter la plateforme et détecter les anomalies rapidement.

**Acceptance Criteria :**

**Given** un `back_office` authentifié sur `/back-office/dashboard`
**When** la page se charge
**Then** les métriques live affichées sont : nb ONGs certifiées, nb dossiers en attente, volume total transactions (Ar), Score moyen de la plateforme (FR47)
**And** les métriques sont rafraîchies automatiquement toutes les 60 secondes sans rechargement de page
**And** la topbar de toutes les pages back-office reprend les métriques urgentes condensées (UX-DR11, UX-DR19)
**And** le temps de chargement initial du dashboard est < 3s (NFR1)
**And** un skeleton loader s'affiche pendant le premier chargement des métriques (UX-DR15)
**And** un `empty state` s'affiche si aucune métrique n'est encore disponible (UX-DR16)

> **Avancement :** Aucun code lié. Dépend de Story 3.1 (features/back-office/).

---

### Story 7.4 — Rapports Agrégés, Exports & Gestion Paramètres Plateforme (FR40, FR48, FR49, FR50, FR51) ⬜

En tant que `back_office`,
je veux générer des rapports anonymisés, exporter les données et gérer les paramètres de la plateforme,
afin d'assurer le reporting externe et l'administration opérationnelle.

**Acceptance Criteria :**

**Given** un `back_office` sur `/back-office/reports`
**When** il génère un rapport d'activité pour une période donnée
**Then** le rapport contient des données agrégées anonymisées : nb transactions, volumes par secteur, Score moyen — sans identifiant individuel (FR48)
**And** le rapport est exportable en PDF (via `pdf.service.ts`) et en CSV — les PDF sont conformes ISO 32000 (NFR23)
**And** la liste complète des ONGs certifiées avec métadonnées (nom, secteur, zone, Score, date certification) est exportable en CSV (FR51)
**And** la page Paramètres (`/back-office/settings`) permet de modifier : critères du Score, tarif abonnement, messages types email — chaque modification est journalisée dans `audit.service.ts` (FR49, FR39)
**And** le log d'accès des bailleurs (FR50) est consultable en tableau avec pagination curseur `PaginatedResponse<T>` et exportable en CSV
**And** tous les exports se génèrent en < 30s (NFR5)

> **Avancement :** Aucun code lié. Dépend de Stories 7.1, 7.2, 7.3, 6.1 (pdf.service.ts).
