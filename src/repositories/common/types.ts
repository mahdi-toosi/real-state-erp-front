import { SidebarItem } from 'vue-sidebar-menu'
import { ReceivedMessage } from '../messages/types'
import { Res } from '../types'

export interface Section {
	title: string
	hrefs: {
		title: string
		icon: string
		href: string
	}[]
}

export interface SidebarItemAndSections extends SidebarItem {
	sections?: Section[]
}

export interface Workspace {
	id: number
	uuid: string
	name: string
	parent_id: number
	root_id: number
	// 👇 added in frontend
	deleteLoading?: boolean
}

export type GetRouteAndPermissionsResponse = {
	active_workspace?: Workspace
	system_permissions: string[]
	contact_us: {
		support_phone_number: string
	}
	my_finance: {
		enrollment: boolean
		food: boolean
		imprest: boolean
		personnel: boolean
	}
	has_system_permission: boolean
	has_workspace_permission?: boolean
	switchable_workspaces?: Workspace[]
	unread_messages: ReceivedMessage[]
	sidebar_menu: SidebarItemAndSections[]
	home_widgets: { key: string; label: string }[]
	workspace_permissions: {
		[key: string]: { is_tree: boolean; name: string; role: string; workspace_id: number }[]
	}
}

export interface FileUploadPayload {
	file: File
	title?: string
	user_id: number
	context: 'document' | 'profile' | 'letter'
}

export interface Organization {
	id?: number
	name: string
	// 👇 added in frontend
	deleteLoading?: boolean
}

export interface UserAvatarResponse {
	file_name: string
	preview_url: string
}

export interface TaxiServices {
	redirect_url: string
	message?: string
}

export interface RCommon {
	//! files
	uploadFile(payload: FileUploadPayload): Res<{ filename: string }>
	getFile(filename: string): Res<Blob>
	deleteFile(filename: string): Res

	//! data-table-banks
	getBanks(): Res<Organization[]>
	updateBank(payload: Organization): Res<Organization>
	insertBank(payload: Organization): Res<Organization>
	deleteBank(id: number): Res<Organization>

	//!upload
	uploadUserImage(payload: FileUploadPayload): Res<UserAvatarResponse>

	//! taxi service
	hasPermissionForTaxiServices(): Res<TaxiServices>
}
