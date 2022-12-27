<script setup lang="ts">
//? vue
import { computed, PropType } from 'vue'
//? component
import DatePicker from 'vue3-persian-datetime-picker'
import AppInputErrors from '@/components/AppInputErrors.vue'
// ? types
import type { ErrorObject } from '@vuelidate/core'

//? Define and uses
const emit = defineEmits(['update:modelValue', 'change'])
const $props = defineProps({
	label: { type: String },
	min: { type: String },
	customInput: { type: String },
	type: { type: String, default: 'date' },
	modelValue: { type: [String, Array] },
	range: { type: Boolean, default: false },
	loading: { type: Boolean, default: false },
	required: { type: Boolean, default: false },
	disabled: { type: Boolean, required: false },
	jumpMinute: { type: Number, required: false },
	roundMinute: { type: Boolean, required: false },
	placeholder: { type: String, default: 'انتخاب کنید' },
	format: { type: String, default: 'YYYY-MM-DD HH:mm:ss' },
	displayFormat: { type: String, default: 'HH:mm jYYYY/jMM/jDD' },
	view: { type: String as PropType<'year' | 'month' | 'day' | 'time'> },
	errors: {
		default: () => [],
		required: false,
		type: Array as PropType<ErrorObject[]>,
	},
})
//? End of define and uses

const date = computed({
	get() {
		return $props.modelValue
	},
	set(val: boolean) {
		emit('update:modelValue', val)
		emit('change')
	},
})

function calcFormat() {
	if ($props.type === 'date') return 'jYYYY/jMM/jDD'
	else if ($props.type === 'datetime') return 'HH:mm jYYYY/jMM/jDD'
	else if ($props.type === 'time') return 'HH:mm'
}
</script>
<template>
	<div class="app_date_picker">
		<label v-if="label" class="block mb-1 text-sm" v-bind="$attrs">
			{{ label }} <span v-if="required" class="text-red-600 mr-1 font-bold">*</span>
		</label>

		<Skeleton v-if="loading" height="36px" v-bind="$attrs" />

		<DatePicker
			v-else
			:key="date"
			v-model="date"
			:min="min"
			auto-submit
			:type="type"
			:view="view"
			:range="range"
			color="#2196F3"
			:format="format"
			:disabled="disabled"
			:jump-minute="jumpMinute"
			:round-minute="roundMinute"
			:custom-input="customInput"
			:placeholder="placeholder"
			:display-format="calcFormat() || displayFormat"
			:class="{ __errors: errors.length }"
		/>

		<AppInputErrors :errors="errors" />
	</div>
</template>

<style scoped>
:deep(.__errors .form-control) {
	@apply border border-Red1;
}

:deep(.vpd-disabled label) {
	@apply cursor-not-allowed bg-blue-400 !important;
}

:deep(.vpd-disabled input) {
	@apply cursor-not-allowed text-gray-400 !important;
}
</style>
