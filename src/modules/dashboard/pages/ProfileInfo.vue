<script setup lang="ts">
// ? components
import AppRegister from '@/components/AppRegister.vue'
// ? styles
import 'vue-advanced-cropper/dist/style.css'
</script>

<template>
	<AppRegister update-mode class="mt-4">
		<template #header>بروزرسانی حساب کاربری</template>
		<template #subHeader>
			<p class="mb-4">برای بروزرسانی اطلاعات کاربر فرم زیر را پر کنید.</p>
		</template>
	</AppRegister>
</template>
