<script setup lang="ts">
// ? vue
import { ref, onMounted, computed } from 'vue'
// ? utils
import { getRoutes, dashboardState } from '@/composable/useStoreDashboard'
import useStoreLayout from '@/modules/dashboard/composable/useStoreLayout'
// ? components
import TheHeader from '@/components/TheHeader.vue'
import TheBreadCrumb from '@/components/TheBreadCrumb.vue'
import TheSidebarMenu from '@/components/TheSidebarMenu.vue'
// ? types
import type { SidebarItemAndSections } from '@/repositories/common/types'
import type { ReceivedMessage } from '@/repositories/messages/types'

const { sidebarIsCollapsed } = useStoreLayout()

const menu = ref([] as SidebarItemAndSections[])

const unseenMessages = computed(() => {
	const msgs = dashboardState.messages.data as ReceivedMessage[]
	return msgs.filter((m) => !m.seen_at || (m.confirm_required && !m.confirmed_at))
})

onMounted(async () => {
	menu.value = (await getRoutes()) as SidebarItemAndSections[]
})
</script>

<template>
	<div>
		<TheHeader
			:count-unseen-messages="unseenMessages.length"
			:unseen-messages="unseenMessages"
			:contact-us="dashboardState.contact_us?.support_phone_number"
		/>

		<div class="flex">
			<TheSidebarMenu :menu="menu" />
			<div
				:class="['__content_wrapper overflow-auto', { __sidebar_collapsed: sidebarIsCollapsed }]"
			>
				<div class="__content">
					<TheBreadCrumb />
					<slot />
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.__content_wrapper {
	max-height: calc(100vh - 5.5rem); /* reduce header */
	width: 100vw;
	scroll-behavior: smooth;
}

.__content {
	@apply p-2 md:mr-4 md:ml-2 md:p-10 bg-white rounded-lg;

	box-shadow: 0 4px 20px 0 rgb(0 0 0 / 5%);
	min-height: calc(100vh - 6rem);
}

@media (min-width: 640px) {
	.__content_wrapper {
		max-width: calc(100vw - 250px);
	}

	.__content_wrapper.__sidebar_collapsed {
		max-width: calc(100vw - 65px);
	}
}
</style>
