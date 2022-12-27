<script setup lang="ts">
//? vue
import { PropType, ref } from 'vue'
import { useRouter } from 'vue-router'
// ? utils
import useStoreUser from '@/composable/useStoreUser'
import { dashboardState } from '@/composable/useStoreDashboard'
import useStoreLayout from '@/modules/dashboard/composable/useStoreLayout'
//? component
import TheUnseenMessages from './TheUnseenMessages.vue'
//? type
import type { ReceivedMessage } from '@/repositories/messages/types'

defineProps({
	countUnseenMessages: { type: Number, required: true, default: 0 },
	unseenMessages: { type: Array as PropType<ReceivedMessage[]>, default: () => [] },
	contactUs: { type: String },
})

const { user } = useStoreUser()
const { sidebarIsCollapsed, onSidebarCollapsed } = useStoreLayout()

const showProfileOptions = ref(false)

const $router = useRouter()
function showProfile() {
	$router.push({ name: 'ProfileInfo' })
	showProfileOptions.value = false
}

function signOut() {
	localStorage.clear()
	window.location.href = window.location.origin + '/auth'
}
</script>

<template>
	<header class="__header">
		<div class="flex items-center gap-4">
			<Button
				class="p-button-text p-button-rounded p-button-secondary md:hidden"
				:icon="`fas fa-${sidebarIsCollapsed ? 'bars' : 'times'}`"
				@click="onSidebarCollapsed(!sidebarIsCollapsed)"
			/>

			<img class="__image" src="@/assets/icons/profileImage.png" />

			<span
				class="font-bold text-dark-blue hidden md:block"
				v-text="dashboardState.activeWorkspace?.name ?? ''"
			/>
		</div>

		<div class="flex justify-end relative gap-4">
			<!-- Support btn -->
			<a v-if="contactUs?.length" :href="`tel:${contactUs}`" class="__support_btn">
				<!-- whatsapp svg -->
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-6 h-6 ml-2">
					<path
						fill="green"
						d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"
					/>
				</svg>
				<!-- whatsapp svg -->

				<span class="flex">
					پشتیبانی
					<span class="hidden md:block">:</span>
					<span class="hidden md:block mr-3" v-text="contactUs" />
				</span>
			</a>

			<!-- End Support btn -->

			<!-- Profile btn -->
			<div class="relative">
				<div
					v-if="showProfileOptions"
					class="fixed top-0 left-0 w-screen h-screen"
					@click="showProfileOptions = !showProfileOptions"
				></div>

				<Button
					:class="[
						'p-button-rounded p-button-outlined __profile_btn',
						{ 'border-0 md:border pl-1': user.avatar },
					]"
					@click="showProfileOptions = !showProfileOptions"
				>
					<img v-if="user.avatar" class="__user_avatar" :src="user.avatar" />
					<i v-else class="far fa-user mr-3"></i>

					<span>
						{{ user.first_name + ' ' + user.last_name }}
					</span>
					<i
						:class="`hidden md:block mr-auto pi pi-chevron-${showProfileOptions ? 'up' : 'down'}`"
					></i>
				</Button>

				<transition name="fade">
					<ul v-if="showProfileOptions" class="__profile_options">
						<li class="text-dark-blue" @click="showProfile">
							<i class="far fa-eye"></i> <span>مشاهده حساب کاربری</span>
						</li>

						<li class="text-red-500" @click="signOut">
							<i class="far fa-sign-out-alt"></i> <span>خروج از حساب کاربری</span>
						</li>
					</ul>
				</transition>
			</div>
			<!-- End Profile btn -->

			<TheUnseenMessages
				:count-unseen-messages="unseenMessages.length"
				:unseen-messages="unseenMessages"
			/>
		</div>

		<!-- <Button
			class="__back_btn p-button-secondary p-button-outlined p-button-rounded"
			icon="fas fa-arrow-left"
			@click="$router.go(-1)"
		/> -->
	</header>
</template>

<style scoped>
.__header {
	@apply px-4 py-8 h-14 bg-white rounded-lg  flex items-center justify-between relative mb-4;

	box-shadow: 0 4px 20px 0 rgb(0 0 0 / 5%);
}

.__image {
	@apply rounded-2xl w-12 h-12 hidden md:block;
}

.__support_btn {
	@apply flex items-center border border-Gray1 p-2 md:px-4 text-dark-blue text-sm
		rounded-lg h-11;
}

.__profile_btn {
	@apply text-dark-blue border-Gray1 w-full md:w-72 h-11 pr-1 relative !important;
}

.__profile_btn span {
	@apply mr-2 hidden md:block md:w-5/6 md:text-right
		whitespace-nowrap overflow-hidden overflow-ellipsis;
}

.__user_avatar {
	@apply w-10 h-9 rounded-lg object-cover;
}

.__profile_options {
	@apply flex flex-col absolute left-0 top-11 bg-white
		rounded overflow-auto py-2 z-10000 cursor-pointer md:w-72;

	box-shadow: 0 1px 11px 4px rgb(0 0 0 / 10%);
}

.__profile_options li {
	@apply py-3 px-4 transition flex items-center gap-3 whitespace-nowrap text-sm;
}

.__profile_options li:hover {
	@apply bg-slate-50;
}
</style>
