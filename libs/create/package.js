const fs = require('fs');
const { attributeExist_, parsePageConfig_ } = require('./utils');

class NextUseCreatePackageError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NextUseCreatePackageError';
	}
}

function createPackageDir_(root = '.', dirName = 'packages') {
	if (!dirName.includes('/')) {
		if (!fs.existsSync([root, dirName].join('/'))) {
			console.log(
				`|->\tCreating packages directory ${[root, dirName].join('/')}.`
			);
			fs.mkdirSync([root, dirName].join('/'));
		}
	} else {
		if (!fs.existsSync([root, dirName.split('/')[0]].join('/'))) {
			console.log(
				`|->\tCreating packages directory ${[
					root,
					dirName.split('/')[0]
				].join('/')}.`
			);
			fs.mkdirSync([root, dirName.split('/')[0]].join('/'));
		}

		return createPackageDir_(
			[root, dirName.split('/')[0]].join('/'),
			dirName.split('/').slice(1).join('/')
		);
	}
	console.log(
		`Successfully created packages directory ${[root, dirName].join(
			'/'
		)}.\n`
	);
}

function createPackageFile_(filePath, content) {
	console.log(`|->\tCreating package file ${filePath}.`);
	fs.writeFileSync(filePath, content);
	console.log(`Successfully created package file ${filePath}.\n`);
}

function package(name) {
	const NextUseConfigFileName = 'nextuse.config.json';

	if (!fs.existsSync(NextUseConfigFileName)) {
		console.log(
			`You have not yet initialize nextuse in the project.\nPlease initialize it by running the following command.\n`
		);
		console.log("\t'nextuse -i' or 'nextuse --init'");
		return;
	}

	console.log("Let's create nextuse package in the project!\n");

	if (!name) {
		console.log(
			`|->\tCreating Package Failed: Did you forget to include the filename you want to create?\n`
		);
		console.log(
			"To create a package, please enter the following commands\n\n\t'nextuse -c package <page-name>' or 'nextuse --create package <page-name>'"
		);
		throw new NextUseCreatePackageError(
			'You did not include the package name you want to create. Please try again.'
		);
	}

	if (
		`~!@#$%^&*()_-+={[}]|"':;?/>.<,`
			.split('')
			.find(each => name.includes(each))
	) {
		console.log(
			`|->\tCreating Package Failed: Your package name should not include specical character.\n`
		);
		throw new NextUseCreatePackageError(
			'Your package name should not include specical character. Please try again.'
		);
	}
	fs.readFile(NextUseConfigFileName, 'utf-8', function (error, data) {
		const data_ = parsePageConfig_(data);

		const root_ = attributeExist_(data_, 'root', function () {
			console.log(
				`|->\tCreating Package Failed: Please reconfigure your '${NextUseConfigFileName}'.\n`
			);
			throw new NextUseCreatePackageError(
				`You are missing the 'root' path string in your '${NextUseConfigFileName}'.`
			);
		});

		const packages_ = attributeExist_(data_, 'packages', function () {
			console.log(
				`|->\tCreating Package Failed: Please reconfigure your '${NextUseConfigFileName}'.\n`
			);
			throw new NextUseCreatePackageError(
				`You are missing the 'packages' object in your '${NextUseConfigFileName}'.`
			);
		});

		const packagesPath_ = attributeExist_(packages_, 'path', function () {
			console.log(
				`|->\tCreating Package Failed: Please reconfigure your '${NextUseConfigFileName}'.\n`
			);
			throw new NextUseCreatePackageError(
				`You are missing the 'path' string in your '${NextUseConfigFileName}' in the 'packages' object.`
			);
		});

		const packagesAlias_ = attributeExist_(packages_, 'alias', function () {
			console.log(
				`|->\tCreating Package Failed: Please reconfigure your '${NextUseConfigFileName}'.\n`
			);
			throw new NextUseCreatePackageError(
				`You are missing the 'alias' string in your '${NextUseConfigFileName}' in the 'packages' object.`
			);
		});

		const PackagesConfigObject = {
			root: root_,
			packages: {
				path: packagesPath_.replace('^package', name),
				alias: packagesAlias_.replace('^package', name)
			}
		};

		const PackageFileContent = {
			indexTs: {
				path: 'index.ts',
				content: `import {default as ${name}} from "./${name}"\nexport default ${name}\n`
			},
			types: {
				path: `${name}.types.ts`,
				content: `export interface I${name} {\n\tid?: string\n}\n`
			},
			packageJson: {
				path: 'package.json',
				content: `{\n\t"name": "${PackagesConfigObject.packages.alias}",\n\t"main": "index.ts",\n\t"version":"1.0.0"\n}\n`
			},
			componentTsx: {
				path: `${name}.tsx`,
				content: `import type {I${name}} from "./${name}.types"\n\nconst ${name} = (props: I${name}) => {\n\treturn <></>\n}\n\nexport default ${name}\n`
			}
		};

		if (
			fs.existsSync(
				[
					PackagesConfigObject.root,
					PackagesConfigObject.packages.path
				].join('/')
			)
		) {
			console.log(
				`|->\tCreating Package Failed: '${name}' directory already exists in '${[
					PackagesConfigObject.root,
					PackagesConfigObject.packages.path
				].join('/')}'.\n`
			);
			throw new NextUseCreatePackageError(
				`The package directory '${name}' already exists in the '${[
					PackagesConfigObject.root,
					PackagesConfigObject.packages.path
				].join('/')}' directory. Please try different package name.`
			);
		}

		if (
			fs.existsSync(
				[
					PackagesConfigObject.root,
					PackagesConfigObject.packages.path + '.tsx'
				].join('/')
			)
		) {
			console.log(
				`|->\tCreating Package Failed: '${
					name + '.tsx'
				}' file already exists in '${[
					PackagesConfigObject.root,
					PackagesConfigObject.packages.path
				].join('/')}'.\n`
			);
			throw new NextUseCreatePackageError(
				`The package file '${name + '.tsx'}' already exists in the '${[
					PackagesConfigObject.root,
					PackagesConfigObject.packages.path
				].join('/')}' directory. Please try different package name.`
			);
		}

		createPackageDir_(
			PackagesConfigObject.root,
			PackagesConfigObject.packages.path
		);

		Object.values(PackageFileContent).forEach(({ path, content }) => {
			createPackageFile_(
				[
					PackagesConfigObject.root,
					PackagesConfigObject.packages.path,
					path
				].join('/'),
				content
			);
		});
	});
}

module.exports = package;
