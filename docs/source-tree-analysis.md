# Analyse de l'arborescence — Paika ONG Platform

**Date :** 2026-05-13

---

```
ONG/                                    ← Racine du projet
│
├── app.vue                             ← Point d'entrée Nuxt (NuxtLayout + NuxtPage)
├── nuxt.config.ts                      ← Config Nuxt (modules, runtimeConfig, nitro preset)
├── tailwind.config.ts                  ← Config Tailwind (container max 1400px, couleurs CSS vars)
│
├── pages/                              ← Routage file-based Nuxt
│   ├── index.vue                       ← Landing : liste publique des ONGs [layout: false]
│   ├── dashboard.vue                   ← Dashboard user (agent/partenaire) [layout: default]
│   ├── Profil.vue                      ← Profil utilisateur [layout: default]
│   │
│   ├── auth/                           ← Pages auth [layout: false, middleware: guest]
│   │   ├── Login.vue
│   │   ├── SignUp.vue
│   │   ├── forgot.vue
│   │   ├── reset-password.vue
│   │   └── callback.vue
│   │
│   ├── ongs/
│   │   ├── new.vue                     ← Création dossier ONG (stepper) [layout: default]
│   │   └── [id]/
│   │       ├── index.vue               ← Fiche publique ONG [layout: false, avec Footer]
│   │       ├── edit.vue                ← Édition ONG agent [layout: default]
│   │       └── recap.client.vue        ← Récapitulatif PDF [layout: false]
│   │
│   ├── dashboard/
│   │   └── agent/
│   │       ├── score.client.vue        ← Score transparence agent [layout: default]
│   │       └── ong/
│   │           └── visibility.vue      ← Visibilité sections publiques [layout: default]
│   │
│   ├── admin/                          ← Back-office [layout: admin, middleware: back-office]
│   │   ├── verification.vue            ← Pipeline Kanban certification
│   │   ├── donations.vue               ← Liste des dons Stripe
│   │   ├── historique.vue              ← Audit trail
│   │   └── ongs.vue                    ← Liste ONGs admin
│   │
│   ├── account/
│   │   └── settings.vue                ← Paramètres compte [layout: default]
│   ├── terms.vue                       ← CGU [layout: false]
│   └── privacy.vue                     ← Politique confidentialité [layout: false]
│
├── layouts/
│   ├── default.vue                     ← Header sticky + slot (pages utilisateur)
│   └── admin.vue                       ← Sidebar nav + main (pages back-office)
│
├── components/                         ← Composants globaux (auto-import Nuxt)
│   ├── Header.vue                      ← En-tête app (logo + UserHeader)
│   ├── Footer.client.vue               ← Pied de page
│   ├── OngStatus.vue                   ← Badge statut ONG
│   ├── ThemeToggle.client.vue          ← Bascule light/dark
│   └── VilleAutoCompletion.vue         ← Autocomplétion villes
│
├── features/                           ← Modules métier (DDD-lite)
│   │
│   ├── auth/
│   │   ├── components/
│   │   │   ├── UserHeader.client.vue   ← Nav + profil + déconnexion dans le header
│   │   │   ├── Login.client.vue
│   │   │   ├── Signup.client.vue
│   │   │   ├── ForgotPassword.client.vue
│   │   │   ├── ResetPassword.client.vue
│   │   │   └── AccountSettings.client.vue
│   │   └── stores/
│   │       └── auth.client.ts          ← Store Pinia : currentUser, userInitials
│   │
│   ├── user/
│   │   ├── components/
│   │   │   ├── DashboardWelcome.vue    ← Accueil dashboard (contextuel au rôle)
│   │   │   ├── DashboardPartnerDonations.vue
│   │   │   ├── DashboardCardProfil.vue
│   │   │   ├── ProfilHeader.client.vue
│   │   │   ├── ProfilEditForm.client.vue
│   │   │   ├── ProfilTabOngs.client.vue
│   │   │   ├── ProfilTabActivite.client.vue
│   │   │   └── ProfilTabProjets.client.vue
│   │   ├── composables/
│   │   │   └── useStats.ts             ← Stats donations/ONGs/projets
│   │   └── services/
│   │       ├── user.donations.ts
│   │       ├── user.ongs.ts
│   │       └── user.projects.ts
│   │
│   ├── ong/
│   │   ├── components/
│   │   │   ├── DashboardAgentOng.vue   ← Dashboard agent : complétude, statut, CTA
│   │   │   ├── DashboardFloatingChat.vue ← Widget messagerie flottant (Teleport)
│   │   │   ├── DashboardCardExplorer.vue
│   │   │   ├── OwnOng.vue              ← Carte ONG complète (agent)
│   │   │   ├── OwnOngForm.vue          ← Formulaire édition ONG
│   │   │   ├── Card.vue                ← Carte ONG publique
│   │   │   ├── OngList.client.vue      ← Liste publique avec filtres
│   │   │   ├── OngListFilter.vue
│   │   │   ├── OngProfile.client.vue   ← Profil public ONG complet
│   │   │   ├── OngDetail.client.vue    ← Wrapper tabs détail ONG
│   │   │   ├── OngDetailHeader.vue
│   │   │   ├── OngDetailTabAbout.vue
│   │   │   ├── OngDetailTabDocuments.vue
│   │   │   ├── OngDetailTabFinancials.vue
│   │   │   ├── OngDetailTabImpact.vue
│   │   │   ├── OngDetailTabProjects.vue
│   │   │   ├── OngDetailTabTransparency.vue
│   │   │   ├── OngDetailTabDonation.vue
│   │   │   └── OngDetailTabVolunteers.vue
│   │   ├── services/
│   │   │   ├── ongService.ts           ← CRUD ONG (Supabase direct)
│   │   │   └── ong-agent.service.ts    ← Actions agent (resubmit)
│   │   └── type.ts                     ← Type ONG, SectionVisibility, etc.
│   │
│   ├── ong-profile/
│   │   ├── components/
│   │   │   ├── OngDossierStepper.vue   ← Orchestrateur 5 étapes + modal soumission
│   │   │   ├── StepperForm.vue
│   │   │   ├── OngStepIdentite.vue
│   │   │   ├── OngStepMission.vue
│   │   │   ├── OngStepDocuments.vue    ← Upload documents + Storage Supabase
│   │   │   ├── OngStepProjets.vue
│   │   │   ├── OngStepContacts.vue
│   │   │   └── DocumentUploadZone.vue
│   │   └── pages/
│   │       └── OngDossierCreate.client.vue
│   │
│   ├── verification/
│   │   ├── components/
│   │   │   ├── PipelineKanban.vue      ← Kanban back-office (colonnes par statut)
│   │   │   ├── DossierMessagerie.vue   ← Chat back-office ↔ agent (Realtime)
│   │   │   ├── AuditTrailSection.vue   ← Historique actions par dossier
│   │   │   ├── ScoreTransparenceWidget.vue ← Visualisation score + critères
│   │   │   └── BadgeVerifie.vue
│   │   └── services/
│   │       └── messagerie.service.ts
│   │
│   ├── donations/
│   │   └── services/
│   │       └── donations.service.ts
│   │
│   ├── admin/
│   │   └── services/
│   │       └── admin.service.ts        ← Appels API back-office
│   │
│   └── score/
│       └── services/
│           └── score.service.ts        ← Calcul score côté client
│
├── server/
│   ├── middleware/
│   │   └── auth.ts                     ← Injecte userId dans event.context
│   ├── utils/
│   │   └── errors.ts                   ← Helpers erreurs Nitro
│   ├── services/                       ← Logique métier server-side
│   │   ├── ong-status.service.ts       ← Machine d'états ONG (SEUL point de changement)
│   │   ├── audit.service.ts            ← Insère dans audit_trail via RPC SECURITY DEFINER
│   │   ├── score.service.ts            ← Calcul score (5 critères, poids algo v1)
│   │   ├── payment.service.ts
│   │   ├── stripe.service.ts
│   │   ├── email.service.ts            ← Stub Brevo (non implémenté)
│   │   └── pdf.service.ts
│   └── api/                            ← Routes Nitro (voir api-contracts.md)
│
├── middleware/                         ← Guards navigation Nuxt
│   ├── auth.ts / auth.client.ts        ← Vérifie JWT, redirige si non auth
│   ├── agent-only.ts / .client.ts      ← Réservé aux user_agent
│   ├── partner-only.client.ts          ← Réservé aux user_partner
│   ├── back-office.ts                  ← Réservé admin/back_office
│   └── guest.client.ts                 ← Redirige si déjà connecté
│
├── supabase/
│   └── migrations/                     ← 17 migrations SQL (idempotentes)
│       ├── 01 → financial-transactions
│       ├── 02 → algorithm-versions
│       ├── 03 → score-tables
│       ├── 04 → audit-ops (audit_trail, ops_alerts)
│       ├── 05 → rls-policies
│       ├── 06 → pgcron-zombie-recovery
│       ├── 07 → jwt-role-claims (trigger + backfill)
│       ├── 08 → ong-section-visibility (JSONB)
│       ├── 09 → ong-status-submitted
│       ├── 10 → stripe-donations
│       ├── 11 → stripe-rls-policies
│       ├── 12 → dossier-messages
│       ├── 13 → status-suspended
│       ├── 14 → backoffice-audit-rls
│       ├── 15 → ongs-rls-backoffice
│       ├── 16 → fix-get-user-role (lit app_metadata.role)
│       └── 17 → audit-trail-rpc (insert_audit_entry SECURITY DEFINER)
│
├── assets/
│   └── css/
│       └── main.css                    ← Variables CSS Tailwind (tokens couleur light/dark)
│
└── docs/                               ← Documentation projet (ce dossier)
```
