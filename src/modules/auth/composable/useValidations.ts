import {
	email,
	helpers,
	maxLength,
	minLength,
	required,
	sameAs,
	numeric,
} from '@vuelidate/validators'

export default function useValidation() {
	const requiredField = helpers.withMessage('فیلد الزامی است.', required)

	const validators = {
		otpCode: {
			requiredField,
			numeric: helpers.withMessage('مقدار وارد شده عدد نیست.', numeric),
			minLength: helpers.withMessage('باید 5 کاراکتر باشد.', minLength(5)),
			maxLength: helpers.withMessage('باید 5 کاراکتر باشد.', maxLength(5)),
		},
		password: {
			requiredField,
			minLength: helpers.withMessage('حداقل باید 5 کاراکتر باشد.', minLength(5)),
			maxLength: helpers.withMessage('حداکثر باید 200 کاراکتر باشد.', maxLength(200)),
		},
		rpassword: (pass: string) => ({
			requiredField,
			sameAsPassword: helpers.withMessage('تکرار رمز عبور صحیح نیست.', sameAs(pass)),
		}),
		nationalCode: {
			requiredField,
			numeric: helpers.withMessage('مقدار وارد شده عدد نیست.', numeric),
			minLength: helpers.withMessage('حداقل باید 10 کاراکتر باشد.', minLength(10)),
			maxLength: helpers.withMessage('کد ملی معتبر نیست.', maxLength(10)),
		},
		mobile: {
			requiredField,
			mobileNum: helpers.withMessage('شماره تلفن همراه معتبر نیست.', helpers.regex(/09\d{9}/)),
			numeric: helpers.withMessage('مقدار وارد شده عدد نیست.', numeric),
			maxLength: helpers.withMessage('شماره تلفن همراه معتبر نیست.', maxLength(11)),
		},
		email: {
			email: helpers.withMessage('ساختار ایمیل  صحیح نیست.', email),
			maxLength: helpers.withMessage('حداکثر باید 200 کاراکتر باشد.', maxLength(200)),
		},
		postalCode: {
			requiredField,
			minLength: helpers.withMessage('حداقل باید 10 کاراکتر باشد.', minLength(10)),
			maxLength: helpers.withMessage('کد پستی معتبر نیست.', maxLength(10)),
		},
		requiredText: {
			requiredField,
			minLength: helpers.withMessage('حداقل باید 2 کاراکتر باشد.', minLength(2)),
			maxLength: helpers.withMessage('حداکثر باید 500 کاراکتر باشد.', maxLength(500)),
		},
		requiredField: { requiredField },
	}

	return validators
}
