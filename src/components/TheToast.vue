<script setup lang="ts">
// ? vue
import { watch, ref } from 'vue'
// ? utils
import useStoreToast from '@/composable/useStoreToast'
import { useToast } from 'primevue/usetoast'
// ? components
import Toast from 'primevue/toast'

const timerId = ref(0)
const $toast = useToast()
const { toast: toastState, showToast } = useStoreToast()

watch(toastState, (value) => {
	if (!value.detail) return
	$toast.add({
		severity: toastState.value.severity,
		detail: toastState.value.detail,
		life: toastState.value.life,
	})
	timerId.value = window.setTimeout(() => {
		showToast({ detail: '' })
		clearTimeout(timerId.value)
	}, toastState.value.life)
})
</script>
<template>
	<Toast position="bottom-left" />
</template>

<style scoped>
:global(.p-toast) {
	@apply w-[22rem] md:w-96;
}

:global(.p-toast-message-text) {
	@apply m-0 mr-4 !important;
}

:global(.p-toast .p-toast-message .p-toast-message-content .p-toast-detail) {
	@apply mt-0  !important;

	max-width: 16rem;
	word-break: break-word;
}

:global(.p-toast-message-content) {
	@apply border-0 justify-center !important;
}
</style>
