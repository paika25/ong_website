<template>
	<div class="min-h-screen flex flex-col items-center justify-center py-12 bg-background">
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
