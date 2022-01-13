const fs = require('fs');

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



module.exports = {
    writeFile,
    removeFile,
    renameFile,
};