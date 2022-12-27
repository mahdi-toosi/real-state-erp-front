<script setup lang="ts">
// ? vue
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// ? utils
import { useRepositoryContext } from '@/repository'
import useStoreToast from '@/composable/useStoreToast'
// ? components
import GetUserInfo from '../components/AGetUserInfo.vue'
import AGetOTPAndPass from '../components/AGetOTPAndPass.vue'

// ? define and uses
const $router = useRouter()
const $route = useRoute()
const { showToast } = useStoreToast()
const { auth } = useRepositoryContext()
// ? END define and uses

const username = ref('')
const mobile = ref('')

async function onSendOTP(payload: { username: string; mobile: string }) {
	if (!payload.username) payload.username = username.value // TODO => better solution
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
		name: 'forgotPass',
		query: { status: 'new-pass' },
	})
}

function onSuccess() {
	$router.push({ name: 'login' })
}
</script>

<template>
	<section class="flex flex-col-reverse md:flex-row">
		<div class="px-4 md:px-10 py-7">
			<AGetOTPAndPass
				v-if="$route.query.status === 'new-pass'"
				:mobile="mobile"
				:username="username"
				@sendOTP="onSendOTP"
				@success="onSuccess"
			/>
			<GetUserInfo v-else @sendOTP="onSendOTP" />
		</div>

		<div class="__img_wrapper">
			<img src="@/assets/images/forgot-password.png" width="230" />
		</div>
	</section>
</template>

<style scoped>
.__img_wrapper {
	@apply flex justify-center items-center bg-Orange2 border border-Orange1 rounded-3xl p-4 md:p-24;
}
</style>
