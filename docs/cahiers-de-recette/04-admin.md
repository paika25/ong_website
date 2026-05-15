# CR-04 — Administrateur Back-office

**Compte** : ADMIN (back_office)  
**Prérequis** :
- Se connecter en tant que ADMIN
- Le compte ADMIN **doit avoir `app_metadata.role = 'back_office'`** dans Supabase (Dashboard → Authentication → Users → Edit user → `app_metadata`). Sans ça, le middleware Nitro retourne 403 sur tous les appels `/api/admin/*` et `/api/back-office/*`
- Les pages admin utilisent le layout `admin` et le middleware client `back-office`

---

## AD1 — Accès et navigation admin

### AD1-01 — Accès aux 4 pages admin
`[ ]` `P1`

1. Connecté ADMIN, naviguer vers chacune :
   - `/admin/ongs`
   - `/admin/donations`
   - `/admin/verification`
   - `/admin/historique`
2. ✅ Chaque page se charge avec le layout admin
3. ✅ Aucune redirection vers `/auth/login` ou `/dashboard`

---

### AD1-02 — Skeleton loader présent pendant le chargement
`[ ]` `P3`

1. Ouvrir chaque page admin sur une connexion lente (DevTools → Network throttling)
2. ✅ Skeleton animé affiché pendant le chargement des données
3. ✅ Pas de flash de contenu vide

---

## AD2 — Gestion des ONGs (`/admin/ongs`)

### AD2-01 — Liste de toutes les ONGs (actives et inactives)
`[ ]` `P1`

1. Ouvrir `/admin/ongs`
2. ✅ Toutes les ONGs s'affichent (y compris `pending` et `inactive`)
3. ✅ Colonnes visibles : ONG, Statut, Email, Mise à jour, Actions

---

### AD2-02 — Recherche par nom
`[ ]` `P2`

1. Saisir un nom partiel dans le champ de recherche
2. ✅ La liste filtre en temps réel sur le nom de l'ONG

---

### AD2-03 — Action sur une ONG (ex. valider / désactiver)
`[ ]` `P1`

1. Trouver une ONG avec une action disponible, cliquer l'action
2. ✅ Le statut change en base et se reflète dans la liste
3. ✅ L'action est enregistrée dans l'historique (`/admin/historique`)

---

## AD3 — Pipeline de vérification (`/admin/verification`)

### AD3-01 — Kanban affiché avec les colonnes
`[ ]` `P1`

1. Ouvrir `/admin/verification`
2. ✅ Colonnes Kanban présentes (ex. "À vérifier", "En cours", "Validé", "Rejeté")
3. ✅ Les dossiers sont répartis dans les bonnes colonnes selon leur statut

---

### AD3-02 — Ouverture d'un dossier
`[ ]` `P1`

1. Cliquer sur une carte dossier
2. ✅ Détail du dossier affiché (ONG, informations, documents)

---

### AD3-03 — Valider un dossier
`[ ]` `P1`

1. Sur un dossier en statut `submitted` ou `under_review`, cliquer "Valider"
2. ✅ Statut du dossier mis à jour
3. ✅ La carte passe dans la colonne "Validé" (ou équivalent)
4. ✅ L'action apparaît dans `/admin/historique`

---

### AD3-04 — Demander un complément
`[ ]` `P2`

1. Cliquer l'action "Complément requis" sur un dossier actionnable
2. ✅ Statut passe à `complement_required`
3. ✅ Action enregistrée dans l'historique

---

### AD3-05 — Skeleton pendant le chargement
`[ ]` `P3`

1. Sur une connexion lente, ouvrir `/admin/verification`
2. ✅ Skeleton animé (4 colonnes) pendant le chargement

---

## AD4 — Historique des dons (`/admin/donations`)

### AD4-01 — Tous les dons visibles
`[ ]` `P1`

1. Ouvrir `/admin/donations`
2. ✅ Tableau avec tous les dons de toutes les ONGs (pas seulement ceux d'un partenaire)
3. ✅ Colonnes : Date, données don, montant, statut

---

### AD4-02 — Totaux en en-tête
`[ ]` `P2`

1. Vérifier les compteurs en haut : "Total dons", "Complétés", "Volume total"
2. ✅ Les chiffres sont cohérents avec les données en base

---

### AD4-03 — Format montant correct
`[ ]` `P3`

1. Vérifier que les montants sont affichés en EUR (€) et non en centimes bruts
2. ✅ Format lisible (ex. "25,00 €" et non "2500")

---

## AD5 — Historique des actions (`/admin/historique`)

### AD5-01 — Journal complet des actions
`[ ]` `P1`

1. Ouvrir `/admin/historique`
2. ✅ Tableau avec toutes les actions back-office (validations, rejets, compléments)
3. ✅ Colonnes : Date, Action, ONG ID (et autres champs)

---

### AD5-02 — Filtre par type d'action
`[ ]` `P2`

1. Sélectionner un type d'action dans le filtre
2. Cliquer "Filtrer"
3. ✅ Seules les lignes du type sélectionné s'affichent

---

### AD5-03 — Filtre par ID ONG
`[ ]` `P2`

1. Saisir un ID d'ONG dans le champ correspondant, appuyer Entrée
2. ✅ Seules les actions liées à cette ONG s'affichent

---

### AD5-04 — Réinitialisation des filtres
`[ ]` `P3`

1. Appliquer un filtre
2. Cliquer "Réinitialiser"
3. ✅ Tous les filtres effacés, liste complète restaurée

---

## AD6 — Restrictions (un non-admin ne peut pas accéder)

### AD6-01 — PARTNER_A bloqué sur /admin/*
`[ ]` `P1`

Voir CR-02 P5-03 — redirection confirmée côté partenaire.

---

### AD6-02 — AGENT_A bloqué sur /admin/*
`[ ]` `P1`

Voir CR-03 A7-03 — redirection confirmée côté agent.

---

## AD7 — Middleware serveur Nitro (protection API)

### AD7-01 — Appel `/api/admin/*` sans token → 401
`[ ]` `P1`

```bash
curl -X GET "http://localhost:3000/api/admin/dossiers"
# Pas de header Authorization
```
✅ Réponse : `401 Non authentifié`

---

### AD7-02 — Appel `/api/admin/*` avec token d'un agent → 403
`[ ]` `P1`

```bash
curl -X GET "http://localhost:3000/api/admin/dossiers" \
  -H "Authorization: Bearer [JWT_AGENT_A]"
```
✅ Réponse : `403 Rôle admin requis`  
✅ AGENT_A ne peut pas accéder aux données admin même avec un token valide

---

### AD7-03 — Appel `/api/admin/*` avec token ADMIN valide → 200
`[ ]` `P1`

```bash
curl -X GET "http://localhost:3000/api/admin/dossiers" \
  -H "Authorization: Bearer [JWT_ADMIN]"
```
✅ Réponse : `200` avec la liste des dossiers  
✅ Confirme que `app_metadata.role = 'back_office'` est bien présent dans le JWT

---

### AD7-04 — Routes internes Nuxt non bloquées par le middleware
`[ ]` `P2`

```bash
curl -X GET "http://localhost:3000/api/_nuxt_icon/heroicons.json?icons=credit-card"
# Pas de header Authorization
```
✅ Réponse : `200` (icônes chargées)  
✅ Le middleware n'intercepte pas les routes `/api/_*`
