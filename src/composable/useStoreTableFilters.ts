// ? vue
import { ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave, LocationQuery } from 'vue-router'
// ? utils
import { jalaliDate } from '@/composable/useUtils'
// ? types
type TreeSelectAnswer = { checked: boolean }
type TreeSelect = { key: keyof Filter; checkbox: boolean }
export type Filter = {
	[key: string]:
		| string
		| string[]
		| number
		| number[]
		| undefined
		| Record<string, TreeSelectAnswer>
}
// TODO =>  ☝🏻 should be Filters

export type QueriesManifest = {
	arrays?: string[]
	numbers?: string[]
	numArrays?: string[]
	treeSelect?: TreeSelect[]
	rangeDates?: { from: string; to: string }[]
}

export interface FiltersManifest {
	[key: string]: {
		title: string
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		options?: any[]
		optionLabel?: string
		optionValue?: string
		type: 'string' | 'multiSelect' | 'select' | 'date' | 'treeSelect'
	}
}

export type FilterChip = {
	label: string
	title: string
	value: string | number
	filter: string
	treeSelectVal?: Record<string, TreeSelectAnswer>
}

export interface FilterChipsLocalStorage {
	[key: string /* route name */]: FilterChip[]
}

const chips = ref([] as FilterChip[])
const show = ref(false)
const CHIPS_LOCAL_STORAGE_KEY = 'pagesFilters'

