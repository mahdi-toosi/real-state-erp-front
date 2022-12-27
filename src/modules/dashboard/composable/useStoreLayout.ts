import { ref } from 'vue'

const sidebarIsCollapsed = ref(window.innerWidth < 640) // tailwind mobile breakpoint
export default () => ({
	sidebarIsCollapsed,
	onSidebarCollapsed: (status: boolean) => {
		localStorage.setItem('sidebarStatus', status ? '1' : '0')
		sidebarIsCollapsed.value = status
	},
})
