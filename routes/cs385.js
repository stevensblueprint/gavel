const express = require('express');
const router = express.Router();
const checkPost = require('../helpers/check_post_info');
const aws = require('../data/utilAWS');
const cppEngine = require('../engine/cpp');


// router.post('/execute/single-test', async(req, res) => {
//    /*
//     POST data should look like this:

//     {
//         "class": "cs385",
//         "language": "cpp",
//         "file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
//         "test_file_name": "<FILE NAME AS AWS S3 KNOWS IT>"
//         "time_limit": "10000",          **in milliseconds**
//         "memory_limit": "65536",        **in bytes**
//     }
//     */
// });

router.post('/execute/single-file', async (req, res) => {
      /*
    POST data should look like this:

    {
        "class": "cs385",
        "language": "cpp",
        "compiler": "-g",      ** could also be -03**
        "cli_args": ""           **cli args exactly**
        "file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
        "time_limit": "10000",          **in milliseconds**
        "memory_limit": "65536",        **in bytes**
        "valgrind_check": "True",
        "extra_files": "<FILES SEPERATED BY COMMAS AS KNOWN BY AWS S3>"
    }
    */
    const postDetails = req.body;
    const errors = checkPost.checkSingleFilePost('cs385', postDetails);
    if (errors.length > 0) {
        return res.json({
            'error': errors,
        });
    }

    let allFileNames = postDetails.extra_files.length > 0 ? postDetails.extra_files.split(',') : [];
    allFileNames.unshift(postDetails.file_name);

    let filesAndNames = [];
    for (let file of allFileNames){
        console.log(file);
        const getFile = await aws.retrieveFile(file);
        if (getFile.error) {
            console.log('here is the error!');
            return res.json({
                'error': getFile.error,
            });
        }
        filesAndNames.push([file, getFile.file]);
    }
    
    let output = await cppEngine.runSingleFile(filesAndNames, postDetails);
    res.json(output);

});


module.exports = router;