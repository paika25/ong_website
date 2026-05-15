# CR-01 — Visiteur non connecté (Guest)

**Prérequis** : Navigateur en navigation privée, aucun cookie ni localStorage.

---

## G1 — Pages publiques

### G1-01 — Page d'accueil
`[ ]` `P1`

1. Aller sur `/`
2. ✅ Page chargée, liste des ONGs visibles ou état de chargement, pas de redirection

---

### G1-02 — Liste des ONGs — seules les actives sont visibles
`[ ]` `P1`

1. Charger `/` ou la page liste ONGs
2. ✅ Uniquement les ONGs avec `status = 'active'` apparaissent
3. ✅ Aucune ONG `pending` ou `inactive` dans la liste

---

### G1-03 — Filtres sur la liste
`[ ]` `P2`

1. Utiliser le filtre par catégorie (ex. Éducation)
2. ✅ Liste filtrée en temps réel
3. Utiliser la recherche textuelle
4. ✅ Résultats filtrés sur nom et description

---

### G1-04 — Page détail d'une ONG active
`[ ]` `P1`

1. Cliquer sur une ONG active
2. ✅ Page `/ongs/[id]` chargée sans erreur
3. Naviguer sur chaque onglet : À propos, Projets, Impact, Financiers, Transparence, Bénévoles, Documents
4. ✅ Chaque onglet s'affiche sans erreur JS

---

### G1-05 — Récapitulatif imprimable d'une ONG
`[ ]` `P2`

1. Aller sur `/ongs/[id]/recap`
2. ✅ Page de récapitulatif affichée avec en-tête, statut, informations de l'ONG
3. ✅ Bouton "Imprimer / Sauvegarder en PDF" visible
4. Cliquer le bouton
5. ✅ Dialog d'impression du navigateur s'ouvre

---

### G1-06 — Onglet Don — consultation sans action
`[ ]` `P2`

1. Sur la page détail d'une ONG avec des opportunités de don, accéder à l'onglet "Don"
2. ✅ Les opportunités s'affichent avec montants
3. Cliquer "Faire un don"
4. ✅ Redirection vers `/auth/login` (pas de paiement déclenché)

---

### G1-07 — Pages légales
`[ ]` `P3`

1. Aller sur `/privacy` puis `/terms`
2. ✅ Chaque page chargée sans erreur ni redirection

---

## G2 — Redirections de protection

### G2-01 — Dashboard bloqué
`[ ]` `P1`

1. Naviguer directement vers `/dashboard`
2. ✅ Redirection vers `/auth/login?redirect=%2Fdashboard`
3. ✅ Aucun contenu du dashboard affiché

---

### G2-02 — Profil bloqué
`[ ]` `P1`

1. Naviguer vers `/Profil`
2. ✅ Redirection vers `/auth/login`

---

### G2-03 — Création d'ONG bloquée
`[ ]` `P1`

1. Naviguer vers `/ongs/new`
2. ✅ Redirection vers `/auth/login`

---

### G2-04 — Édition d'ONG bloquée
`[ ]` `P1`

1. Naviguer vers `/ongs/[id_valide]/edit`
2. ✅ Redirection vers `/auth/login`

---

### G2-05 — Pages admin bloquées
`[ ]` `P1`

1. Tester `/admin/ongs`, `/admin/donations`, `/admin/verification`, `/admin/historique`
2. ✅ Chaque URL redirige vers `/auth/login`

---

### G2-06 — Account settings bloqué
`[ ]` `P1`

1. Naviguer vers `/account/settings`
2. ✅ Redirection vers `/auth/login`

---

### G2-07 — Paramètre redirect préservé
`[ ]` `P2`

1. Tenter d'accéder à `/dashboard` sans être connecté
2. Se connecter depuis la page login
3. ✅ Retour automatique sur `/dashboard` après connexion

---

## G3 — Cas d'erreur

### G3-01 — ONG inexistante
`[ ]` `P2`

1. Naviguer vers `/ongs/00000000-0000-0000-0000-000000000000`
2. ✅ Message d'erreur clair (pas de crash, pas de page blanche)

---

### G3-02 — Route inconnue
`[ ]` `P3`

1. Naviguer vers `/page-inexistante`
2. ✅ Page 404 avec lien de retour
