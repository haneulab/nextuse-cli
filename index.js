#!/usr/bin/env node

/**
 * nextuse
 * A utility CLI for nextjs development environment.
 *
 * @author Haneul Choi <https://github.com/haneulab>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const create = require('./libs/create');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);

	if (flags.create) {
		if (input.length === 0) {
			throw new Error(
				"Please enter the package name you'd like to create."
			);
		} else {
			if (input.length === 1) {
				const [filename] = input;
				create.package().components(filename);
				return;
			}
			if (input.length === 2) {
				const [path, filename] = input;
				create.package(`packages/${path}`).components(filename);
				return;
			}
		}
	}
})();
