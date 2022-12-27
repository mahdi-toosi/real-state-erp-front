module.exports = {
	extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
	rules: {
		indentation: null,
		'string-quotes': 'single',
		'selector-not-notation': null,
		'selector-class-pattern': null,
		'no-descending-specificity': null,
		'declaration-block-trailing-semicolon': null,
		'selector-pseudo-element-no-unknown': [true, { ignorePseudoElements: [] }],
		'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'deep'] }],
		'at-rule-no-unknown': [
			true,
			{
				ignoreAtRules: [
					'tailwind',
					'apply',
					'variants',
					'responsive',
					'screen',
					'mixin',
					'extend',
					'include',
				],
			},
		],
	},
}
