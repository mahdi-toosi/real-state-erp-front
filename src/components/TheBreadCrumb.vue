<script setup lang="ts">
// ? vue
import { watchEffect, ref } from 'vue'
import { useRoute } from 'vue-router'
// ?
import { dashboard_bread } from '@/modules/dashboard'
// ? types
import type { Bread } from 'types/global'

const $route = useRoute()

const savedBreads = ref([] as Bread[])

watchEffect(() => {
	const breadcrumb = $route.meta?.breadcrumb
	if (!breadcrumb) return

	// const breads = breadcrumb.map((b) => {
	// 	if (!savedBreads.value.length) return b

	// 	const sb = savedBreads.value.find((sb) => sb.name == b.name)
	// 	if (sb) return sb

	// 	savedBreads.value = []
	// 	return b
	// })

	savedBreads.value = [
		dashboard_bread,
		...breadcrumb,
		{ name: $route.name as string, title: $route.meta.title },
	]
})
</script>

<template>
	<div v-if="$route.meta?.breadcrumb" class="__bread_crumb flex flex-wrap items-center mb-3">
		<template v-for="(link, index) in savedBreads" :key="link.name">
			<router-link v-if="link.name && index !== savedBreads.length - 1" :to="link">
				<Button
					type="button"
					class="p-button-text shadow-none whitespace-nowrap"
					:class="{ __truncate: index + 1 === savedBreads.length }"
					:label="link.title"
					:disabled="index + 1 === savedBreads.length || !link.name"
					:title="link.title"
				/>
			</router-link>
			<Button
				v-else
				type="button"
				class="p-button-text shadow-none whitespace-nowrap"
				:class="{ __truncate: index + 1 === savedBreads.length }"
				:label="link.title"
				:disabled="index + 1 === savedBreads.length || !link.name"
				:title="link.title"
			/>

			<span v-if="index + 1 !== savedBreads.length">
				<i class="far fa-angle-left text-Blue1"></i>
			</span>
		</template>
	</div>
</template>

<style scoped>
.__truncate .p-button-label {
	@apply truncate;

	max-width: 150px;
}
</style>
