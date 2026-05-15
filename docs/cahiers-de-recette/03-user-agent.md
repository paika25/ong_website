# CR-03 — Agent ONG / Gestionnaire (user_agent)

**Compte** : AGENT_A (user_agent, possède ONG_A active) et AGENT_B (user_agent, sans ONG)  
**Prérequis** : Se connecter avant chaque module.

---

## A1 — Dashboard agent

### A1-01 — Dashboard affiche le bloc ONG
`[ ]` `P1`

1. Connexion AGENT_A → `/dashboard`
2. ✅ Bloc "Mon ONG" présent avec le nom de ONG_A et son statut
3. ✅ Bloc "Mes Dons" / `DashboardPartnerDonations` **absent**

---

### A1-02 — Dashboard agent sans ONG
`[ ]` `P1`

1. Connexion AGENT_B (sans ONG) → `/dashboard`
2. ✅ État vide avec appel à l'action "Créer mon ONG"
3. ✅ Le lien pointe vers `/ongs/new`, pas de crash

---

## A2 — Création d'ONG

### A2-01 — Accès à la page de création
`[ ]` `P1`

1. Connecté AGENT_B, naviguer vers `/ongs/new`
2. ✅ Formulaire affiché, onglet "Informations générales" actif

---

### A2-02 — Création avec champs obligatoires
`[ ]` `P1`

1. Remplir : Nom "ONG Recette Test", Description (> 10 chars), Catégorie "Social"
2. Laisser les autres champs vides
3. Cliquer "Créer" / soumettre
4. ✅ Redirection vers `/ongs/[new-id]/edit`
5. ✅ L'ONG apparaît dans le dashboard de AGENT_B

---

### A2-03 — Validation champs obligatoires manquants
`[ ]` `P2`

1. Laisser le nom vide, ne pas sélectionner de catégorie
2. Soumettre
3. ✅ Erreurs affichées sur chaque champ manquant
4. ✅ Aucun appel API, pas de redirection

---

### A2-04 — Upload image de couverture valide
`[ ]` `P2`

1. Dans le formulaire, glisser une image JPG < 5 Mo
2. ✅ Prévisualisation affichée avant sauvegarde
3. Sauvegarder
4. ✅ Image visible sur la page publique `/ongs/[id]`

---

### A2-05 — Rejet image > 5 Mo
`[ ]` `P2`

1. Tenter d'uploader un fichier > 5 Mo
2. ✅ Message d'erreur "Fichier trop lourd — 5 Mo max" ou équivalent
3. ✅ Aucun upload déclenché

---

## A3 — Édition de l'ONG

### A3-01 — Accès à l'édition de sa propre ONG
`[ ]` `P1`

1. Connecté AGENT_A, naviguer vers `/ongs/[id-ONG_A]/edit`
2. ✅ Formulaire affiché avec données actuelles pré-remplies
3. ✅ Badge de statut (Active / En attente) visible

---

### A3-02 — Sauvegarde des modifications
`[ ]` `P1`

1. Modifier le nom (ajouter "_v2"), la description, la localisation
2. Sauvegarder
3. ✅ Modifications persistées en base
4. ✅ Page publique `/ongs/[id]` reflète les nouvelles valeurs
5. ✅ `updated_at` mis à jour

---

### A3-03 — Navigation entre onglets du formulaire
`[ ]` `P2`

1. Sur `/ongs/[id]/edit`, cliquer sur chaque onglet disponible
2. ✅ Chaque onglet s'affiche sans erreur
3. ✅ Données saisies dans un onglet non perdues en changeant d'onglet

---

## A4 — Score de transparence

### A4-01 — Accès à la page score
`[ ]` `P1`

1. Connecté AGENT_A, naviguer vers `/dashboard/agent/score`
2. ✅ Page affichée avec le score actuel et les critères
3. ✅ `ScoreTransparenceWidget` rendu sans erreur

---

### A4-02 — Clic sur un critère actionnable
`[ ]` `P2`

1. Sur la page score, cliquer sur un critère avec une action
2. ✅ Navigation vers la page correspondante (ex. édition de l'ONG)

---

## A5 — Visibilité publique de l'ONG

### A5-01 — Accès à la page visibilité
`[ ]` `P1`

1. Connecté AGENT_A, naviguer vers `/dashboard/agent/ong/visibility`
2. ✅ Liste des sections configurables affichée
3. ✅ Retour vers l'édition de l'ONG fonctionnel

---

### A5-02 — Activation/désactivation d'une section
`[ ]` `P2`

1. Basculer le toggle d'une section (ex. "Financiers")
2. ✅ Changement persisté
3. Vérifier sur la page publique `/ongs/[id]`
4. ✅ La section masquée n'apparaît pas pour un visiteur

---

## A6 — Récapitulatif imprimable

### A6-01 — Accès et impression
`[ ]` `P2`

1. Naviguer vers `/ongs/[id-ONG_A]/recap`
2. ✅ Récapitulatif complet affiché (en-tête, statut, données)
3. Cliquer "Imprimer / Sauvegarder en PDF"
4. ✅ Dialog d'impression ouvert

---

## A7 — Restrictions de rôle (agent)

### A7-01 — Édition d'une ONG qui ne lui appartient pas — UI
`[ ]` `P1`

1. Connecté AGENT_B, naviguer vers `/ongs/[id-ONG_A]/edit`
2. ✅ Redirection vers `/dashboard`
3. ✅ Formulaire d'édition de ONG_A jamais affiché

---

### A7-02 — RLS — tentative de modification directe ONG_A par AGENT_B
`[ ]` `P1`

1. Récupérer le JWT de AGENT_B (DevTools → localStorage)
2. Exécuter via curl/Postman :
   ```
   PATCH /rest/v1/ongs?id=eq.[id-ONG_A]
   Authorization: Bearer <token_AGENT_B>
   Body: {"name": "Compromis"}
   ```
3. ✅ Réponse : 0 lignes modifiées (RLS bloque silencieusement)
4. ✅ Nom de ONG_A inchangé en base

---

### A7-03 — Pages admin bloquées pour un agent
`[ ]` `P1`

1. Connecté AGENT_A, tester `/admin/ongs`, `/admin/verification`, `/admin/donations`, `/admin/historique`
2. ✅ Chaque URL redirige (réservé back-office)

---

### A7-04 — Un agent ne voit pas le bloc "Mes Dons"
`[ ]` `P2`

1. Connecté AGENT_A → `/dashboard`
2. ✅ `DashboardPartnerDonations` absent du DOM

---

## A8 — Profil agent

### A8-01 — Modification du profil
`[ ]` `P1`

1. Naviguer vers `/Profil`
2. Modifier prénom, bio, localisation, sauvegarder
3. ✅ Modifications persistées et affichées dans le header

---

## A9 — Déconnexion

### A9-01 — Déconnexion propre
`[ ]` `P1`

1. Se déconnecter depuis le header
2. ✅ Naviguer vers `/ongs/[id]/edit` → redirection login
3. ✅ localStorage vidé
