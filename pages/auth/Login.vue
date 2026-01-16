<template>
	<div class="min-h-screen flex flex-col items-center justify-center py-12">
		<AuthLogin @login-success="onLoginSuccess" @switch-to-signup="onSwitchToSignup" @forgot-password="onForgotPassword" />
	</div>
</template>

<script setup lang="ts">
import AuthLogin from '../../features/auth/components/Login.client.vue'
import useAuthStore from '../../features/auth/stores/auth'
import type { User } from '../../features/auth/types/auth.types'

const authStore = useAuthStore()

const onLoginSuccess = async (payload: { user: User } | any) => {
	// Persister l'utilisateur dans le store
	if (payload?.user) {
		authStore.setUser(payload.user)
		console.log('✅ Utilisateur connecté et persisté:', payload.user.email)
	} else {
		authStore.setConnected()
	}
	await navigateTo('/')
}

const onSwitchToSignup = () => {
	navigateTo('/auth/signup')
}

const onForgotPassword = () => {
	navigateTo('/auth/forgot')
}
</script>
