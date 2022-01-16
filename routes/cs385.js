const express = require('express');
const router = express.Router();
const checkPost = require('../helpers/check_post_info');
const aws = require('../data/utilAWS');
const cppEngine = require('../engine/cpp');


router.post('/execute/single-test', async(req, res) => {
   /*
    POST data should look like this:

    {
        "class": "cs385",
        "language": "cpp",
        "file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
        "test_file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
        "compiler": "-g",
        "time_limit": "10000",          **in milliseconds**
        "memory_limit": "65536",        **in bytes**
    }
    */
   const postDetails = req.body;
   const errors = checkPost.checkFileAndTestPost('cs385', postDetails);
   if (errors.length > 0) {
       return res.json({
           'error': errors,
       });
   }
   const getFile = await aws.retrieveFile(postDetails.file_name);
   if (getFile.error) {
       return res.json({
           'error': getFile.error,
       });
   }
   const file = getFile.file;
 
   
   const getTestFile = await aws.retrieveFile(postDetails.test_file_name);
   if (getTestFile.error) {
       return res.json({
           'error': getTestFile.error,
       });
   }
   const testFile = getTestFile.file;
   
   let output = await cppEngine.runFileAndTest(file, testFile, postDetails);
   res.json(output);

});

router.post('/execute/single-file', async (req, res) => {
      /*
    POST data should look like this:

    {
        "class": "cs385",
        "language": "cpp",
        "compiler": "-g",      ** could also be -03**
        "cli_args": "",           **cli args exactly**
        "stdin_args": "",          ** if the program runs with stdin args **
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
        const getFile = await aws.retrieveFile(file);
        if (getFile.error) {
            return res.json({
                'error': getFile.error,
            });
        }
        filesAndNames.push([file, getFile.file]);
    }
    
    let output = await cppEngine.runSingleFile(filesAndNames, postDetails);
    res.json(output);

});

router.post('/execute/batch', async(req, res) => {
        /*
    POST data should look like this:
    {
        "class": "cs385",
        "language": "cpp",
        "file_name": "<FILE NAME ZIP AS AWS S3 KNOWS IT>",
        "test_file": "<FILE NAME AS AWS S3 KNOWS IT",
        "grader_file": "<FILE NAME AS AWS S3 KNOWS IT>",
        "extra_files": "EXTRA FILES DELINEATED BY COMMAS AS AWS S3 KNOWS IT>",
        "compiler": "-g",
        "time_limit": "10000",          **in milliseconds**
        "memory_limit": "65536",        **in bytes**
    }
    */
   const postDetails = req.body;
   const errors = checkPost.checkBatchPost('cs385', postDetails);
   if (errors.length > 0) {
       return res.json({
           'error': errors,
       });
   }

   let fileNames = postDetails.extra_files.split(',');
   fileNames.unshift(postDetails.grader_file);
   fileNames.unshift(postDetails.test_file);

   let files = [];

   for (let file of fileNames) {
       console.log(file);
        if (file.length > 0) {
            const getFile = await aws.retrieveFile(file);
            if (getFile.error) {
                return res.json({
                    'error': getFile.error,
                });
            }
            files.unshift([file, getFile]);
        }
  }
   let output = await cppEngine.runBatch(postDetails.file_name, postDetails.test_file, postDetails.grader_file, files, postDetails);
   return res.json(output);
});

module.exports = router;