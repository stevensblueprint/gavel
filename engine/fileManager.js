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
                result.errors.push('Error in removing file');
            } else {
                result.error = 'Error in removing file.';
            }
        }
    });
};

module.exports = {
    writeFile,
    removeFile,
};