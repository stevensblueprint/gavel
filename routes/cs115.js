const express = require('express');
const router = express.Router();
const aws = require('../data/utilAWS');
const checkPost = require('../helpers/check_post_info');
const pythonEngine = require('../engine/python');

router.post('/execute/single-test', async(req, res) => {
   /*
    POST data should look like this:

    {
        "class": "cs115",
        "language": "py",
        "file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
        "test_file_name": "<FILE NAME AS AWS S3 KNOWS IT>"
        "time_limit": "10000",          **in milliseconds**
        "memory_limit": "65536",        **in bytes**
    }
    */
  const postDetails = req.body;
  const errors = checkPost.checkFileAndTestPost('cs115', postDetails);
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
  
  let output = await pythonEngine.runFileAndTest(file, testFile, postDetails);
  res.json(output);
});

router.post('/execute/single-file', async (req, res) => {
  /*
    POST data should look like this:

    {
        "class": "cs115",
        "language": "py",
        "file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
        "time_limit": "10000",          **in milliseconds**
        "memory_limit": "65536",        **in bytes**
    }
    */
  const single_file = req.body;
  const errors = checkPost.checkSingleFilePost('cs115', single_file);
  if (errors.length > 0) {
      return res.json({
          'error': errors,
      });
  }

  const getFile = await aws.retrieveFile(single_file.file_name);
  if (getFile.error) {
      return res.json({
          'error': getFile.error,
      });
  }
  const file = getFile.file;
  let output = await pythonEngine.runSingleFile(file, single_file);
  res.json(output);
});

router.post('/execute/batch', async(req, res) => {
    /*
    POST data should look like this:
    {
        "class": "cs115",
        "language": "py",
        "test_file_handles_batch": "False",    ** this indicates that we need to run the test script on each individual submission **
        "zip_level": 1                  ** how many times does the program have to unzip **
        "file_name": "<FILE NAME AS AWS S3 KNOWS IT>",
        "test_file": "<FILE NAME AS AWS S3 KNOWS IT",
        "extra_files": "<EXTRA FILES DELINEATED BY COMMAS AS AWS S3 KNOWS IT>",
        "time_limit": "10000",          **in milliseconds**
        "memory_limit": "65536",        **in bytes**
        "desired_file_rename": "<WHAT DOES THE FILE NEED TO BE NAMED FOR TEST SCRIPT TO REGISTER IT>"
    }
    */
   const postDetails = req.body;
   const errors = checkPost.checkBatchPost('cs115', postDetails);
   if (errors.length > 0) {
       return res.json({
           'error': errors,
       });
   }

   let fileNames = postDetails.extra_files.split(',');
   fileNames.unshift(postDetails.test_file);

   let files = [];

   for (let file of fileNames) {
        const getFile = await aws.retrieveFile(file);
        if (getFile.error) {
            return res.json({
                'error': getFile.error,
            });
        }
        files.unshift([file, getFile]);
   }
   let output = await pythonEngine.runBatch(postDetails.file_name, postDetails.test_file, files, postDetails);
   return res.json(output);
});

module.exports = router;
