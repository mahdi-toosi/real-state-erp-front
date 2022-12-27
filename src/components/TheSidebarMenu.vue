<script setup lang="ts">
// ? vue
import { onMounted, ref } from 'vue'
import { SidebarItemAndSections } from '@/repositories/common/types'
// ? utils
import { dashboardState } from '@/composable/useStoreDashboard'
import useStoreLayout from '@/modules/dashboard/composable/useStoreLayout'
// ? components
import { SidebarItem, SidebarMenu } from 'vue-sidebar-menu'

import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

defineProps<{ menu: SidebarItemAndSections[] }>()

const { sidebarIsCollapsed, onSidebarCollapsed } = useStoreLayout()

const windowWidth = ref(window.innerWidth)
window.onresize = () => {
	windowWidth.value = window.innerWidth
}

function onItemClicked(_event: Event, item: SidebarItem) {
	if (item.href && !Array.isArray(item.child) && windowWidth.value < 640) onSidebarCollapsed(true)
}

onMounted(() => {
	const sidebarStatus = localStorage.getItem('sidebarStatus')
	if (windowWidth.value > 640) onSidebarCollapsed(sidebarStatus === '1' ? true : false)
})
</script>
<template>
	<SidebarMenu
		rtl
		:menu="menu"
		width="250px"
		class="__sidebar"
		theme="white-theme"
		:relative="windowWidth > 640"
		:collapsed="sidebarIsCollapsed"
		@item-click="onItemClicked"
		@update:collapsed="onSidebarCollapsed"
	>
		<template v-if="windowWidth < 640" #header>
			<div class="flex items-center mt-8">
				<img class="__avatar mr-4" src="@/assets/icons/profileImage.png" />

				<h3 class="mr-4" v-text="dashboardState.activeWorkspace?.name ?? ''"></h3>
			</div>

			<hr class="mx-3 mt-4 mb-2" />
		</template>

		<template #toggle-icon>
			<i :class="`fas fa-angle-${sidebarIsCollapsed ? 'left' : 'right'}`"></i>
		</template>
	</SidebarMenu>

	<div v-show="!sidebarIsCollapsed" class="__sidebar_mask" @click="onSidebarCollapsed(true)"></div>
</template>

<style scoped>
.__sidebar {
	@apply shadow z-20;
}

.__sidebar_mask {
	@apply fixed w-screen h-screen md:hidden z-10;
}

:deep(.vsm--link_active[aria-current='page']) {
	pointer-events: none;
}

:deep(.vsm--title) {
	@apply text-sm;
}

.v-sidebar-menu {
	@apply rounded-tl-2xl rounded-bl-2xl h-screen;

	max-height: calc(100vh - 6rem) !important; /* reduce header */
	top: 5rem !important;
}

.v-sidebar-menu.vsm_collapsed {
	max-width: 0 !important;
	overflow: hidden;
}

:deep(.vsm--mobile-bg) {
	@apply rounded-md bg-98Gray  !important;
}

:deep(.vsm--toggle-btn) {
	@apply rounded-bl-2xl h-11;
}

:deep(.vsm--icon) {
	@apply rounded-lg text-white !important;

	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
}

:deep(.vsm--dropdown) {
	@apply bg-98Gray !important;
}

:deep(.vsm--dropdown .vsm--item:hover) {
	@apply bg-Background_Gray !important;
}

:deep(.vsm--dropdown .vsm--icon) {
	@apply text-dark-blue !important;

	font-size: 5px;
}

:deep(.vsm--arrow_default::before) {
	@apply w-2 h-2 border-Gray2;
}

:deep(.vsm--arrow_open .vsm--arrow_default::before) {
	@apply border-Gray2;
}

:deep(.vsm--link_level-1.vsm--link_open) {
	@apply text-dark-blue  !important;

	background: #f3f6fc !important;
	box-shadow: inset -3px 0 0 0 #8b94a7 !important;
}

:deep(.vsm--link) {
	@apply text-dark-blue !important;
}

:deep(.vsm--link_active) {
	box-shadow: inset -3px 0 0 0 #8b94a7 !important;
}

/* icon background colors  */
:deep(.vsm--icon.fa-home) {
	background: linear-gradient(180deg, rgb(156 136 255 / 50%) 0%, #9c88ff 100%) !important;
}

:deep(.vsm--icon.fa-chalkboard-teacher) {
	background: linear-gradient(180deg, rgb(255 174 17 / 50%) 0%, #ffae11 100%) !important;
}

:deep(.vsm--icon.fa-sitemap) {
	background: linear-gradient(180deg, rgb(3 192 104 / 50%) 0%, #03c068 100%) !important;
}

:deep(.vsm--icon.fa-file-alt) {
	background: linear-gradient(180deg, rgb(248 130 215 / 50%) 0%, #f882d7 100%) !important;
}

:deep(.vsm--icon.fa-cog) {
	background: linear-gradient(180deg, rgb(139 148 167 / 50%) 0%, #8b94a7 100%) !important;
}

:deep(.vsm--icon.fa-users) {
	background: linear-gradient(180deg, rgb(145 217 54 / 50%) 0%, #91d936 100%) !important;
}

:deep(.vsm--icon.fa-book-open) {
	background: linear-gradient(180deg, rgb(255 174 17 / 50%) 0%, #ffae11 100%) !important;
}

:deep(.vsm--icon.fa-comment-alt) {
	background: linear-gradient(180deg, rgb(96 191 255 / 50%) 0%, #60bfff 100%) !important;
}

:deep(.vsm--icon.fa-address-card) {
	background: linear-gradient(180deg, rgb(145 217 54 / 50%) 0%, #91d936 100%) !important;
}

:deep(.vsm--icon.fa-calendar-alt) {
	background: linear-gradient(180deg, rgb(96 191 255 / 50%) 0%, #60bfff 100%) !important;
}

:deep(.vsm--icon.fa-usd-circle) {
	background: linear-gradient(180deg, rgb(156 136 255 / 50%) 0%, #9c88ff 100%) !important;
}

:deep(.vsm--icon.fa-briefcase) {
	background: linear-gradient(180deg, rgb(255 174 17 / 50%) 0%, #ffae11 100%) !important;
}

:deep(.vsm--icon.fa-utensils) {
	background: linear-gradient(180deg, rgb(241 75 75 / 50%) 0%, #f14b4b 100%) !important;
}

:deep(.vsm--icon.fa-city) {
	background: linear-gradient(180deg, rgb(96 191 255 / 50%) 0%, #60bfff 100%) !important;
}

:deep(.vsm--icon.fa-sms) {
	background: linear-gradient(180deg, rgb(96 191 255 / 50%) 0%, #60bfff 100%) !important;
}

:deep(.vsm--icon.fa-car-side) {
	background: linear-gradient(180deg, rgb(241 75 75 / 50%) 0%, #f14b4b 100%) !important;
}

:deep(.vsm--icon.fa-envelope) {
	background: linear-gradient(180deg, rgb(3 192 104 / 50%) 0%, #03c068 100%) !important;
}

:deep(.vsm--icon.fa-car) {
	background: linear-gradient(180deg, rgb(241 75 75 / 50%) 0%, #f14b4b 100%) !important;
}

/* End icon background colors  */

@media (min-width: 640px) {
	.v-sidebar-menu {
		top: 0 !important;
	}

	.v-sidebar-menu.vsm_collapsed {
		max-width: 65px !important;
		overflow: visible;
	}
}
</style>
