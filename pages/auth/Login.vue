<template>
	<div class="min-h-screen flex flex-col items-center justify-center py-12 bg-background relative">
		<!-- Bouton retour à l'accueil -->
		<NuxtLink 
			to="/" 
			class="absolute top-6 left-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
		>
			<svg 
				xmlns="http://www.w3.org/2000/svg" 
				width="20" 
				height="20" 
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				stroke-width="2" 
				stroke-linecap="round" 
				stroke-linejoin="round"
				class="group-hover:-translate-x-1 transition-transform"
			>
				<path d="m12 19-7-7 7-7"/>
				<path d="M19 12H5"/>
			</svg>
			<span>Retour à l'accueil</span>
		</NuxtLink>

		<ClientOnly>
			<AuthLogin @login-success="onLoginSuccess" @switch-to-signup="onSwitchToSignup" @forgot-password="onForgotPassword" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import AuthLogin from '~/features/auth/components/Login.client.vue'
import { useAuthStore } from '~/features/auth/stores/auth.client'
import type { User } from '~/features/auth/types/auth.types'
import { onMounted } from 'vue'

definePageMeta({
  layout: false,
  middleware: ['guest-client']
})

const route = useRoute()
const authStore = useAuthStore()

const onLoginSuccess = async (payload: { user: User } | any) => {
	// Persister l'utilisateur dans le store
	if (payload?.user) {
		authStore.setUser(payload.user)
		console.log('✅ Utilisateur connecté:', payload.user.email)
	} else {
		authStore.setConnected()
	}
	
	// Rediriger vers la destination ou dashboard
	const redirect = route.query.redirect as string
	await navigateTo(redirect || '/dashboard')
}

const onSwitchToSignup = () => {
	navigateTo('/auth/signup')
}

const onForgotPassword = () => {
	navigateTo('/auth/forgot')
}
</script>
