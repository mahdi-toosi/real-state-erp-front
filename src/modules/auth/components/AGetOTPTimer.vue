<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'

const $emit = defineEmits(['sendAgain'])

const state = reactive({
	minutes: 0,
	secondes: 0,
	time: 2 * 60,
})
let timer: number | undefined = 0

function start() {
	if (timer) return
	timer = window.setInterval(() => {
		if (state.time > 0) state.time--
		else reset()
	}, 1000)
}

function reset() {
	clearInterval(timer)
	timer = undefined
	state.time = 0
	state.secondes = 0
	state.minutes = 0
}

const prettyTime = computed(() => {
	const time = state.time / 60
	const minutes = parseInt(String(time))
	const secondes = Math.round((time - minutes) * 60)
	return minutes + ':' + secondes
})

function sendAgain() {
	if (state.time !== 0) return
	state.time = 2 * 60
	start()
	$emit('sendAgain')
}

onMounted(() => {
	start()
})
</script>

<template>
	<p class="mt-6 text-sm">
		کد بدست شما نرسید؟
		<button
			class="pr-1 transition"
			:class="state.time === 0 ? 'cursor-pointer  text-blue-500' : 'cursor-not-allowed'"
			type="button"
			@click="sendAgain()"
		>
			<span class="underline">ارسال دوباره کد</span>

			<span
				v-if="state.time"
				:class="['pr-1', { 'text-red-700': state.time < 10 }]"
				v-text="prettyTime"
			></span>
		</button>
	</p>
</template>
