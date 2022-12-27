<script setup lang="ts">
import { PropType, ref } from 'vue'
import Menu from 'primevue/menu'

export interface Action {
	label: string
	icon?: string
	command?: () => void
}
defineProps({
	icon: { type: String, default: 'pi pi-ellipsis-v' },
	buttons: { type: Array as PropType<Action[]>, required: true },
})

const menu = ref()
const toggle = (event: MouseEvent) => {
	if (!menu.value) return
	menu.value.toggle(event)
}
</script>

<template>
	<div v-bind="$attrs" class="app_table_split_btn">
		<Button :icon="icon" class="p-button-text p-button-secondary" @click="toggle" />

		<Menu v-bind="$attrs" ref="menu" :model="buttons" popup />
	</div>
</template>

<style scoped>
:deep(.p-button .p-button-icon) {
	font-size: 1.1rem;
}
</style>
