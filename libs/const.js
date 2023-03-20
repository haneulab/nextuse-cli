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

module.exports = {
	PACKAGES
};
