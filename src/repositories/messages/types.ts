import type { Res, Paginate } from '../types'
import type { Workspace } from '../workspaces/types'

export interface MessageUser {
	id: number
	name?: string
}

export interface WorkspaceRole {
	id: number
	display_name: string
	hierarchal: number
	name: string
	scopes: string[]
	type: string
}
export interface MessageWorkspace extends MessageUser {
	roles: WorkspaceRole[]
}

export interface Message {
	title: string
	content: string
	confirm_required: boolean
	type: string
	workspace_id: number
	receivers: {
		users: MessageUser[]
		workspaces: MessageWorkspace[]
	}
}

export interface insertMessagePayload {
	title: string
	content: string
	confirm_required: boolean
	type: string
	workspace_id: number
	receivers: { users?: number[]; workspaces: { id: number; role_ids: number[] }[] }
}

export interface ReceivedMessage extends Message {
	id: number
	confirmed_at: string
	seen_at: string
	created_at: string
	creator_id: number
	deleted_at: string
	root: number
	from_workspace: string
	root_workspace_name: string
	updated_at: string
}

export type ReceivedMessages = Paginate<ReceivedMessage>

export interface MessageReceiver {
	deleted_at: null | string
	email: string
	first_name: string
	user_id: number
	is_active: boolean
	receiver_name: string
	mobile: number | string
	mobile_verified: number
	national_code: string | number
	confirmed_at: string
	seen_at: string
}

export type MessageReceivers = Paginate<MessageReceiver>

export interface SentMessage {
	confirm_required: boolean
	content: string
	creator_id: number
	deleted_at: null | string
	id: number
	root: number
	title: string
	type: string
	workspace_id: number
	from_workspace: string
	sender: string
	created_at: string
}

export type SentMessages = Paginate<SentMessage>

interface UpdateMessagePayload {
	messageId: number
	user_id: number
	status: 'confirm' | 'seen'
}

interface GetNotificationReport {
	id: number
	root: number
	content: string
	sent_at: string
	sms_cost: number
	bale_cost: number
	bale_status: null
	sms_driver: string
	sms_status: string
	updated_at: string
	tracking_id: number
	receiver_id: number
	meta: {
		mobile: string
		relation: string
	}
	sms_strategy: string
	sms_delivered_at: null
	display_sms_driver: string
	receiver_full_name: string
	display_sms_status: string
	display_sms_strategy: string
}
export interface NotificationsReports {
	data: Paginate<GetNotificationReport>
	meta: {
		count: number
		total_cost: string
		display_sms_driver: string
		display_sms_status: string
		display_sms_strategy: string
	}
}

export interface GetNotificationReportFilters {
	page?: number
	keyword?: string
	to_sent_at?: string
	itemPerPage?: number
	from_sent_at?: string
	sms_strategy?: string | string[]
	sms_status: 'sent'
}

export interface Role {
	id: number
	role_name: string
	display_name: string
	workspace_id: number
	workspace_name: string
}

export interface User {
	id: number
	name: string
	workspace_id: number
	workspace_name: string
}

export type ReceiverRelations = 'self' | 'father' | 'mother'

export interface NotificationQueuePayload {
	id?: number
	receivers: {
		roles?: Role[]
		members?: User[]
		target: 'role' | 'member'
		relations: ReceiverRelations[]
	}[]
	workspace_id: number
	message_content: string
}

export interface InsertNotificationQueueResponse {
	id: number
	status: string
	start_at: string
	operator_id: number
	workspace_id: number
	notification_type: string
}

export interface GetNotificationQueuePayload {
	page: number
	notifierId: number
	itemPerPage: number
}

export interface NotificationQueues {
	notifications: Notifications
	queue: {
		id: number
		status: string
		start_at: string
		created_at: string
		sender_name: string
		updated_at: string
		operator_id: number
		workspace_id: number
		display_status: string
		notification_type: string
		sent_notifications_count: number
		display_notification_type: string
		total_notifications_count: number
		draft_notifications_count: number
	}
	meta: {
		count: number
		total_cost: number
		display_sms_driver: string
		display_sms_status: string
		display_sms_strategy: string
		sent_notifications_count: number
		draft_notifications_count: number
		total_notifications_count: number
	}
}

export interface Notification {
	id: number
	root: number
	content: string
	sent_at: string
	sms_cost: number
	bale_cost: number
	sms_driver: number
	sms_status: number
	created_at: string
	updated_at: string
	tracking_id: number
	receiver_id: number
	bale_status: string
	sms_strategy: string
	sms_delivered_at: string
	receiver_full_name: string
	display_sms_driver: string
	display_sms_status: string
	display_sms_strategy: string
	notification_queue_id: number

	meta: {
		mobile: string
		relation: string
	}

	// added in front
	deleteLoading: boolean
	sendNotificationLoading: boolean
}
export type Notifications = Paginate<Notification>

export interface NotifierMessagePanel {
	sms_panel: NotifierMessage
}

export interface NotifierMessage {
	sender: number
	api_key: string
	supplier: string
	dedicated_sms: boolean
	dedicated_sender: number
	dedicated_lookup: boolean
}

export interface RMessages {
	sendMessage(payload: insertMessagePayload): Res<Message>
	getUserMessages(payload: {
		userId: number
		page: number
		itemPerPage: number
	}): Res<ReceivedMessages>
	updateMessageStatus(payload: UpdateMessagePayload): Res<'done'>
	getSentMessage(id: number, page: number): Res<MessageReceivers>
	getSentMessages(payload?: { page: number; itemPerPage: number }): Res<SentMessages>
	getNotificationReport(payload: GetNotificationReportFilters): Res<NotificationsReports>

	//! short message services,sendable workspaces,notificationQueue
	getSendableWorkspaces(): Res<Workspace[]>
	insertNotificationQueue(payload: NotificationQueuePayload): Res<InsertNotificationQueueResponse>
	insertNotificationQueueById(
		payload: NotificationQueuePayload
	): Res<InsertNotificationQueueResponse>
	getNotificationQueue(payload: GetNotificationQueuePayload): Res<NotificationQueues>
	getNotificationsQueuesList(payload: { page: number; itemPerPage: number }): Res<Notifications>
	updateNotificationQueue(payload: { notification_id: number; content: string }): Res
	deleteNotificationQueue(id: number): Res
	sendNotification(id: number): Res
	sendAllNotifications(notification_queue_id: number): Res

	//!notifier-settings
	getNotifierSetting(): Res<NotifierMessagePanel>
	insertNotifierSetting(payload: NotifierMessagePanel): Res<NotifierMessagePanel>
}
