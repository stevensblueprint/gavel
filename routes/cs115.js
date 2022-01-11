const express = require('express');
const router = express.Router();
const aws = require('../data/utilAWS');
const checkPost = require('../helpers/check_post_info');
const pythonEngine = require('../engine/python');
const fileOp = require('../engine/fileManager');


// router.get('/retrieve/:id', async (req, res) => {
//   s3 = new AWS.S3();

//   // var bucketParams = {
//   //     Bucket: 'gavel-test'
//   // };

//   // s3.createBucket(bucketParams, function(err, data) {
//   //     if (err) {
//   //         console.log("Error", err);
//   //     } else {
//   //         console.log("Success", data.Location);
//   //     }
//   // });
//   s3.listBuckets(function(err, data) {
//     if (err) {
//       console.log(err, err.stack);
//     } else {
//       console.log(data);
//     }
//   });
//   const params = {Bucket: 'gavel-test', Key: 'hw6.py'};
//   const response = await s3.getObject(params).promise();
//   const fileContent = response.Body.toString('utf-8');
//   console.log(fileContent);
//   res.json({
//     message: 'Hello World! This is GET!',
//   });
// });

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
    }
    */
   const postDetails = req.body;
   const errors = checkPost.checkSingleFilePost('cs115', postDetails);
   if (errors.length > 0) {
       return res.json({
           'error': errors,
       });
   }

   let fileNames = postDetails.extra_files.split(',');
   fileNames.unshift(postDetails.test_file);
   fileNames.unshift(postDetails.file_name);


   let files = [];

   for (let file of fileNames) {
       if (file.slice(file.length - 4) == '.zip') {
           const getZip = await aws.retrieveZip(file);
           if (getZip.error) {
               return res.json(getZip);
           }
           console.log('finished writing zip file');
           const unzipFiles = fileOp.unzipFile(file);
           if (unzipFiles.error) {
               return res.json(unzipFiles);
           }
       }
   }
   return;

   //let output = pythonEngine.runBatch(files, postDetails);
   //res.json(output);



});

module.exports = router;
