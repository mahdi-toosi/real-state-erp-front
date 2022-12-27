import type { IContext } from '@/context'

export const dashboard_bread = { title: 'داشبورد', name: 'dashboard' }

export default function (ctx: IContext) {
	ctx.Router.registerRoutes([
		{
			path: '/',
			name: dashboard_bread.name,
			component: () => import('./pages/index.vue'),
			meta: { title: dashboard_bread.title },
		},
		{
			path: '/profile',
			name: 'profile',
			component: () => import('./pages/Profile.vue'),
			children: [
				{
					path: '',
					name: 'ProfileInfo',
					component: () => import('./pages/ProfileInfo.vue'),
					meta: { title: 'مشخصات کاربری' },
				},
				{
					path: 'mobile-activation',
					name: 'MobileVerification',
					component: () => import('./pages/MobileVerification.vue'),
					meta: { title: 'فعالسازی شماره موبایل' },
				},
				{
					path: 'reset-pass',
					name: 'ResetPass',
					component: () => import('./pages/ResetPass.vue'),
					meta: { title: 'تغییر رمز عبور' },
				},
			],
		},
	])
}
