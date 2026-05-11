<template>
  <div class="max-w-6xl mx-auto space-y-8">
    <OngDetailHeader
      :ong="ong"
      :status-label="getStatusLabel(ong.status)"
      :category-label="getCategoryLabel(ong.category)"
      :project-count="getProjectCount(ong)"
      :active-projects-count="getActiveProjectsCount(ong)"
      :years-since-creation="getYearsSinceCreation(ong)"
      :share-copied="shareCopied"
      @donate="handleDonate"
      @shareDonation="handleShare"
    />

    <UTabs :items="tabs" v-model="activeTab">
      <template #item="{ item }">
        <OngDetailTabAbout
          v-if="item.key === 'about'"
          :ong="ong"
          :format-date="formatDate"
        />

        <OngDetailTabProjects
          v-else-if="item.key === 'projects'"
          :projects="getProjectsArray(ong)"
          :get-project-status-color="getProjectStatusColor"
          :get-project-status-label="getProjectStatusLabel"
          :format-date="formatDate"
        />

        <OngDetailTabFinancials
          v-else-if="item.key === 'financials'"
          :financials="ong.financials"
          :format-currency="formatCurrency"
        />

        <OngDetailTabImpact
          v-else-if="item.key === 'impact'"
          :impact="ong.impact"
          :format-number="formatNumber"
        />

        <OngDetailTabDonation
          v-else-if="item.key === 'donation'"
          :ong-id="ong.id"
          :ong-name="ong.name"
          :donation-status="donationStatus"
        />

        <OngDetailTabTransparency
          v-else-if="item.key === 'transparency'"
          :legal="ong.legal"
          :monitoring="ong.monitoring"
          :format-date="formatDate"
          :score="ongScore"
        />

        <OngDetailTabDocuments
          v-else-if="item.key === 'documents'"
          :documents="documents"
          :get-category-doc-label="getCategoryDocLabel"
        />

        <OngDetailTabVolunteers
          v-else-if="item.key === 'volunteers'"
          :volunteers="ong.volunteers"
          :is-active="ong.status === 'active'"
          @join="handleJoin"
        />
      </template>
    </UTabs>

    <Teleport to="body">
      <OngDonationModal
        v-if="showDonationModal"
        :ong="ong"
        :amount="selectedAmount"
        :custom-amount="customAmount"
        @close="showDonationModal = false"
      />

      <OngVolunteerModal
        v-if="showVolunteerModal"
        :ong="ong"
        @close="showVolunteerModal = false"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ONG } from '../type'
import { useOngDetail } from '../composables/useOngDetail'
import OngDetailHeader from './OngDetailHeader.vue'
import OngDetailTabAbout from './OngDetailTabAbout.vue'
import OngDetailTabProjects from './OngDetailTabProjects.vue'
import OngDetailTabFinancials from './OngDetailTabFinancials.vue'
import OngDetailTabImpact from './OngDetailTabImpact.vue'
import OngDetailTabDonation from './OngDetailTabDonation.vue'
import OngDetailTabTransparency from './OngDetailTabTransparency.vue'
import OngDetailTabDocuments from './OngDetailTabDocuments.vue'
import OngDetailTabVolunteers from './OngDetailTabVolunteers.vue'
import OngDonationModal from './OngDonationModal.vue'
import OngVolunteerModal from './OngVolunteerModal.vue'

const props = defineProps<{ ong: ONG }>()

const route = useRoute()
const donationStatus = computed(() => {
  const val = route.query.donation
  if (val === 'success') return 'success' as const
  if (val === 'cancelled') return 'cancelled' as const
  return null
})

const {
  activeTab,
  documents,
  tabs,
  showDonationModal,
  showVolunteerModal,
  shareCopied,
  getStatusLabel,
  getCategoryLabel,
  getProjectStatusColor,
  getProjectStatusLabel,
  getCategoryDocLabel,
  getProjectCount,
  getProjectsArray,
  getActiveProjectsCount,
  getYearsSinceCreation,
  formatDate,
  formatCurrency,
  formatNumber,
  handleJoin,
  handleShare,
  handleDonate,
} = useOngDetail(() => props.ong)

import { getOngScore } from '~/features/score/services/score.service'

const ongScore = ref(0)
onMounted(async () => {
  try {
    const { score } = await getOngScore(props.ong.id)
    ongScore.value = score
  } catch { /* score reste 0 si non disponible */ }
})
</script>
