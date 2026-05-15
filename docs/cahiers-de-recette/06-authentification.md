# CR-06 — Authentification (tous profils)

**Périmètre** : Inscription, connexion, mot de passe oublié, réinitialisation, paramètres du compte.

---

## AUTH1 — Inscription

### AUTH1-01 — Inscription partenaire valide
`[ ]` `P1`

1. Aller sur `/auth/signup`, sélectionner "Partenaire"
2. Remplir : Prénom "Jean", Nom "Test", Email `jean-test@test.com`, MDP `Test1234!`, confirmation, accepter les CGU
3. Cliquer "S'inscrire"
4. ✅ Modal de succès : "Inscription réussie ! Un email de confirmation a été envoyé à…"
5. ✅ Email de confirmation reçu
6. ✅ Entrée créée dans `accounts` avec `account_type = 'user_partner'`

---

### AUTH1-02 — Inscription agent ONG valide
`[ ]` `P1`

1. Même flux avec "Agent ONG"
2. ✅ `account_type = 'user_agent'` en base

---

### AUTH1-03 — Confirmation email → connexion automatique
`[ ]` `P1`

1. Après AUTH1-01, cliquer le lien de confirmation dans l'email
2. ✅ Redirection vers `/auth/callback`
3. ✅ "Connexion réussie !" puis redirection vers `/dashboard`
4. ✅ `verified = true` dans `accounts`

---

### AUTH1-04 — Email déjà utilisé
`[ ]` `P1`

1. Tenter de s'inscrire avec un email existant en base
2. ✅ Message : "Cet email est déjà utilisé"
3. ✅ Pas de doublon en base

---

### AUTH1-05 — Mot de passe trop faible
`[ ]` `P2`

1. Saisir "abc" comme mot de passe
2. ✅ Erreur : "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre"
3. ✅ Bouton "S'inscrire" désactivé

---

### AUTH1-06 — Confirmation MDP non concordante
`[ ]` `P2`

1. Saisir "Password1!" / "Password2!" dans les deux champs
2. ✅ Erreur : "Les mots de passe ne correspondent pas"
3. ✅ Pas d'appel API

---

### AUTH1-07 — CGU non acceptées
`[ ]` `P2`

1. Remplir tous les champs, ne pas cocher les CGU, soumettre
2. ✅ Erreur : "Vous devez accepter les conditions d'utilisation"

---

## AUTH2 — Connexion

### AUTH2-01 — Connexion valide
`[ ]` `P1`

1. `/auth/login` → email + mot de passe corrects d'un compte confirmé
2. ✅ Redirection vers `/dashboard`
3. ✅ Nom visible dans le header

---

### AUTH2-02 — Mauvais mot de passe
`[ ]` `P1`

1. Email valide, mot de passe incorrect
2. ✅ Message : "Email ou mot de passe incorrect"
3. ✅ Pas de redirection

---

### AUTH2-03 — Email inexistant
`[ ]` `P2`

1. Email qui n'existe pas en base
2. ✅ Message d'erreur générique (sans révéler si l'email existe)

---

### AUTH2-04 — Affichage/masquage du mot de passe
`[ ]` `P3`

1. Saisir un mot de passe, cliquer l'icône œil
2. ✅ Texte affiché en clair
3. Recliquer → ✅ Masqué

---

### AUTH2-05 — Déjà connecté → redirection depuis login
`[ ]` `P2`

1. Connecté en tant que PARTNER_A, naviguer vers `/auth/login`
2. ✅ Redirection immédiate vers `/dashboard` (middleware `guest-client`)

---

## AUTH3 — Mot de passe oublié

### AUTH3-01 — Accès depuis la page login
`[ ]` `P1`

1. Sur `/auth/login`, cliquer "Mot de passe oublié ?"
2. ✅ Redirection vers `/auth/forgot`
3. ✅ Formulaire email affiché (composant `ForgotPassword.client.vue`)

---

### AUTH3-02 — Envoi du lien de réinitialisation
`[ ]` `P1`

1. Saisir un email de compte existant, cliquer "Envoyer le lien de réinitialisation"
2. ✅ Écran succès : "Vérifiez votre boîte mail — Si un compte existe pour cette adresse…"
3. ✅ Email reçu avec lien pointant vers `[APP_URL]/auth/reset-password#access_token=...&type=recovery`

---