export default () => {
	const $route = useRoute()
	const $router = useRouter()

	onBeforeRouteLeave(() => {
		show.value = false
		chips.value = []
	})

	return {
		show,
		chips,

		updateRouteQueries: async (filters: Filter | null, page?: number, itemPerPage?: number) => {
			const queries = filters === null ? $route.query : filters
			await $router.replace({
				name: $route.name as string,
				query: { ...queries, page, itemPerPage },
			})
		},

		toggle: () => {
			show.value = !show.value
		},

		readyForQuery: (filters: Filter, _queriesManifest?: QueriesManifest) => {
			const storage = getChipsFromLocalStorage($route.name as string)
			const localStorageChips = storage[$route.name as string]

			const FiltersChips = localStorageChips.reduce((acc, chip) => {
				acc[chip.filter] = chip.value
				return acc
			}, {} as Filter)

			let result = { ...filters } as Filter
			if (!Object.keys($route.query).length) result = { ...result, ...FiltersChips }

			if (!_queriesManifest) return result
			const queriesManifest = JSON.parse(JSON.stringify(_queriesManifest)) as QueriesManifest

			if (queriesManifest.numArrays || queriesManifest.arrays) {
				let arr = [] as string[]
				if (queriesManifest.numArrays) arr = [...queriesManifest.numArrays]
				if (queriesManifest.arrays) arr = [...arr, ...queriesManifest.arrays]
				queriesManifest.arrays = arr
			}

			queriesManifest.arrays?.forEach((key) => {
				const val = result[key] as string[]
				if (key in result && Array.isArray(val)) {
					result[key] = val.join(',')
				} else if (key === 'education_year_id' && !val) {
					result[key] = 'undefined'
				}
			})

			queriesManifest.rangeDates?.forEach(({ from, to }) => {
				if (!from || !to || !(from in result)) return
				const val = result[from] as string[]
				if (Array.isArray(val)) {
					result[from] = val[0]
					result[to] = val[1]
				} else {
					result[from] = val
				}
			})

			queriesManifest.treeSelect?.forEach(({ key, checkbox }) => {
				if (!key || !result[key]) return
				const b = result[key] as Record<string, TreeSelectAnswer>

				if (!checkbox) {
					result[key] = Object.keys(b).join(',')
					return
				} else {
					result[key] = Object.keys(b)
						.filter((k) => b[k].checked)
						.join(',')
				}
			})

			for (const key in result) {
				const property = result[key]
				if (typeof property === 'string' && !property.length) delete result[key]
			}

			return result
		},

		readFromQuery: (queriesManifest?: QueriesManifest, queries?: LocationQuery) => {
			const storage = getChipsFromLocalStorage($route.name as string)
			const localStorageChips = storage[$route.name as string]

			const FiltersChips = localStorageChips.reduce((acc, chip) => {
				acc[chip.filter] = chip.value
				return acc
			}, {} as Filter)

			const q = queries || $route.query
			let result = { ...q } as Filter

			if (!Object.keys(result).length) result = { ...FiltersChips, ...result }

			if (!queriesManifest) return result

			queriesManifest.arrays?.forEach((key) => {
				const val = result[key]
				if (key in result && typeof val === 'string') {
					result[key] = val.split(',')
				}
			})

			queriesManifest.numbers?.forEach((key) => {
				const val = result[key]
				if (val && typeof val === 'string' && !queriesManifest.arrays?.includes(key)) {
					result[key] = !isNaN(Number(val)) ? Number(val) : val
				}
			})

			queriesManifest.numArrays?.forEach((key) => {
				const val = result[key]
				if (key in result && typeof val === 'string') {
					if (key === 'education_year_id' && val === 'undefined') {
						result[key] = undefined
						return
					}
					result[key] = val?.split(',')?.map((v) => Number(v))
				}
			})

			queriesManifest.rangeDates?.forEach(({ from, to }) => {
				if (!from || !to || !(from in result)) return
				if (result[from] && result[to]) {
					result[from] = [result[from], result[to]] as string[]
					delete result[to]
				}
			})

			queriesManifest.treeSelect?.forEach(({ key }) => {
				const treeSelect = localStorageChips.find((c) => c.filter === key)
				if (!treeSelect) return
				result[key] = treeSelect.treeSelectVal
			})

			return result
		},

		onRemoveFilterChip: (chip: FilterChip) => {
			chips.value = chips.value.filter((c: FilterChip) => c.filter !== chip.filter)
			const storage = getChipsFromLocalStorage($route.name as string)
			storage[$route.name as string] = chips.value
			storeChipsInLocalStorage(storage)
		},

		onClearFilterChips: () => {
			chips.value = []
			const storage = getChipsFromLocalStorage($route.name as string)
			storage[$route.name as string] = chips.value
			storeChipsInLocalStorage(storage)
		},

		buildFiltersChips: (filters: Filter, filtersManifest: FiltersManifest, onMounted = false) => {
			chips.value = []
			const storage = getChipsFromLocalStorage($route.name as string)
			const routeStorage = storage[$route.name as string]

			for (const filter in filtersManifest) {
				const filterSetting = filtersManifest[filter]
				let label, value, storedFilter

				if (onMounted) {
					storedFilter = routeStorage.find((sf) => sf.title === filterSetting.title)
				}

				if (storedFilter) {
					label = storedFilter.label
					value = storedFilter.value
				} else if (filterSetting.type === 'string' && filters[filter]) {
					label = filters[filter] as string
					value = filters[filter] as string
				} else if (
					filterSetting.type === 'multiSelect' &&
					Array.isArray(filters[filter]) &&
					filterSetting.options?.length
				) {
					const values = [] as string[]
					const labels = [] as string[]
					const _filters = filters[filter] as string[]

					_filters.forEach((f) => {
						const filterObj = filterSetting.options?.find(
							(b) => b[filtersManifest[filter].optionValue as string] === f
						)

						if (!filterObj) return
						values.push(f)
						labels.push(filterObj[filtersManifest[filter].optionLabel as string])
					})

					const val = values.join(',')
					if (!val.length) continue
					label = labels.join(', ')
					value = val
				} else if (filterSetting.type === 'treeSelect' && filterSetting.options?.length) {
					const values = [] as string[]
					const labels = [] as string[]
					const _filters = filters[filter] as Record<string, TreeSelectAnswer>

					for (const f in _filters) {
						if (!_filters[f].checked) continue

						const filterObj = filterSetting.options?.find(
							(b) => b[filtersManifest[filter].optionValue as string] === Number(f)
						)

						if (!filterObj) continue
						values.push(f)
						labels.push(filterObj[filtersManifest[filter].optionLabel as string])
					}

					const val = values.join(',')
					if (!val.length) continue
					label = labels.join(', ')
					value = val
				} else if (filterSetting.type === 'select' && filterSetting.options?.length) {
					const filterObj = filterSetting.options?.find(
						(o) => o[filtersManifest[filter].optionValue as string] === (filters[filter] as string)
					)
					if (!filterObj) continue

					value = filters[filter] as string
					label = filterObj[filtersManifest[filter].optionLabel as string]
				} else if (filterSetting.type === 'date' && filters[filter]) {
					if (filters[filter] instanceof Array) {
						const val = filters[filter] as string[]
						label = `از ${jalaliDate(val[0])}`
						if (val[1]) label += ` تا ${jalaliDate(val[1] as string)}`
					} else {
						label = `از ${jalaliDate(filters[filter] as string)}`
					}
					value = filters[filter] as string
				}

				if (value && label) {
					const payload = { filter, label, value, title: filterSetting.title } as FilterChip
					if (filterSetting.type === 'treeSelect') {
						payload.treeSelectVal = filters[filter] as Record<string, TreeSelectAnswer>
					}

					chips.value.push(payload)
				}
			}

			storage[$route.name as string] = chips.value

			storeChipsInLocalStorage(storage)
		},
	}
}

function getChipsFromLocalStorage(routeName: string) {
	let storage: FilterChipsLocalStorage
	const stringifiedStorage = localStorage.getItem(CHIPS_LOCAL_STORAGE_KEY)

	if (!stringifiedStorage) {
		storage = { [routeName]: [] }
		localStorage.setItem(CHIPS_LOCAL_STORAGE_KEY, JSON.stringify(storage))
		return storage
	}

	storage = JSON.parse(stringifiedStorage)
	if (!storage[routeName]) {
		storage[routeName] = []
	}

	return storage
}

function storeChipsInLocalStorage(storage: FilterChipsLocalStorage) {
	localStorage.setItem(CHIPS_LOCAL_STORAGE_KEY, JSON.stringify(storage))
}
