// ? vue
import { ref } from 'vue'
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
// ? utils
import { initRoutesAndPermissions } from '@/composable/useStoreDashboard'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// caches the JWT status
const hasToken = ref(false)

function authGuard(to: RouteLocationNormalized, next: NavigationGuardNext): void {
	const authenticationPages = ['auth', 'login', 'register']

	if (to.meta.guest) {
		if (localStorage.getItem('token') && authenticationPages.includes(to.name as string))
			return next({ name: 'dashboard' })
		else return next()
	} else if (hasToken.value) return next()
	else return next({ path: '/auth' })
}

async function globalStartupGuard(to: RouteLocationNormalized): Promise<void> {
	if (to.path) NProgress.start()
	if (!hasToken.value) hasToken.value = localStorage.getItem('token') ? true : false

	//  👇 should be after setting value for hasToken
	if (hasToken.value && !to.meta.guest && to.name !== 'MobileVerification')
		await initRoutesAndPermissions()
}

export async function beforeEach(
	to: RouteLocationNormalized,
	_from: RouteLocationNormalized,
	next: NavigationGuardNext
) {
	return globalStartupGuard(to).then(() => authGuard(to, next))
	// .catch(() => NProgress.done())
}

export function afterEach(to: RouteLocationNormalized) {
	NProgress.done()
	document.title = 'درس افزار'
	if (to.meta.title) document.title += ` | ${to.meta.title}`
}
