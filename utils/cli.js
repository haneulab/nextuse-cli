const meow = require('meow');
const meowHelp = require('cli-meow-help');

const flags = {
	init: {
		type: `boolean`,
		default: false,
		alias: 'i',
		desc: "Initializes nextuse by creating 'nextuse.config.js' in the root."
	},
	create: {
		type: `boolean`,
		default: false,
		alias: 'c',
		desc: 'Creates a project package or page.'
	},
	help: {
		type: `boolean`,
		default: false,
		alias: 'h',
		desc: 'Displays availabel commands for nextuse CLI.'
	},
	debug: {
		type: `boolean`,
		default: false,
		alias: `d`,
		desc: `Print debug info`
	},
	version: {
		type: `boolean`,
		alias: `v`,
		desc: `Print CLI version`
	}
};

const commands = {
	help: { desc: `Print help info` }
};

const helpText = meowHelp({
	name: `nextuse`,
	flags,
	commands
});

const options = {
	inferType: true,
	description: false,
	hardRejection: false,
	flags
};

module.exports = meow(helpText, options);
