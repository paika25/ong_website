# CR-02 — Partenaire / Donateur (user_partner)

**Compte** : PARTNER_A (user_partner, au moins 2 dons en base)  
**Prérequis** : Se connecter en tant que PARTNER_A avant chaque module.

---

## P1 — Dashboard partenaire

### P1-01 — Dashboard affiche le bloc dons (pas le bloc ONG)
`[ ]` `P1`

1. Connexion avec PARTNER_A → aller sur `/dashboard`
2. ✅ Section "Mes Dons" visible avec tableau historique
3. ✅ Section "Mon ONG" / `DashboardAgentOng` **absente**
4. ✅ Raccourcis "Mon Profil" et "Explorer" présents

---

### P1-02 — Statistiques dons correctes
`[ ]` `P1`

1. Sur `/dashboard`, relever le nombre de dons et le total affiché
2. ✅ Chiffres cohérents avec les dons de PARTNER_A en base
3. ✅ Aucun don de PARTNER_B dans la liste

---

### P1-03 — Dashboard sans don (compte neuf)
`[ ]` `P2`

**Précondition** : créer PARTNER_C sans aucun don

1. Connexion PARTNER_C → `/dashboard`
2. ✅ État vide affiché ("Aucun don" ou similaire), pas de crash
3. ✅ Total = 0 €, compteur = 0

---

### P1-04 — Tableau dons : colonnes et données
`[ ]` `P2`

1. Sur `/dashboard` avec PARTNER_A
2. ✅ Colonnes présentes : Date, ONG, Type, Montant, Statut
3. ✅ Les données correspondent aux dons de PARTNER_A

---

## P2 — Exploration des ONGs

### P2-01 — Accès à la liste et détail ONG
`[ ]` `P1`

1. Connecté PARTNER_A, naviguer vers la liste des ONGs
2. ✅ Liste visible, filtres fonctionnels
3. Cliquer sur une ONG
4. ✅ Tous les onglets de détail accessibles sans erreur

---

### P2-02 — Onglet Don — chargement sans erreur 401
`[ ]` `P1`

1. Ouvrir la page détail d'une ONG, aller sur l'onglet "Don"
2. Ouvrir DevTools → onglet Network
3. ✅ Aucune requête `/api/_nuxt_icon/*` ne retourne 401
4. ✅ Les icônes (ex. `credit-card`) sont visibles dans la page
5. ✅ Aucune erreur console

---

### P2-03 — Onglet Don actif pour un partenaire connecté
`[ ]` `P1`

1. Sur l'onglet "Don" d'une ONG avec opportunités
2. ✅ Les boutons de montant sont cliquables
3. Sélectionner un montant prédéfini
4. ✅ Bouton "Faire un don" activé
5. Sélectionner "Autre montant", saisir une valeur < minimum
6. ✅ Bouton "Faire un don" désactivé

---

### P2-04 — Récapitulatif imprimable ONG accessible
`[ ]` `P2`

1. Naviguer vers `/ongs/[id]/recap`
2. ✅ Page affichée avec les données de l'ONG

---

## P3 — Profil

### P3-01 — Accès à la page profil
`[ ]` `P1`

1. Naviguer vers `/Profil`
2. ✅ Profil de PARTNER_A affiché (pas celui d'un autre utilisateur)
3. ✅ Header avec initiales/nom, type "Partenaire"
4. ✅ Onglets Activité, ONGs, Projets accessibles

---

### P3-02 — Modification du profil
`[ ]` `P1`

1. Cliquer "Modifier le profil"
2. Changer le prénom, la bio, la localisation
3. Ajouter une compétence via le champ + touche Entrée
4. Sauvegarder
5. ✅ Modifications persistées en base
6. ✅ Header profil mis à jour immédiatement

---

### P3-03 — Annulation sans sauvegarde
`[ ]` `P2`

1. Ouvrir le formulaire d'édition, modifier plusieurs champs
2. Cliquer "Annuler"
3. ✅ Valeurs d'origine restaurées, aucun appel API effectué

---

### P3-04 — Suppression d'une compétence
`[ ]` `P3`

1. Ajouter 3 compétences, sauvegarder
2. Rouvrir l'édition, cliquer sur la croix d'une compétence
3. Sauvegarder
4. ✅ 2 compétences restantes en base, la supprimée absente

---

## P4 — Account Settings

### P4-01 — Accès aux paramètres du compte
`[ ]` `P1`

1. Naviguer vers `/account/settings`
2. ✅ Page affichée avec deux sections : "Adresse email" et "Mot de passe"
3. ✅ L'email actuel de PARTNER_A est visible

---

### P4-02 — Changement de mot de passe
`[ ]` `P1`

1. Saisir le mot de passe actuel, un nouveau mot de passe valide, et la confirmation
2. Cliquer "Changer le mot de passe"
3. ✅ Message de succès affiché
4. Se déconnecter et se reconnecter avec le nouveau mot de passe
5. ✅ Connexion réussie

---

### P4-03 — Mauvais mot de passe actuel
`[ ]` `P2`

1. Saisir un mot de passe actuel incorrect
2. ✅ Message d'erreur, pas de changement effectué

---

### P4-04 — Changement d'email
`[ ]` `P2`

1. Saisir une nouvelle adresse email valide
2. Cliquer "Changer l'email"
3. ✅ Message de confirmation (email de vérification envoyé)

---

## P5 — Restrictions de rôle

### P5-01 — Création d'ONG bloquée pour un partenaire
`[ ]` `P1`

1. Connecté PARTNER_A, naviguer vers `/ongs/new`
2. ✅ Redirection vers `/dashboard`
3. ✅ Formulaire de création jamais affiché

---

### P5-02 — Édition d'ONG bloquée pour un partenaire
`[ ]` `P1`

1. Connecté PARTNER_A, naviguer vers `/ongs/[id_valide]/edit`
2. ✅ Redirection vers `/dashboard`

---

### P5-03 — Pages admin bloquées pour un partenaire
`[ ]` `P1`

1. Tester `/admin/ongs`, `/admin/verification`, `/admin/donations`, `/admin/historique`
2. ✅ Chaque URL redirige vers `/dashboard`

---

### P5-04 — Score transparence inaccessible
`[ ]` `P2`

1. Naviguer vers `/dashboard/agent/score`
2. ✅ Redirection (réservé aux agents)

---

### P5-05 — Visibilité ONG inaccessible
`[ ]` `P2`

1. Naviguer vers `/dashboard/agent/ong/visibility`
2. ✅ Redirection (réservé aux agents)

---

## P6 — Déconnexion

### P6-01 — Déconnexion propre
`[ ]` `P1`

1. Utiliser l'action de déconnexion depuis le header
2. ✅ Redirection vers `/` ou `/auth/login`
3. ✅ Naviguer vers `/dashboard` → redirection login
4. ✅ localStorage vidé (pas de token ni de données user)
