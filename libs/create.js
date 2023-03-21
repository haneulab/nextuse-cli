const fs = require('fs');

class NextUseCreateError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NextUseCreateError';
	}
}

function createPageDir_(root = '.', dirName = 'pages') {
	console.log(
		`|->\tCreating pages directory ${[root, dirName].join('/')}.\n`
	);
	fs.mkdirSync([root, dirName].join('/'));
	console.log(
		`Successfully created pages directory ${[root, dirName].join('/')}.\n`
	);
}

function createPageFile_(fileName, content, root = '.', dirName = 'pages') {
	console.log(
		`|->\tCreating pages file ${[root, dirName, fileName].join('/')}.\n`
	);
	fs.writeFileSync([root, dirName, fileName].join('/'), content);
	console.log(
		`Successfully created page file ${[root, dirName, fileName].join('/')}.`
	);
}

function page(name = null) {
	const NextUseConfigFileName = 'nextuse.config.json';

	if (!fs.existsSync(NextUseConfigFileName)) {
		console.log(
			`You have not yet initialize nextuse in the project.\nPlease initialize it by running the following command.\n`
		);
		console.log("\t'nextuse -i' or 'nextuse --init'");
		return;
	}

	console.log("Let's create nextuse page in the project!\n");

	if (!name) {
		console.log(
			`|->\tCreating Page Failed: Did you forget to include the filename you want to create?\n`
		);
		console.log(
			"To create a page, please enter the following commands\n\n\t'nextuse -c <page-name>' or 'nextuse --create <page-name>'"
		);
		throw new NextUseCreateError(
			'You did not include the page name you want to create. Please try again.'
		);
	}

	fs.readFile(NextUseConfigFileName, 'utf-8', function (error, data) {
		const data_ = JSON.parse(data);
		const root_ = data_['root'] ?? false;
		if (!root_) {
			console.log(
				`|->\tCreating Page Failed: Please reconfigure your '${NextUseConfigFileName}'.\n`
			);
			throw new NextUseCreateError(
				`You are missing the 'root' path string in your '${NextUseConfigFileName}'.`
			);
		}
		const pages_ = data_['pages'] ?? false;

		if (!pages_) {
			console.log(
				`|->\tCreating Page Failed: Please reconfigure your '${NextUseConfigFileName}'.\n`
			);
			throw new NextUseCreateError(
				`You are missing the 'pages' object in your '${NextUseConfigFileName}'.`
			);
		}
		const pagesPath_ = pages_['path'] ?? false;
		if (!pagesPath_) {
			console.log(
				`|->\tCreating Page Failed: Please reconfigure your '${NextUseConfigFileName}'.\n`
			);
			throw new NextUseCreateError(
				`You are missing the 'path' string in your '${NextUseConfigFileName}' in the 'pages' object.`
			);
		}
		const pagesAsDir_ =
			typeof pages_['asDir'] !== 'boolean' ? true : pages_['asDir'];

		const pagesPattern = pages_['pattern']
			? pages_['pattern']
			: {
					declaration: 'arrow',
					layout: {
						getLayout: true,
						importFrom: '@nextapp/layout',
						dynamic: true
					},
					serverSideProps: false
			  };

		const PagesConfigObject = {
			root: root_,
			pages: {
				path: pagesPath_,
				asDir: pagesAsDir_,
				pattern: pagesPattern
			}
		};

		const PageFileContent = [
			/** dynamic import of layout */
			PagesConfigObject.pages.pattern.layout.dynamic
				? `import dynamic from "next/dynamic"\nconst Layout = dynamic(() => import('${PagesConfigObject.pages.pattern.layout.importFrom}'))\n`
				: `import Layout from '${PagesConfigObject.pages.pattern.layout.importFrom}'\n`,
			PagesConfigObject.pages.pattern.declaration === 'arrow'
				? `const ${name} = () => {\n\treturn <>${name}</>\n}\n`
				: `function ${name}() {\n\treturn <>${name}</>\n}\n`,
			PagesConfigObject.pages.pattern.layout.getLayout
				? `${name}.getLayout = (page) => {\n\treturn <Layout>{page}</Layout>\n}\n`
				: '',
			`export default ${name}`
		].join('\n');

		/** IF pages dir does not exist */
		if (
			!fs.existsSync(
				[PagesConfigObject.root, PagesConfigObject.pages.path].join('/')
			)
		) {
			createPageDir_(
				PagesConfigObject.root,
				PagesConfigObject.pages.path
			);
		}
		/** IF the page name already exist */
		if (pagesAsDir_) {
			if (
				fs.existsSync(
					[
						PagesConfigObject.root,
						PagesConfigObject.pages.path,
						name
					].join('/')
				)
			) {
				console.log(
					`|->\tCreating Page Failed: ${name} directory already exists in ${[
						PagesConfigObject.root,
						PagesConfigObject.pages.path
					].join('/')}.\n`
				);
				throw new NextUseCreateError(
					`The page directory '${name}' already exists in the ${PagesConfigObject.pages.path} directory. Please try different page name.`
				);
			} else {
				fs.mkdirSync(
					[
						PagesConfigObject.root,
						PagesConfigObject.pages.path,
						name
					].join('/')
				);
				createPageFile_(
					[name, 'index.tsx'].join('/'),
					PageFileContent,
					PagesConfigObject.root,
					PagesConfigObject.pages.path
				);
			}
		} else {
			if (
				fs.existsSync(
					[
						PagesConfigObject.root,
						PagesConfigObject.pages.path,
						name + '.tsx'
					].join('/')
				)
			) {
				console.log(
					`|->\tCreating Page Failed: ${name}.tsx already exists in ${[
						PagesConfigObject.root,
						PagesConfigObject.pages.path
					].join('/')}.\n`
				);
				throw new NextUseCreateError(
					`The page '${name + '.tsx'}' already exists in the ${
						PagesConfigObject.pages.path
					} directory. Please try different page name.`
				);
			} else {
				createPageFile_(
					name + '.tsx',
					PageFileContent,
					PagesConfigObject.root,
					PagesConfigObject.pages.path
				);
			}
		}
	});
}
function package(name) {
	if (!name) {
		throw new NextUseConfigFileName(
			'You did not include the page name you want to create. Please try again.'
		);
	}
	const NextUseConfigFileName = 'nextuse.config.json';
	fs.readFile(NextUseConfigFileName, 'utf-8', function (error, data) {
		// console.log(JSON.parse(JSON.stringify(data)));
	});
}

module.exports = {
	page,
	package
};
