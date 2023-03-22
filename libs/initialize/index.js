const fs = require('fs');

class NextUseInitializeError extends Error {
	constructor(message) {
		super(message);
		this.name = 'NextUseInitalizeError';
	}
}

function createNextUseConfig_(
	NextUseConfigFileName,
	NextUseIntializePreRequisite
) {
	if (NextUseIntializePreRequisite.AlreadyExist()) {
		return;
	}
	console.log(
		"|->\tCompleted checking prerequisites. Now creating 'nextuse.config.js' in the root.\n"
	);
	const defaultNextUseConfig = `{\n\t"root": ".",\n\t"alias": "@nextuse",\n\t"pages": {\n\t\t"path": "pages",\n\t\t"asDir": true,\n\t\t"pattern": {\n\t\t\t"declaration": "arrow",\n\t\t\t"layout": {\n\t\t\t\t"getLayout": true,\n\t\t\t\t"importFrom": "^alias/Layout",\n\t\t\t\t"dynamic": true\n\t\t\t},\n\t\t\t"serverSideProps": false\n\t\t}\n\t},\n\t"components": {\n\t\t"path": "^alias/components/^package",\n\t\t"alias": "^alias/^package"\n\t}\n}\n`;
	fs.writeFileSync(
		['.', NextUseConfigFileName].join('/'),
		defaultNextUseConfig
	);
	return;
}

function initialize() {
	/**
	 * COMMAND: nextuse -i | nextuse --init
	 */
	console.log("Let's initialize nextuse in the project!\n");
	/**
	 *
	 * IF 'nextuse.config.js' not exists
	 * Initialize action starts
	 *  - creates 'nextuse.config.js' in the root
	 *  - with default config
	 *  - alert user the completed message
	 *  - process exits
	 */
	const NextUseConfigFileName = 'nextuse.config.json';
	setTimeout(() => {
		createNextUseConfig_(NextUseConfigFileName, {
			/**
			 * NextUseInitialize PreRequisite Checks
			 **/
			AlreadyExist: () => {
				/**
				 * 		if 'nextuse.config.js' already exists
				 * 		throw NextConfigError (message = "Already initialized nextuse in this project, please delete 'nextuse.config.js' to reinitalize it.")
				 **/

				if (fs.existsSync(['.', NextUseConfigFileName].join('/'))) {
					console.log(
						`|->\tPrerequisite Check Failed: You already have '${NextUseConfigFileName}' in your project.\n`
					);
					throw new NextUseInitializeError(
						`To reinitalize, please delete '${NextUseConfigFileName}' and run the command again.`
					);
				}
			}
		});
		console.log('Successfully initialized nextuse in the project!\n');
	}, 1250);
	console.log('|->\tChecking prerequisites for setting up the project...');
}

module.exports = initialize;
