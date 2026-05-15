# Contrats API — Paika ONG Platform

**Date :** 2026-05-13
**Base URL :** `/api`
**Auth :** `Authorization: Bearer <JWT Supabase>` sur tous les endpoints protégés

---

## Règles générales

- Tous les handlers extraient `event.context.userId` (injecté par `server/middleware/auth.ts`)
- Les erreurs retournent `{ statusCode, statusMessage }`
- Les transitions de statut passent **obligatoirement** par `applyStatusTransition()` (machine d'états)
- L'audit trail est écrit via `insertAuditEntry()` → RPC `insert_audit_entry` (SECURITY DEFINER)

---

## ONGs — Actions agent

### POST `/api/ongs/:id/submit`
Soumet le dossier ONG (pending/complement_required → submitted).

**Auth :** `user_agent` (ownership vérifié)
**Body :** aucun
**Réponse :** `{ success: true, status: "submitted" }`

---

### POST `/api/ongs/:id/resubmit`
Re-soumet après demande de complément (complement_required → submitted).

**Auth :** `user_agent` (ownership vérifié)
**Body :** aucun
**Réponse :** `{ success: true, status: "submitted" }`

---

### GET `/api/ongs/:id/messages`
Récupère les messages de la messagerie back-office pour une ONG.

**Auth :** `user_agent` ou `back_office`
**Réponse :** `Message[]`

---

### POST `/api/ongs/:id/messages`
Envoie un message dans la messagerie (agent).

**Auth :** `user_agent`
**Body :** `{ content: string }`
**Réponse :** `Message` (nouveau message)

---

## Dossiers — Back-office (`/api/admin/dossiers/`)

> Note : Routes miroir sous `/api/back-office/dossiers/` — comportement identique.

### GET `/api/admin/dossiers`
Liste tous les dossiers ONG pour le pipeline Kanban.

**Auth :** `back_office` / `admin`
**Réponse :** `Dossier[]` avec ONG + documents + score

---

### GET `/api/admin/dossiers/:id`
Détail complet d'un dossier.

**Auth :** `back_office` / `admin`
**Réponse :** `{ ong, documents, messages, score }`

---

### POST `/api/admin/dossiers/:id/start-review`
Passe le dossier en revue (pending/submitted → under_review).

**Auth :** `back_office` / `admin`
**Body :** aucun
**Réponse :** `{ success: true, status: "under_review" }`
**Audit :** `REVIEW_STARTED`

---

### POST `/api/admin/dossiers/:id/validate`
Valide le dossier (→ verified).

**Auth :** `back_office` / `admin`
**Body :** aucun
**Réponse :** `{ success: true, status: "verified" }`
**Audit :** `BACKOFFICE_VALIDATED`

---

### POST `/api/admin/dossiers/:id/reject`
Rejette le dossier (→ rejected). Commentaire obligatoire.

**Auth :** `back_office` / `admin`
**Body :** `{ comment: string }` *(requis)*
**Réponse :** `{ success: true, status: "rejected" }`
**Audit :** `BACKOFFICE_REJECTED`

---

### POST `/api/admin/dossiers/:id/complement`
Demande un complément de pièces (→ complement_required). Message obligatoire.

**Auth :** `back_office` / `admin`
**Body :** `{ message: string }` *(requis)*
**Réponse :** `{ success: true, status: "complement_required" }`
**Audit :** `COMPLEMENT_REQUESTED`

---

### POST `/api/admin/dossiers/:id/suspend`
Suspend le badge post-certification (verified/active → suspended). Commentaire obligatoire.

**Auth :** `back_office` / `admin`
**Body :** `{ comment: string }` *(requis)*
**Réponse :** `{ success: true, status: "suspended" }`
**Audit :** `BADGE_SUSPENDED`

---

### GET `/api/admin/dossiers/:id/audit`
Récupère l'audit trail d'un dossier spécifique.

**Auth :** `back_office` / `admin`
**Query :** `cursor` (pagination curseur par `created_at`)
**Réponse :** `{ data: AuditEntry[], cursor: string | null }`

---

### GET `/api/admin/dossiers/:id/messages`
Messages back-office d'un dossier (lecture admin).

**Auth :** `back_office` / `admin`
**Réponse :** `Message[]`

---

### POST `/api/admin/dossiers/:id/messages`
Envoie un message depuis le back-office.

**Auth :** `back_office` / `admin`
**Body :** `{ content: string }`
**Réponse :** `Message`

---

## Historique global

### GET `/api/admin/historique`
Journal complet des actions back-office avec pagination curseur.

**Auth :** `back_office` / `admin`
**Query :**
- `cursor` — ISO date pour pagination
- `action` — filtre par type d'action (ex: `BACKOFFICE_VALIDATED`)
- `ong_id` — filtre par ONG

**Réponse :**
```json
{
  "data": [
    {
      "id": "uuid",
      "action": "BACKOFFICE_VALIDATED",
      "entity_type": "ong",
      "entity_id": "uuid",
      "ong_id": "uuid",
      "performed_by": "uuid",
      "details_json": { "comment": "", "previousStatus": "under_review", "newStatus": "verified" },
      "created_at": "ISO8601",
      "ongs": { "name": "ONG Name" },
      "operator": { "id": "uuid", "first_name": "Jean", "last_name": "Dupont", "email": "j@d.com" }
    }
  ],
  "cursor": "ISO8601 | null"
}
```

**Actions possibles :**
| Action | Déclencheur |
|--------|------------|
| `DOSSIER_SUBMITTED` | Agent soumet |
| `REVIEW_STARTED` | Back-office prend en charge |
| `BACKOFFICE_VALIDATED` | Back-office valide |
| `BACKOFFICE_REJECTED` | Back-office rejette |
| `COMPLEMENT_REQUESTED` | Back-office demande pièces |
| `DOSSIER_RESUBMITTED` | Agent re-soumet |
| `BADGE_SUSPENDED` | Back-office suspend badge |
| `BADGE_REACTIVATED` | Back-office réactive badge |
| `DOSSIER_DEACTIVATED` | Désactivation définitive |

---

## Dons / Paiements

### POST `/api/donations/create-checkout`
Crée une session Stripe Checkout.

**Auth :** authentifié
**Body :** `{ ongId: string, amount: number, currency: string }`
**Réponse :** `{ url: string }` (URL de redirection Stripe)

---

### POST `/api/donations/confirm-session`
Confirme et enregistre un don après retour Stripe.

**Auth :** authentifié
**Body :** `{ sessionId: string }`
**Réponse :** `{ success: true, donation: Donation }`

---

### GET `/api/admin/donations`
Liste tous les dons (back-office).

**Auth :** `back_office` / `admin`
**Réponse :** `Donation[]`

---

### POST `/api/webhooks/stripe`
Webhook Stripe (signature HMAC vérifiée).

**Auth :** Stripe-Signature header
**Body :** Stripe Event

---

## Score

### GET `/api/score/criteria`
Retourne les critères de l'algorithme de score actif.

**Auth :** public
**Réponse :** `{ criteria: ScoreCriterion[], version: string }`

---

### GET `/api/score/ong/:id`
Score actuel d'une ONG.

**Auth :** public
**Réponse :** `{ score: number, criteria: ScoreCriterion[] }`
