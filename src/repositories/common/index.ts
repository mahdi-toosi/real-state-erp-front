import { VERSION_1 } from '../version'
import type { AxiosInstance } from 'axios'
import type { RCommon } from './types'
export type { RCommon }

const banksService = VERSION_1 + '/banks'
const filesService = VERSION_1 + '/cdn/file'
const uploadService = VERSION_1 + '/cdn/upload'
export const dashboardService = VERSION_1 + '/dashboard'

export default (axios: AxiosInstance): RCommon => ({
	uploadFile(payload) {
		const formData = new FormData()
		formData.append('user_id', String(payload.user_id))
		formData.append('context', payload.context)
		formData.append('title', payload.title)
		formData.append('file', payload.file)

		return axios.post(filesService, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	},

	//! files
	getFile(filename) {
		return axios.get(`${filesService}/${filename}`, { responseType: 'blob' })
	},
	deleteFile(filename) {
		return axios.delete(`${filesService}/${filename}`)
	},

	//! data-table-banks
	getBanks() {
		return axios.get(banksService)
	},
	insertBank(payload) {
		return axios.post(banksService, payload)
	},
	updateBank(payload) {
		return axios.patch(`${banksService}/${payload.id}`, payload)
	},
	deleteBank(id) {
		return axios.delete(`${banksService}/${id}`)
	},

	//!upload
	uploadUserImage(payload) {
		const formData = new FormData()
		formData.append('context', payload.context)
		formData.append('file', payload.file)

		return axios.post(uploadService, formData, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	},

	//! taxi service
	hasPermissionForTaxiServices() {
		return axios.get(`${VERSION_1}/taxi/redirect`)
	},
})
