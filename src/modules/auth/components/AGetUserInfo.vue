<script setup lang="ts">
// ? vue
import { computed, reactive, ref } from 'vue'
// ? utils
import useVuelidate from '@vuelidate/core'
import useValidation from '@/modules/auth/composable/useValidations'

// ? define and uses
defineProps({
	backBtn: {
		default: true,
		type: Boolean,
	},
})
const $emit = defineEmits(['sendOTP'])
const { nationalCode, mobile } = useValidation()

const state = reactive({ nationalCode: '', mobile: '' })
const rules = computed(() => ({ nationalCode, mobile }))
const $v = useVuelidate(rules, state)

// ? END define and uses

const loading = ref(false)
async function onSubmit() {
	$v.value.$touch()
	if ($v.value.$invalid) return
	loading.value = true
	$emit('sendOTP', { username: state.nationalCode, mobile: state.mobile })

	setTimeout(() => (loading.value = false), 2000)
}
</script>

<template>
	<form class="flex flex-col" @submit.prevent="onSubmit">
		<h4 class="text-xl text-center mb-3 relative">
			<slot name="title">
				بازیابی رمز عبور
				<span v-if="backBtn" class="absolute right-0 -top-2">
					<router-link to="/auth">
						<Button class="p-button-secondary p-button-text text-xl" icon="fas fa-arrow-right" />
					</router-link>
				</span>
			</slot>
		</h4>
		<p class="mb-2 text-center max-w-sm">
			<slot name="discription">
				برای بازیابی،‌ کد ملی و شماره ای که با آن ثبت نام کرده اید را وارد کرده سپس کد ارسال شده به
				شماره را وارد نمایید.
			</slot>
		</p>

		<div class="flex flex-col md:block">
			<div class="mt-5">
				<AppInput
					v-model="state.nationalCode"
					label="کد ملی"
					icon="fas fa-barcode"
					number
					:errors="$v.nationalCode.$errors"
					@change="$v.nationalCode.$touch()"
				/>
			</div>

			<div class="mt-5">
				<AppInput
					v-model="state.mobile"
					label="شماره همراه"
					icon="fas fa-mobile-alt"
					number
					:errors="$v.mobile.$errors"
					@change="$v.mobile.$touch()"
				/>
			</div>
		</div>

		<Button
			type="submit"
			class="w-full p-button-success mt-7"
			label="دریافت کد 4 رقمی"
			:loading="loading"
		/>
	</form>
</template>
