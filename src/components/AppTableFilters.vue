<script setup lang="ts">
// ? vue
import { ref, watch } from 'vue'
// ? utils
import useStoreTableFilters, { Filter, FilterChip } from '@/composable/useStoreTableFilters'
// ? components
import PrimeChip from 'primevue/chip'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'

//? Define and uses
const $props = defineProps({ defaultOpen: { type: Boolean, default: false } })
const $emit = defineEmits<{
	(event: 'search'): void
	(event: 'clearFilters'): void
	(event: 'toggleFilters'): void
	(event: 'removeFilter', filter_key: keyof Filter): void
}>()
const { chips, onRemoveFilterChip } = useStoreTableFilters()
//? End of Define and uses

function onRemoveFilter(chip: FilterChip) {
	onRemoveFilterChip(chip)
	$emit('removeFilter', chip.filter)
}

const chipsKey = ref()
watch(
	() => chips.value,
	() => {
		chipsKey.value = new Date().getTime()
	}
)

const activeAcc = ref<undefined | number>($props.defaultOpen ? 0 : undefined)
function toggleFilters() {
	if (activeAcc.value === undefined) activeAcc.value = 0
	else activeAcc.value = undefined
	$emit('toggleFilters')
}
</script>

<template>
	<section class="p-4 border border-Gray2 rounded mb-5">
		<div class="flex flex-wrap items-center gap-4">
			<Button
				label="فیلتر و جستجو"
				class="p-button-sm p-button-outlined"
				:icon="`fas mr-2 ml-0 ${activeAcc === 0 ? 'fa-chevron-up' : 'fa-chevron-down'}`"
				icon-pos="right"
				@click="toggleFilters()"
			/>

			<div :key="chipsKey" class="__filters_chips">
				<span v-for="(filter, key) in chips" :key="key" class="relative">
					<span class="__chip_title" v-text="filter.title"></span>
					<PrimeChip
						:label="filter.label"
						class="text-sm"
						removable
						@remove="onRemoveFilter(filter)"
					/>
				</span>
			</div>
		</div>

		<Accordion :active-index="activeAcc" class="__filters">
			<AccordionTab>
				<form @submit.prevent="$emit('search')">
					<slot></slot>

					<div class="__actions w-full" dir="ltr">
						<Button type="submit" label="جستجو" class="mr-4" />

						<Button
							label="حذف فیلتر ها"
							class="p-button-text p-button-danger"
							@click.prevent="$emit('clearFilters')"
						/>
					</div>
				</form>
			</AccordionTab>
		</Accordion>
	</section>
</template>

<style scoped>
.__filters_chips {
	@apply flex flex-wrap gap-x-3 gap-y-6 mt-3;
}

.__chip_title {
	@apply text-xs absolute;

	top: -18px;
	right: 10px;
}

:deep(.p-chip-text) {
	min-width: 7rem;
	text-align: center;
}

form {
	@apply flex flex-wrap items-end gap-3 mt-3;
}

:deep(form > div) {
	@apply w-56;
}
</style>
