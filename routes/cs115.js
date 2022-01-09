const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
//const {request} = require('express');
const checkPost = require('../helpers/check_post_info');
const pythonEngine = require('../engine/python');

AWS.config.update({region: 'us-east-1'});


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

  let s3 = new AWS.S3();
  const fileParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: postDetails.file_name,
  };

  const fileResponse = await s3.getObject(fileParams).promise();
  const file = fileResponse.Body;

  const testParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: postDetails.test_file_name,
  };

  const testResponse = await s3.getObject(testParams).promise();
  const testFile = testResponse.Body;

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

  let s3 = new AWS.S3();
  const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: single_file.file_name,
  };

  const fileResponse = await s3.getObject(params).promise();
  const file = fileResponse.Body;

  let output = await pythonEngine.runSingleFile(file, single_file);
  res.json(output);
});

// router.post('/execute/batch', (req, res) => {
//   res.json({
//     message: 'Hello World! This is POST!',
//   });
// });

module.exports = router;
