const fs = require("fs");
const path = require("path");

function exists(name) {
    return fs.existsSync(name)
}

function createDir(name) {
    try {
        fs.mkdir(name, { recursive: true }, (error) => {
            if (error) throw error;
        });
    } catch (Error) {
        return false;
    }

    return true;
}

function copyFile(inputFile, outputFile) {
    if (path.extname(outputFile) === '') {
        outputFile = path.join(outputFile, path.basename(inputFile));
    }

    fs.copyFileSync(inputFile, outputFile);
}

exports.exists = exists;
exports.createDir = createDir;
exports.copyFile = copyFile;
