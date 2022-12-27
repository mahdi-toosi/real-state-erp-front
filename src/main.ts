// ? vue
import { createApp } from 'vue'
import router, { registerRoutes } from './router'
// ? prime
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Tooltip from 'primevue/tooltip'
// ? init
import context from '@/context'
import bootstrap from '@/bootstrap'
import registerGlobalComponents from '@/component'
import App from '@/App.vue'

// ? styles
import '@/assets/fonts/fontawesome-pro-5.15.3-web/css/all.min.css'
// ? prime styles
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
// ? END prime styles
import '@/assets/css/main.css'

import PersianDigits from './directive/PersianDigits'

const app = createApp(App)

app.directive('persian-digits', PersianDigits)

registerGlobalComponents(app, context)

async function init() {
	await bootstrap(context)

	registerRoutes(context.Router.routes)

	app
		.use(router)
		.use(PrimeVue, { ripple: true })
		.use(ToastService)
		.use(ConfirmationService)
		.directive('tooltip', Tooltip)
		.mount('#app')
}

init()
