module.exports = {
	globals: {
		'ts-jest': {
			tsConfig: 'tsconfig.json'
		}
	},
	moduleFileExtensions: [
		'ts',
		'js'
	],
	reporters: [
		"default",
		[
			"jest-junit",
			{
				outputDirectory: "reports",
				outputName: "./junit.xml",
				suiteName: "sensors"
			}
		]
	],
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest'
	},
	testMatch: [
		'**/test/**/*.test.(ts|js)'
	],
	testEnvironment: 'node'
};
