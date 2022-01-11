const fs = require('fs');
const extract = require('extract-zip');

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

const unzipFile = async(fileName) => {
    /* 
    Maybe one day this function could handle the zip levels
    AKA the zip structure found in 385, 496 programs?
    */
   console.log(fileName);
   try {
       await extract(fileName, { dir: './'});
       return {
           'message': 'success',
       };
   } catch (e) {
       return {
           'error': e.toString(),
       };
   }

};

module.exports = {
    writeFile,
    removeFile,
    unzipFile,
};