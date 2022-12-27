<script setup lang="ts">
//? vue
import { ref, computed, PropType } from 'vue'
import { useRouter, useRoute } from 'vue-router'
//? type
import type { ReceivedMessage } from '@/repositories/messages/types'

//? Define and uses
const $props = defineProps({
	unseenMessages: { type: Array as PropType<ReceivedMessage[]>, default: () => [] },
	countUnseenMessages: { type: Number, required: true, default: 0 },
})
const $route = useRoute()
const $router = useRouter()

const showOverlay = ref(false)
//? End of Define and uses

const forceShowOverlay = computed(() => {
	if ($route.name === 'MessagesReceived') return false

	const index = $props.unseenMessages.findIndex(
		(msg) => msg?.confirm_required && !msg?.confirmed_at
	)
	if (index === -1) return false
	else return true
})

function getMessage(msg: ReceivedMessage) {
	$router.push({ name: 'MessagesReceived', query: { id: msg.id } })
}

function getAllMessages() {
	$router.push({ name: 'MessagesReceived' })
}
</script>

<template>
	<div class="relative">
		<div
			v-if="showOverlay"
			class="fixed top-0 left-0 w-screen h-screen"
			@click="showOverlay = !showOverlay"
		></div>

		<Button
			icon="far fa-bell"
			class="p-button-secondary p-button-rounded p-button-outlined __notification_btn"
			:class="{ 'px-6': countUnseenMessages }"
			dir="ltr"
			:badge="countUnseenMessages <= 9 ? String(countUnseenMessages) : '+9'"
			:badge-class="`p-badge-danger ml-0 p-0  ${!countUnseenMessages && 'hidden'}`"
			@click="showOverlay = !showOverlay"
		/>

		<transition name="fade">
			<div v-if="forceShowOverlay" class="__bg_overlay"></div>
		</transition>

		<transition name="fade">
			<div v-show="forceShowOverlay || showOverlay" class="__messages_wrapper">
				<div
					v-for="(msg, index) in unseenMessages"
					:key="index"
					class="__msg_row"
					@click="getMessage(msg)"
				>
					<div class="flex items-center">
						<div class="flex flex-col gap-1 px-2">
							<i class="far fa-envelope p-1 rounded text-white bg-Red1"></i>
						</div>

						<h3 class="__msg_header truncate" v-text="msg.title"></h3>
					</div>
				</div>

				<div v-if="!unseenMessages.length" class="__empty_message_box">
					<img src="@/assets/icons/emptyMessageBox.png" />
					<p class="text-Gray2">پیام جدیدی وجود ندارد!</p>
				</div>

				<hr v-if="!unseenMessages.length" />

				<Button
					label="مشاهده تمامی پیام ها"
					class="p-button-outlined __P_button_see_all_messages"
					@click="getAllMessages"
				/>
			</div>
		</transition>
	</div>
</template>
<style scoped>
.__bg_overlay {
	@apply w-screen h-screen fixed top-0 left-0 z-30 bg-white bg-opacity-40 backdrop-blur-sm;
}

.__messages_wrapper {
	@apply flex flex-col max-w-xs md:max-w-2xl max-h-96 absolute left-0 top-11
		bg-white rounded overflow-auto py-2 z-10000;

	min-width: 92vw;
	box-shadow: 0 1px 11px 4px rgb(0 0 0 / 10%);
}

.__msg_row {
	@apply border-b cursor-pointer transition hover:bg-gray-100  py-5 px-3;
}

.__msg_header {
	@apply font-bold text-dark-blue;

	max-width: 280px;
}

.__notification_btn {
	@apply overflow-visible border-Gray1 h-11 z-40 text-dark-blue !important;
}

@media (min-width: 640px) {
	.__messages_wrapper {
		min-width: 390px;
	}
}

.__P_button_see_all_messages {
	@apply self-end my-5 ml-5 overflow-visible;
}

.__empty_message_box {
	@apply flex flex-col justify-center items-center my-5 gap-3;
}
</style>
