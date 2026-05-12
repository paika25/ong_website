// Edge Function : zombie-recovery
// Détecte les transactions financial_transactions bloquées en 'processing' > 30 min
// et crée des alertes dans ops_alerts.
//
// Déploiement :
//   bunx supabase functions deploy zombie-recovery
//
// Déclenchement (plan Free — pas de pg_cron) :
//   Configurer un webhook cron externe (ex: cron-job.org) vers :
//   https://cdbpsbwhklvkjpaeavnk.supabase.co/functions/v1/zombie-recovery
//   Authorization: Bearer <SUPABASE_ANON_KEY>
//   Fréquence : */5 * * * * (toutes les 5 minutes)
//
// Variables d'environnement requises (auto-injectées par Supabase) :
//   SUPABASE_URL
//   SUPABASE_SERVICE_ROLE_KEY

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ZOMBIE_THRESHOLD_MINUTES = 30

Deno.serve(async (req) => {
  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const thresholdTime = new Date(
      Date.now() - ZOMBIE_THRESHOLD_MINUTES * 60 * 1000
    ).toISOString()

    // Trouver les transactions zombies
    const { data: zombies, error: fetchError } = await supabase
      .from('financial_transactions')
      .select('id, ong_id, created_at, retry_count')
      .eq('status', 'processing')
      .lt('created_at', thresholdTime)

    if (fetchError) {
      console.error('[zombie-recovery] fetch error:', fetchError)
      return new Response(
        JSON.stringify({ error: fetchError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!zombies || zombies.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'No zombies found' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Vérifier les doublons d'alertes (éviter le spam)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    const { data: existingAlerts } = await supabase
      .from('ops_alerts')
      .select('payload')
      .eq('type', 'zombie_transaction')
      .is('resolved_at', null)
      .gte('created_at', oneHourAgo)

    const alreadyAlerted = new Set(
      (existingAlerts ?? []).map((a: any) => a.payload?.transaction_id)
    )

    const newZombies = zombies.filter(z => !alreadyAlerted.has(z.id))

    if (newZombies.length === 0) {
      return new Response(
        JSON.stringify({ processed: 0, message: 'All zombies already alerted' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Insérer les alertes
    const alerts = newZombies.map(z => ({
      type: 'zombie_transaction',
      payload: {
        transaction_id: z.id,
        ong_id: z.ong_id,
        stuck_since: z.created_at,
        retry_count: z.retry_count,
      },
      severity: z.retry_count >= 3 ? 'critical' : 'warning',
    }))

    const { error: insertError } = await supabase
      .from('ops_alerts')
      .insert(alerts)

    if (insertError) {
      console.error('[zombie-recovery] insert error:', insertError)
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(`[zombie-recovery] Created ${newZombies.length} alerts`)

    return new Response(
      JSON.stringify({ processed: newZombies.length }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('[zombie-recovery] unexpected error:', err)
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
