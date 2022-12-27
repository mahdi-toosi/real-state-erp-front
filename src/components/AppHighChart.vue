<script setup lang="ts">
//? vue
import { PropType } from 'vue'
//? component
import VueHighcharts from 'vue3-highcharts'
//? type
export interface PieData {
	name: string
	y: number
	sliced?: boolean
	selected?: boolean
}
export interface Series {
	name?: string
	data: PieData[]
}
export interface Option {
	title?: { text: string }
	plotOptions: {
		pie?: {
			allowPointSelect: boolean
			cursor: 'pointer'
			dataLabels?: {
				enabled: boolean
				format: string
			}
		}
	}
	series: Series[]
	chart: {
		type: 'pie'
		plotShadow: boolean
		plotBorderWidth: null | string
		plotBackgroundColor: null | string
	}
}

//? Define and uses

defineProps({
	options: { type: Object as PropType<Option>, required: true },
	type: { type: String as PropType<'chart'>, default: 'chart' },
})

//? End of Define uses
</script>

<template>
	<VueHighcharts :options="options" :type="type" />
</template>
