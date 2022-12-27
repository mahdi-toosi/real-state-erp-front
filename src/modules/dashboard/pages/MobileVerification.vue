<script setup lang="ts">
// ? vue
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// ? utils
import useVuelidate from '@vuelidate/core'
import { useRepositoryContext } from '@/repository'
import useValidation from '@/modules/auth/composable/useValidations'
// ? components
import AppInput from '@/components/AppInput.vue'
import useStoreUser from '@/composable/useStoreUser'
import AGetOTPTimer from '@/modules/auth/components/AGetOTPTimer.vue'
// ? types
import type { ValidationRuleWithParams } from '@vuelidate/core'

const { user } = useStoreUser()
const { auth } = useRepositoryContext()

const stage = ref({
	mobileSended: false,
	mobile: undefined as undefined | string,
	national_code: undefined as undefined | string,
	activation_code: undefined as undefined | number,
})
const { mobile, requiredField: activation_code, nationalCode: national_code } = useValidation()

const rules = computed(() => {
	const obj = { national_code, mobile } as Record<
		string,
		{ [key: string]: ValidationRuleWithParams<object> }
	>
	if (stage.value.mobileSended) obj.activation_code = activation_code
	return obj
})
const $v = useVuelidate(rules, stage)
const loading = ref(false)

async function getOtp() {
	$v.value.$touch()
	if ($v.value.$invalid) return

	loading.value = true
	const result = await auth.getOtp({
		mobile: stage.value.mobile as string,
		username: stage.value.national_code as string,
	})
	loading.value = false
	if (result) stage.value.mobileSended = true
}

const $router = useRouter()
async function activeMobile() {
	$v.value.$touch()
	if ($v.value.$invalid) return

	if (!stage.value.mobileSended) return getOtp()

	loading.value = true
	const result = await auth.verifyMobile(stage.value.activation_code as number)
	loading.value = false
	if (!result) return

	const redirect = localStorage.getItem('redirect')
	localStorage.removeItem('redirect')
	$router.push(redirect || '/')
}

onMounted(() => {
	stage.value.mobile = user.value.mobile
	stage.value.national_code = user.value.national_code
})
</script>

<template>
	<form class="max-w-xs flex flex-col gap-5 mt-5" @submit.prevent="activeMobile">
		<AppInput
			v-model="stage.national_code"
			label="نام کاربری"
			icon="far fa-barcode"
			number
			:errors="$v.national_code.$errors"
			:disabled="stage.mobileSended"
		/>

		<AppInput
			v-model="stage.mobile"
			label="شماره همراه"
			icon="fas fa-mobile-alt"
			number
			:errors="$v.mobile.$errors"
			:disabled="stage.mobileSended"
		/>

		<AppInput
			v-if="stage.mobileSended"
			v-model="stage.activation_code"
			label="کد اعتبار سنجی"
			number
			:errors="$v.activation_code.$errors"
		/>

		<AGetOTPTimer v-if="stage.mobileSended" class="mt-0" @sendAgain="stage.mobileSended = false" />

		<Button
			type="submit"
			:loading="loading"
			:class="{ 'p-button-success': stage.mobileSended }"
			:label="stage.mobileSended ? 'تایید شماره موبایل' : 'ارسال کد اعتبار سنجی'"
		/>
	</form>
</template>
