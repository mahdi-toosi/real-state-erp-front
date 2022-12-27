<script setup lang="ts">
import { useRepositoryProvider } from '@/repositories'
import TheToast from '@/components/TheToast.vue'
import ConfirmDialog from 'primevue/confirmdialog'

useRepositoryProvider()
</script>
<template>
	<!-- You should not add anything to this component! -->
	<TheToast />
	<ConfirmDialog />
	<router-view />
</template>
