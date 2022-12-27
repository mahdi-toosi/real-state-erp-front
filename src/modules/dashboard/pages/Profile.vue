<script setup lang="ts">
// ? vue
import { ref } from 'vue'
// ? utils
import { dashboardState } from '@/composable/useStoreDashboard'
//? components
import TabMenu from 'primevue/tabmenu'

//? define and uses
const items = ref([
	{
		label: 'مشخصات کاربری',
		to: '/profile',
	},
	{
		label: 'فعالسازی شماره موبایل',
		to: '/profile/mobile-activation',
	},
	{
		label: 'تغییر رمز عبور',
		to: '/profile/reset-pass',
	},
])

if (dashboardState.workspaces.length) {
	items.value.splice(1, 0, {
		label: 'تغییر مجموعه',
		to: '/profile/switch-workspace',
	})
}
//? End define and uses
</script>

<template>
	<DefaultLayout>
		<TabMenu :model="items" />
		<div class="max-w-xl">
			<router-view />
		</div>
	</DefaultLayout>
</template>
