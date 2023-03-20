#!/usr/bin/env node

/**
 * nextuse
 * A utility CLI for nextjs development environment.
 *
 * @author Haneul Choi <https://github.com/haneulab>
 */

const fs = require('fs');

const PACKAGES = {
	dirName: 'packages',
	fileNames: {
		indexTs: 'index.ts',
		packageJson: 'package.json',
		typeTs: filename => `${filename}.types.ts`,
		componentTsx: filename => `${filename}.tsx`
	},
	fileContents: {
		indexTs: filename =>
			`import { default as ${filename} } from "./${filename}"\nexport default ${filename}`,
		packageJson: filename =>
			`{\n"name": "@nextjs-app/${filename.toLowerCase()}",\n"main": "index.ts",\n"version": "1.0.0"\n}`,
		typeTs: filename => `export interface I${filename} {\n}`,
		componentTsx: filename =>
			`import type {I${filename}} from "./${filename}.types"\n\nconst ${filename} = (props: I${filename}) => {\n\treturn <></>\n}\n\nexport default ${filename}`
	}
};
function package(path = 'packages') {
	let writePackageTo = ['.', path];

	return {
		components(filename) {
			writePackageTo.push(filename);

			if (fs.existsSync(writePackageTo.join('/'))) {
				console.log(`${filename} already exist.`);
				throw new Error(
					'The package name you like to create already exists in this project.\nTry another package name.'
				);
			} else {
				fs.mkdirSync(writePackageTo.join('/'));
				/** CREATES 'index.ts' */
				fs.writeFileSync(
					[...writePackageTo, PACKAGES.fileNames.indexTs].join('/'),
					PACKAGES.fileContents.indexTs(filename)
				);
				/** CREATES 'package.json' */
				fs.writeFileSync(
					[...writePackageTo, PACKAGES.fileNames.packageJson].join(
						'/'
					),
					PACKAGES.fileContents.packageJson(filename)
				);
				/** CREATES 'types.ts' */
				fs.writeFileSync(
					[
						...writePackageTo,
						PACKAGES.fileNames.typeTs(filename)
					].join('/'),
					PACKAGES.fileContents.typeTs(filename)
				);
				/** CREATES 'component.tsx' */
				fs.writeFileSync(
					[
						...writePackageTo,
						PACKAGES.fileNames.componentTsx(filename)
					].join('/'),
					PACKAGES.fileContents.componentTsx(filename)
				);
			}
		}
	};
}

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

	if (flags.create) {
		if (input.length === 0) {
			throw new Error(
				"Please enter the package name you'd like to create."
			);
		} else {
			if (input.length === 1) {
				const [filename] = input;
				package().components(filename);
				return;
			}
			if (input.length === 2) {
				const [path, filename] = input;
				package(`packages/${path}`).components(filename);
				return;
			}
		}
	}
})();
