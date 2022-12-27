<script setup lang="ts">
import { PropType } from 'vue'
import { ErrorObject } from '@vuelidate/core'

defineProps({
	errors: { required: true, type: Array as PropType<ErrorObject[] | { $message: string }[]> },
})
</script>

<template>
	<small
		v-if="errors.length"
		class="text-red-600 block"
		dir="rtl"
		v-text="errors[0].$message"
	></small>
</template>
