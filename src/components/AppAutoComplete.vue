<script setup lang="ts">
//? vue
import { onMounted, PropType, ref, watch } from 'vue'
//? utils
import { ErrorObject } from '@vuelidate/core'
//? component
import AutoComplete, { AutoCompleteItemUnselectEvent } from 'primevue/autocomplete'
import AppInputErrors from '@/components/AppInputErrors.vue'
import { useDebounceFn } from '@/composable/useDebounceFn'

//? Define and uses
const $props = defineProps({
	// eslint-disable-next-line vue/require-prop-types
	modelValue: {},
	field: { type: String },
	label: { type: String },
	suggestions: { required: true, type: Array },
	required: { type: Boolean, default: false },
	disabled: { required: false, type: Boolean },
	placeholder: { required: false, type: String, default: 'جستجو ...' },
	emptySearchMessage: { required: false, type: String, default: 'موردی پیدا نشد.' },
	errors: {
		default: () => [],
		required: false,
		type: Array as PropType<ErrorObject[] | { $message: string }[]>,
	},
})

const $emit = defineEmits(['blur', 'clear', 'complete', 'item-select', 'update:modelValue'])

const model = ref()
//End of define and uses

const onItemSelected = useDebounceFn((event: AutoCompleteItemUnselectEvent) => {
	$emit('item-select', event.value)
}, 100)

function onClear() {
	model.value = undefined
	$emit('clear')
}

const debouncedOnBlur = useDebounceFn(() => $emit('blur'), 10)

watch(model, () => {
	if (model.value === null) return
	$emit('update:modelValue', model.value)
})

watch(
	() => $props.modelValue,
	() => {
		model.value = $props.modelValue
	}
)

onMounted(() => {
	if ($props.modelValue) model.value = $props.modelValue
})
</script>

<template>
	<div class="app_auto_complete">
		<label v-if="label" class="__label" :for="label">
			{{ label }} <span v-if="required">*</span>
		</label>

		<div class="relative w-full">
			<AutoComplete
				v-model="model"
				dropdown
				:field="field"
				force-selection
				:empty-search-message="emptySearchMessage"
				dropdown-mode="current"
				:placeholder="placeholder"
				:suggestions="suggestions"
				:class="['w-full', { __error: errors.length, __selected: model }]"
				:disabled="disabled || (typeof model === 'object' && model !== null)"
				@blur="debouncedOnBlur"
				@item-select="onItemSelected"
				@complete="$emit('complete', $event)"
			>
				<template #item="{ item, index }">
					<slot name="item" :item="item" :index="index">
						{{ field ? item[field as keyof typeof item] : '' }}
					</slot>
				</template>
			</AutoComplete>

			<i
				v-if="typeof model === 'object' && model !== null"
				class="pi pi-times __clear_button"
				@click="onClear"
			></i>
		</div>

		<AppInputErrors :errors="errors" />
	</div>
</template>

<style scoped>
.__label {
	@apply block mb-1 text-sm;
}

.__label span {
	@apply text-red-600 mr-1 font-bold;
}

:deep(.__selected input) {
	opacity: 1 !important;
}

.__clear_button {
	@apply absolute top-1/2 left-4 cursor-pointer;

	margin-top: -0.5rem;
	color: #6c757d;
}

:deep(.__error .p-autocomplete-input) {
	@apply border border-red-500 shadow-none rounded-lg !important;
}
</style>
