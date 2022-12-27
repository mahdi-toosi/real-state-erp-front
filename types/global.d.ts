declare module 'vue3-persian-datetime-picker'
declare module 'nprogress'

import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import DefaultLayout from '@/layouts/Default.vue'
import AppInput from '@/components/AppInput.vue'

declare module '@vue/runtime-core' {
	export interface GlobalComponents {
		Button: typeof Button
		Skeleton: typeof Skeleton
		AppInput: typeof AppInput
		InputText: typeof InputText
		Password: typeof Password
		DefaultLayout: typeof DefaultLayout
	}
}

//  ? RouterMeta
export interface Finder {
	name: string
	query: string[]
	params: string[]
}
export interface Bread {
	name?: string
	title: string
	query?: string[]
	params?: RouteParamsRaw
}

declare module 'vue-router' {
	interface RouteMeta {
		title: string
		requiresAuth?: boolean
		breadcrumb?: Bread[]
	}
}
//  ? ENd RouterMeta
