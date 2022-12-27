// ? vue
import { reactive } from 'vue'
// ? utils
import axios from '@/api'
import { dashboardService } from '@/repositories/common'
// ? types
import type { ReceivedMessages } from '@/repositories/messages/types'
import type {
	GetRouteAndPermissionsResponse,
	SidebarItemAndSections,
	Workspace,
} from '@/repositories/common/types'

export const dashboardState = reactive({
	routes: [] as SidebarItemAndSections[],
	system_permissions: [] as string[],
	contact_us: {} as GetRouteAndPermissionsResponse['contact_us'],
	workspace_permissions: {} as GetRouteAndPermissionsResponse['workspace_permissions'],
	workspaces: [] as Workspace[],
	my_finance: {} as GetRouteAndPermissionsResponse['my_finance'],
	activeWorkspace: {} as Workspace,
	dashboardLinks: [] as GetRouteAndPermissionsResponse['home_widgets'],
	messages: {
		data: [] as ReceivedMessages['data'],
	} as ReceivedMessages,
})

export async function getRoutes(
	link?: string
): Promise<SidebarItemAndSections[] | SidebarItemAndSections | undefined> {
	await initRoutesAndPermissions()

	if (!link) return dashboardState.routes
	const index = dashboardState.routes.findIndex((r) => r.href === link)
	if (index !== -1) return dashboardState.routes[index]
	return undefined
}

export async function initRoutesAndPermissions() {
	if (dashboardState.routes.length) return

	const result = await dashboardReq()
	if (!result) return
	dashboardState.routes = result.sidebar_menu
	dashboardState.system_permissions = result.system_permissions
	dashboardState.dashboardLinks = result.home_widgets
	dashboardState.contact_us = result.contact_us
	dashboardState.my_finance = result.my_finance

	setWorkspaceUuid(-1, result)

	if (!dashboardState.messages.data.length) setUserMessages(result.unread_messages)
}

export async function dashboardReq(): Promise<GetRouteAndPermissionsResponse> {
	return axios.get(dashboardService)
}

export function setWorkspaceUuid(index: number, result?: GetRouteAndPermissionsResponse) {
	if (index > -1) {
		dashboardState.activeWorkspace = dashboardState.workspaces[index]
		localStorage.setItem('workspace_uuid', dashboardState.activeWorkspace.uuid)
		return
	}

	if (!result) return
	dashboardState.activeWorkspace = result.active_workspace || ({} as Workspace)
	dashboardState.workspaces = result.switchable_workspaces || []
	dashboardState.workspace_permissions = result.workspace_permissions || []

	const uuid = localStorage.getItem('workspace_uuid')
	if (!uuid) localStorage.setItem('workspace_uuid', result.active_workspace?.uuid ?? '')
}

export function setUserMessages(userMessages: ReceivedMessages['data'] | ReceivedMessages) {
	if (Array.isArray(userMessages)) {
		dashboardState.messages.data = []
		dashboardState.messages.data = userMessages
		return
	}
	dashboardState.messages = userMessages
}
