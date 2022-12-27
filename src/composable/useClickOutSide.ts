import { onBeforeUnmount, onMounted, Ref } from 'vue'

export default (el_target_ref: Ref, callback_fn: () => void) => {
	if (!el_target_ref) return
	const listener = (e: Event) => {
		if (e.target == el_target_ref.value || e.composedPath().includes(el_target_ref.value)) {
			//We clicked inside the modal/active region
			return
		}
		//at this point we clicked outside the modal
		if (typeof callback_fn == 'function') {
			callback_fn()
		}
	}

	onMounted(() => {
		window.addEventListener('click', listener)
	})

	onBeforeUnmount(() => {
		window.removeEventListener('click', listener)
	})

	return { listener }
}
