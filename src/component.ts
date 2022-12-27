import type { App, Component as VueComponent } from 'vue'
import type { IContext } from '@/context'

import Button from 'primevue/button'
import Skeleton from 'primevue/skeleton'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import DefaultLayout from '@/layouts/Default.vue'
import AppInput from '@/components/AppInput.vue'

type IComponent = { [key: string]: VueComponent }
const generalComponents = {
	Button,
	Skeleton,
	InputText,
	AppInput,
	Password,
	DefaultLayout,
} as IComponent

function registerVueComponents(app: App<Element>, ctx: IContext) {
	for (const cmp in generalComponents) {
		ctx.Component.register(app, {
			component: generalComponents[cmp],
			name: cmp,
		})
	}
}

export default function registerGlobalComponents(app: App<Element>, ctx: IContext) {
	registerVueComponents(app, ctx)
}
