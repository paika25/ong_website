/**
 * Service email transactionnel via l'API Brevo (ex-Sendinblue).
 * Côté Nitro uniquement — la clé API n'est jamais exposée côté client.
 *
 * Configuration requise (.env) :
 *   NUXT_BREVO_API_KEY=xkeysib-...
 *   NUXT_EMAIL_SENDER_ADDRESS=noreply@paika.mg
 *   NUXT_EMAIL_SENDER_NAME=Paika   (optionnel, défaut fourni dans nuxt.config)
 */

export type EmailTemplate =
  | 'certification_granted'
  | 'certification_rejected'
  | 'document_complement_required'
  | 'badge_suspended'
  | 'badge_reactivated'
  | 'subscription_expiry_reminder'
  | 'payment_confirmed'
  | 'payment_failed'
  | 'signup_confirmation'
  | 'password_reset'

interface EmailPayload {
  subject: string
  htmlContent: string
}

function buildPayload(template: EmailTemplate, data: Record<string, unknown>): EmailPayload {
  const ongName = String(data.ongName ?? '')
  const comment = data.comment ? `<p><strong>Commentaire :</strong> ${data.comment}</p>` : ''

  switch (template) {
    case 'certification_granted':
      return {
        subject: `🎉 Votre ONG "${ongName}" est certifiée !`,
        htmlContent: `<h2>Félicitations !</h2>
<p>Votre dossier pour <strong>${ongName}</strong> a été examiné et validé par notre équipe.</p>
<p>Votre badge de certification est désormais actif sur la plateforme Paika.</p>
${comment}
<p>Vous pouvez maintenant recevoir des dons et apparaître dans les recherches des bailleurs de fonds.</p>`,
      }

    case 'certification_rejected':
      return {
        subject: `Résultat de l'examen de votre dossier — ${ongName}`,
        htmlContent: `<h2>Dossier non retenu</h2>
<p>Après examen de votre dossier pour <strong>${ongName}</strong>, nous ne sommes pas en mesure de délivrer la certification à ce stade.</p>
${comment}
<p>Vous pouvez corriger les points mentionnés et soumettre à nouveau votre dossier.</p>`,
      }

    case 'document_complement_required':
      return {
        subject: `Complément de dossier requis — ${ongName}`,
        htmlContent: `<h2>Complément de dossier</h2>
<p>Votre dossier pour <strong>${ongName}</strong> est en cours d'examen. Notre équipe a besoin d'informations ou de documents supplémentaires.</p>
${comment}
<p>Connectez-vous à votre espace ONG pour soumettre les éléments demandés.</p>`,
      }

    case 'badge_suspended':
      return {
        subject: `Badge temporairement suspendu — ${ongName}`,
        htmlContent: `<h2>Badge suspendu</h2>
<p>Le badge de certification de <strong>${ongName}</strong> a été suspendu.</p>
${comment}
<p>Contactez-nous pour plus d'informations.</p>`,
      }

    case 'badge_reactivated':
      return {
        subject: `Badge réactivé — ${ongName}`,
        htmlContent: `<h2>Badge réactivé</h2>
<p>Le badge de certification de <strong>${ongName}</strong> est à nouveau actif.</p>
<p>Votre ONG est de nouveau visible sur la plateforme Paika.</p>`,
      }

    case 'payment_confirmed':
      return {
        subject: `Reçu de votre don — ${ongName}`,
        htmlContent: `<h2>Merci pour votre don !</h2>
<p>Votre contribution à <strong>${ongName}</strong> d'un montant de <strong>${data.amount ?? '—'} €</strong> a bien été reçue.</p>
<p>Vous trouverez le détail de votre transaction dans votre espace donateur.</p>`,
      }

    case 'payment_failed':
      return {
        subject: `Échec du paiement — ${ongName}`,
        htmlContent: `<h2>Problème de paiement</h2>
<p>Votre tentative de don à <strong>${ongName}</strong> n'a pas pu aboutir.</p>
<p>Veuillez réessayer ou contacter votre banque si le problème persiste.</p>`,
      }

    case 'signup_confirmation':
      return {
        subject: '✅ Votre compte partenaire est activé — Paika',
        htmlContent: `<h2>Compte validé !</h2>
<p>Bonjour${data.firstName ? ` ${data.firstName}` : ''}${data.organizationName ? ` (${data.organizationName})` : ''},</p>
<p>Votre profil partenaire a été vérifié et validé par notre équipe.</p>
<p>Vous avez désormais accès à l'intégralité des fiches ONG, y compris leurs données financières.</p>
<p><a href="${useRuntimeConfig().public.appUrl || 'https://paika.mg'}/dashboard">Accéder à mon espace</a></p>`,
      }

    case 'password_reset':
      return {
        subject: 'Réinitialisation de votre mot de passe',
        htmlContent: `<h2>Réinitialisation du mot de passe</h2>
<p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
<p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
<p><a href="${data.resetLink}">Réinitialiser mon mot de passe</a></p>`,
      }

    case 'subscription_expiry_reminder':
      return {
        subject: `Rappel — Votre certification expire bientôt (${ongName})`,
        htmlContent: `<h2>Renouvellement de certification</h2>
<p>La certification de <strong>${ongName}</strong> expirera dans <strong>${data.daysLeft ?? '?'} jours</strong>.</p>
<p>Connectez-vous à votre espace ONG pour initier le renouvellement.</p>`,
      }

    default:
      return {
        subject: 'Notification Paika',
        htmlContent: `<p>${JSON.stringify(data)}</p>`,
      }
  }
}

export async function sendTransactionalEmail(
  template: EmailTemplate,
  to: string,
  data: Record<string, unknown>
): Promise<void> {
  const config = useRuntimeConfig()
  const apiKey = config.brevoApiKey
  const senderAddress = config.emailSenderAddress
  const senderName = config.emailSenderName ?? 'Paika'

  if (!apiKey || !senderAddress) {
    console.warn('[email] NUXT_BREVO_API_KEY or NUXT_EMAIL_SENDER_ADDRESS not configured — email skipped')
    return
  }

  const { subject, htmlContent } = buildPayload(template, data)

  await $fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: {
      sender: { name: senderName, email: senderAddress },
      to: [{ email: to }],
      subject,
      htmlContent,
    },
  })
}
