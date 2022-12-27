<script setup lang="ts">
// ? vue
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
// ? utils
import useVuelidate from '@vuelidate/core'
import { useRepositoryContext } from '@/repository'
import useStoreUser from '@/composable/useStoreUser'
import useStoreToast from '@/composable/useStoreToast'
import useCheckPermissions from '@/composable/hasPermission'
import useValidation from '@/modules/auth/composable/useValidations'
// ? components
import Dialog from 'primevue/dialog'
import { Cropper } from 'vue-advanced-cropper'
import AppInputErrors from '@/components/AppInputErrors.vue'
// ? types
import type { ValidationRuleWithParams } from '@vuelidate/core'
import type { FileUploadPayload } from '@/repositories/common/types'
import type { UpdatePayload, User } from '@/repositories/users/types'
import type { AuthResponse, RegisterPayload } from '@/repositories/auth/types'

// ?  define and uses
const $props = defineProps({
	updateMode: { type: Boolean, default: false },
})
const $emit = defineEmits(['registered'])

const { user, setUser } = useStoreUser()
const { auth, users, common } = useRepositoryContext()
const { hasSysPermission, hasWSPermission } = useCheckPermissions()

const $route = useRoute()
const $router = useRouter()

const isRegisterPage = $route.name === 'register'
const isProfileInfoPage = $route.name === 'ProfileInfo'

const activeRegisterBtn = computed(() => {
	if (isRegisterPage) return true
	if (hasSysPermission('create-users')) return true
	if (hasWSPermission('manage-members')) return true
	return false
})

const mobileBeforeUpdate = ref(undefined as undefined | string)
// ? END define and uses

const userStage = ref({} as User)

const {
	requiredText: first_name,
	requiredText: last_name,
	email,
	nationalCode: national_code,
	mobile,
	password,
	rpassword: password_confirmation,
} = useValidation()
const rules = computed(() => {
	const obj = { first_name, last_name, email, national_code, mobile } as Record<
		string,
		{ [key: string]: ValidationRuleWithParams<object> }
	>
	if (!$props.updateMode) {
		obj.password = password
		obj.password_confirmation = password_confirmation(userStage.value.password as string)
	}
	return obj
})
const $v = useVuelidate(rules, userStage)

function updateUserInFront(result: User) {
	if (user.value.id !== result.id) return
	user.value.first_name = result.first_name
	user.value.last_name = result.last_name
	user.value.mobile = result.mobile
	user.value.national_code = result.national_code
	user.value.avatar = result.avatar ?? ''

	// * save in local storage
	const localUser = localStorage.getItem('user')
	if (localUser) {
		const parsedUser = JSON.parse(localUser)
		parsedUser.first_name = result.first_name
		parsedUser.last_name = result.last_name
		parsedUser.avatar = result.avatar
		localStorage.setItem('user', JSON.stringify(parsedUser))
	}
}

const storeLoading = ref(false)
const { showToast } = useStoreToast()
async function onSubmit() {
	$v.value.$touch()
	if ($v.value.$invalid) return

	storeLoading.value = true

	let result
	if ($props.updateMode) {
		if (userStage.value.id !== user.value.id && !hasSysPermission('edit-users'))
			return (storeLoading.value = false)

		result = await users.updateUser(userStage.value as UpdatePayload)
		if (result) updateUserInFront(result)

		if (result && mobileBeforeUpdate.value !== result.mobile) {
			showToast({
				severity: 'success',
				detail: 'لطفا شماره موبایل خود را تایید و فعال کنید.',
				life: 10000,
			})
			$router.push({ name: 'MobileVerification' })
		}
	} else {
		result = await auth.register(userStage.value as RegisterPayload)
	}
	storeLoading.value = false

	if (!result) return

	if (!isRegisterPage) {
		$emit('registered', result)
		return
	} else setUser(result as AuthResponse)

	const redirect = localStorage.getItem('redirect')
	if (redirect) {
		$router.push(JSON.parse(redirect))
		localStorage.removeItem('redirect')
		return
	}
	userStage.value = result as User
	$router.push({ name: 'dashboard' })
}

const fetchLoading = ref(false)
async function fetchUser() {
	if (!$props.updateMode) return
	let user_id
	if ($route.name === 'ProfileInfo') user_id = user.value.id
	else if (hasSysPermission('view-users')) user_id = Number($route.params.id)
	else return

	fetchLoading.value = true
	const result = await users.getUser({ id: user_id })
	fetchLoading.value = false
	if (!result) return

	userStage.value = result
	mobileBeforeUpdate.value = result.mobile
}

