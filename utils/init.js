const welcome = require('cli-welcome');
const pkg = require('./../package.json');
const unhandled = require('cli-handle-unhandled');

module.exports = ({ clear = false }) => {
	unhandled();
	welcome({
		title: `nextuse`,
		tagLine: `by Haneul Choi`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#2F58CD',
		color: '#FFFFFF',
		bold: true,
		clear
	});
};
