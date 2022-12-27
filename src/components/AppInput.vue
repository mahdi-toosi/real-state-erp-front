<script setup lang="ts">
// ? vue
import { PropType } from 'vue'
// ? utils
import { ErrorObject } from '@vuelidate/core'
// ? components
import AppInputErrors from '@/components/AppInputErrors.vue'

defineProps({
	label: { type: String },
	icon: { type: String, required: false },
	modelValue: { type: [String, Number] },
	loading: { type: Boolean, default: false },
	number: { type: Boolean, default: false },
	required: { type: Boolean, default: false },
	placeholder: { type: String, default: 'وارد کنید' },
	errors: {
		type: Array as PropType<ErrorObject[] | { $message: string }[]>,
		required: false,
		default: () => [],
	},
})

const $emit = defineEmits(['update:modelValue'])
function updateValue(event: Event) {
	const e = event as Event & { target: { value: string | number } }
	$emit('update:modelValue', e.target.value)
}
</script>

<template>
	<div class="app_input">
		<label v-if="label" :for="label" class="block mb-1 text-sm" dir="rtl">
			{{ label }} <span v-if="required" class="text-red-600">*</span>
		</label>

		<span :class="['w-full', { 'p-input-icon-right': icon }]">
			<i :class="icon"></i>
			<Skeleton v-if="loading" v-bind="$attrs" class="w-full" height="2.6rem" />

			<InputText
				v-else
				:id="label"
				class="w-full"
				v-bind="$attrs"
				autocomplete="off"
				:value="modelValue"
				:placeholder="placeholder"
				:dir="number ? 'ltr' : undefined"
				:type="number ? 'number' : undefined"
				:class="{ 'p-invalid': errors.length, r_remove_spin_btns: number }"
				@input="updateValue"
			/>
		</span>

		<AppInputErrors :errors="errors" />
	</div>
</template>
