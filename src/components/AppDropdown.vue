<script setup lang="ts">
//? vue
import { PropType } from 'vue'

//? utils
import { ErrorObject } from '@vuelidate/core'

//? component
import Dropdown from 'primevue/dropdown'
import AppInputErrors from '@/components/AppInputErrors.vue'

//? Define and uses
defineProps({
	options: { required: true, type: Array },
	placeholder: { required: false, type: String, default: 'انتخاب کنید' },
	optionLabel: { required: true, type: String },
	optionValue: { required: false, type: String },
	emptyMessage: { required: false, type: String, default: 'موردی پیدا نشد.' },
	emptyFilterMessage: { required: false, type: String, default: 'موردی پیدا نشد.' },
	// eslint-disable-next-line vue/require-prop-types
	modelValue: {},
	filter: { required: false, type: Boolean },
	loading: { required: false, type: Boolean },
	label: { type: String, default: '' },
	required: { type: Boolean, default: false },

	errors: {
		default: () => [],
		required: false,
		type: Array as PropType<ErrorObject[] | { $message: string }[]>,
	},
})
const emit = defineEmits(['update:modelValue'])
//End of define and uses

function updateValue(event: { value: string | number }) {
	emit('update:modelValue', event.value)
}
</script>
<template>
	<div>
		<label v-if="label" class="block mb-1 text-sm" :for="label">
			{{ label }} <span v-if="required" class="text-red-600 mr-1 font-bold">*</span>
		</label>

		<Skeleton v-if="loading" height="36px" v-bind="$attrs" />

		<Dropdown
			v-else
			:filter="filter"
			v-bind="$attrs"
			:options="options"
			:placeholder="placeholder"
			:option-label="optionLabel"
			:model-value="modelValue"
			:option-value="optionValue"
			:empty-message="emptyMessage"
			:empty-filter-message="emptyFilterMessage"
			:class="['flex items-center', { 'p-invalid': errors.length }]"
			@change="updateValue"
		/>

		<AppInputErrors :errors="errors" />
	</div>
</template>
