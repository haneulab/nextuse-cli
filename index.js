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

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	debug && log(flags);
})();
