// ? vue
import { ref } from 'vue'
// ? types
import type { User, AuthResponse } from '@/repositories/auth/types'

const user = ref({} as User)

export default () => {
	if (!user.value.id) {
		const _user = localStorage.getItem('user')
		if (_user) user.value = JSON.parse(_user)
	}

	return {
		user,

		setUser(payload: AuthResponse) {
			localStorage.setItem('token', 'Bearer ' + payload.access_token)

			const userData = {
				id: payload.user.id,
				first_name: payload.user.first_name,
				last_name: payload.user.last_name,
				avatar: payload.user.avatar,
			}
			localStorage.setItem('user', JSON.stringify(userData))
			user.value = payload.user
		},
	}
}