const profileImage = ref({
	src: '',
	type: 'image/jpg',
})
const file = ref()
const cropper = ref()
const showModal = ref(false)
const cropImage = () => {
	const result = cropper.value.getResult()
	result.canvas.toBlob(async (blob: Blob) => {
		await uploadUserProfileImage(blob)
		await onSubmit()
		showModal.value = false
	}, profileImage.value.type)
}

function uploadImage(event: Event) {
	const { files } = event.target as HTMLInputElement

	showModal.value = true
	if (files && files[0]) {
		const blob = URL.createObjectURL(files[0])

		profileImage.value = {
			src: blob,
			type: files[0].type,
		}
	}
}

const avatar = ref('')
const uploading = ref(false)
async function uploadUserProfileImage(file: Blob) {
	uploading.value = true

	const payload = {
		file,
		context: 'profile',
		user_id: user.value.id,
	} as FileUploadPayload

	const result = await common.uploadUserImage(payload)
	uploading.value = false

	if (!result) return
	userStage.value.avatar = result.file_name
	avatar.value = result.preview_url
	showToast({
		severity: 'success',
		life: 5 * 1000,
		detail: 'تصویر با موفقیت بارگذاری شد',
	})
}

onMounted(() => {
	fetchUser()
})
</script>

<template>
	<form :class="{ 'md:px-36 ': $route.name === 'register' }" @submit.prevent="onSubmit">
		<h4 :class="['text-xl font-bold mb-4', { 'text-center mb-10': $route.name === 'register' }]">
			<slot name="header">ایجاد حساب کاربری جدید</slot>
		</h4>
		<slot name="subHeader"> </slot>

		<div v-if="isProfileInfoPage" class="__uploadImage">
			<div class="w-14 h-14 rounded-2xl text-center">
				<img
					v-if="avatar || userStage.avatar"
					class="w-16 h-14 rounded-full object-cover"
					:src="avatar || userStage.avatar"
				/>

				<img v-else class="w-14" src="../assets/icons/profileImage.png" />

				<div class="__uploader">
					<input
						ref="file"
						hidden
						type="file"
						accept="image/png, image/jpeg"
						@change="uploadImage"
					/>

					<i class="fas fa-camera pt-2 cursor-pointer" @click="file.click()"></i>
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<small class="font-bold"> {{ userStage.first_name }} {{ userStage.last_name }} </small>

				<div class="flex gap-5 items-center">
					<!-- <small class="ــroles">نقش ها:</small> -->

					<!-- <span class="__complex">دانش‌آموز <small class="text-Gray2">(مجتمع ارمان)</small></span> -->

					<!-- <span class="__complex">دانش‌آموز <small class="text-Gray2">(مجتمع ارمان)</small></span> -->

					<!-- <span class="__complex">دانش‌آموز <small class="text-Gray2">(مجتمع ارمان)</small></span> -->
				</div>
			</div>
		</div>

		<div v-if="isRegisterPage" class="__info_box">
			<i class="pi pi-info-circle"></i>
			<p>
				در صورتی که متقاضی ثبت‌نام در مدرسه هستید، لطفا فرم زیر را با اطلاعات دانش‌آموز خود پر کنید.
				همچنین در صورت بروز هرگونه مشکل به شماره پشتیبانی
				<a dir="ltr" class="underline" href="tel:+989100818890">+98 910 081 8890</a> در پیام‌رسان
				واتس‌اپ پیام دهید.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div>
				<AppInput
					v-model="userStage.first_name"
					label="نام"
					icon="far fa-user"
					required
					:errors="$v.first_name.$errors"
					:loading="fetchLoading"
				/>
			</div>

			<div>
				<AppInput
					v-model="userStage.last_name"
					label="نام خانوادگی"
					icon="far fa-user"
					required
					:errors="$v.last_name.$errors"
					:loading="fetchLoading"
				/>
			</div>

			<div>
				<AppInput
					v-model="userStage.national_code"
					label="کد ملی"
					icon="fas fa-barcode"
					number
					:disabled="$route.name === 'ProfileInfo'"
					required
					:errors="$v.national_code.$errors"
					:loading="fetchLoading"
				/>
			</div>

			<div>
				<AppInput
					v-model="userStage.mobile"
					label="شماره همراه"
					icon="fas fa-mobile-alt"
					number
					required
					:loading="fetchLoading"
					:errors="$v.mobile.$errors"
				/>
				<small v-if="updateMode && !fetchLoading" class="text-red-500">
					در صورت تغییر باید تایید و فعال سازی انجام گیرد.
				</small>
			</div>

			<template v-if="!updateMode">
				<div>
					<label for="password" class="block mb-1 text-sm">
						رمز عبور <span class="text-red-600">*</span>
					</label>
					<Password
						id="password"
						v-model="userStage.password"
						toggle-mask
						placeholder="وارد کنید"
						hide-icon="far fa-eye-slash"
						show-icon="far fa-eye"
						class="w-full"
						input-class="w-full"
						weak-label="ضعیف"
						medium-label="متوسط"
						strong-label="قوی"
						prompt-label="رمز عبور را وارد کنید"
					/>
					<AppInputErrors :errors="$v.password.$errors" />
				</div>

				<div>
					<label for="password_confirmation" class="block mb-1 text-sm">
						تکرار رمز عبور <span class="text-red-600">*</span>
					</label>
					<Password
						id="password_confirmation"
						v-model="userStage.password_confirmation"
						toggle-mask
						placeholder="وارد کنید"
						hide-icon="far fa-eye-slash"
						show-icon="far fa-eye"
						class="w-full"
						input-class="w-full"
						weak-label="ضعیف"
						medium-label="متوسط"
						strong-label="قوی"
						prompt-label="رمز عبور را وارد کنید"
					/>
					<AppInputErrors :errors="$v.password_confirmation.$errors" />
				</div>

				<div>
					<AppInput
						v-model="userStage.email"
						label="ایمیل"
						placeholder="example@domain.com"
						icon="fas fa-at"
						type="email"
						dir="ltr"
						:errors="$v.email.$errors"
						:loading="fetchLoading"
					/>
				</div>
			</template>
		</div>
		<Dialog v-model:visible="showModal">
			<Cropper
				ref="cropper"
				:stencil-props="{
					aspectRatio: 3 / 3,
					movable: true,
					resizable: true,
				}"
				class="cropper"
				priority="visibleArea"
				default-boundaries="fill"
				:src="profileImage.src"
			/>

			<template #footer>
				<Button label="تایید" class="p-button-success" :loading="uploading" @click="cropImage" />
			</template>
		</Dialog>

		<div class="ــregister_button" dir="ltr">
			<Skeleton v-if="fetchLoading" height="2.6rem" />
			<Button
				v-if="!fetchLoading && updateMode"
				label="بروزرسانی"
				type="submit"
				:loading="storeLoading"
			/>

			<Button
				v-if="!fetchLoading && !updateMode"
				label="ثبت نام"
				type="submit"
				dir="rtl"
				:loading="storeLoading"
				:disabled="!activeRegisterBtn"
			/>

			<router-link v-if="isRegisterPage" to="/auth">
				<Button
					label="قبلا ثبت نام کرده اید؟ از اینجا وارد شوید"
					class="p-button-outlined w-full px-9"
				/>
			</router-link>
		</div>
	</form>
