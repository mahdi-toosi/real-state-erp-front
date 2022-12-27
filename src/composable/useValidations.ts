import type { ValidationRuleWithParams } from '@vuelidate/core'
import { helpers, maxLength, minLength, required, numeric } from '@vuelidate/validators'

export default function useValidation() {
	const requiredField = helpers.withMessage('فیلد الزامی است.', required)

	const validators = {
		requiredNumber: {
			requiredField,
			numeric: helpers.withMessage('مقدار وارد شده عدد نیست.', numeric),
		},
		requiredText: {
			requiredField,
			minLength: helpers.withMessage('حداقل باید 3 کاراکتر باشد.', minLength(3)),
			maxLength: helpers.withMessage('حداکثر باید 500 کاراکتر باشد.', maxLength(500)),
		},
		requiredField: { requiredField },
	}

	return validators
}

export type ValidationCustomRules = Record<
	string,
	{ [key: string]: ValidationRuleWithParams<object> }
>
