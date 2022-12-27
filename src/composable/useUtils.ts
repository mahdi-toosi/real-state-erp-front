import dayjs from 'dayjs'
import jalaliday from 'jalaliday'
dayjs.extend(jalaliday)

export function jalaliDate(date?: string, format: 'date' | 'dateTime' | string = 'date') {
	if (!date) return undefined
	if (format === 'date') format = 'YYYY/MM/DD'
	else if (format === 'dateTime') format = 'HH:mm YYYY/MM/DD'

	return dayjs(date).calendar('jalali').locale('fa').format(format)
}

export function getJalaliWrapper(date?: string) {
	return dayjs(date).calendar('jalali').locale('fa')
}

export function getGregoryWrapper(date?: string) {
	return dayjs(date, { jalali: true })
}

export function gregoryDate(date?: string, mode: 'date' | 'dateTime' | string = 'date') {
	if (!date) return false
	const format = mode === 'date' ? 'YYYY/MM/DD' : ' HH:mm YYYY/MM/DD'
	return dayjs(date, { jalali: true }).format(format)
}

export function differenceInMonths(start: string, end: string) {
	const diff = new Date(end).getTime() - new Date(start).getTime()
	return Math.floor(diff / (1000 * 60 * 60 * 24 * 30))
}

export function formatNumberWithCommas(input: string | number) {
	return input.toString().replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, '$1,')
}

const delimiter = ' و '
const zero = 'صفر'
const negative = 'منفی '
const letters = [
	['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'],
	['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده', 'بیست'],
	['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'],
	['', 'یکصد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'],
	['', ' هزار', ' میلیون', ' میلیارد', ' بیلیون', ' بیلیارد', ' تریلیون', ' تریلیارد'],
]

const decimalSuffixes = ['', 'دهم', 'صدم', 'هزارم', 'دههزارم', 'صدهزارم', 'میلیونوم']

const prepareNumber = (num: number | string) => {
	let out = num
	if (typeof out === 'number') {
		out = out.toString()
	}

	if (out.length % 3 === 1) {
		out = `00${out}`
	} else if (out.length % 3 === 2) {
		out = `0${out}`
	}
	return out.replace(/\d{3}(?=\d)/g, '$&*').split('*')
}

const tinyNumToWord = (num: string) => {
	if (parseInt(num, 0) === 0) return ''

	const parsedInt = parseInt(num, 0)
	if (parsedInt < 10) return letters[0][parsedInt]

	if (parsedInt <= 20) return letters[1][parsedInt - 10]

	if (parsedInt < 100) {
		const one = parsedInt % 10
		const ten = (parsedInt - one) / 10
		if (one > 0) return letters[2][ten] + delimiter + letters[0][one]
		return letters[2][ten]
	}
	const one = parsedInt % 10
	const hundreds = (parsedInt - (parsedInt % 100)) / 100
	const ten = (parsedInt - (hundreds * 100 + one)) / 10
	const out = [letters[3][hundreds]]
	const secondPart = ten * 10 + one

	if (secondPart === 0) return out.join(delimiter)

	if (secondPart < 10) {
		out.push(letters[0][secondPart])
	} else if (secondPart <= 20) {
		out.push(letters[1][secondPart - 10])
	} else {
		out.push(letters[2][ten])
		if (one > 0) {
			out.push(letters[0][one])
		}
	}

	return out.join(delimiter)
}

const convertDecimalPart = (decimalPart: string) => {
	decimalPart = decimalPart.replace(/0*$/, '')

	if (decimalPart === '') return ''

	if (decimalPart.length > 11) {
		decimalPart = decimalPart.substr(0, 11)
	}
	return ' ممیز ' + Num2persian(decimalPart) + ' ' + decimalSuffixes[decimalPart.length]
}

const Num2persian = (input: number | string) => {
	input = input.toString().replace(/[^0-9.-]/g, '')
	let isNegative = false
	const floatParse = parseFloat(input)
	if (isNaN(floatParse)) return zero

	if (floatParse === 0) return zero

	if (floatParse < 0) {
		isNegative = true
		input = input.replace(/-/g, '')
	}

	let decimalPart = ''
	let integerPart = input
	const pointIndex = input.indexOf('.')
	if (pointIndex > -1) {
		integerPart = input.substring(0, pointIndex)
		decimalPart = input.substring(pointIndex + 1, input.length)
	}

	if (integerPart.length > 21) return 'خارج از محدوده'

	const slicedNumber = prepareNumber(integerPart)
	const out = []
	for (let i = 0; i < slicedNumber.length; i += 1) {
		const converted = tinyNumToWord(slicedNumber[i])
		if (converted !== '') out.push(converted + letters[4][slicedNumber.length - (i + 1)])
	}

	if (decimalPart.length > 0) decimalPart = convertDecimalPart(decimalPart)

	return (isNegative ? negative : '') + out.join(delimiter) + decimalPart
}

export function formatPriceInWrittenForm(input: string | number | null) {
	const amount = Num2persian(parseFloat(String(input)).toString().slice(0, -1))
	return `${amount} تومان`
}

export function formatAmount(
	amount?: number | string | null,
	currency: string | null = 'ریال',
	emptySign = '--'
) {
	if (!amount) return emptySign
	if (Number(amount).toLocaleString() === '0') return emptySign
	let amountStr
	if (amount && amount < 0) amountStr = `${Math.abs(Number(amount)).toLocaleString()} -`
	else amountStr = Number(amount).toLocaleString()

	if (currency) return `${amountStr} ${currency}`
	else return amountStr
}

export function downloadFile(
	fileName: string,
	file: ArrayBuffer | Blob,
	fileType: 'excel' | 'pdf' | 'docx'
) {
	const type = {
		jpg: 'application/jpg',
		jpeg: 'application/jpeg',
		png: 'application/png',
		doc: 'file-word',
		dotx: 'file-word',
		xlsx: 'file-excel',
		xls: 'file-excel',
		xlsm: 'file-excel',
		mp4: 'video',
		mkv: 'video',
		zip: 'application/zip',
		rar: 'application/rar',
		pdf: 'application/pdf',
		excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
		docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	}
	const blobFile = new Blob([file], { type: type[fileType] })

	const url = URL.createObjectURL(blobFile)

	if (fileType === 'pdf') {
		window.open(url)
		return
	}

	const link = document.createElement('a')
	link.href = url
	link.download = fileName
	document.body.appendChild(link)

	link.click()
	URL.revokeObjectURL(url)
	document.body.removeChild(link)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// export function convertArrayToString(obj: { [k: string]: any }) {
// 	const copyObj = JSON.parse(JSON.stringify(obj))
// 	for (const key in copyObj) {
// 		if (Array.isArray(copyObj[key]))
// 			copyObj[key] = copyObj[key].join(',') ? copyObj[key].join(',') : undefined
// 	}
// 	return copyObj
// }

export function copyToClipboard(val: string) {
	const elem = document.createElement('textarea')
	elem.value = val
	document.body.appendChild(elem)
	elem.select()
	document.execCommand('copy')
	document.body.removeChild(elem)
}
