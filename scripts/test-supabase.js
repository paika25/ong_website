/**
 * Script de test de connexion Supabase
 * 
 * Usage: node scripts/test-supabase.js
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config()

const supabaseUrl = process.env.NUXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NUXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Test de connexion Supabase...\n')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.error('   Vérifiez que .env contient:')
  console.error('   - NUXT_PUBLIC_SUPABASE_URL')
  console.error('   - NUXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

console.log('✅ Variables d\'environnement trouvées')
console.log(`   URL: ${supabaseUrl}`)
console.log(`   Key: ${supabaseKey.substring(0, 20)}...`)

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    console.log('\n📊 Test 1: Récupération des ONGs...')
    const { data: ongs, error: ongsError } = await supabase
      .from('ongs')
      .select('id, name, category, status')
      .limit(5)

    if (ongsError) {
      console.error('❌ Erreur:', ongsError.message)
      return false
    }

    console.log(`✅ ${ongs?.length || 0} ONGs trouvées:`)
    ongs?.forEach((ong, i) => {
      console.log(`   ${i + 1}. ${ong.name} (${ong.category}) - ${ong.status}`)
    })

    console.log('\n📊 Test 2: Récupération des comptes...')
    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('email, account_type, verified')
      .limit(5)

    if (accountsError) {
      console.error('❌ Erreur:', accountsError.message)
      return false
    }

    console.log(`✅ ${accounts?.length || 0} comptes trouvés:`)
    accounts?.forEach((account, i) => {
      console.log(`   ${i + 1}. ${account.email} (${account.account_type}) - ${account.verified ? 'vérifié' : 'non vérifié'}`)
    })

    console.log('\n📊 Test 3: Récupération des donations...')
    const { data: donations, error: donationsError } = await supabase
      .from('donations')
      .select('amount, type, status')
      .limit(5)

    if (donationsError) {
      console.error('❌ Erreur:', donationsError.message)
      return false
    }

    console.log(`✅ ${donations?.length || 0} donations trouvées:`)
    const total = donations?.reduce((sum, d) => sum + d.amount, 0) || 0
    console.log(`   Total des 5 premières: ${total} Ar`)

    console.log('\n🎉 Tous les tests sont passés avec succès!')
    console.log('✅ Votre connexion Supabase fonctionne parfaitement')
    
    return true
  } catch (error) {
    console.error('\n❌ Exception:', error.message)
    return false
  }
}

testConnection()
  .then(success => {
    if (!success) {
      console.log('\n💡 Suggestions:')
      console.log('   1. Vérifiez que les tables ont été créées (db_squelette.sql)')
      console.log('   2. Vérifiez que les données ont été insérées (db2_data.sql)')
      console.log('   3. Vérifiez les clés API dans .env')
      console.log('   4. Consultez SUPABASE_SETUP.md pour plus d\'infos')
      process.exit(1)
    }
  })
  .catch(err => {
    console.error('❌ Erreur fatale:', err)
    process.exit(1)
  })
