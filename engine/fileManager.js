const fs = require('fs');
const unzipper = require('unzipper');
const etl = require('etl');

const writeFile = (fileName, data) => {
    fs.writeFile(fileName, data, function(err) {
        if (err) {
            return {
                'error': 'File creation failed.',
            };
        }
    });

    return {
        'message' : 'Successfully wrote file.',
    };
};

const writeFileToPath = (path, data) => {
    fs.writeFile(path, data, function(err) {
        if (err) {
            return {
                'error': 'File creation failed.',
            };
        }
    });

    return {
        'message' : 'Successfully wrote file.',
    };
};

const writeFileToPathStream = (readObject, path, fileName) => {
    let readStream = readObject.createReadStream();
    let writeStream = fs.createWriteStream(path, fileName);
    readStream.pipe(writeStream);
};


const removeFile = (fileName, result) => {
    fs.unlink(fileName, (err) => {
        if (err) {
            if (result.errors) {
                result.errors.push('Error in removing file: ' + fileName);
            } else {
                result.errors = ['Error in removing file: ' + fileName];
            }
        }
    });
};

const renameFile = (oldFileName, newFileName) => {
    fs.rename(oldFileName, newFileName, () => {
        console.log('File renamed');
    });
};

const createDirectory = (directoryName) => {
    fs.mkdir(directoryName, { recursive: true }, (err) => {
        if (err) throw err;
    });
};

const parseEachFileInZip = (pathToZip) => {
    let results = {};
    fs.createReadStream(pathToZip)
        .pipe(unzipper.Parse())
        .pipe(etl.map(async entry => {
            const content = await entry.buffer();
            results[entry.path] = Buffer.from(content).toString();
        }));
    return results;
};



module.exports = {
    writeFile,
    writeFileToPath,
    removeFile,
    renameFile,
    createDirectory,
    parseEachFileInZip,
    writeFileToPathStream,
};