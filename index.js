#!/usr/bin/env node

/**
 * nextuse
 * A utility CLI for nextjs development environment.
 *
 * @author Haneul Choi <https://github.com/haneulab>
 */
const { initialize, create } = require('./libs');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear: false });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);

	if (flags.init) {
		initialize();
	} else if (flags.create) {
		const [type, name] = input;
		if (!type) {
			console.log(
				'|->\tIncomplete Create Command: You did not include the type of action for create-action.\n'
			);
			console.log(
				"Please enter 'nextuse -c package <package-name>' or 'nextuse -c page <page-name>'."
			);
			return;
		}
		if (type === 'page') create.page(name);
		if (type === 'package') create.package(name);
	} else if (flags.help) {
		cli.showHelp(0);
	} else {
		let unknownCommand = Object.keys(flags).filter(key => flags[key])[0];
		console.log(
			`|->\tUnknown command '${unknownCommand}' entered.\n\nPlease enter 'nextuse -h' or 'nextuse --help' to see available commands.`
		);
	}
})();
