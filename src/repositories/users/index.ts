import { VERSION_1 } from '../version'
import type { AxiosInstance } from 'axios'
import type { RUsers } from './types'
export type { RUsers }

const usersService = VERSION_1 + '/users'
const rolesService = VERSION_1 + '/roles'

export default (axios: AxiosInstance): RUsers => ({
	getUsers(payload) {
		return axios.get(usersService, { params: payload })
	},
	getUser(payload) {
		const endpoint = payload.id
			? `${usersService}/${payload.id}`
			: `${usersService}/${payload.nationalCode}/find`
		return axios.get(endpoint, { params: payload })
	},
	updateUser(payload) {
		return axios.patch(`${usersService}/${payload.id}`, payload)
	},
	changePasswordToNationalCode(payload) {
		const endpoint = `${usersService}/${payload.id}/change-password-to-national-code`
		return axios.post(endpoint, payload)
	},
	deleteUser(id) {
		return axios.delete(`${usersService}/${id}`)
	},

	getRoles(id) {
		return axios.get(`${VERSION_1}/users/${id}/roles`)
	},
	getAllRoles() {
		return axios.get(rolesService)
	},
	manageSystemRoles(payload) {
		return axios.post(rolesService + '/assign-system-roles', payload)
	},
	getSystemUsers(payload) {
		return axios.get(VERSION_1 + '/users-with-system-roles', { params: payload })
	},
})
