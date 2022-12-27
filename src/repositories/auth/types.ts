export interface RegisterPayload {
	first_name: string
	last_name: string
	email: string
	national_code: string
	mobile: string
	password: string
	password_confirmation?: string
}

export interface User extends RegisterPayload {
	id: number
	avatar: string
	name: string
	is_active: boolean
	created_at: Date
	deleted_at: null
	updated_at: Date
}

export interface AuthResponse {
	access_token: string
	user: User
}

export interface ResetPassPayload {
	mobile: string
	activation_code: string
	password: string
	password_confirmation: string
}

export interface RAuth {
	register(payload: RegisterPayload): Promise<AuthResponse>
	login(payload: { username: string; password: string }): Promise<AuthResponse>
	getOtp(payload: { mobile: string; username: string }): Promise<undefined>
	resetPass(payload: ResetPassPayload): Promise<string>
	verifyMobile(activation_code: number): Promise<undefined>
}
