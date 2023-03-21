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
	page: require('./create/page'),
	package
};
