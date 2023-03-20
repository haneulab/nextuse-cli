const { PACKAGES } = require('./const');
const fs = require('fs');

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

module.exports = {
	package
};
