<template>
	<div class="min-h-screen flex flex-col items-center justify-center py-12">
		<AuthLogin @login-success="onLoginSuccess" @switch-to-signup="onSwitchToSignup" @forgot-password="onForgotPassword" />
	</div>
</template>

<script setup lang="ts">
import AuthLogin from '../../features/auth/components/Login.vue'
import { navigateTo } from '#app'

const onLoginSuccess = async (payload: any) => {
	await navigateTo('/')
}

const onSwitchToSignup = () => {
	navigateTo('/auth/signup')
}

const onForgotPassword = () => {
	navigateTo('/auth/forgot')
}
</script>
