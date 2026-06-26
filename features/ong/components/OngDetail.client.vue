<template>
  <div>
    <!-- ─── Hero banner ─── -->
    <div class="relative h-56 md:h-72 bg-gradient-to-br from-primary/80 via-primary to-primary/50 overflow-hidden">
      <img v-if="ong.image" :src="ong.image" :alt="ong.name" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

      <!-- Top : badges -->
      <div class="absolute top-4 left-4 right-4 flex items-start justify-between">
        <NuxtLink to="/ongs">
          <UButton size="sm" color="white" variant="ghost" icon="i-heroicons-arrow-left" class="backdrop-blur-sm bg-black/20 text-white hover:bg-black/30">
            Retour
          </UButton>
        </NuxtLink>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-sm text-white capitalize">
            {{ categoryLabel }}
          </span>
          <BadgeVerifie
            v-if="ong.status === 'verified' || ong.status === 'active'"
            status="verified"
            :certification-date="ong.updatedAt"
            size="sm"
          />
        </div>
      </div>

      <!-- Bottom : nom + location -->
      <div class="absolute bottom-5 left-5 right-5">
        <h1 class="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">{{ ong.name }}</h1>
        <div class="flex items-center gap-1.5 text-white/70 text-sm">
          <Icon name="i-heroicons-map-pin" class="w-4 h-4 shrink-0" />
          <span>{{ ong.location }}</span>
        </div>
      </div>
    </div>

    <!-- ─── Corps ─── -->
    <div class="container mx-auto px-4 max-w-6xl py-8">
      <div class="lg:grid lg:grid-cols-3 lg:gap-8">

        <!-- ── Colonne principale ── -->
        <div class="lg:col-span-2 min-w-0">

          <!-- Tabs nav -->
          <div class="flex border-b border-border mb-6 overflow-x-auto scrollbar-none gap-1">
            <button
              v-for="(tab, i) in tabs"
              :key="tab.key"
              type="button"
              class="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors"
              :class="activeTab === i
                ? 'border-b-2 border-primary -mb-px text-primary'
                : 'text-muted-foreground hover:text-foreground'"
              @click="activeTab = i"
            >
              <Icon :name="tab.icon" class="w-4 h-4" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Contenu des tabs -->
          <OngDetailTabAbout
            v-if="tabs[activeTab]?.key === 'about'"
            :ong="ong"
            :format-date="formatDate"
          />
          <OngDetailTabProjects
            v-else-if="tabs[activeTab]?.key === 'projects'"
            :projects="getProjectsArray(ong)"
            :get-project-status-color="getProjectStatusColor"
            :get-project-status-label="getProjectStatusLabel"
            :format-date="formatDate"
          />
          <OngDetailTabFinancials
            v-else-if="tabs[activeTab]?.key === 'financials'"
            :financials="ong.financials"
            :format-currency="formatCurrency"
          />
          <OngDetailTabImpact
            v-else-if="tabs[activeTab]?.key === 'impact'"
            :impact="ong.impact"
            :format-number="formatNumber"
          />
          <OngDetailTabTransparency
            v-else-if="tabs[activeTab]?.key === 'transparency'"
            :legal="ong.legal"
            :monitoring="ong.monitoring"
            :format-date="formatDate"
            :score="ongScore"
          />
          <OngDetailTabDocuments
            v-else-if="tabs[activeTab]?.key === 'documents'"
            :documents="documents"
            :get-category-doc-label="getCategoryDocLabel"
          />
          <OngDetailTabDonation
            v-else-if="tabs[activeTab]?.key === 'donation'"
            :ong-id="ong.id"
            :ong-name="ong.name"
            :donation-status="donationStatus"
          />
        </div>

        <!-- ── Sidebar ── -->
        <div class="mt-8 lg:mt-0 space-y-4 lg:sticky lg:top-20 lg:self-start">

          <!-- Score de transparence -->
          <div class="bg-card border border-border rounded-2xl p-5">
            <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Score de transparence</p>
            <div class="flex items-center gap-4">
              <!-- Jauge circulaire simplifiée -->
              <div class="relative w-16 h-16 shrink-0">
                <svg class="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="6" class="text-muted/30" />
                  <circle
                    cx="32" cy="32" r="26" fill="none" stroke="currentColor" stroke-width="6"
                    class="text-primary transition-all duration-700"
                    stroke-linecap="round"
                    :stroke-dasharray="`${2 * Math.PI * 26}`"
                    :stroke-dashoffset="`${2 * Math.PI * 26 * (1 - ongScore / 100)}`"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-sm font-bold">{{ ongScore }}</span>
                </div>
              </div>
              <div>
                <p class="text-2xl font-bold">{{ ongScore }}<span class="text-sm text-muted-foreground font-normal"> / 100</span></p>
                <p class="text-xs text-muted-foreground mt-0.5">
                  {{ ongScore >= 80 ? 'Excellent niveau de transparence' : ongScore >= 60 ? 'Bon niveau de transparence' : 'Transparence en cours d\'amélioration' }}
                </p>
              </div>
            </div>
          </div>

          <!-- CTA dons -->
          <div class="bg-card border border-border rounded-2xl p-5 space-y-3">
            <UButton
              block
              size="lg"
              icon="i-heroicons-heart"
              :disabled="!canDonate"
              @click="handleDonate()"
            >
              Faire un don
            </UButton>
            <UButton
              v-if="isPartner && canDonate"
              block
              variant="outline"
              icon="i-heroicons-envelope"
              @click="showContactModal = true"
            >
              Contacter l'ONG
            </UButton>
            <UButton
              block
              variant="ghost"
              size="sm"
              :icon="shareCopied ? 'i-heroicons-check' : 'i-heroicons-share'"
              @click="handleShare"
            >
              {{ shareCopied ? 'Lien copié !' : 'Partager' }}
            </UButton>
          </div>

          <!-- Stats rapides -->
          <div class="bg-card border border-border rounded-2xl p-5">
            <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">En chiffres</p>
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div class="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="i-heroicons-users" class="w-3.5 h-3.5 text-primary" />
                  </div>
                  Bénévoles
                </div>
                <span class="font-semibold text-sm">{{ ong.volunteers }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div class="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900 flex items-center justify-center">
                    <Icon name="i-heroicons-briefcase" class="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  </div>
                  Projets
                </div>
                <span class="font-semibold text-sm">{{ getProjectCount(ong) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <div class="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                    <Icon name="i-heroicons-calendar" class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  Années d'activité
                </div>
                <span class="font-semibold text-sm">{{ getYearsSinceCreation(ong) }}</span>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div v-if="ong.email || ong.phone || ong.website" class="bg-card border border-border rounded-2xl p-5">
            <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Contact</p>
            <div class="space-y-2.5">
              <a v-if="ong.email" :href="`mailto:${ong.email}`" class="flex items-center gap-2.5 text-sm text-primary hover:underline">
                <Icon name="i-heroicons-envelope" class="w-4 h-4 shrink-0" />
                <span class="truncate">{{ ong.email }}</span>
              </a>
              <a v-if="ong.phone" :href="`tel:${ong.phone}`" class="flex items-center gap-2.5 text-sm text-primary hover:underline">
                <Icon name="i-heroicons-phone" class="w-4 h-4 shrink-0" />
                {{ ong.phone }}
              </a>
              <a v-if="ong.website" :href="ong.website" target="_blank" rel="noopener" class="flex items-center gap-2.5 text-sm text-primary hover:underline">
                <Icon name="i-heroicons-globe-alt" class="w-4 h-4 shrink-0" />
                <span class="truncate">{{ ong.website }}</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ─── Modals ─── -->
    <Teleport to="body">
      <OngDonationModal v-if="showDonationModal" :ong="ong" :amount="0" :custom-amount="''" @close="showDonationModal = false" />
      <OngVolunteerModal v-if="showVolunteerModal" :ong="ong" @close="showVolunteerModal = false" />

      <UModal v-model="showContactModal">
        <div class="flex flex-col" style="height: 480px">
          <div class="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
            <div class="flex items-center gap-2">
              <Icon name="i-heroicons-chat-bubble-left-right" class="w-4 h-4 text-primary" />
              <span class="text-sm font-semibold">Contacter {{ ong.name }}</span>
            </div>
            <UButton variant="ghost" icon="i-heroicons-x-mark" size="xs" @click="showContactModal = false" />
          </div>
          <PartnerMessagerie :ong-id="ong.id" viewer-role="partner" class="flex-1 min-h-0" />
        </div>
      </UModal>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'
import { useOngDetail } from '../composables/useOngDetail'
import OngDetailTabAbout from './OngDetailTabAbout.vue'
import OngDetailTabProjects from './OngDetailTabProjects.vue'
import OngDetailTabFinancials from './OngDetailTabFinancials.vue'
import OngDetailTabImpact from './OngDetailTabImpact.vue'
import OngDetailTabDonation from './OngDetailTabDonation.vue'
import OngDetailTabTransparency from './OngDetailTabTransparency.vue'
import OngDetailTabDocuments from './OngDetailTabDocuments.vue'
import OngDonationModal from './OngDonationModal.vue'
import OngVolunteerModal from './OngVolunteerModal.vue'
import BadgeVerifie from '~/features/verification/components/BadgeVerifie.vue'
import PartnerMessagerie from '~/features/messaging/components/PartnerMessagerie.vue'
import { useAuthStore } from '~/features/auth/stores/auth.client'
import { getOngScore } from '~/features/score/services/score.service'

const props = defineProps<{ ong: ONG; donationStatus?: 'success' | 'cancelled' | null }>()

const authStore = useAuthStore()
const showContactModal = ref(false)
const ongScore = ref(0)

const canDonate  = computed(() => props.ong.status === 'verified' || props.ong.status === 'active')
const isPartner  = computed(() => authStore.isPartner)

const categoryLabel = computed(() => ({
  education: 'Éducation', health: 'Santé', environment: 'Environnement',
  social: 'Social', culture: 'Culture',
}[props.ong.category] ?? props.ong.category))

const TAB_ICONS: Record<string, string> = {
  about:        'i-heroicons-information-circle',
  projects:     'i-heroicons-briefcase',
  financials:   'i-heroicons-banknotes',
  impact:       'i-heroicons-chart-bar',
  transparency: 'i-heroicons-shield-check',
  documents:    'i-heroicons-document-text',
  donation:     'i-heroicons-heart',
}

const {
  activeTab, documents, tabs: baseTabs,
  showDonationModal, showVolunteerModal, shareCopied,
  getProjectStatusColor, getProjectStatusLabel, getCategoryDocLabel,
  getProjectCount, getProjectsArray, getYearsSinceCreation,
  formatDate, formatCurrency, formatNumber,
  handleShare, handleDonate,
} = useOngDetail(() => props.ong)

const tabs = computed(() =>
  baseTabs.value.map(t => ({ ...t, icon: TAB_ICONS[t.key] ?? 'i-heroicons-squares-2x2' }))
)

onMounted(async () => {
  try {
    const { score } = await getOngScore(props.ong.id)
    ongScore.value = score
  } catch { /* score reste 0 */ }
})
</script>
