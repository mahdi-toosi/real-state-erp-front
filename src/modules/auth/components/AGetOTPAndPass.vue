<script setup lang="ts">
// ? vue
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
// ? utils
import { useRepositoryContext } from '@/repository'
import useVuelidate from '@vuelidate/core'
import useValidation from '@/modules/auth/composable/useValidations'
import useStoreToast from '@/composable/useStoreToast'

// ? components
import OTPFormTimer from './AGetOTPTimer.vue'
import AppInputErrors from '@/components/AppInputErrors.vue'

// ? define and uses
const $props = defineProps({
	mobile: { type: String, required: true },
	username: { type: String, required: true },
})
const router = useRouter()
const $emit = defineEmits(['sendOTP', 'success'])
const { showToast } = useStoreToast()
const { auth } = useRepositoryContext()

const { otpCode, password, rpassword } = useValidation()

const state = reactive({ otpCode: '', password: '', rpassword: '' })
const rules = computed(() => ({ otpCode, password, rpassword: rpassword(state.password) }))
const $v = useVuelidate(rules, state)

// ? END define and uses

const loading = ref(false)
async function onSubmit() {
	$v.value.$touch()
	if ($v.value.$invalid) return
	loading.value = true

	const payload = {
		mobile: $props.mobile,
		username: $props.username,
		activation_code: state.otpCode,
		password: state.password,
		password_confirmation: state.rpassword,
	}
	const result = await auth.resetPass(payload)

	if (!result) return (loading.value = false)

	showToast({
		severity: 'success',
		detail: result,
		life: 10000,
	})
	$emit('success')
}

function sendAgain() {
	$emit('sendOTP')
}
</script>

<template>
	<form class="flex flex-col" @submit.prevent="onSubmit">
		<slot name="title">
			<h4 class="text-xl mb-3">بازیابی رمز عبور</h4>
		</slot>
		<p class="mb-2" style="max-width: 22rem">
			کد چهار رقمی برای شما ارسال شد. لطفا کد را به همراه رمز عبور جدید وارد کنید.
		</p>

		<div class="flex flex-col md:block">
			<AppInput
				v-model="state.otpCode"
				label="کد اعتبار سنجی"
				icon="far fa-comment-dots"
				number
				:errors="$v.otpCode.$errors"
				@change="$v.otpCode.$touch()"
			/>

			<label for="password" class="block mt-5 mb-1 text-sm"> رمز عبور</label>
			<Password
				id="password"
				v-model="state.password"
				class="w-full"
				input-class="w-full"
				toggle-mask
				hide-icon="far fa-eye-slash"
				show-icon="far fa-eye"
				weak-label="ضعیف"
				medium-label="متوسط"
				strong-label="قوی"
				@change="$v.password.$touch()"
			/>
			<AppInputErrors :errors="$v.password.$errors" />

			<label for="rpassword" class="block mt-5 mb-1 text-sm"> تکرار رمز عبور</label>
			<Password
				id="rpassword"
				v-model="state.rpassword"
				class="w-full"
				input-class="w-full"
				toggle-mask
				hide-icon="far fa-eye-slash"
				show-icon="far fa-eye"
				weak-label="ضعیف"
				medium-label="متوسط"
				strong-label="قوی"
				@change="$v.rpassword.$touch()"
			/>
			<AppInputErrors :errors="$v.rpassword.$errors" />
		</div>

		<OTPFormTimer @sendAgain="sendAgain()" />

		<hr class="hidden md:block text-gray-300 mt-4" />

		<div class="ــbuttons">
			<Button type="button" label="بازگشت" class="p-button-outlined" @click="router.back()" />

			<hr class="md:hidden text-gray-300 my-3" />

			<Button type="submit" label="تغییر رمز عبور" :loading="loading" />
		</div>
	</form>
</template>

<style scoped>
:deep(.p-password-input) {
	width: 100%;
}

.ــbuttons {
	@apply flex flex-col-reverse md:flex-row justify-between mt-5;
}
</style>
