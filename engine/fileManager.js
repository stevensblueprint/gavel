const fs = require('fs');
//const extract = require('extract-zip');
const unzipper = require('unzipper');


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
//    console.log(fileName);
//    try {
//        const res = await extract(fileName, { dir: './'});
//        console.log(res);
//        const res2 = await extract(fileName + '-1', { dir: './'});
//        console.log(res2);
//        return {
//            'message': 'success',
//        };
//    } catch (e) {
//        return {
//            'error': e.toString(),
//        };
//    }
    // const pathToZip = './' + fileName;
    // console.log(pathToZip);
    // fs.createReadStream(pathToZip).pipe(unzipper.Extract({ path: './' }));
    // return {
    //     'message': 'Success',
    // };



};

module.exports = {
    writeFile,
    removeFile,
    unzipFile,
};