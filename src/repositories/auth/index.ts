import { VERSION_1 } from '../version'
import type { AxiosInstance } from 'axios'
import type { RAuth } from './types'
export type { RAuth }

const authService = VERSION_1 + '/auth'

export default (axios: AxiosInstance): RAuth => ({
	login(payload) {
		return axios.post(`${authService}/login`, payload)
	},
	register(payload) {
		return axios.post(`${authService}/register`, payload)
	},
	getOtp(payload) {
		return axios.post(`${authService}/request-activation-code`, payload)
	},
	resetPass(payload) {
		return axios.post(`${authService}/reset-password`, payload)
	},
	verifyMobile(activation_code: number) {
		return axios.post(`${authService}/verify-mobile`, { activation_code })
	},
})
