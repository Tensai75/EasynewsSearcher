import OptionsSync from 'webext-options-sync';

export default new OptionsSync({
	defaults: {
		username: '',
		password: '',
		title: 'periods',
	},
	migrations: [
		OptionsSync.migrations.removeUnused,
	],
	logging: true,
});