### AUTH3-03 — Email inexistant — comportement anti-énumération
`[ ]` `P2`

1. Saisir un email qui n'existe pas
2. ✅ Même écran de succès affiché (pas de message "email non trouvé")
3. ✅ Aucun email envoyé (comportement Supabase par défaut)

---

### AUTH3-04 — Validation email avant envoi
`[ ]` `P2`

1. Saisir "pas-un-email", cliquer envoyer
2. ✅ Erreur inline : "Format d'email invalide"
3. ✅ Pas d'appel Supabase

---

### AUTH3-05 — Renvoyer un lien
`[ ]` `P3`

1. Après l'écran succès, cliquer "Renvoyer un lien"
2. ✅ Formulaire email réaffiché

---

### AUTH3-06 — Retour à la connexion
`[ ]` `P3`

1. Sur `/auth/forgot`, cliquer "Retour à la connexion"
2. ✅ Redirection vers `/auth/login`

---

## AUTH4 — Réinitialisation du mot de passe

### AUTH4-01 — Accès via lien valide
`[ ]` `P1`

1. Cliquer le lien dans l'email reçu (AUTH3-02)
2. ✅ Arrivée sur `/auth/reset-password` avec le formulaire "Nouveau mot de passe" (composant `ResetPassword.client.vue`)
3. ✅ État `tokenState = 'valid'`, pas l'écran d'erreur

---

### AUTH4-02 — Définition du nouveau mot de passe
`[ ]` `P1`

1. Saisir "NouveauMdp1!" dans les deux champs
2. Cliquer "Réinitialiser le mot de passe"
3. ✅ État succès : "Mot de passe modifié"
4. ✅ Bouton "Se connecter" visible
5. Connexion avec le nouveau mot de passe
6. ✅ Connexion réussie
7. ✅ Ancien mot de passe ne fonctionne plus

---

### AUTH4-03 — Validation on-blur : champ mot de passe
`[ ]` `P2`

1. Saisir "abc" dans le champ mot de passe, cliquer ailleurs
2. ✅ Erreur inline : "Le mot de passe doit contenir au moins 8 caractères"

---

### AUTH4-04 — Validation on-blur : confirmation non concordante
`[ ]` `P2`

1. Saisir "Password1!" / "Password2!" dans les deux champs, cliquer ailleurs sur le second
2. ✅ Erreur : "Les mots de passe ne correspondent pas"
3. ✅ Bouton désactivé

---

### AUTH4-05 — Lien déjà utilisé / expiré
`[ ]` `P1`

1. Utiliser un lien de reset déjà consommé, ou modifier le token dans l'URL
2. ✅ État `tokenState = 'invalid'` → écran "Lien invalide ou expiré"
3. ✅ Bouton "Demander un nouveau lien" → `/auth/forgot`
4. ✅ Aucun formulaire de saisie affiché

---

### AUTH4-06 — Accès direct sans token
`[ ]` `P2`

1. Naviguer vers `/auth/reset-password` sans hash dans l'URL
2. ✅ État `tokenState = 'invalid'` → écran d'erreur avec bouton vers `/auth/forgot`

---

## AUTH5 — Callback email (confirmation de compte)

### AUTH5-01 — Lien de confirmation valide
`[ ]` `P1`

1. Après inscription, cliquer le lien de confirmation dans l'email
2. ✅ `/auth/callback` → spinner "Vérification en cours"
3. ✅ "Connexion réussie !" → redirection `/dashboard` après 1,5 s
4. ✅ Utilisateur connecté automatiquement

---

### AUTH5-02 — Lien de confirmation expiré ou déjà utilisé
`[ ]` `P2`

1. Cliquer un lien de confirmation périmé
2. ✅ `/auth/callback` affiche l'état "Erreur" avec message explicite
3. ✅ Bouton "Retour à la connexion"

---

## AUTH6 — Paramètres du compte (`/account/settings`)

### AUTH6-01 — Changement de mot de passe avec succès
`[ ]` `P1`

Voir CR-02 P4-02.

---

### AUTH6-02 — Déconnexion de toutes les sessions
`[ ]` `P2`

1. Sur `/account/settings`, section "Sessions actives"
2. Cliquer "Se déconnecter de toutes les sessions" (si disponible)
3. ✅ Session courante terminée, redirection login
4. ✅ Les autres sessions actives sur d'autres appareils sont invalidées
