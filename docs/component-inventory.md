# Inventaire des composants — Paika ONG Platform

**Date :** 2026-05-13

---

## Conventions

- Tous les composants en `.client.vue` sont rendus **côté client uniquement** (pas de SSR)
- Les composants dans `features/*/components/` sont importés **manuellement** (pas d'auto-import)
- Les composants dans `components/` sont **auto-importés** par Nuxt

---

## Composants globaux (`components/`)

| Composant | Usage | Notes |
|-----------|-------|-------|
| `Header.vue` | En-tête application | Logo + `<UserHeader>` via `<ClientOnly>` |
| `Footer.client.vue` | Pied de page | Sur index + ong detail |
| `OngStatus.vue` | Badge statut ONG | Accepte `status: string`, affiche couleur + label |
| `ThemeToggle.client.vue` | Bascule light/dark | Utilise Nuxt colorMode |
| `VilleAutoCompletion.vue` | Champ ville autocomplete | Réutilisé dans formulaires |

---

## Feature : Auth (`features/auth/`)

| Composant | Type | Description |
|-----------|------|-------------|
| `UserHeader.client.vue` | Navigation | Nav (Accueil/Dashboard), admin badge, avatar+nom, déconnexion |
| `Login.client.vue` | Formulaire | Connexion email/password |
| `Signup.client.vue` | Formulaire | Inscription avec choix de rôle |
| `ForgotPassword.client.vue` | Formulaire | Demande reset password |
| `ResetPassword.client.vue` | Formulaire | Nouveau mot de passe |
| `AccountSettings.client.vue` | Paramètres | Email, mot de passe, sessions actives |

---

## Feature : User (`features/user/`)

| Composant | Type | Description |
|-----------|------|-------------|
| `DashboardWelcome.vue` | En-tête dashboard | Salutation + sous-titre contextuel au rôle (`accountType`) |
| `DashboardPartnerDonations.vue` | Liste | Tableau historique dons partenaire + stats |
| `DashboardCardProfil.vue` | Card action | Raccourci vers `/profil` |
| `DashboardCardExplorer.vue` | Card action | Raccourci vers `/` |
| `ProfilHeader.client.vue` | En-tête profil | Avatar, nom, stats (ONGs, projets, dons) |
| `ProfilEditForm.client.vue` | Formulaire | Édition nom, bio, localisation, avatar |
| `Profil.client.vue` | Page wrapper | Assemble ProfilHeader + tabs |
| `ProfilTabOngs.client.vue` | Tab | ONGs de l'utilisateur |
| `ProfilTabActivite.client.vue` | Tab | Activité récente |
| `ProfilTabProjets.client.vue` | Tab | Projets |

---

## Feature : ONG (`features/ong/`)

| Composant | Type | Description |
|-----------|------|-------------|
| `DashboardAgentOng.vue` | Section dashboard | Barre complétude, statut, CTA soumission/resoumission, blocs d'état |
| `DashboardFloatingChat.vue` | Widget flottant | Chat messagerie en bas-droite (Teleport → body), toggle ouvert/fermé, badge non-lus |
| `OwnOng.vue` | Card ONG (agent) | Vue complète ONG de l'agent avec stats |
| `OwnOngForm.vue` | Formulaire | Édition complète : identité, mission, projets, contacts, financiers, légal, documents |
| `Card.vue` | Card publique | Mini-carte ONG pour la liste publique |
| `OngList.client.vue` | Liste | Liste publique avec filtres, stats globales |
| `OngListFilter.vue` | Filtres | Filtres catégorie/localisation |
| `OngProfile.client.vue` | Profil complet | Vue admin/partenaire de l'ONG |
| `OngDetail.client.vue` | Wrapper tabs | Tabs détail ONG (À propos, Documents, Financiers…) |
| `OngDetailHeader.vue` | En-tête ONG | Nom, statut, stats (bénévoles, projets, années) |
| `OngDetailTabAbout.vue` | Tab | Description + contacts |
| `OngDetailTabDocuments.vue` | Tab | Documents officiels |
| `OngDetailTabFinancials.vue` | Tab | Budget, allocation, rapports financiers |
| `OngDetailTabImpact.vue` | Tab | KPIs impact |
| `OngDetailTabProjects.vue` | Tab | Liste projets |
| `OngDetailTabTransparency.vue` | Tab | Score + infos légales + suivi |
| `OngDetailTabDonation.vue` | Tab | Formulaire don Stripe |
| `OngDetailTabVolunteers.vue` | Tab | Bénévoles |

---

## Feature : ONG Profile / Stepper (`features/ong-profile/`)

| Composant | Type | Description |
|-----------|------|-------------|
| `OngDossierStepper.vue` | Orchestrateur | Navigation 5 étapes + URL step + restore Supabase + modal soumission |
| `StepperForm.vue` | Layout | Wrapper étape avec navigation précédent/suivant |
| `OngStepIdentite.vue` | Étape 1 | Nom, forme juridique, adresse, catégorie |
| `OngStepMission.vue` | Étape 2 | Mission, secteurs, zones géographiques |
| `OngStepDocuments.vue` | Étape 3 | Upload statuts, récépissé, rapports (Storage Supabase) |
| `OngStepProjets.vue` | Étape 4 | Gestion projets (CRUD) |
| `OngStepContacts.vue` | Étape 5 | Responsable légal + contact communication + réseaux sociaux |
| `DocumentUploadZone.vue` | Upload | Zone drag & drop avec prévisualisation |

---

## Feature : Verification / Back-office (`features/verification/`)

| Composant | Type | Description |
|-----------|------|-------------|
| `PipelineKanban.vue` | Kanban | Colonnes par statut ONG, cartes dossiers, actions contextuelles |
| `DossierMessagerie.vue` | Chat | Messagerie Realtime (send, receive, read receipts). Prop `hideHeader` pour mode embarqué |
| `AuditTrailSection.vue` | Liste | Historique actions d'un dossier (pagination curseur) |
| `ScoreTransparenceWidget.vue` | Visualisation | Score + barre progression + détail critères + CTA actions |
| `BadgeVerifie.vue` | Badge | Badge certification affichable sur profil public |

---

## Layouts

| Layout | Composants inclus | Usage |
|--------|-----------------|-------|
| `layouts/default.vue` | Header sticky + slot | Dashboard, profil, ongs/new, settings, score, visibility |
| `layouts/admin.vue` | Header admin + sidebar nav + main | Toutes les pages `/admin/*` |

---

## Hiérarchie typographique (standard appliqué)

| Niveau | Classes Tailwind | Usage |
|--------|----------------|-------|
| H1 page | `text-2xl font-bold tracking-tight` | Titre unique par page |
| Sous-titre | `text-sm text-muted-foreground mt-1` | Description sous H1 |
| H2 section | `text-lg font-semibold` | Sections majeures |
| H3 sous-section | `text-base font-semibold` | Cards, sous-sections, états vides |
| H4 labels | `text-sm font-semibold` | Groupes de champs |
| Valeurs numériques | `text-2xl/3xl font-bold` | Stats, KPIs — intentionnellement gros |
