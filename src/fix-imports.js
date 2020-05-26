/* eslint-disable prettier/prettier,@typescript-eslint/no-var-requires,@typescript-eslint/no-use-before-define */
const fs = require('fs');
const path = require('path');

const TS_FILE = /.*\.tsx?$/;
const RELATIVE_IMPORT = /from[\s]'(\.\.\/[^']+)'/;
const ROOT_PATH = path.join(__dirname, 'app');

traverse(__dirname);

function traverse(dirName) {
    const dirList = fs.readdirSync(dirName);
    dirList.forEach((dirEntry) => {
        const absPath = path.join(dirName, dirEntry);
        if(fs.statSync(absPath).isDirectory()) {
            traverse(absPath);
        } else if(TS_FILE.test(absPath)){
            fixFile(absPath);
        }
    });
}

function fixFile(filePath) {
    const tsFile = fs.readFileSync(filePath).toString('utf8');
    const matches = tsFile.match(RELATIVE_IMPORT);

    if(matches) {
        const realPath = path.resolve(path.join(filePath, matches[1]));
        const absImport = realPath.replace( ROOT_PATH, 'app');
        const filedContent =
        fs.writeFileSync(filePath, fixedContent);
    }
}