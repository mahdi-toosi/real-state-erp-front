<script setup lang="ts">
import { defineComponent } from 'vue'
defineComponent({ name: 'Auth' })
</script>

<template>
	<div class="__login_register_wrapper">
		<section class="__login_register_box">
			<router-view></router-view>
		</section>
	</div>
</template>

<style>
.__login_register_wrapper {
	@apply flex justify-center items-center w-full py-4 h-screen bg-Background_Gray;
}

.__login_register_box {
	@apply flex m-auto flex-col md:flex-row rounded-3xl overflow-hidden px-4 md:px-8 py-10 bg-white;

	box-shadow: 0 4px 25px 0 rgb(0 0 0 / 10%);
}
</style>
