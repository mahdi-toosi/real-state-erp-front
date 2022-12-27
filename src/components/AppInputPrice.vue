<script lang="ts">
export default {
	name: 'AppInputPrice',
	inheritAttrs: false,
}
</script>

<script setup lang="ts">
// ? vue
import { onMounted, PropType } from 'vue'
// ? utils
import { ErrorObject } from '@vuelidate/core'
import { testCharacter, toEnNumber } from '@/directive/PersianDigits'
//? components
import AppInputErrors from '@/components/AppInputErrors.vue'
//? utils
import { formatPriceInWrittenForm } from '@/composable/useUtils'

const $props = defineProps({
	label: { type: String },
	icon: { type: String },
	// eslint-disable-next-line vue/require-prop-types
	modelValue: {},
	format: { type: Boolean, default: true },
	loading: { type: Boolean, default: false },
	required: { type: Boolean, default: false },
	placeholder: { type: String, default: 'وارد کنید' },
	errors: {
		type: Array as PropType<ErrorObject[] | { $message: string }[]>,
		default: () => [],
	},
})

const $emit = defineEmits(['update:modelValue'])

function updateValue(event: Event) {
	const e = event as Event & { target: { value: string | number } }
	const val = String(toEnNumber(e.target.value.toString().split(',').join('')))

	if (!testCharacter(val)) {
		$emit('update:modelValue', null)
		return
	}

	$emit('update:modelValue', val)
}

onMounted(() => {
	$emit('update:modelValue', $props.modelValue?.toString().split(',').join(''))
})
</script>

<template>
	<div class="app_input_price" v-bind="$attrs">
		<label v-if="label" :for="label" class="block mb-1 text-sm">
			{{ label }} <span v-if="required" class="text-red-600">*</span>
		</label>

		<span :class="{ 'p-input-icon-right': icon }">
			<i :class="icon"></i>
			<Skeleton v-if="loading" v-bind="$attrs" class="w-full" height="2.6rem" />

			<InputText
				v-else
				:id="label"
				v-bind="$attrs"
				v-persian-digits="{ block: 3, delimiter: ',' }"
				:model-value="modelValue"
				:class="{ 'p-invalid': errors.length }"
				class="w-full"
				type="tel"
				autocomplete="off"
				dir="ltr"
				:placeholder="placeholder"
				@input="updateValue"
			/>
		</span>

		<small v-if="format && modelValue" class="mt-1 block">
			{{ formatPriceInWrittenForm(modelValue) }}
		</small>

		<AppInputErrors v-if="errors.length" :errors="errors" />
	</div>
</template>
