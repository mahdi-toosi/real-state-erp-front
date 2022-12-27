import { VERSION_1 } from '../version'
import type { AxiosInstance } from 'axios'
import type { RMessages } from './types'
export type { RMessages }

const messagesService = VERSION_1 + '/messages'
const notificationSettingService = VERSION_1 + '/notifier/settings'
const notificationService = VERSION_1 + '/notifier/notification-queues'
const notifierNotificationService = VERSION_1 + '/notifier/notifications'

export default (axios: AxiosInstance): RMessages => ({
	sendMessage(payload) {
		return axios.post(messagesService + '/send-message', payload)
	},
	getUserMessages(payload) {
		const endpoint = `${VERSION_1}/users/${payload.userId}/messages`
		return axios.get(endpoint, { params: { page: payload.page, itemPerPage: payload.itemPerPage } })
	},
	updateMessageStatus(payload) {
		return axios.post(`${messagesService}/${payload.messageId}/${payload.status}`, payload)
	},
	getSentMessage(id, page) {
		return axios.get(`${messagesService}/${id}/receivers`, {
			params: { page },
		})
	},
	getSentMessages(payload) {
		return axios.get(messagesService + '/sent-messages', { params: payload })
	},
	getNotificationReport(payload) {
		return axios.get(notifierNotificationService, { params: payload })
	},
	//! short message services,sendable workspaces
	getSendableWorkspaces() {
		return axios.get(`${VERSION_1}/notifier/sendable-workspaces`)
	},
	insertNotificationQueue(payload) {
		return axios.post(notificationService, payload)
	},
	insertNotificationQueueById(payload) {
		return axios.post(`${notificationService}/${payload.id}/add-notifications`, payload)
	},
	getNotificationQueue(params) {
		return axios.get(`${notificationService}/${params.notifierId}`, {
			params: { ...params, notifierId: undefined },
		})
	},
	getNotificationsQueuesList(params) {
		return axios.get(notificationService, { params })
	},
	updateNotificationQueue(payload) {
		return axios.patch(`${notifierNotificationService}/${payload.notification_id}`, payload)
	},
	deleteNotificationQueue(id) {
		return axios.delete(`${notifierNotificationService}/${id}`)
	},
	sendNotification(id) {
		return axios.post(`${notifierNotificationService}/${id}/send`)
	},
	sendAllNotifications(notification_queue_id) {
		return axios.post(`${notificationService}/${notification_queue_id}/start`)
	},

	//! notifier
	getNotifierSetting() {
		return axios.get(notificationSettingService)
	},
	insertNotifierSetting(payload) {
		return axios.post(notificationSettingService, payload)
	},
})
