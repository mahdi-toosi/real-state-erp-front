import type { IContext } from '@/context'
const guest = true

export default function (ctx: IContext) {
	ctx.Router.registerRoutes([
		{
			path: '/auth',
			name: 'auth',
			meta: { title: '', guest },
			component: () => import('./pages/Index.vue'),
			children: [
				{
					path: '',
					name: 'login',
					meta: { guest, title: 'ورود' },
					component: () => import('./pages/Login.vue'),
				},
				{
					path: 'register',
					name: 'register',
					meta: { guest, title: 'ثبت نام' },
					component: () => import('@/components/AppRegister.vue'),
				},
				{
					path: 'forgot-password',
					name: 'forgotPass',
					meta: { guest, title: 'بازیابی رمز عبور' },
					component: () => import('./pages/ForgotPass.vue'),
				},
			],
		},
	])
}
