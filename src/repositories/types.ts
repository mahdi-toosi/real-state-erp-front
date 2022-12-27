export type Res<A = 'success', B = undefined, C = undefined, D = undefined> = Promise<A | B | C | D>

export interface Paginate<T> {
	data: T[]
	to: number
	path: string
	total: number
	from: number
	per_page: number
	last_page: number
	current_page: number
	last_page_url: string
	first_page_url: string
	next_page_url: string | null
	prev_page_url: string | null
	links: { label: string; active: boolean; url: null | string }[]
}
