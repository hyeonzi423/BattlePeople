module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		"airbnb",
		"airbnb/hooks",
		"airbnb-typescript",
		"plugin:@typescript-eslint/recommended",
		"prettier",
		"prettier/prettier",
		"plugin:prettier/recommended",
	],
	ignorePatterns: ['dist', '/*.*'],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
		project: `${__dirname}/tsconfig.json`,
	},
	plugins: ["react-refresh", "@typescript-eslint"],
	rules: {
		"no-shadow": 0,
		"import/no-extraneous-dependencies": 0,
		"react/react-in-jsx-scope": 0,
		"react/jsx-filename-extension": [1, { extensions: [".tsx", ".jsx"] }],
		"import/extensions": 0,
		"@typescript-eslint/no-shadow": 0,
		"import/no-absolute-path": 0,
		"import/prefer-default-export": 0,
	},
	settings: {
		"import/resolver": {
			typescript: {},
		},
	},
};
