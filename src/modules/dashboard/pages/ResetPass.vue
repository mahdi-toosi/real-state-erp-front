<script setup lang="ts">
//? vue
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

//? utils
import { useRepositoryContext } from '@/repository'
import useStoreToast from '@/composable/useStoreToast'

//?components
import AGetUserInfo from '@/modules/auth/components/AGetUserInfo.vue'
import AGetOTPAndPass from '@/modules/auth/components/AGetOTPAndPass.vue'

// ? define and uses
const $route = useRoute()
const $router = useRouter()
const { showToast } = useStoreToast()
const { auth } = useRepositoryContext()
// ? END define and uses
const username = ref('')
const mobile = ref('')

async function onSendOTP(payload: { mobile: string; username: string }) {
	if (!payload.username) payload.username = username.value
	if (!payload.mobile) payload.mobile = mobile.value

	const result = await auth.getOtp(payload)
	if (!result) return

	username.value = payload.username
	mobile.value = payload.mobile
	showToast({
		severity: 'success',
		detail: result,
		life: 10000,
	})

	$router.push({
		name: 'ResetPass',
		query: { status: 'change-pass' },
	})
}

function onSuccess() {
	$router.push({ name: 'dashboard' })
}
</script>
<template>
	<div class="flex m-4">
		<AGetOTPAndPass
			v-if="$route.query.status === 'change-pass'"
			:has-code="false"
			:mobile="mobile"
			:username="username"
			@sendOTP="onSendOTP"
			@success="onSuccess"
		>
			<template #title> تغییر رمز عبور </template>
		</AGetOTPAndPass>
		<AGetUserInfo v-else :back-btn="false" @sendOTP="onSendOTP">
			<template #title> تغییر رمز عبور </template>
			<template #discription> لطفا تلفن همراه مرتبط با حساب کاربری خود را وارد نمایید. </template>
		</AGetUserInfo>
	</div>
</template>