</template>

<style scoped>
:deep(.p-password-input) {
	width: 100%;
}

.__info_box {
	@apply flex items-center gap-3 border border-Blue1 bg-Blue2 p-3 rounded-lg
		max-w-3xl mx-auto mb-8 text-Blue1;
}

.__info_box i {
	@apply text-center block text-2xl;
}

.ــregister_button {
	@apply grid grid-cols-1 md:grid-cols-2 gap-4 mt-8;
}

:deep(.__documents_section) {
	@apply bg-white p-5 py-10 rounded-lg my-4;
}

#app {
	text-align: center;
	color: #2c3e50;
	margin-top: 100px;
}

.cropper {
	max-height: 700px;
}

.button-wrapper {
	display: flex;
	justify-content: center;
	margin-top: 17px;
}

.button {
	color: white;
	font-size: 16px;
	padding: 10px 20px;
	width: 100%;
	background: #151515;
	cursor: pointer;
	transition: background 0.5s;
	border: none;
}

.button input {
	display: none;
}

.button:hover {
	background: #2f2f2f;
}

.button:not(:last-of-type) {
	margin-right: 10px;
}

.__complex {
	@apply bg-white rounded-2xl text-center px-4 py-1 text-sm;
}

.__uploadImage {
	@apply mb-8 flex items-center p-4 gap-4 rounded-lg h-24;

	background: linear-gradient(180deg, rgb(139 148 167 / 5%) 0%, rgb(139 148 167 / 10%) 100%);
	width: 960px;
}

.__uploader {
	@apply bg-white w-8 h-8 rounded-full sticky -mt-5 -mr-2;
}

.ــroles {
	@apply text-base font-normal opacity-40;
}
</style>
