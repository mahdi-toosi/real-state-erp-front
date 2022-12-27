<script setup lang="ts">
//? vue
import { PropType } from 'vue'

//? utils
import { ErrorObject } from '@vuelidate/core'

//? component
import MultiSelect from 'primevue/multiselect'
import AppInputErrors from '@/components/AppInputErrors.vue'

//? Define and uses
defineProps({
	// eslint-disable-next-line vue/require-prop-types
	modelValue: {},
	label: { type: String, default: '' },
	options: { required: true, type: Array },
	filter: { required: false, type: Boolean },
	required: { type: Boolean, default: false },
	loading: { required: false, type: Boolean },
	optionLabel: { required: true, type: String },
	optionValue: { required: false, type: String },
	placeholder: { required: false, type: String, default: 'انتخاب کنید' },
	emptyMessage: { required: false, type: String, default: 'موردی پیدا نشد.' },
	emptyFilterMessage: { required: false, type: String, default: 'موردی پیدا نشد.' },
	errors: { default: () => [], required: false, type: Array as PropType<ErrorObject[]> },
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

		<MultiSelect
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
